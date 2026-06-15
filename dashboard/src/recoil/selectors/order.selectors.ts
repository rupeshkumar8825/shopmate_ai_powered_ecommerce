import { selector } from "recoil";
import { orderStateAtom } from "../atoms/order.atom";
import type { OrderDetails } from "../../types/order.types";

// this is the selectors related to the order state for this purpose


// true while any order operation (fetch / update status / delete) is in flight
export const isOrderOperationInProgressSelector = selector<boolean>({
    key : "isOrderOperationInProgressSelector",
    get : ({ get }) => {
        return get(orderStateAtom).orderOperationInProgress
    }
})


// the full list of orders currently held in the store
export const ordersSelector = selector<OrderDetails[]>({
    key : "ordersSelector",
    get : ({ get }) => {
        return get(orderStateAtom).orders
    }
})


// the latest order related error message (null when there is none)
export const orderErrorSelector = selector<string | null>({
    key : "orderErrorSelector",
    get : ({ get }) => {
        return get(orderStateAtom).error
    }
})


// derived : the total number of orders in the store (handy for dashboard counts)
export const ordersCountSelector = selector<number>({
    key : "ordersCountSelector",
    get : ({ get }) => {
        return get(orderStateAtom).orders.length
    }
})
