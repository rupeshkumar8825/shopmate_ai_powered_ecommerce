// all the types related to the admin comes here 

import type { User } from "./auth.types"

export interface AdminGetAllUsersRequestPayload {
    pages : number
}

export interface AdminGetAllUsersResponse {
    success : boolean, 
    message : string, 
    currentPage : number, 
    totalUsers : number, 
    userList : User[]
}


export interface AdminDeleteUserRequestPayload {
    userId : string
}

export interface AdminDeleteUserResponse {
    success : boolean,
    message : string,
    deletedUser : User
}


// ── Product (as returned by the backend; mirrors the client's ProductDetail) ──
export interface ProductImage {
    public_id : string,
    url : string
}

export interface Product {
    id : string,
    name : string,
    description : string,
    price : number,
    category : string,
    ratings : number,
    images : ProductImage[],
    stock : number,
    created_by : string,
    created_at : Date
}


// ── Dashboard stats (GET /v1/admin/dashboard-stats) ──

// counts of orders grouped by their status
export interface OrderStatusCounts {
    Processing : number,
    Shipped : number,
    Delivered : number,
    Cancelled : number
}

// one entry per month from the raw SQL revenue query
export interface MonthlyRevenue {
    month : string,   // ISO date string, e.g. "2026-06-01T00:00:00.000Z"
    revenue : string  // raw SQL returns the numeric sum as a string
}

// a product together with how many units it has sold
export interface TopSellingProduct {
    product : Product | null,
    quantitySold : number
}

export interface AdminDashboardStats {
    allTimeRevenue : number,
    totalPaidOrdersCount : number,
    totalUsersCount : number,
    orderStatusCounts : OrderStatusCounts,
    todaysRevenue : number,
    yesterdayRevenue : number,
    monthlyRevenueResponse : MonthlyRevenue[],
    topSellingProductDetails : TopSellingProduct[],
    revenueOfLastMonth : number,
    lowStockProductListQueryResponse : Product[],
    lastMonthRevenue : number,
    newUserRegisteredThisMonth : number
}

export interface AdminGetDashboardStatsResponse {
    success : boolean,
    message : string,
    dashboardStats : AdminDashboardStats
}