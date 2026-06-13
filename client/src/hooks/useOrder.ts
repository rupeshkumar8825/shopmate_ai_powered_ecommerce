import { useRecoilState, useRecoilValue } from "recoil";
import { orderAtom } from "../recoil/atoms/order.atom";
import { orderDetailsSelector, orderListSelector, fetchingOrdersSelector, placingOrderSelector, finalPriceSelector, orderStepSelector, paymentIntentSelector } from "../recoil/selectors/orderSelectors";
import { placeNewOrderApi, fetchSingleOrderApi, fetchMyOrderDetailsApi, fetchAllOrdersApi, updateOrderStatusApi, deleteOrderApi } from "../api/order.api";
import type { PlaceNewOrderRequestPayload, FetchSingleOrderRequestPayload, UpdateOrderStatusRequestPayload, DeleteOrderRequestPayload } from "../types/order.types";
import type { ParsedApiError } from "../types/error.types";
import { globalAxiosErrorHandler } from "../error/globalAxiosHandler";

export const useOrder = () => {
    const [, setOrderState] = useRecoilState(orderAtom);

    const orderDetails = useRecoilValue(orderDetailsSelector);
    const orderList = useRecoilValue(orderListSelector);
    const fetchingOrders = useRecoilValue(fetchingOrdersSelector);
    const placingOrder = useRecoilValue(placingOrderSelector);
    const finalPrice = useRecoilValue(finalPriceSelector);
    const orderStep = useRecoilValue(orderStepSelector);
    const paymentIntent = useRecoilValue(paymentIntentSelector);


    const placeNewOrder = async (payload: PlaceNewOrderRequestPayload) => {
        setOrderState((prev) => ({ ...prev, placingOrder: true }));
        try {
            const response = await placeNewOrderApi(payload);
            setOrderState((prev) => ({
                ...prev,
                orderDetails: response.order,
                paymentIntent: response.paymentDetails,
            }));
            return response;
        } catch (error) {
            const parsedError: ParsedApiError = globalAxiosErrorHandler(error);
            console.error("[placeNewOrder]", parsedError.message);
            return null;
        } finally {
            setOrderState((prev) => ({ ...prev, placingOrder: false }));
        }
    };


    const fetchSingleOrder = async (payload: FetchSingleOrderRequestPayload) => {
        setOrderState((prev) => ({ ...prev, fetchingOrders: true }));
        try {
            const response = await fetchSingleOrderApi(payload);
            setOrderState((prev) => ({ ...prev, orderDetails: response.orderDetails }));
        } catch (error) {
            const parsedError: ParsedApiError = globalAxiosErrorHandler(error);
            console.error("[fetchSingleOrder]", parsedError.message);
        } finally {
            setOrderState((prev) => ({ ...prev, fetchingOrders: false }));
        }
    };


    const fetchMyOrders = async () => {
        setOrderState((prev) => ({ ...prev, fetchingOrders: true }));
        try {
            const response = await fetchMyOrderDetailsApi();
            setOrderState((prev) => ({ ...prev, orderList: response.orderItems }));
        } catch (error) {
            const parsedError: ParsedApiError = globalAxiosErrorHandler(error);
            console.error("[fetchMyOrders]", parsedError.message);
        } finally {
            setOrderState((prev) => ({ ...prev, fetchingOrders: false }));
        }
    };


    const fetchAllOrders = async () => {
        setOrderState((prev) => ({ ...prev, fetchingOrders: true }));
        try {
            const response = await fetchAllOrdersApi();
            setOrderState((prev) => ({ ...prev, orderList: response.orderDetails }));
        } catch (error) {
            const parsedError: ParsedApiError = globalAxiosErrorHandler(error);
            console.error("[fetchAllOrders]", parsedError.message);
        } finally {
            setOrderState((prev) => ({ ...prev, fetchingOrders: false }));
        }
    };


    const updateOrderStatus = async (payload: UpdateOrderStatusRequestPayload) => {
        setOrderState((prev) => ({ ...prev, fetchingOrders: true }));
        try {
            const response = await updateOrderStatusApi(payload);
            const updatedOrder = response.orderDetails;
            setOrderState((prev) => ({
                ...prev,
                orderList: prev.orderList.map((order) =>
                    order.id === updatedOrder.id ? updatedOrder : order
                ),
                orderDetails: prev.orderDetails?.id === updatedOrder.id ? updatedOrder : prev.orderDetails,
            }));
        } catch (error) {
            const parsedError: ParsedApiError = globalAxiosErrorHandler(error);
            console.error("[updateOrderStatus]", parsedError.message);
        } finally {
            setOrderState((prev) => ({ ...prev, fetchingOrders: false }));
        }
    };


    const deleteOrder = async (payload: DeleteOrderRequestPayload) => {
        setOrderState((prev) => ({ ...prev, fetchingOrders: true }));
        try {
            await deleteOrderApi(payload);
            setOrderState((prev) => ({
                ...prev,
                orderList: prev.orderList.filter((order) => order.id !== payload.orderId),
                orderDetails: prev.orderDetails?.id === payload.orderId ? null : prev.orderDetails,
            }));
        } catch (error) {
            const parsedError: ParsedApiError = globalAxiosErrorHandler(error);
            console.error("[deleteOrder]", parsedError.message);
        } finally {
            setOrderState((prev) => ({ ...prev, fetchingOrders: false }));
        }
    };


    const setOrderStep = (step: number) => {
        setOrderState((prev) => ({ ...prev, orderStep: step }));
    };

    const setFinalPrice = (price: number) => {
        setOrderState((prev) => ({ ...prev, finalPrice: price }));
    };


    return {
        // state
        orderDetails,
        orderList,
        fetchingOrders,
        placingOrder,
        finalPrice,
        orderStep,
        paymentIntent,

        // functions
        placeNewOrder,
        fetchSingleOrder,
        fetchMyOrders,
        fetchAllOrders,
        updateOrderStatus,
        deleteOrder,
        setOrderStep,
        setFinalPrice,
    };
};
