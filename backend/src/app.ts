import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express();

//setting up the different middlewares in this case
app.use(cors());

// this middleware is to parse the data into the json format. 
app.use(express.json());
// middle ware to get 
app.use(cookieParser());

// this middleware tells that which type of data has arrived in this case 
app.use(express.urlencoded({extended: true}));


app.get("/health", (req, res) => {
    res.json({status : "OK"})
})


export default app;





