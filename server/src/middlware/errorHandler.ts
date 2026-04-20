// this is the middleware to handle the errors and then return the correct message and status 

import { NextFunction, Request, Response } from "express";
import { success } from "zod";
import { PrismaClientKnownRequestError } from "../generated/prisma/internal/prismaNamespace";
import { StatusCodes } from "../error/statusCodes";

class AppError extends Error {
    statusCode : number
    constructor(message : string, statusCode : number)
    {
        super(message)
        this.statusCode = statusCode
    }
}


// codes to the client 
export const ErrorHandler = (error : Error, request : Request, response: Response, next: NextFunction) => {

    // check if the error is of type apperror or not
    if(error instanceof AppError)
    {
        // then simply we can return the message and the return code as it is
        return response.status(error.statusCode).json({
            success : "error", 
            message : error.message
        });
    }
    else if(error instanceof PrismaClientKnownRequestError)
    {
        // this is some prisma error let's try to find out the following things 
        // code : error code of the prisma which we will return to the client as well 
        // message : the exact error message. this also we will send it to client
        const code = error.code;
        let message = error.message;
        message = `Error occurred while interacting with database with prisma code as ${code} and with message as ${message}`;

        // lets return the response to the client 
        return response.status(StatusCodes.BAD_REQUEST_400).json({
            success : "error", 
            message : message
        });
    }


    console.log("Unhandled error occurred:", error);
    //otherwise this means that some internal error occurred hence we will return teh 
    // status code as 500 and message as internal error 
    response.status(500).json({
        success : 'error', 
        message : "Internal Server Error Occurred"
    })

}

export default AppError