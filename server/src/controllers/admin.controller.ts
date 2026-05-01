import { Request, Response } from "express";
import { AdminService } from "../services/admin.service";
import { StatusCodes } from "../error/statusCodes";

// controller for all the admin related apis 
export class AdminController {
    // controller function to return the list of the users to the admin. 
    // please note this end point supports the pagination.
    static async getAllUsersController(request : Request, response : Response) {
        const pages = request.query.page? parseInt(request.query.page as string) : 1;

        // lets call the service layer function here 
        const [totalNumberOfUsers, usersListResponse] = await AdminService.getAllUsersService(pages);

        // if control reaches here this means that the api request was successfull . 
        // lets return a positive response to the user 
        return response.status(StatusCodes.SUCCESS_200).json({
            success : true, 
            message : "Successfully fetched the users list", 
            currentPage : pages,
            totalUsers : totalNumberOfUsers,
            userList : usersListResponse
        });


    }
}