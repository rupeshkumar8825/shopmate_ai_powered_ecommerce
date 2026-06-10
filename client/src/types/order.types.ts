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
    created_at : Date
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