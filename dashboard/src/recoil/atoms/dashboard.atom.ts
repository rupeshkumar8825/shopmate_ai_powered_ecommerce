// this will consists of the atom to store the state of the dashboard stats from the backend

import { atom } from "recoil"
import type { User } from "../../types/auth.types"

export interface OrderStatusCounts {
    Processing : number,
    Shipped : number,
    Delivered : number,
    Cancelled : number
}


// all the product related type comes here 
export interface ProductImage {
    public_id : string, 
    url : string
}



export interface ReviewDetail {
    id : string, 
    product_id : string, 
    user_id : string, 
    rating : number, 
    created_at : Date, 
    comment : string, 
    user : User
}

export interface ProductDetail {
    id : string, 
    name : string, 
    description : string, 
    price : number, 
    category : string, 
    ratings : number, 
    images : ProductImage[], 
    stock : number, 
    created_by : string, 
    created_at : Date, 
    reviewList : ReviewDetail[] 
}

export interface TopSellingProductDetail {
    // the backend resolves this via prisma.product.findUnique, which can return null
    product : ProductDetail | null,
    quantitySold : number
}



export interface MonthlyRevenueResponse {
    month : Date, 
    revenue : string
}


export interface DashboardStateAtom {
    allTimeRevenue : number,
    totalPaidOrdersCount : number,
    totalUsersCount : number,
    orderStatusCounts : OrderStatusCounts | null,
    todaysRevenue : number,
    yesterdayRevenue : number,
    // the backend returns one entry per month (last 12 months), so this is a list
    monthlyRevenueResponse : MonthlyRevenueResponse[],
    topSellingProductDetails : TopSellingProductDetail[] ,
    revenueOfLastMonth : number,
    lowStockProductListQueryResponse : ProductDetail[],
    lastMonthRevenue : number,
    newUserRegisteredThisMonth : number,
    error : string | null,
    isDashboardRelatedWorkInProgress : boolean
}


export const dashboardStateAtom = atom<DashboardStateAtom>({
    key : "dashboardStateAtom",
    default : {
        allTimeRevenue : 0,
        totalPaidOrdersCount : 0,
        totalUsersCount : 0,
        orderStatusCounts : null,
        todaysRevenue : 0,
        yesterdayRevenue : 0,
        monthlyRevenueResponse : [],
        topSellingProductDetails : [] ,
        revenueOfLastMonth : 0,
        lowStockProductListQueryResponse : [],
        lastMonthRevenue : 0,
        newUserRegisteredThisMonth : 0,
        error : null,
        isDashboardRelatedWorkInProgress : false
    }
})