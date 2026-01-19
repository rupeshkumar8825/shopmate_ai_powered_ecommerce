// this handles all logic related to authenticated related routes

import { Request } from "express";
import AppError from "../middlware/errorHandler";
import prisma from "../config/prisma";
import { User } from "../generated/prisma/client";
import { ErrorCodes } from "../error/errorCodes";

export class AuthController {
    static  registerUser = async (req: Request, res: Response) => {
        // first validate the client data received. Ideally we should use zod validation
        // but for now we will do validation of the client data by ourselves itself
        // after proper validation we will call the service layer function
        const {name, email, password} = req.body;
        if(!name || !email || !password)
        {
            // if any of the fields are not defined then we will throw an apperror
            throw new AppError("Please provide all fields", 400);
        }



        const isEmailAlreadyExists : User[] = await prisma.user.findMany({
            where:{
                email : email    
            }
        })

        
        if(isEmailAlreadyExists.length > 0)
        {
            // this means that this email is already taken hence throw an error 
            throw new AppError("Duplicate Email Found", ErrorCodes.BAD_REQUEST)
        }

        //otherwise we are good to go and create a new entry for this user 
        //in this particular database
        // for this we may call the function from the service layer itself 





    }
}