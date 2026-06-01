// all the product related type comes here 
export interface ProductImage {
    public_id : string, 
    url : string
}



export interface ProductDetail {
    id : string, 
    name : string, 
    description : string, 
    price : number, 
    category : string, 
    ratings : string, 
    images : ProductImage[], 
    stock : number, 
    created_by : string, 
    created_at : Date 
}


