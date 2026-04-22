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
import { generatePasswordResetToken } from "../utils/password.utils"
import { generatePasswordResetEmailTemplate } from "../utils/generate.email.template.utils"
import { sendEmail } from "../utils/send.email"

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
        const token = await JWTTokenService.generateNewToken(user);

        // say everything went fine 
        return token;

    }


    static async logoutUserService() {
        // let logoutSuccess : Promise<boolean= null;

        // // say everything went fine 
        // return logoutSuccess
    }



    // service function to return the user if found else throws an error for this purpose
    // this function takes the userId as the argument passed by the controller
    static async getUserInformationService(userId : string) : Promise<User> {
        const user = await prisma.user.findUnique({
            where : {
                id : userId
            }
        })

        if(!user)
        {
            // user was not found lets return an error for this purpose
            throw new AppError("User not found", StatusCodes.NOT_FOUND_404);
        }

        // say everything went fine 
        return user;
    }


    // service layer function to handle the forgot password related action
    static async forgotPasswordService(email : string, frontendUrl : string) {
        /// Actions to do : 
        ///     1. First find the user with the given emailid
        ///     2. Send an email for setting the password. 
        ///     3. We will send the link with the generated token in the email too 
        ///     4. Update the reset_password_token field with the generated token 
        ///     5. Update the reset_password_expire field to the expiry date of the token
        ///     6. Finally send the email and check its response

        // check whether the user exists of not 
        const user = await prisma.user.findUnique({
            where : {email : email}
        })
        if(!user)
        {
            // user was not found. Lets throw an error for this 
            throw new AppError("User not found", StatusCodes.NOT_FOUND_404);
        }

        // else lets generate the password reset token here 
        const generatTokenResponse = generatePasswordResetToken();
        const resetToken = generatTokenResponse.resetToken;
        const hashedToken = generatTokenResponse.hashedToken;
        const tokenExpiryTime = generatTokenResponse.resetPasswordTokenExpiry;
        
        // now lets update the database entries
        const userUpdateResponse = await prisma.user.update({
            where : {email : email},
            data : {
                resetPasswordToken : hashedToken, 
                resetPasswordExpires : new Date(tokenExpiryTime)
            }
        })

        if(!userUpdateResponse)
        {
            // this means that the user update failed. Hence lets throw error 
            throw new AppError("User update failed", StatusCodes.INTERNAL_ERROR_500);
        }
        

        // now lets generate the frontend url to be sent to the user 
        const resetPasswordURL = `${frontendUrl}/password/reset/${resetToken}`;

        // lets generate the gmail content to be sent to the user 
        const generatedGmailContent = generatePasswordResetEmailTemplate(resetPasswordURL);

        // lets send the email now 
        // this we want to keep it inside the try catch block because 
        // we want to send the custom message otherwise our server will throw 
        // the 500 internal server error which we may not want to do
        try{
            const emailSendResponse = await sendEmail(email, "Ecommerce Password Recovery", generatedGmailContent);
        }
        catch(error)
        {
            // since the send email failed hence we should rollback the changes related to 
            // the token entry in the database. lets do that now. 
            const userTokenRelatedDataUpdateResponse = await prisma.user.update({
                where : {email : email}, 
                data : { resetPasswordToken : null, resetPasswordExpires : null }
            });

            // now since the database changes has been rollbacked
            // now lets send the error to the error middleware
            throw new AppError("Failed to send the Ecommerce Password Reset Email", StatusCodes.INTERNAL_ERROR_500);
        }

        // say everything went fine 
        return;

    }
}