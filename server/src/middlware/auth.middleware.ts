// middleware to handle the authentication of the user
// this middleware will be called before the actual API call logic starts executing

import { NextFunction, Request, Response } from "express";
import AppError from "./errorHandler";
import { StatusCodes } from "../error/statusCodes";
import jwt, { JwtPayload } from "jsonwebtoken"
import { ENV } from "../config/env";

export function authMiddleware (request : Request, response : Response, next : NextFunction) {
    // need to fetch the token from the authorization header itself
    const authorizationHeader = request.headers.authorization;
    if(!authorizationHeader)
    {
        // this means that authorization header is not present 
        // hence lets try to throw an error in this case
        throw new AppError("Authorization header was not found", StatusCodes.BAD_REQUEST_400);
    }  

    // otherwise lets fetch the token from it
    const token = authorizationHeader.split(' ')[1];
    if(!token)
    {
        // token was not found hence lets throw an error here
        throw new AppError("Token was not found", StatusCodes.BAD_REQUEST_400);
    }

    // otherwise lets decode this token and then try to get the user information from this 
    const decodedToken = jwt.verify(token, ENV.JWT_SECRET_KEY) as JwtPayload;
    const userId = decodedToken.id;
    const email = decodedToken.email;

    // TODO :- need to find a way to embed the decoded id and email into the 
    // request itself so that we do not need to again decode the same token 
    // to get back the user's id and email

    // since the token decoding was successfully hence lets call the next function
    // say everything went fine 
    next();

}