// service layer that consists the core logic to handle all the payment related business logics 

import { request, response } from "express";
import { StatusCodes } from "../error/statusCodes";
import Stripe from "stripe";
import stripe from "stripe";
import { ENV } from "../config/env";
import AppError from "../middlware/errorHandler";
import { StripePaymentService } from "./stripe.payment.service";

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
            return response.status(StatusCodes.INTERNAL_ERROR_500).json({
                success : false, 
                message : `Webhook error ${error.message || error}`
            })
        }

        // lets handle the events that we care about
        const eventReceived = await StripePaymentService.stripeEventHandlerService(stripeEvent);

        return eventReceived;
    }


    static async createPaymentIntentController(){

    }
}