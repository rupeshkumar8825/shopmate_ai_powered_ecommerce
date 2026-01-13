import express from "express"
import { config } from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

// create the app from the express framework
const app = express();

config({path : "./config/config.env"});


// Now we will be setting up multiple middlewares in our case for this purpose. 

// set the CORS middleware to tell what all origins are allowed to make 
// the requests to this particular server.
// we can also specify which methods the allowed origin can call 
// to this server. 
app.use(
    cors({
        origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL], 
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

// using cookieParser to parse the cookie
app.use(cookieParser())
// setup the middleware to parse the data into the json format
app.use(express.json())

// this finds out the type of the data that has arrived.
// whether the data which came is of string format, array format
// or json format and so on.
app.use(express.urlencoded({extended: true}))

// middleware to access the files which were sent 
// we specify location where the files should be present 
// sent from the frontend.
app.use(fileUpload({
    tempFileDir: "./uploads",
    useTempFiles: true,
}))


// lets export the default app now 
export default app;

