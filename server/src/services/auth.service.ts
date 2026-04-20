// this is service layer for handling the authentication related business logic
// this layer will interact with the database prisma ORM 
// kindly note that we are not going to using the user repository as we are already 
import { ENV } from "../config/env"
import prisma from "../config/prisma"
import { StatusCodes } from "../error/statusCodes"
import { User } from "../generated/prisma/client"
import AppError from "../middlware/errorHandler"
import bcrypt from "bcrypt"
import { JWTTokenService } from "./jwt.token.service"
import { PrismaClientKnownRequestError } from "../generated/prisma/internal/prismaNamespace"

// using an prisma ORM. And generally ORMs are enough to act as an abstraction layer 
export class AuthService {
    static registerUserService = async (name : string, email : string, password : string) : Promise<[User, string]> => {
        // check whether the email is already taken or not
        const isEmailAlreadyExists : User[] = await prisma.user.findMany({
            where:{
                email : email    
            }
        })

        if(isEmailAlreadyExists.length > 0)
        {
            // this means that this email is already taken hence throw an error 
            throw new AppError("Duplicate Email Found", StatusCodes.BAD_REQUEST_400)
        }


        // get the hash of the password 
        const hashedPassword = await bcrypt.hash(password, 10)
        let userCreate = null;
        //now lets create a new user
        try{
            
                userCreate = await prisma.user.create({
                    data:
                    {
                        name : name,
                        email : email, 
                        password : hashedPassword
                    }
                })
        } catch(error)
        {
            if(error instanceof PrismaClientKnownRequestError)
            {
                // this is a known error. we need to get the following fields
                // code : the error code 
                // message : this will return the error message
                const code = error.code;
                const message =  "Error Occurred with message : " + error.message + " and with error code" + code;
                
                // lets the throw the error with proper message
                throw new AppError(message, StatusCodes.BAD_REQUEST_400)
            }
            
            // otherwise this is some unknown message 
            throw new AppError("Something went wrong", StatusCodes.INTERNAL_ERROR_500)
        }
        
        // check if the user creation was successfull 
        if(!userCreate)
        {
            // there was some problem creating the user 
            throw new AppError("Some problem occurred while creating new user in database", StatusCodes.INTERNAL_ERROR_500);
        }

        // need to get the token and then need to set the cookie in the user's 
        // browser for this purpose
        const token = await JWTTokenService.generateNewToken(userCreate)
        
        // say everything went fine 
        return [userCreate, token]
        
    }
}