// middleware to handle the authentication of the user
// this middleware will be called before the actual API call logic starts executing

import { NextFunction, Request, Response } from "express";
import AppError from "./errorHandler";
import { StatusCodes } from "../error/statusCodes";
import jwt, { JwtPayload } from "jsonwebtoken"
import { ENV } from "../config/env";



// middleware function to handle the authentication of the user hitting the api request 
// to us. This middleware would be called almost each of the api hits. 
export function authMiddleware (request : Request, response : Response, next : NextFunction) {
    // need to fetch the token from the authorization header itself
    const authorizationHeader = request.cookies;
    if(!authorizationHeader)
    {
        // this means that authorization header is not present 
        // hence lets try to throw an error in this case
        throw new AppError("Authorization header was not found", StatusCodes.BAD_REQUEST_400);
    }  

    // otherwise lets fetch the token from it
    const token = authorizationHeader.token;
    if(!token)
    {
        // token was not found hence lets throw an error here
        throw new AppError("Token was not found", StatusCodes.BAD_REQUEST_400);
    }

    // otherwise lets decode this token and then try to get the user information from this 
    const decodedToken = jwt.verify(token, ENV.JWT_SECRET_KEY) as JwtPayload;
    const userId = decodedToken.id;
    const email = decodedToken.email;

    console.log(`[(${Date.now()})Authmiddleware :- ]the decoded value of the userid from token is : `, userId)
    console.log(`[(${Date.now()})Authmiddleware :- ]the decoded value of the email from token is : `, email)

    // embed these decoded values about the user into the request object itself
    // this our controllers will be able to get the userid and email without
    // having to decode it again and again for this purpose
    request.userId = userId;
    request.email = email;

    // since the token decoding was successfully hence lets call the next function
    // say everything went fine 
    next();

}