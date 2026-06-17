// useDashboard — the dashboard-stats hook for the ADMIN dashboard.
// It is the single place that ties together the api layer (admin.api.ts dashboard endpoint)
// and the recoil state (dashboardStateAtom). Components should consume this hook rather
// than calling the api function or touching the atom directly.
//
// Reminder: this dashboard is admin-only. The dashboard-stats route on the backend is
// guarded by the auth + "Admin" role middleware; here we surface any failure as a
// readable error message in the atom.

import { useSetRecoilState, useRecoilValue } from "recoil"
import { isAxiosError } from "axios"

import { dashboardStateAtom } from "../recoil/atoms/dashboard.atom"
import {
    isDashboardWorkInProgressSelector,
    dashboardErrorSelector,
    allTimeRevenueSelector,
    todaysRevenueSelector,
    yesterdayRevenueSelector,
    revenueOfLastMonthSelector,
    lastMonthRevenueSelector,
    monthlyRevenueSelector,
    totalPaidOrdersCountSelector,
    totalUsersCountSelector,
    newUserRegisteredThisMonthSelector,
    orderStatusCountsSelector,
    topSellingProductDetailsSelector,
    lowStockProductListSelector,
} from "../recoil/selectors/dashboard.selectors"
import { getDashboardStatsApi } from "../api/dashboard.api"


// turns whatever was thrown (axios error or the plain Errors thrown by the api layer)
// into a human readable message
const extractErrorMessage = (err: unknown): string => {
    if (isAxiosError(err)) {
        return err.response?.data?.message ?? err.message ?? "Something went wrong"
    }
    if (err instanceof Error) {
        switch (err.message) {
            case "EMPTY_RESPONSE":
            case "INVALID_RESPONSE":
                return "Received an unexpected response from the server. Please try again."
            default:
                return err.message
        }
    }
    return "Something went wrong"
}


export const useDashboard = () => {
    // ── read-only state pulled from the atom via selectors ──
    const isDashboardRelatedWorkInProgress = useRecoilValue(isDashboardWorkInProgressSelector)
    const error = useRecoilValue(dashboardErrorSelector)

    const allTimeRevenue = useRecoilValue(allTimeRevenueSelector)
    const todaysRevenue = useRecoilValue(todaysRevenueSelector)
    const yesterdayRevenue = useRecoilValue(yesterdayRevenueSelector)
    const revenueOfLastMonth = useRecoilValue(revenueOfLastMonthSelector)
    const lastMonthRevenue = useRecoilValue(lastMonthRevenueSelector)
    const monthlyRevenueResponse = useRecoilValue(monthlyRevenueSelector)

    const totalPaidOrdersCount = useRecoilValue(totalPaidOrdersCountSelector)
    const totalUsersCount = useRecoilValue(totalUsersCountSelector)
    const newUserRegisteredThisMonth = useRecoilValue(newUserRegisteredThisMonthSelector)
    const orderStatusCounts = useRecoilValue(orderStatusCountsSelector)

    const topSellingProductDetails = useRecoilValue(topSellingProductDetailsSelector)
    const lowStockProductListQueryResponse = useRecoilValue(lowStockProductListSelector)

    // single writer into the (object) dashboard atom
    const setDashboardState = useSetRecoilState(dashboardStateAtom)

    const clearError = () => {
        setDashboardState((prev) => ({ ...prev, error: null }))
    }


    // ── Fetch the aggregated dashboard stats (GET /v1/admin/dashboard-stats) ──────
    const fetchDashboardStats = async () => {
        setDashboardState((prev) => ({
            ...prev,
            isDashboardRelatedWorkInProgress: true,
            error: null,
        }))
        try {
            const response = await getDashboardStatsApi()
            // fold the whole stats payload into the atom, keeping our own state flags intact
            setDashboardState((prev) => ({
                ...prev,
                ...response.dashboardStats,
                isDashboardRelatedWorkInProgress: false,
            }))
            return true
        } catch (err) {
            setDashboardState((prev) => ({
                ...prev,
                isDashboardRelatedWorkInProgress: false,
                error: extractErrorMessage(err),
            }))
            return false
        }
    }


    return {
        // state
        isDashboardRelatedWorkInProgress,
        error,
        allTimeRevenue,
        todaysRevenue,
        yesterdayRevenue,
        revenueOfLastMonth,
        lastMonthRevenue,
        monthlyRevenueResponse,
        totalPaidOrdersCount,
        totalUsersCount,
        newUserRegisteredThisMonth,
        orderStatusCounts,
        topSellingProductDetails,
        lowStockProductListQueryResponse,

        // actions
        fetchDashboardStats,
        clearError,
    }
}
