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



export interface FetchAllProductsRequest {
    availability : "in-stock" | "out-of-stock" | "limited",
    minPrice : number,
    maxPrice : number, 
    category : string, 
    minRating : number,
    maxRating : number,
    search : string,
    page : number,
}

export interface FetchAllProductsResponse {
    success : boolean, 
    message : string, 
    totalNumberOfProducts : number,
    productList : ProductDetail[], 
    newlyCreatedProducts : ProductDetail[],
    topRatedProducts : ProductDetail[]
}


export interface FetchProductDetailRequest {
    productId : string
}



export interface FetchProductDetailsResponse {
    success : boolean, 
    message : string, 
    productDetails : ProductDetail
}


