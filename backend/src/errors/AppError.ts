import { NextFunction, Request, Response } from "express";

// defining the global error handling for the application here 
export class AppError extends Error{
    // we are saying that every apperror will have the following two fields
    public readonly statusCode : number;
    public readonly isOperational : boolean;

    constructor(statusCode : number, message : string)
    {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

    }

}


// this is the centralized error handling function for this purpose
export const errorHandler = (err : Error, req : Request, res: Response, next : NextFunction) => {

    // check if the error is of type AppError or not. 
    // if it is of type of AppError then this means that this is handled error
    if(err instanceof AppError)
    {
        return res.status(err.statusCode).json({
            status : "error", 
            message : err.message
        });

    }

    console.error("Unhandled Error :", err);


    // this means that this is unhandled error hence we will return 500 status code
    // with message stating "some internal server error occurred"
    return res.status(500).json({
        status : "error", 
        message : "Internal Server Error"    
    });
}