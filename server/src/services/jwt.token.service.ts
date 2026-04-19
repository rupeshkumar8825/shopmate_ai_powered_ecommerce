// this will handle all logic related to jwt token itself
import jwt, { SignOptions }  from "jsonwebtoken"
import { User } from "../generated/prisma/client"
import { ENV } from "../config/env"
import { env } from "node:process"
import AppError from "../middlware/errorHandler"


export class JWTTokenService {
    // define the important functions here for this purpose 
    static async generateNewToken(user : User) : Promise<string>{
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
            throw new AppError("JWT Environment variables are not defined", 401);
        }


        const expiresIn = ENV.JWT_EXPIRES_IN as SignOptions["expiresIn"] ?? "1d"
        const tokenOptions  = {
            expiresIn : expiresIn
        }

        const payload = {
            id : user.id,
            email : user.email
        }

        const token = jwt.sign(payload, ENV.JWT_SECRET_KEY, tokenOptions)
        
        // say everything went fine 
        return token;
    }
}

