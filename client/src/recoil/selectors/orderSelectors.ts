import { selector } from "recoil";
import type { OrderDetails, PaymentIntentResponse } from "../../types/order.types";
import { orderAtom } from "../atoms/order.atom";


export const orderDetailsSelector = selector<OrderDetails | null>({
    key : "orderDetailsSelector",
    get : ({ get }) => {
        return get(orderAtom).orderDetails;
    }
});


export const orderListSelector = selector<OrderDetails[]>({
    key : "orderListSelector",
    get : ({ get }) => {
        return get(orderAtom).orderList;
    }
});


export const fetchingOrdersSelector = selector<boolean>({
    key : "fetchingOrdersSelector",
    get : ({ get }) => {
        return get(orderAtom).fetchingOrders;
    }
});


export const placingOrderSelector = selector<boolean>({
    key : "placingOrderSelector",
    get : ({ get }) => {
        return get(orderAtom).placingOrder;
    }
});


export const finalPriceSelector = selector<number | null>({
    key : "finalPriceSelector",
    get : ({ get }) => {
        return get(orderAtom).finalPrice;
    }
});


export const orderStepSelector = selector<number>({
    key : "orderStepSelector",
    get : ({ get }) => {
        return get(orderAtom).orderStep;
    }
});


export const paymentIntentSelector = selector<PaymentIntentResponse | null>({
    key : "paymentIntentSelector",
    get : ({ get }) => {
        return get(orderAtom).paymentIntent;
    }
});
