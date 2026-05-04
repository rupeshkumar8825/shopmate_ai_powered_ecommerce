// service layer that consists the core logic to handle all the payment related business logics 

import { request, response } from "express";
import { StatusCodes } from "../error/statusCodes";
import Stripe from "stripe";
import stripe from "stripe";
import { ENV } from "../config/env";
import AppError from "../middlware/errorHandler";
import { StripePaymentService } from "./stripe.payment.service";
import { stripeObject } from "../config/stripe";
import prisma from "../config/prisma";
import { PaymentStatus, PaymentType } from "../generated/prisma/enums";

// this layer will interact with the database 
export class PaymentsService {
    static async paymentWebhookHandlerService(signature : string) : Promise<{success : boolean, message : string}>{
        if(!signature){
            // this was unexpected but lets throw an error in this case 
            throw new AppError("Stripe signature not found", StatusCodes.NOT_AUTHORIZED_401);
        }


        // let define an event 
        let stripeEvent : Stripe.Event;

        try{
            stripeEvent = stripe.webhooks.constructEvent(request.body, signature, ENV.STRIPE_WEBHOOK_SECRET);
        }catch(error : any){
            // lets log this error too as it would be helpful in debugging the webhook error too
            console.log(`(${new Date()})[app.ts, payments/webhook endpoint] : - Webhook signature error : ${error.message || error}`);
            // some erorr occurred lets return a negative response to the user 
            throw new AppError(`Webhook error while creating the stripe event ${error.message || error}`, StatusCodes.INTERNAL_ERROR_500);
        }

        // lets handle the events that we care about
        const eventReceived = await StripePaymentService.stripeEventHandlerService(stripeEvent);

        return eventReceived;
    }




    
    static async createPaymentIntentService(orderId : string, totalPrice : number){
        // given order id lets find out the buyer id to be stored into the payment intent metadata 
        const orderRespose = await prisma.order.findFirst({
            where : {id : orderId}
        });
        if(!orderRespose){
            throw new AppError("Order does not exists", StatusCodes.NOT_FOUND_404);
        }

        const paymentIntent = await stripeObject.paymentIntents.create({
            amount : totalPrice * 100, 
            currency : "usd", 
            metadata : {
                orderId : orderId, 
                buyerId : orderRespose.buyer_id 
            }
        });

        // lets insert this intent into the payments itself 
        const paymentResponse = await prisma.payments.create({
            data : {
                order_id : orderId, 
                payment_type : PaymentType.Online, 
                payment_status : PaymentStatus.Pending, 
                payment_intent_id : paymentIntent.id
            }
        });


        // lets return the payment intents to the caller. Caller may be someone from the service layer or controller layer
        const paymentIntentResponse = {
            paymentIntentId : paymentIntent.id, 
            clientSecret : paymentIntent.client_secret, 
            amount : totalPrice, 
            currency : "inr"
        }

        // say everything went fine 
        return paymentIntentResponse;
    }
}