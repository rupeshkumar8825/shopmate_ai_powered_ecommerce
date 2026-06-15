// All the API calls related to the admin-only order endpoints live here.
// These map to the OrderController's admin routes on the backend (mounted under
// `/v1/order` and guarded by the auth + "Admin" role middleware):
//   GET    /v1/order/admin/getall   -> fetchAllOrdersController
//   PUT    /v1/order/admin/:orderId -> updateOrderStatusController
//   DELETE /v1/order/admin/:orderId -> deleteOrderController
// This layer abstracts the backend HTTP calls away from the rest of the dashboard.

import type {
    FetchAllOrdersResponse,
    UpdateOrderStatusRequestPayload,
    UpdateOrderStatusResponse,
    DeleteOrderRequestPayload,
    DeleteOrderResponse,
} from "../types/order.types";
import { axiosInstance } from "./axios.instance";


// fetches the list of every order in the system (GET /v1/order/admin/getall)
export const getAllOrdersAdminApi = async (): Promise<FetchAllOrdersResponse> => {
    const response = await axiosInstance.get("/v1/order/admin/getall");

    if (!response.data) {
        throw new Error("EMPTY_RESPONSE")
    }

    if (!response.data.orderDetails) {
        throw new Error("INVALID_RESPONSE")
    }

    // say everything went fine
    return response.data as FetchAllOrdersResponse
}


// updates the status of a single order (PUT /v1/order/admin/:orderId)
export const updateOrderStatusAdminApi = async (
    payload: UpdateOrderStatusRequestPayload
): Promise<UpdateOrderStatusResponse> => {
    const response = await axiosInstance.put(
        // orderId is a path param
        `/v1/order/admin/${payload.orderId}`,
        {
            // the backend reads `request.body.orderStatus`
            orderStatus: payload.orderStatus,
        }
    );

    if (!response.data) {
        throw new Error("EMPTY_RESPONSE")
    }

    if (!response.data.orderDetails) {
        throw new Error("INVALID_RESPONSE")
    }

    // say everything went fine
    return response.data as UpdateOrderStatusResponse
}


// deletes a single order (DELETE /v1/order/admin/:orderId)
export const deleteOrderAdminApi = async (
    payload: DeleteOrderRequestPayload
): Promise<DeleteOrderResponse> => {
    const response = await axiosInstance.delete(
        // orderId is a path param
        `/v1/order/admin/${payload.orderId}`
    );

    if (!response.data) {
        throw new Error("EMPTY_RESPONSE")
    }

    if (!response.data.deleteOrderDetails) {
        throw new Error("INVALID_RESPONSE")
    }

    // say everything went fine
    return response.data as DeleteOrderResponse
}
