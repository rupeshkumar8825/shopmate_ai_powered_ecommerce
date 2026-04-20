// this handles all logic related to authenticated related routes

import { Request, Response } from "express";
import AppError from "../middlware/errorHandler";
import prisma from "../config/prisma";
import { User } from "../generated/prisma/client";
import { StatusCodes } from "../error/statusCodes";
import { AuthService } from "../services/auth.service";
import { ENV } from "../config/env";

export class AuthController {
    static  registerUser = async (request: Request, response: Response) => {
        // first validate the client data received. Ideally we should use zod validation
        // but for now we will do validation of the client data by ourselves itself
        // after proper validation we will call the service layer function
        console.log("the api end point to register the user got successfully hit")
        console.log("the value of request body is as follows : ", request.body);
        const {name, email, password} = request.body;
        if(!name || !email || !password)
        {
            // if any of the fields are not defined then we will throw an apperror
            throw new AppError("Please provide all fields", 400);
        }

        const [userCreated, token] = await AuthService.registerUserService(name, email, password);
        

        // say everything went fine 

        // here lets set the cookies for the user with the help of received token
        response.status(StatusCodes.SUCCESS_200).cookie("token", token, {
            expires: new Date(Date.now() + ENV.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000), 
            httpOnly : true
        }).json({
            success : true, 
            user : userCreated, 
            message : "User registered successfully", 
        });
    }


    //controller function to handle login of the user
    static loginUser (request : Request, response : Response){
        const email = request.body.email;
        const password = request.body.password;
        // lets call service function 
        const token = AuthService.loginUserService(email, password);


        // say everything went fine 
        response.status(StatusCodes.SUCCESS_200).json({
            success : "true", 
            message : "User login successfully", 
            token : token
        })
    } 


}