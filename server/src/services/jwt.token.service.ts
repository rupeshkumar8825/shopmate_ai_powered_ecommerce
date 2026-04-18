// this will handle all logic related to jwt token itself
import jwt  from "jsonwebtoken"
import { User } from "../generated/prisma/client"


export class JWTTokenService {
    // define the important functions here for this purpose 
    static async getNewToken(user : User){
        // const token = jwt.sign(user.email, process.env.JWT_SECRET_KEY, )
    }
}

