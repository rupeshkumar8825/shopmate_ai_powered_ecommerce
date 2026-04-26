// middleware to check whether the user is authorized user or not
// for example for creation of the product can only be done by an admin user
// so before actually taking the request to the controller layer, its better to first
// validate the role of the user in the middleware itself. 

import { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma";
import AppError from "./errorHandler";
import { StatusCodes } from "../error/statusCodes";

export const validateRole = (requiredRole : string) => {
     return async function (request : Request, response : Response, nextFunction : NextFunction) {
          // assuming this middleware will be called after the the authentication middleware
          // hence if the control reaches to this function this would mean that the request
          // object will already have the userId object into the request object
          const userId : string = request.userId ?? "";
          
          const currUser = await prisma.user.findUnique({
               where : {id : userId}
          });

          if(!currUser){
               // user not found lets throw an error 
               throw new AppError("User not found", StatusCodes.NOT_FOUND_404)
          }
          
          // otherwise lets try to validate the role of the user 
          if(currUser.role !== requiredRole){
               // then this would mean that role mismatch happened. lets throw an error 
               throw new AppError("User not authorized to do this action", StatusCodes.NOT_AUTHORIZED_401)
          }

          // else everything went fine 
          nextFunction();

     }
      
     
}