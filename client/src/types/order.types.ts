// file to contain all the types related to order component/functionality


export interface OrderItem {
    productId : string, 
    quantity : string
}

export interface ShippingInfoDetails {
    id : string, 
    order_id : string, 
    full_name : string, 
    state : string, 
    city : string, 
    country : string, 
    address : string, 
    pincode : string, 
    phone : string
}

export interface OrderDetails {
    id : string, 
    buyer_id : string, 
    total_price : number, 
    tax_price : number, 
    shipping_price : number, 
    order_status : string, 
    paid_at : Date, 
    created_at : Date, 
    orderItemList : OrderItem[], 
    shippingInfoList : ShippingInfoDetails[]
}



export interface PaymentIntentResponse {
    success: boolean;
    paymentIntentId: string;
    clientSecret: string | null;
    amount: number;
    currency: string;
}

export interface PlaceNewOrderRequestPayload {
    fullName : string, 
    state : string, 
    city : string, 
    country : string, 
    address : string, 
    pincode : string,
    phone : string, 
    orderItems : OrderItem[],
}


export interface PlaceNewOrderRequestResponse {
    success : string, 
    message : string, 
    order : OrderDetails, 
    paymentDetails : PaymentIntentResponse, 
}


export interface FetchSingleOrderRequestPayload {
    orderId : string
}

export interface FetchSingleOrderResponse {
    success : boolean, 
    message : string, 
    orderDetails : OrderDetails
}


// note that there is no need to define the payload here 
// as the only thing that is needed is userId which will anyways 
// be sent with the token itself in the authorization header for this purpose 
// export const FetchMyOrderDetailsControllerRequestPayload {
// }

// so lets only define the FetchMyOrderDetailsResponse interface 
export interface FetchMyOrderDetailsResponse {
    success : boolean, 
    message : string, 
    orderItems : OrderDetails[]
}


export interface FetchAllOrderResponse {
    success : boolean, 
    message : string, 
    orderDetails : OrderDetails[]
}


export interface UpdateOrderStatusRequestPayload {
    orderId : string, 
    updatedOrderStatus : string, 
}

export interface UpdateOrderStatusResponse {
    success : boolean, 
    message : string, 
    orderDetails : OrderDetails
}

export interface DeleteOrderRequestPayload {
    orderId : string
}


export interface DeleteOrderResponse {
    success  : boolean, 
    message : string, 
    deleteOrderDetails : OrderDetails
}