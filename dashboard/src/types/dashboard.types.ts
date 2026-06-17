// All the types for the admin dashboard statistics endpoint (GET /v1/admin/dashboard-stats).
// The underlying data-shape types (status counts, revenue series, product details) are the
// same ones the dashboard atom already exposes, so we import them from there rather than
// redeclaring a second copy.

import type {
    OrderStatusCounts,
    MonthlyRevenueResponse,
    TopSellingProductDetail,
    ProductDetail,
} from "../recoil/atoms/dashboard.atom"


// the aggregated stats object the backend returns. It mirrors the data fields of the
// dashboard atom (minus our client-only flags), so the hook can fold it straight in.
export interface DashboardStats {
    allTimeRevenue : number,
    totalPaidOrdersCount : number,
    totalUsersCount : number,
    // the backend always returns the counts here (the atom keeps it nullable until fetched)
    orderStatusCounts : OrderStatusCounts,
    todaysRevenue : number,
    yesterdayRevenue : number,
    monthlyRevenueResponse : MonthlyRevenueResponse[],
    topSellingProductDetails : TopSellingProductDetail[],
    revenueOfLastMonth : number,
    lowStockProductListQueryResponse : ProductDetail[],
    lastMonthRevenue : number,
    newUserRegisteredThisMonth : number
}


export interface GetDashboardStatsResponse {
    success : boolean,
    message : string,
    dashboardStats : DashboardStats
}
