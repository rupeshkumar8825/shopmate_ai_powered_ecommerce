import cookieParser from "cookie-parser";
import express from "express"
import { Express } from "express";
import { ENV } from "./config/env";
import cors from "cors"
import { ErrorHandler } from "./middlware/errorHandler";
import expressFileUpload  from "express-fileupload"

import authRoutes from "./routes/auth.routes"
import productRoutes from "./routes/product.routes";
import adminRouter from "./routes/admin.routes";


const app : Express = express();

// dedining the different types of the middlewares here for this purpose 
app.use(cors({
    origin : [ENV.FRONTEND_URL, ENV.DASHBOARD_URL], 
    methods : ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials : true,     
})
);

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
