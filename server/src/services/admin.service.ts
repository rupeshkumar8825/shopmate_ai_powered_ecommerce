// service layer class to handle all the admin related apis

import prisma from "../config/prisma";

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
}