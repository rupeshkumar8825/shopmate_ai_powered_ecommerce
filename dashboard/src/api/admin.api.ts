import type { AdminGetAllUsersRequestPayload, AdminGetAllUsersResponse } from "../types/admin.types";
import { axiosInstance } from "./axios.instance"

// all the function responsible to hit the api to the backend server comes here
export const getAllUsersAdminApi = async (payload : AdminGetAllUsersRequestPayload) => {
    const response = await axiosInstance.get("/v1/admin/users", {
        params : {
            pages : payload.pages
        }
    });

    if(!response.data) {
        throw new Error("EMPTY_RESPONSE")
    }

    if(!response.data.usersList) {
        throw new Error("INVALID_RESPONSE")
    }


    // say everything went fine 
    return response.data as AdminGetAllUsersResponse
}