import Stripe from "stripe";
import AppError from "../middlware/errorHandler";
import { StatusCodes } from "../error/statusCodes";
import prisma from "../config/prisma";
import { PaymentStatus } from "../generated/prisma/enums";
import { finalize } from "zod/v4/core";

// consists of all the setups/business logics related to the stripe payment gateway 
export class StripePaymentService {

    /**
     * Service function to implement the different event handlers depending on the different 
     * types of events. Some of the events that stripe might return as webhook are as follows: 
     *      1. payment_intent.succeeded
     *      2. payment_intent.failed
     *      3. ... and so on
     * @param stripeEvent Event which was custom created is passed so that this function can 
     * define the handlers for different event types that could be received as a webhook
     * from Stripe server. 
     * @returns a boolean result stating whether or not the handling of all the event types 
     * was successfull. Note that this function will only return if there are no exceptions
     * thrown in between as the exceptions thrown will be handled by the global error 
     * middleware. 
     */
    static async  stripeEventHandlerService (stripeEvent : Stripe.Event) : Promise<{success : boolean, message : string}> {
        let responseToSendToController : {success : boolean, message : string} = {success : true, message : "Some other event was captured. No need to handle."}
        switch (stripeEvent.type) {
            case "payment_intent.succeeded" : {
                const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent;
                console.log("Payment intent successfull", paymentIntent.id, paymentIntent.metadata);
                
                const finalizeStripePaymentResponse = await StripePaymentService.finalizeStripePaymentService(paymentIntent.id);
                if(!finalizeStripePaymentResponse.success){
                    // then something went wrong
                    // throw an error here 
                    throw new AppError(finalizeStripePaymentResponse.message, StatusCodes.INTERNAL_ERROR_500);
                }else {
                    responseToSendToController = {success : finalizeStripePaymentResponse.success, message : finalizeStripePaymentResponse.message};
                }

            }
                break;
            case "payment_intent.payment_failed" : {
                const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent
                console.log("Payment failed", paymentIntent.id, paymentIntent.metadata);
                // payment failed we need to update this thing in the database too in the payments table
                const failedPaymentHandlerResponse = await StripePaymentService.handleFailedPaymentService(paymentIntent.id);
                if(!failedPaymentHandlerResponse.success){
                    throw new AppError(failedPaymentHandlerResponse.message, StatusCodes.INTERNAL_ERROR_500);
                }else {
                    responseToSendToController = failedPaymentHandlerResponse;
                }
            }
            default : 
                // ignore the other event types
                break;
        }

        return responseToSendToController;
    }


    /**
     * Function to handle the failed payments. Typically this will return a proper response
     * with success and with a message to the caller. 
     * @param paymentIntentId payment intent id on which the webhook would have received
     */
    static async handleFailedPaymentService (paymentIntentId : string) {
        /**
         * Following actions needs to be done : 
         *      1. Marks payment as failed
         *      2. No stock updates
         * 
         * Call this from the Strip webhook on `payment_intent.payment_failed`
         */

        if(!paymentIntentId){
            // this was not expected but still lets throw an error here 
            throw new AppError("Payment intent id is required", StatusCodes.BAD_REQUEST_400);
        }

        // lets handle the database changes using the transaction itself 
        return prisma.$transaction(async (transaction) => {
            const paymentResponse = await transaction.payments.findUnique({
                where : {payment_intent_id : paymentIntentId}
            });
            if(!paymentResponse){
                throw new AppError("Payment entry not found for this payment_intent_id", StatusCodes.NOT_FOUND_404);
            }

            const orderResponse = await transaction.order.findUnique({
                where : {id : paymentResponse.order_id}
            });
            if(!orderResponse){
                throw new AppError("Order entry not found for this payment_intent_id", StatusCodes.NOT_FOUND_404);
            }

            // lets check the paid_at status
            if(orderResponse.paid_at && paymentResponse.payment_status === PaymentStatus.Paid){
                // this means that it turns out that the user has already paid the amount 
                // but we received this failure webhook. it may be due to multiple retries 
                // of the user for this purpose. 
                // lets return from here with positive response
                const responseToSend = {success : true, message : "Payment already done"};
                return responseToSend;
            }else if((orderResponse.paid_at && paymentResponse.payment_status !== PaymentStatus.Paid)
                    || (!orderResponse.paid_at && paymentResponse.payment_status === PaymentStatus.Paid)){
                // this was unexpected lets highlight this and throw an error 
                throw new AppError("Some inconsistency in the database found between the orders and payments table", StatusCodes.CONFLICT_409);
            }

            if(paymentResponse.payment_status === PaymentStatus.Failed){
                // the payment intent is already marked as the failed. hence lets return from here
                return {success : true, message : "Payment already marked Failed"};
            }

            // if control reaches here then this means that we will have to mark the payment as failed
            // for this purpose
            await transaction.payments.update({
                where : {payment_intent_id : paymentIntentId}, 
                data : {payment_status : PaymentStatus.Failed}
            });

            // say everything went fine 
            return {success : true, message : "Payment marked as failed"}

        });

    }

    /**
     * Once the server application validates and confirms that the payment made by the user is 
     * successfully received then this function is called to finalize the payment. 
     * While finalizing we do bunch of things which are listed below ; 
     * @param paymentIntentId id of the payment intent. Each of the user's payment request is uniquely 
     * identified using a unique id known as payment_intent_id
     * @returns a boolean status indicating whether or not all the finalizing steps are completed
     * successfully or not. Also this function will stop its execution abruptly if any exception
     * occurs.
     */      
    static async finalizeStripePaymentService (paymentIntentId : string){  
        // we need to define a transaction so that even if any one of the database operation fails
        // abruptly we should be able to return from here and the database should get back to the 
        // previous consistent state for this purpose
        return prisma.$transaction(async (transaction) => {
            /**
             * Since the user payment was successfull hence we need to do the following actions : 
             *      1. Find the payment entry in payments table using the payment_intent_id
             *      2. Update the columns like payment_status, created_at in Payments table 
             *      3. Find the corresponding order entry using the order_id present in the 
             *          Payments table and then update the paid_at part. 
             * If everything is successfull then we will return a positive response for this purpose 
             */
            const paymentResponse = await transaction.payments.findUnique({
                where : {payment_intent_id : paymentIntentId}  
            });
            if(!paymentResponse){
                // could not find any entry in payments table with this payment intent id 
                // lets throw an error 
                throw new AppError("Payment entry not found for this payment id", StatusCodes.NOT_FOUND_404);
            }
            // }else if (paymentResponse.payment_status === "Paid"){
            //     // the payment status is already paid hence we will return
            //     throw new AppError("Payment is already done.", StatusCodes.CONFLICT_409);
            // }
            
            // lets load the order so that we can implement the idempotency + business rules 
            const orderResponse = await transaction.order.findUnique({
                where : {id : paymentResponse.order_id}
            });

            if(!orderResponse){
                // Order not found for the given payment
                // hence lets throw an error which will be eventually be handled by error middleware 
                throw new AppError("Order not found for the given payment", StatusCodes.NOT_FOUND_404);
            }
            
            /**
             * Idempotency guards (e.g. stripe webhooks can retry)
             * We treat the order as "already finalized" if paid_at is set.
             * Also normalize payment_status to Paid if needed. 
             */
            if(orderResponse.paid_at){
                if(paymentResponse.payment_status !== PaymentStatus.Paid){
                    // then this means that the order is set to paid but the payment status is not set to paid
                    // hence we need to normalize by setting the payment status as paid for this purpose 
                    await transaction.payments.update({
                        where : {payment_intent_id : paymentIntentId}, 
                        data : {payment_status : PaymentStatus.Paid}
                    });
                }

                const responseToSend = {success : true, message : "Order is already finalized. Hence setting the payment status as Paid"};
                // return a positive response to the user 
                return responseToSend;
            }

            // second case could be that the payment is already paid but the order is not yet finalized 
            if(paymentResponse.payment_status === PaymentStatus.Paid){
                // this means that the payment is marked as Paid but the order is not finalized
                // meaning the paid_at value is not set for this order. lets update it now for this purpose
                await transaction.order.update({
                    where : {id : paymentResponse.order_id}, 
                    data : {paid_at : new Date()}
                });

                const responseToSend = {success : true, message : "Normalized state (payment was Paid; set order.paid_at)" };
                // say everything went fine 
                return responseToSend;
            }

            // here we are confident that we everything is consistent and we need to finalize the payment in the orders
            // table as well in the payments table. lets first start with reducing the stock according to the order 
            const orderItemsResponse = await transaction.orderItem.findMany({
                where : {order_id : paymentResponse.order_id}
            });
            if(!orderItemsResponse){
                // no orderitem is present for this order 
                throw new AppError("No order items rows found for this order", StatusCodes.INTERNAL_ERROR_500);
            }


            // lets use the for loop to use the product_id and quantity to reduce the number of 
            // stocks 
            for(var currOrderItem of orderItemsResponse){
                // update the stock 
                const updatedResponse = await transaction.product.update({
                    where : {id : currOrderItem.product_id, stock : {gte : currOrderItem.quantity}}, 
                    data : {
                        stock : {decrement : currOrderItem.quantity}
                    }
                });

                if(!updatedResponse){
                    // this means that the stock was not enough in this product. 
                    // hence lets return a negative response to the user 
                    // by throwing an error 
                    throw new AppError(`Insufficient stock (or missing product) for product_id${currOrderItem.product_id}`, StatusCodes.CONFLICT_409);
                }
                // else we need to continue
            }

            // now lets mark the order paid and payment status as paid 
            await transaction.order.update({
                where : {id : paymentResponse.order_id}, 
                data : {paid_at : new Date()}
            });

            await transaction.payments.update({
                where : {payment_intent_id : paymentIntentId}, 
                data : {payment_status : PaymentStatus.Paid}
            });

            const responseToSend = {success: true, message : "Finalized payment and decremented stock" }
            // say everything went fine 
            return responseToSend;
        })

            
    }


}