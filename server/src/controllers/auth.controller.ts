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
    static async loginUser (request : Request, response : Response){
        const email = request.body.email;
        const password = request.body.password;
        // lets call service function 
        const token = await AuthService.loginUserService(email, password);


        // say everything went fine and lets set the cookie for the user
        response.status(StatusCodes.SUCCESS_200).cookie("token", token, {
            expires : new Date(Date.now() + ENV.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000), 
            httpOnly : true
        }).json({
            success : "true", 
            message : "User logged in successfully", 
            token : token
        }) 
        
    } 


    static async logoutUser(request : Request, response : Response){
        // we simply need to delete the cookies 
        // and since this can be done in the controller itself 
        // hence we will not call any function from the service layer
        response.status(StatusCodes.SUCCESS_200).cookie("token", "", {
            expires : new Date(Date.now()), 
            httpOnly : true
        }).json({
            success : "true", 
            message : "User successfully logged out"
        });
    }

    // controller function to get the details of a given user
    static async  getUserDetails(request : Request, response : Response){
        // here by now we can assume that the authmiddleware would have validated the token already 
        const userId = request.userId as string;
        const user = await AuthService.getUserInformationService(userId)


        // say everything went fine
        return response.status(StatusCodes.SUCCESS_200).json({
            success : "true", 
            message : "User details successfully fetched", 
            user : user
        })
    }


    // controller for the forgot password 
    // this will call the service layer forgotPassword 
    static async forgotPassword(request : Request, response : Response) {
        // considering that the zod would have validated the data being sent from
        // the user/client is correct we will take the email and the frontendURL
        const email : string = request.body.email;
        // const frontendURL : string = request.query;
        const frontendURL = "";

        // lets pass these arguments to the service layer function
        AuthService.forgotPasswordService(email, frontendURL);

        // if the control reaches here this means that the service 
        // layer worked as expected. lets return the positive response to the user
        return response.status(StatusCodes.SUCCESS_200).json({
            success : true,
            message : "Password change email successfully sent", 
        })

    }

    static async resetPassword(request : Request, response : Response){
        // considering that the zod would have validated the user input lets read the values 
        const password = request.body.password;
        const confirmPassword = request.body.confirmPassword;

        const resetPasswordToken = request.params.token as string;

        // call the service layer function by passing this token and also the passwords
        AuthService.resetPasswordService(resetPasswordToken, password, confirmPassword)

        // if control reaches then we know that the password change is now successfull 
        // hence lets return the positive response itself 
        response.status(StatusCodes.SUCCESS_200).json({
            success : true,
            message : "Password successfully changed"
        })
    }

    // define the controller function for updating the password of the user 
    static async updatePassword (request : Request, response : Response) {
        // assume that the zod will validate the user input and then the controller
        // will be called. Hence lets just directly take the value from the request object 
        const password : string = request.body.password;
        const newPassword : string = request.body.newPassword;
        const confirmPassword : string = request.body.confirmPassword;
        const userId = request.userId? request.userId : "";
        // take the userid from the request parameters
        // const userId = request.params.userId? request.params.userId as string : "";
        console.log("the value of ")
        // lets pass all these values to the service layer function 
        await AuthService.updatePasswordService(userId, password, newPassword, confirmPassword)

        // if control reaches here then we are sure that the user password got changed
        // hence lets return positive response to the user here in this case 
        response.status(StatusCodes.SUCCESS_200).json({
            success : true, 
            message : "User password successfully changed"
        });
    }


    // controller for updating the user's profile
    // in this we will update the name, email and the avatar/profile of user
    static async updateProfile(request : Request, response : Response) {
        // consider that the data that is sent by the user is correct by zod
        // validation. Hence lets read the data directly from request object 
        const updatedName = request.body.name;
        const updatedEmail = request.body.email;
        // const avatar = request.
    } 

}