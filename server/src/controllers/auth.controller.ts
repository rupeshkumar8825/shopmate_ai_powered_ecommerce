// this handles all logic related to authenticated related routes

import { Request } from "express";
import AppError from "../middlware/errorHandler";
import prisma from "../config/prisma";
import { User } from "../generated/prisma/client";
import { ErrorCodes } from "../error/errorCodes";
import { AuthService } from "../services/auth.service";

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

        const createUser = await AuthService.registerUserService(name, email, password);

    }

    
}