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



export interface FetchAllProductsRequestPayload {
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


export interface FetchProductDetailRequestPayload {
    productId : string
}



export interface FetchProductDetailsResponse {
    success : boolean, 
    message : string, 
    productDetails : ProductDetail
}


export interface PostProductReviewRequestPayload {
    productId : string, 
    rating : number, 
    comment : string
}


export interface PostProductReviewResponse {
    success : boolean, 
    message : string, 
    review : {
        id : string, 
        rating : number, 
        comment : string, 
        created_by : string, 
        created_at : Date
    }
}   


// lets now define the types related to the delete product review api 
// since the review can only be deleted by the user who created it, 
// hence we only need the productId to identify which review to delete
export interface DeleteProductReviewRequestPayload {
    productId : string,
}


export interface DeleteProductReviewResponse {
    success : boolean, 
    message : string, 
    product : ProductDetail
}


