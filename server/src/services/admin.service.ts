// service layer class to handle all the admin related apis

import prisma from "../config/prisma";
import { StatusCodes } from "../error/statusCodes";
import AppError from "../middlware/errorHandler";

export class AdminService {
    static async getAllUsersService(pages : number | undefined) {
        if(!pages){
            pages = 1;
        }

        const offset = (pages - 1) * 10;
        const allUsers = await prisma.user.findMany();

        const totalUsersCount = allUsers.length;


        const userList = await prisma.user.findMany({
            where : {role : "User"},
            skip : offset, 
            orderBy : {createdAt : "desc"}, 
            take : 10
        });

        // say everything went fine 
        return [totalUsersCount, userList];
    }

    static async deleteUserService(adminUserId : string | undefined, userIdToDelete : string | undefined) {
        // validation of the inputs to be done here 
        if(!adminUserId || !userIdToDelete){
            // throw error here 
            throw new AppError("Invalid admin user or invalid user to delete", StatusCodes.BAD_REQUEST_400);
        }

        /**
         * Actions to take in order to delete the user : 
         *      1. Delete all the products and all the reviews given by that particular user
         *      2. Then finally delete the user itself.
         * Need to check the cascading effect itself of the database tables. 
         * 
         */

        const deleteUserResponse = await prisma.user.delete({
            where : {id : userIdToDelete}
        });

        if(!deleteUserResponse){
            // some error happened 
            throw new AppError("User deletion failed", StatusCodes.INTERNAL_ERROR_500);
        }

        // else return this to the 
        return deleteUserResponse;

    }
}