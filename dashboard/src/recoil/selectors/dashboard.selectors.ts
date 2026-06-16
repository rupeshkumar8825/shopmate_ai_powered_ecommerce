import { selector } from "recoil"
import { dashboardStateAtom } from "../atoms/dashboard.atom"
import type {
    OrderStatusCounts,
    MonthlyRevenueResponse,
    TopSellingProductDetail,
    ProductDetail,
} from "../atoms/dashboard.atom"

// this is the selectors related to the dashboard state for this purpose


// true while the dashboard stats are being fetched from the backend
export const isDashboardWorkInProgressSelector = selector<boolean>({
    key : "isDashboardWorkInProgressSelector",
    get : ({ get }) => {
        return get(dashboardStateAtom).isDashboardRelatedWorkInProgress
    }
})


// the latest dashboard related error message (null when there is none)
export const dashboardErrorSelector = selector<string | null>({
    key : "dashboardErrorSelector",
    get : ({ get }) => {
        return get(dashboardStateAtom).error
    }
})


// ── revenue figures ───────────────────────────────────────────────────────────
export const allTimeRevenueSelector = selector<number>({
    key : "allTimeRevenueSelector",
    get : ({ get }) => {
        return get(dashboardStateAtom).allTimeRevenue
    }
})


export const todaysRevenueSelector = selector<number>({
    key : "todaysRevenueSelector",
    get : ({ get }) => {
        return get(dashboardStateAtom).todaysRevenue
    }
})


export const yesterdayRevenueSelector = selector<number>({
    key : "yesterdayRevenueSelector",
    get : ({ get }) => {
        return get(dashboardStateAtom).yesterdayRevenue
    }
})


export const revenueOfLastMonthSelector = selector<number>({
    key : "revenueOfLastMonthSelector",
    get : ({ get }) => {
        return get(dashboardStateAtom).revenueOfLastMonth
    }
})


export const lastMonthRevenueSelector = selector<number>({
    key : "lastMonthRevenueSelector",
    get : ({ get }) => {
        return get(dashboardStateAtom).lastMonthRevenue
    }
})


// the month-by-month revenue series (last 12 months) used for the trend chart
export const monthlyRevenueSelector = selector<MonthlyRevenueResponse[]>({
    key : "monthlyRevenueSelector",
    get : ({ get }) => {
        return get(dashboardStateAtom).monthlyRevenueResponse
    }
})


// ── counts ──────────────────────────────────────────────────────────────────
export const totalPaidOrdersCountSelector = selector<number>({
    key : "totalPaidOrdersCountSelector",
    get : ({ get }) => {
        return get(dashboardStateAtom).totalPaidOrdersCount
    }
})


export const totalUsersCountSelector = selector<number>({
    key : "totalUsersCountSelector",
    get : ({ get }) => {
        return get(dashboardStateAtom).totalUsersCount
    }
})


export const newUserRegisteredThisMonthSelector = selector<number>({
    key : "newUserRegisteredThisMonthSelector",
    get : ({ get }) => {
        return get(dashboardStateAtom).newUserRegisteredThisMonth
    }
})


// the order counts grouped by status (null until the stats have been fetched)
export const orderStatusCountsSelector = selector<OrderStatusCounts | null>({
    key : "orderStatusCountsSelector",
    get : ({ get }) => {
        return get(dashboardStateAtom).orderStatusCounts
    }
})


// ── product lists ─────────────────────────────────────────────────────────────
export const topSellingProductDetailsSelector = selector<TopSellingProductDetail[]>({
    key : "topSellingProductDetailsSelector",
    get : ({ get }) => {
        return get(dashboardStateAtom).topSellingProductDetails
    }
})


export const lowStockProductListSelector = selector<ProductDetail[]>({
    key : "lowStockProductListSelector",
    get : ({ get }) => {
        return get(dashboardStateAtom).lowStockProductListQueryResponse
    }
})
