// useOrder — the order hook for the ADMIN dashboard.
// It is the single place that ties together the api layer (order.api.ts) and the
// recoil state (orderStateAtom). Components should consume this hook rather than calling
// the api functions or touching the atom directly.
//
// Reminder: this dashboard is admin-only. The order admin routes on the backend are
// guarded by the auth + "Admin" role middleware; here we surface any failure as a
// readable error message in the atom.

import { useSetRecoilState, useRecoilValue } from "recoil"
import { isAxiosError } from "axios"

import { orderStateAtom } from "../recoil/atoms/order.atom"
import {
    ordersSelector,
    orderErrorSelector,
    isOrderOperationInProgressSelector,
    ordersCountSelector,
} from "../recoil/selectors/order.selectors"
import {
    getAllOrdersAdminApi,
    updateOrderStatusAdminApi,
    deleteOrderAdminApi,
} from "../api/order.api"
import type {
    UpdateOrderStatusRequestPayload,
    DeleteOrderRequestPayload,
} from "../types/order.types"


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


export const useOrder = () => {
    // ── read-only state pulled from the atom via selectors ──
    const orders = useRecoilValue(ordersSelector)
    const ordersCount = useRecoilValue(ordersCountSelector)
    const orderOperationInProgress = useRecoilValue(isOrderOperationInProgressSelector)
    const error = useRecoilValue(orderErrorSelector)

    // single writer into the (object) order atom
    const setOrderState = useSetRecoilState(orderStateAtom)

    const clearError = () => {
        setOrderState((prev) => ({ ...prev, error: null }))
    }


    // ── Fetch every order in the system (GET /v1/order/admin/getall) ──────────────
    const fetchAllOrders = async () => {
        setOrderState((prev) => ({ ...prev, orderOperationInProgress: true, error: null }))
        try {
            const response = await getAllOrdersAdminApi()
            setOrderState((prev) => ({
                ...prev,
                orders: response.orderDetails,
                orderOperationInProgress: false,
            }))
            return true
        } catch (err) {
            setOrderState((prev) => ({
                ...prev,
                orderOperationInProgress: false,
                error: extractErrorMessage(err),
            }))
            return false
        }
    }


    // ── Update a single order's status (PUT /v1/order/admin/:orderId) ─────────────
    const updateOrderStatus = async (payload: UpdateOrderStatusRequestPayload) => {
        setOrderState((prev) => ({ ...prev, orderOperationInProgress: true, error: null }))
        try {
            const response = await updateOrderStatusAdminApi(payload)
            const updatedOrder = response.orderDetails
            setOrderState((prev) => ({
                ...prev,
                // swap the updated order into the list in place
                orders: prev.orders.map((order) =>
                    order.id === updatedOrder.id ? updatedOrder : order
                ),
                orderOperationInProgress: false,
            }))
            return true
        } catch (err) {
            setOrderState((prev) => ({
                ...prev,
                orderOperationInProgress: false,
                error: extractErrorMessage(err),
            }))
            return false
        }
    }


    // ── Delete a single order (DELETE /v1/order/admin/:orderId) ───────────────────
    const deleteOrder = async (payload: DeleteOrderRequestPayload) => {
        setOrderState((prev) => ({ ...prev, orderOperationInProgress: true, error: null }))
        try {
            await deleteOrderAdminApi(payload)
            setOrderState((prev) => ({
                ...prev,
                // drop the deleted order from the list
                orders: prev.orders.filter((order) => order.id !== payload.orderId),
                orderOperationInProgress: false,
            }))
            return true
        } catch (err) {
            setOrderState((prev) => ({
                ...prev,
                orderOperationInProgress: false,
                error: extractErrorMessage(err),
            }))
            return false
        }
    }


    return {
        // state
        orders,
        ordersCount,
        orderOperationInProgress,
        error,

        // actions
        fetchAllOrders,
        updateOrderStatus,
        deleteOrder,
        clearError,
    }
}
