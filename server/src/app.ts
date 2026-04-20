import cookieParser from "cookie-parser";
import express from "express"
import { Express } from "express";
import { ENV } from "./config/env";
import cors from "cors"
import { ErrorHandler } from "./middlware/errorHandler";

import authRoutes from "./routes/auth.routes"


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

app.use("/v1/auth", authRoutes)



// at last we must keep the error handling middleware at the last
// but why we do we have to do this???? need to check on this 
app.use(ErrorHandler)



// now we will be exporting the application so that we can use it properly in this case 
// also this file consists of all the settings about server and middlewares that we
// require for our application in this case for this purpose 
export default app;
