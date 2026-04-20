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

        //now lets create a new user
        const userCreate = await prisma.user.create({
            data:
            {
                name : name,
                email : email, 
                password : hashedPassword
            }
        })
        
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


    /// service function to handle the login of the user. 
    /// if the login is successfull then this function will return the token 
    /// else it will throw the relevant error which will be then handled by the 
    /// global middleware that we have defined
    static async loginUserService(email : string, password : string) : Promise<string> {
        // check if the email exist
        const user : User | null = await prisma.user.findFirst({
            where: {
                email : email
            }
        })

        if (!user)
        {
            // was not able to find any user with this email id
            // hence lets throw an error with appropriate message 
            throw new AppError("User not found", StatusCodes.NOT_FOUND_404);
        }

        // else user was found. lets check whether the password matches or not. 
        const userHashedPassword : string = user.password;
        const isPasswordMatch = await bcrypt.compare(password, userHashedPassword);

        // compare both the passwords
        if(!isPasswordMatch)
        {
            // passwords do not match 
            throw new AppError("Incorrect password was entered.", StatusCodes.BAD_REQUEST_400);
        }

        // otherwise we need to send back the token to the controller
        const token = JWTTokenService.generateNewToken(user);

        // say everything went fine 
        return token;

    }


    static async logoutUserService() {
        // let logoutSuccess : Promise<boolean= null;

        // // say everything went fine 
        // return logoutSuccess
    }
}