// lets have our all custom types in this file 
export type IorderItem = {
    productId : string, 
    quantity : string 
};

export type avatarType = {
    public_id : string, 
    url : string
}

export type IOrderItemDB = {
    product_id : string, 
    quantity : number,
    price : number, 
    image : string, 
    title : string
}

export type IShippingInfo = {
    orderId : string, 
    fullName : string,
    state : string, 
    city : string, 
    country : string, 
    address : string, 
    pincode : string, 
    phone : string
}