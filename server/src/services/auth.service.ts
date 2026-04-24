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
import { generatePasswordResetToken, getHashedResetPasswordToken, verifyPasswordResetToken } from "../utils/password.utils"
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


    static async resetPasswordService(resetPasswordToken : string, newPassword : string, confirmNewPassword : string) {
        /// Following actions we need to do : 
        ///     1. Find the user using email whose email needs to be sent
        ///     2. Validate the resetPasswordToken whether its valid. 
        ///     3. If valid then check whether this is associated with this user or not
        ///     4. If this token belongs to this user, then check whether the timeout occurred or not
        ///     5. If timeout did not occur then we update the password in the database. 
        ///     6. Make the fields related to the token as null  

        /// Also if any occur at any of the steps then we will take appropriate actions. 
        
        
        // user was found, lets get the current hashedresetpassword token from the user
        const hashedPasswordResetToken = getHashedResetPasswordToken(resetPasswordToken)
        const userList = await prisma.user.findMany({
            where : {
                AND : [
                    {resetPasswordToken : hashedPasswordResetToken},
                    {resetPasswordExpires : { gt : Date.now.toString()}}
                ]
            }
        })

        if(!userList || userList.length == 0)
        {
            // user not found hence return an error 
            throw new AppError("User not found", StatusCodes.NOT_FOUND_404)
        }
        else if (userList.length > 1)
        {
            // there were two users who assigned the same token. 
            // since the possibility of having this is very low hence 
            // we will log this in the server and then we will just move forward
            console.log("Unexpected happened. Same token was assigned to two different user");
            console.log("The list of users are as follows: -", userList)
        }

        // lets take the first user itself 
        const user = userList[0];
        if(!user)
        {
            // lets throw an error
            throw new AppError("User not found", StatusCodes.NOT_FOUND_404)
            
        }
        // now we will validate the passwords 
        if(newPassword !== confirmNewPassword)
        {
            // the passwords do not match hence throw an error here
            throw new AppError("Passwords do not match", StatusCodes.BAD_REQUEST_400);
        }

        if((newPassword.length < 8) || (newPassword.length > 16))
        {
            // the password length is not as expected. lets throw an error here too
            throw new AppError("Password length should be between 8 and 16 characters", StatusCodes.BAD_REQUEST_400);
        }

        // hash the password using the bcrypt 
        const hashedPassowrd = bcrypt.hash(newPassword, 10);

        //everything passed lets now try to update the password of the user
        await prisma.user.update({
            where : {id : user.id},
            data : {
                password : newPassword
            } 
        });


        // ideally we should also delete the resettokenpassword and resettokenpasswordexpires
        // from the database but we can ignore that because anyways it is not harming us
        // say everything went fine and simply return from here for this purpose
        return;

    }

    static async updatePasswordService (userId : string, oldPassword : string, newPassword : string, newConfirmPassword : string) {
        const currentUser : User|null = await prisma.user.findUnique({
            where : {id : userId}
        });

        // check whether user exists or not with this particular thing 
        if(!currentUser)
        {
            // user does not exists hence lets throw an error here 
            throw new AppError("User does not exist.", StatusCodes.NOT_FOUND_404);
        }

        // lets get the current password and match it with old password 
        const isCurrentPasswordMatch = await bcrypt.compare(oldPassword, currentUser.password);
        if(!isCurrentPasswordMatch)
        {
            // password mismatch happened hence lets throw an error 
            throw new AppError("Password mismatch", StatusCodes.BAD_REQUEST_400);
        }

        // check whether the new password and the confirm password does not match 
        if(newPassword !== newConfirmPassword)
        {
            // throw an error here 
            throw new AppError("New password and confirm password do not match", StatusCodes.BAD_REQUEST_400)
        }
        // hash the password 
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        // every check password lets now update the password in the database 
        await prisma.user.update({
            where : {id : currentUser.id}, 
            data : {
                password : hashedPassword
            }
        });

        // say everything went fine 
        return;
    }
}