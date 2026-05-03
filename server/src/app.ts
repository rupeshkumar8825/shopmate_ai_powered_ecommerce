import cookieParser from "cookie-parser";
import express, { Request, Response } from "express"
import { Express } from "express";
import { ENV } from "./config/env";
import cors from "cors"
import AppError, { ErrorHandler } from "./middlware/errorHandler";
import expressFileUpload  from "express-fileupload"

import authRoutes from "./routes/auth.routes"
import productRoutes from "./routes/product.routes";
import adminRouter from "./routes/admin.routes";
import { StatusCodes } from "./error/statusCodes";
import stripe, { Stripe } from "stripe";
import prisma from "./config/prisma";
import { PaymentController } from "./controllers/payments.controller";


const app : Express = express();

// dedining the different types of the middlewares here for this purpose 
app.use(cors({
    origin : [ENV.FRONTEND_URL, ENV.DASHBOARD_URL], 
    methods : ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials : true,     
})
);

/**
 * TODO : Following things needs to be implemented : 
 *      1. Implementation of stripe integration is remaining for this server backend implementation 
 *      2. Creation of the GEMINI key is pending. This is required to be able to make AI filtered 
 *         products feature to work. 
 */
app.post("/api/v1/payments/webhook", express.raw({type : "application/json"}), PaymentController.paymentWebhookHandlerController)


// defining the function to handle the successfull payment of the client 
const finalizeStripePayment = async (paymentIntentId : string): Promise<boolean> => {  
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
        const paymentResponse = await prisma.payments.findUnique({
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
        const orderResponse = await prisma.order.findUnique({
            where : {id : paymentResponse.order_id}
        });

        if(!orderResponse){
            // Order not found for the given payment
            // hence lets throw an error which will be eventually be handled by 
        }
        
        
        // now the user can order multiple products in a single order and for each (order, product) there would be 
        // an entry in the orderitems database table.  
        // hence lets fetch all the orderitems which belonged to this particular order_id
        const orderItemResponse = await prisma.orderItem.findMany({
            where : {order_id : updatedOrderResponse.id}
        })

        if(!orderItemResponse){
            // there were no orders. This is not expected. 
        }
        // now lets reduce the stock of all the purchased products 
        for (var currOrderItem of orderItemResponse){

        }

        const nowDateAndTime = new Date();
        // lets update the order itself 
        const updatedOrderResponse = await prisma.order.update({
            where : {id : paymentStatusUpdateResponse.order_id}, 
            data : {paid_at : nowDateAndTime}
        });
        if(!updatedOrderResponse){
            // something went wrong. lets throw an error 
            throw new AppError("Internal server error while updating the payment time in the orders table", StatusCodes.INTERNAL_ERROR_500);
        }


        // this means that the payment status can be updated now
        // shift this to the end. meaning after we are done updating the stocks 
        // and other database tables then only we will mark the payment as PAID 
        const paymentStatusUpdateResponse = await prisma.payments.update({
            where : {payment_intent_id : paymentIntentId}, 
            data : {payment_status : "Paid"}
        });
        if(!paymentStatusUpdateResponse){
            // something went wrong 
            throw new AppError("Internal server error while updating the payment status", StatusCodes.INTERNAL_ERROR_500);
        }


        // say everything went fine 
        return true;
    })

        
}

async function stripeEventHandler (stripeEvent : Stripe.Event) : Promise<boolean> {
    switch (stripeEvent.type) {
        case "payment_intent.succeeded" : {
            const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent;
            console.log("Payment intent successfull", paymentIntent.id, paymentIntent.metadata);
            
            
            const finalizeStripePaymentResponse: boolean = await finalizeStripePayment(paymentIntent.id);
            if(!finalizeStripePaymentResponse){
                // then something went wrong
                // throw an error here 
                throw new AppError("Something went wrong while finalizing the payment.", StatusCodes.INTERNAL_ERROR_500);
            }

        }
            break;
        case "payment_intent.payment_failed" : {
            const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent
            console.log("Payment failed", paymentIntent.id, paymentIntent.metadata);
            // payment failed we need to update this thing in the database too in the payments table

        }
        default : 
            // ignore the other event types
            break;
    }

    return true;
}


app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({extended : true}))
// app.use(file)

// lets define the middleware for uploading the files 
// setup the middlewares 
app.use(
    expressFileUpload({
        tempFileDir : "./uploads", 
        useTempFiles : true,
        limits : {fileSize : 5 * 1024 * 1024}, // 5MB 
        abortOnLimit : true, 
        createParentPath : true,
    })
)

app.use("/v1/auth", authRoutes)
app.use("/v1/product", productRoutes)
app.use("/v1/admin", adminRouter)



// at last we must keep the error handling middleware at the last
// but why we do we have to do this???? need to check on this 
app.use(ErrorHandler)



// now we will be exporting the application so that we can use it properly in this case 
// also this file consists of all the settings about server and middlewares that we
// require for our application in this case for this purpose 
export default app;
