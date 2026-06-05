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


// request and response payload interfaces
export interface CreateProductRequestPayload {
    name : string, 
    description : string, 
    price : number, 
    category : string, 
    stock : number, 
    images : File[]
}

export interface CreateProductResponse {
    success : boolean, 
    message : string, 
    productDetails : ProductDetail
}



// fetch all products request and response payload interfaces
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





// update product request and response payload interfaces
export interface UpdateProductRequestPayload {
    productId : string,
    name? : string, 
    description? : string, 
    price? : number, 
    category? : string, 
    images? : File[]
    stock? : number, 
}

export interface UpdateProductResponse {
    success : boolean, 
    message : string, 
    updatedProductDetails : ProductDetail
}




// delete product controller request and response payload interfaces 
export interface DeleteProductRequestPayload {
    productId : string
}

export interface DeleteProductResponse {
    success : boolean, 
    message : string, 
}


// now we will be defining the types related to the post product review api
export interface FetchProductDetailsResponse {
    success : boolean, 
    message : string, 
    productDetails : ProductDetail
}


export interface FetchProductDetailRequestPayload {
    productId : string
}



// types related to the post product review api comes here
export interface PostProductReviewRequestPayload {
    productId : string, 
    rating : number, 
    comment : string
}


export interface ReviewDetail {
    id : string, 
    product_id : string, 
    user_id : string, 
    rating : number, 
    created_at : Date, 
    comment : string
}

export interface PostProductReviewResponse {
    success : boolean, 
    message : string, 
    review : ReviewDetail,
    product : ProductDetail
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


export interface FetchAIFilteredProductsRequestPayload {
    // for AI filtered option/feature the backend server 
    // takes the user prompt as input
    userPrompt : string, 
}



export interface FetchAIFilteredProductsResponse {
    success : boolean, 
    message : string, 
    aiFilteredProducts : ProductDetail[]
}





// types related to the atoms and selectors which are 
// related to the product comes here
export interface ProductState {
    allProducts : ProductDetail[], 
    topRatedProducts : ProductDetail[], 
    newArrivalProducts : ProductDetail[], 
    productDetails : ProductDetail | null, 
    productError : string, 
    totalNumberOfProducts : number, 
    loading : {
        isCreatingProduct : boolean,
        areProductsLoading : boolean, 
        isAISearchResponseLoading : boolean, 
        isReviewGettingDeleted : boolean, 
        isReviewGettingPosted : boolean, 
    }
}