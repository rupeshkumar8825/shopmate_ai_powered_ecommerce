// All the API calls related to the admin-only `/v1/admin/*` endpoints live here.
// This layer abstracts the backend HTTP calls away from the rest of the dashboard.
// (Product and order admin operations have their own routers on the backend, so they
//  belong in their own api files — this one only covers the AdminController endpoints.)

import type {
    AdminGetAllUsersRequestPayload,
    AdminGetAllUsersResponse,
    AdminDeleteUserRequestPayload,
    AdminDeleteUserResponse,
    AdminGetDashboardStatsResponse,
} from "../types/admin.types";
import { axiosInstance } from "./axios.instance"


// fetches the paginated list of all users (GET /v1/admin/users?page=)
export const getAllUsersAdminApi = async (
    payload: AdminGetAllUsersRequestPayload
): Promise<AdminGetAllUsersResponse> => {
    const response = await axiosInstance.get("/v1/admin/users", {
        // the backend reads `request.query.page`
        params: {
            page: payload.pages,
        },
    });

    if (!response.data) {
        throw new Error("EMPTY_RESPONSE")
    }

    if (!response.data.userList) {
        throw new Error("INVALID_RESPONSE")
    }

    // say everything went fine
    return response.data as AdminGetAllUsersResponse
}


// deletes a user (DELETE /v1/admin/user — userId is sent in the request body)
export const deleteUserAdminApi = async (
    payload: AdminDeleteUserRequestPayload
): Promise<AdminDeleteUserResponse> => {
    const response = await axiosInstance.delete("/v1/admin/user", {
        // a DELETE request body must be passed via the `data` config field
        data: {
            userId: payload.userId,
        },
    });

    if (!response.data) {
        throw new Error("EMPTY_RESPONSE")
    }

    if (!response.data.deletedUser) {
        throw new Error("INVALID_RESPONSE")
    }

    // say everything went fine
    return response.data as AdminDeleteUserResponse
}


// fetches the aggregated dashboard statistics (GET /v1/admin/dashboard-stats)
export const getDashboardStatsAdminApi = async (): Promise<AdminGetDashboardStatsResponse> => {
    const response = await axiosInstance.get("/v1/admin/dashboard-stats");

    if (!response.data) {
        throw new Error("EMPTY_RESPONSE")
    }

    if (!response.data.dashboardStats) {
        throw new Error("INVALID_RESPONSE")
    }

    // say everything went fine
    return response.data as AdminGetDashboardStatsResponse
}
