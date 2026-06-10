// here comes the atom state of the order 
// we need to store the following thing in the order atom state
// 1. Shipping address 
// 2. List of order items that user wants to purchase 
// 3. payment related information may be??? 
// 4. if fetching the list of orders 
// 5. payment intent 
// 6. orderstep ?? 
// 7. placing order too

import { atom } from "recoil";
import type { OrderDetails, PaymentIntentResponse } from "../../types/order.types"

export interface OrderAtom {
    orderDetails : OrderDetails | null,
    orderList : OrderDetails[],
    fetchingOrders : boolean,
    placingOrder : boolean,
    finalPrice : number | null,
    orderStep : number,
    paymentIntent : PaymentIntentResponse | null
}


const defaultOrderAtomValue : OrderAtom = {
    orderDetails : null,
    orderList : [],
    fetchingOrders : false,
    placingOrder : false,
    finalPrice : null,
    orderStep : 1,
    paymentIntent : null
}


export const orderAtom = atom({
    key : "orderAtom", 
    default : defaultOrderAtomValue
});