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
import orderRoutes from "./routes/order.routes";


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
app.use("/v1/order", orderRoutes)



// at last we must keep the error handling middleware at the last
// but why we do we have to do this???? need to check on this 
app.use(ErrorHandler)



// now we will be exporting the application so that we can use it properly in this case 
// also this file consists of all the settings about server and middlewares that we
// require for our application in this case for this purpose 
export default app;


// TODO : Now once the complete backend and frontend is done then we can work on adding the 
// following features to stand out further : 
// 1. Newsletter functionality : - in this we should be able to send some emails to the 
// customers who are subscribed to the newsletter. This newsletter should consists of 
// the details about the new products. And on clicking on this new product the user 
// should be redirected to the products detail page. 