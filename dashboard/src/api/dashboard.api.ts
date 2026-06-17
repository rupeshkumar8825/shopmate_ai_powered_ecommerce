// All the API calls related to the admin dashboard statistics live here.
// This maps to the AdminController dashboard route on the backend:
//   GET /v1/admin/dashboard-stats -> getDashboardStatsApi   (admin only)
// The route is mounted under `/v1/admin`, but it backs the dashboard feature, so the call
// lives alongside the rest of the dashboard module (atom / selectors / hook) rather than in
// admin.api.ts. This layer abstracts the backend HTTP call away from the rest of the dashboard.

import type { GetDashboardStatsResponse } from "../types/dashboard.types";
import { axiosInstance } from "./axios.instance";


// fetches the aggregated dashboard statistics (GET /v1/admin/dashboard-stats)
export const getDashboardStatsApi = async (): Promise<GetDashboardStatsResponse> => {
    const response = await axiosInstance.get("/v1/admin/dashboard-stats");

    if (!response.data) {
        throw new Error("EMPTY_RESPONSE")
    }

    if (!response.data.dashboardStats) {
        throw new Error("INVALID_RESPONSE")
    }

    // say everything went fine
    return response.data as GetDashboardStatsResponse
}
