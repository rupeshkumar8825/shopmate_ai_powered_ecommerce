// this will handle all logic related to jwt token itself
import jwt, { SignOptions }  from "jsonwebtoken"
import { User } from "../generated/prisma/client"
import { ENV } from "../config/env"
import { env } from "node:process"
import AppError from "../middlware/errorHandler"
import { StatusCodes } from "../error/statusCodes"


export class JWTTokenService {
    // define the important functions here for this purpose 
    static async generateNewToken(user : User) : Promise<string>{
        console.log("inside generate newtoken service function")
        // check whether all the environment variables are defined properly or not
        if(!ENV.JWT_SECRET_KEY || !ENV.JWT_EXPIRES_IN)
        {
            // the secret is not defined hence we should throw error here
            // please note that this will be automatically handled by the 
            // error middleware and return the relevant message codes and 
            // message to the user itself. 
            // Please note that even if we do no catch this error in controller
            // or some other service from which this is being called but still 
            // the exception will bubble up and eventually will be catched by the 
            // global error middleware handler for this purpose. 
            throw new AppError("JWT Environment variables are not defined", StatusCodes.NOT_AUTHORIZED_401);
        }

        console.log("the jwt secrets and expiry related information are already defined")
        const expiresIn = ENV.JWT_EXPIRES_IN as SignOptions["expiresIn"] ?? "1d"
        const tokenOptions  = {
            expiresIn : expiresIn
        }

        const payload = {
            id : user.id,
            email : user.email
        }
        console.log("the payload on which we need to create the token is ", payload)
        const token = jwt.sign(payload, ENV.JWT_SECRET_KEY, tokenOptions)
        console.log("the generated token is as follows", token);
        // say everything went fine 
        return token;
    }
}

