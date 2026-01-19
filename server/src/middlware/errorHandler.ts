// this is the middleware to handle the errors and then return the correct message and status 

import { NextFunction, Request, Response } from "express";
import { success } from "zod";

class AppError extends Error {
    statusCode : number
    constructor(message : string, statusCode : number)
    {
        super(message)
        this.statusCode = statusCode
    }
}


// codes to the client 
export const ErrorHandler = (error : Error, req : Request, res: Response, next: NextFunction) => {

    // check if the error is of type apperror or not
    if(error instanceof AppError)
    {
        // then simply we can return the message and the return code as it is
        res.status(error.statusCode).json({
            success : "error", 
            message : error.message
        });
    }


    console.log("Unhandled error occurred:", error);
    //otherwise this means that some internal error occurred hence we will return teh 
    // status code as 500 and message as internal error 
    res.status(500).json({
        success : 'error', 
        message : "Internal Server Error Occurred"
    })

}

export default AppError