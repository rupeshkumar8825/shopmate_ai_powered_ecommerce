// this is service layer for handling the authentication related business logic
// this layer will interact with the database prisma ORM 
// kindly note that we are not going to using the user repository as we are already 
import { ENV } from "../config/env"
import prisma from "../config/prisma"
import { ErrorCodes } from "../error/errorCodes"
import { User } from "../generated/prisma/client"
import AppError from "../middlware/errorHandler"
import bcrypt from "bcrypt"

// using an prisma ORM. And generally ORMs are enough to act as an abstraction layer 
export class AuthService {
    static registerUserService = async (name : string, email : string, password : string) => {
        // check whether the email is already taken or not
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


        // get the hash of the password 
        const hashedPassword = await bcrypt.hash(password, ENV.DASHBOARD_URL)
        //now lets create a new user 
        const userCreate = await prisma.user.create({
            data:
            {
                name : name,
                email : email, 
                password : hashedPassword
            }
        })
        

        // need to get the token and then need to set the cookie in the user's 
        // browser for this purpose
        

    }
}