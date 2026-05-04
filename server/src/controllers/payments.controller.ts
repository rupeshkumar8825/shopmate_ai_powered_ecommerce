// this is the controller to handle all the payment related stuffs 

import { Request, Response } from "express";
import { StatusCodes } from "../error/statusCodes";
import { PaymentsService } from "../services/payments.service";

export class PaymentController {
        // controller to handle the webhook request from the stripe payments
        static async paymentWebhookHandlerController(request : Request, response: Response){
                // lets get the signature of the stripe webhook. This way we will be sure that this webhook is
        // sent by stripe itself 
        let signature : string = "";
        if(!request.headers["stripe-signature"]){
            // there is no signature header hence lets return a negative response to the user 
            return response.status(StatusCodes.BAD_REQUEST_400).json({
                success : false, 
                message : "Stripe Signature not found. Payment Failed."
            });
        }else if (Array.isArray(request.headers["stripe-signature"])){
            // this was not expected to be array instead it was expected to be 
            // a single string element. hence lets return a negative response to the client application 
            return response.status(StatusCodes.NOT_AUTHORIZED_401).json({
                success : false, 
                message : "Stripe signature not found. Payment failed"
            });
        }

        // otherwise we have got confidence that this field might be a signature 
        signature = request.headers["stripe-signature"];

        // call the service layer function here 
        const paymentWebhookHandlerResponse : {success : boolean , message : string} = await PaymentsService.paymentWebhookHandlerService(signature);
        // if the control reaches here this means that payment webhook request is handled
        // properly. say everything went fine 
        return response.status(StatusCodes.SUCCESS_200).json({
            success : paymentWebhookHandlerResponse.success, 
            message : paymentWebhookHandlerResponse.message
        });
        
    }

}