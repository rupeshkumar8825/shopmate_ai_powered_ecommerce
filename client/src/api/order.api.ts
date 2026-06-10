// all the api requests being made to the backend from the frontend comes here

import type { DeleteOrderRequestPayload, DeleteOrderResponse, FetchAllOrderResponse, FetchMyOrderDetailsResponse, FetchSingleOrderRequestPayload, FetchSingleOrderResponse, PlaceNewOrderRequestPayload, PlaceNewOrderRequestResponse, UpdateOrderStatusRequestPayload, UpdateOrderStatusResponse } from "../types/order.types";
import axiosInstance from "./axiosInstance";

export const placeNewOrderApi = async (payload : PlaceNewOrderRequestPayload) : Promise<PlaceNewOrderRequestResponse> => {
    const response = await axiosInstance.post("/v1/order/new", payload)

    if(!response.data) {
        throw new Error ("EMPTY_RESPONSE")
    }

    if(!response.data.order){
        throw new Error("INVALID_RESPONSE")
    }

    return response.data as PlaceNewOrderRequestResponse
}


export const fetchSingleOrderApi = async (payload : FetchSingleOrderRequestPayload) : Promise<FetchSingleOrderResponse> => {
    const response = await axiosInstance.get(`/v1/order/${payload.orderId}`)

    if(!response.data) {
        throw new Error("EMPTY_RESPONSE")
    }

    if(!response.data.orderDetails) {
        throw new Error("INVALID_RESPONSE")
    }

    return response.data as FetchSingleOrderResponse
}


export const fetchMyOrderDetailsApi = async () : Promise<FetchMyOrderDetailsResponse> => {
    const response = await axiosInstance.get("/v1/order/user/all")

    if(!response.data) {
        throw new Error("EMPTY_RESPONSE")
    }

    if(!response.data.orderItems) {
        throw new Error("INVALID_RESPONSE")
    }

    return response.data as FetchMyOrderDetailsResponse
}


export const fetchAllOrdersApi = async () : Promise<FetchAllOrderResponse> => {
    const response = await axiosInstance.get("/v1/order/admin/getall")

    if(!response.data) {
        throw new Error("EMPTY_RESPONSE")
    }

    if(!response.data.orderDetails) {
        throw new Error("INVALID_RESPONSE")
    }

    return response.data as FetchAllOrderResponse
}


export const updateOrderStatusApi = async (payload : UpdateOrderStatusRequestPayload) : Promise<UpdateOrderStatusResponse> => {
    const response = await axiosInstance.put(`/v1/order/admin/${payload.orderId}`, {
        orderStatus : payload.updatedOrderStatus
    })

    if(!response.data) {
        throw new Error("EMPTY_RESPONSE")
    }

    if(!response.data.orderDetails) {
        throw new Error("INVALID_RESPONSE")
    }

    return response.data as UpdateOrderStatusResponse
}


export const deleteOrderApi = async (payload : DeleteOrderRequestPayload) : Promise<DeleteOrderResponse> => {
    const response = await axiosInstance.delete(`/v1/order/admin/${payload.orderId}`)

    if(!response.data) {
        throw new Error("EMPTY_RESPONSE")
    }

    if(!response.data.deleteOrderDetails) {
        throw new Error("INVALID_RESPONSE")
    }

    return response.data as DeleteOrderResponse
}
