// All the types related to the order entity as consumed by the admin dashboard.
// These mirror what the backend OrderController returns for the admin-only routes
// (GET /v1/order/admin/getall, PUT /v1/order/admin/:orderId, DELETE /v1/order/admin/:orderId).


// the possible states an order can be in (matches the backend `OrderStatus` enum)
export type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled";


// a single line item belonging to an order
export interface OrderItem {
    id : string,
    order_id : string,
    product_id : string,
    quantity : number,
    price : number,
    image : string,
    title : string,
    created_at : Date
}


// the shipping address attached to an order
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


// the scalar fields of an order (no relations included)
export interface Order {
    id : string,
    buyer_id : string,
    total_price : number,
    tax_price : number,
    shipping_price : number,
    order_status : OrderStatus,
    paid_at : Date | null,
    created_at : Date
}


// an order together with its related order items and shipping info, as returned
// by the backend when the prisma query uses `include`
export interface OrderDetails extends Order {
    orderItemList : OrderItem[],
    // the backend models shipping info as a one-to-one relation, but the admin
    // queries `include` it; it can be null if no shipping info was created
    shippingInfoList : ShippingInfoDetails | null
}


// ── GET /v1/order/admin/getall ──
// no request payload is needed: the route is guarded by the auth + admin-role
// middleware and reads everything from the bearer token.
export interface FetchAllOrdersResponse {
    success : boolean,
    message : string,
    orderDetails : OrderDetails[]
}


// ── PUT /v1/order/admin/:orderId ──
export interface UpdateOrderStatusRequestPayload {
    orderId : string,
    // the new status to set on the order
    orderStatus : OrderStatus
}

export interface UpdateOrderStatusResponse {
    success : boolean,
    message : string,
    orderDetails : OrderDetails
}


// ── DELETE /v1/order/admin/:orderId ──
export interface DeleteOrderRequestPayload {
    orderId : string
}

export interface DeleteOrderResponse {
    success : boolean,
    message : string,
    // the backend deletes the order without an `include`, so only the scalar
    // fields of the deleted order are returned here
    deleteOrderDetails : Order
}
