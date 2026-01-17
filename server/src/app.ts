import cookieParser from "cookie-parser";
import express from "express"
import { Express } from "express";
import { ENV } from "./config/env";
import cors from "cors"



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




export default app;
