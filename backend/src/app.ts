import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import todoRoutes from "./routes/todo.routes"
import  { Express, Request, Response} from "express"
import { errorHandler } from "./errors/AppError";

const app : Express = express();

//setting up the different middlewares in this case
app.use(cors());

// this middleware is to parse the data into the json format. 
app.use(express.json());
// middle ware to get 
app.use(cookieParser());

// this middleware tells that which type of data has arrived in this case 
app.use(express.urlencoded({extended: true}));


// app.get("/health", (req : Request, res : Response) => {
//     res.json({status : "OK"})
// })

// adding the middleware here for all routes specific to the todo related actions
app.use("/api/todos", todoRoutes)

// need to add the custom error handler middleware here for this purpose
// this middleware must be at the last for this purpose 
app.use(errorHandler);


//this app needs to be exported so that this can be used in the index.ts 
// for starting the server.
// this app file acts as an settings of the server that we have to do before 
// running it for this purpose 
export default app;





