import type {  FetchAllProductsRequestPayload, FetchAllProductsResponse, FetchProductDetailRequestPayload, FetchProductDetailsResponse, PostProductReviewRequestPayload, PostProductReviewResponse } from "../types/product.types";
import axiosInstance from "./axiosInstance";

// all the api related to the products comes here
export const fetchAllProductsApi = async (payload : FetchAllProductsRequestPayload) => {
    // given the axios instance we need to make the get api call to fetch all the products 
    const fetchAllProductsResponse = await axiosInstance.get("/v1/products", {
        params : {
            availability : payload.availability,
            minPrice : payload.minPrice,
            maxPrice : payload.maxPrice,
            category : payload.category,
            minRating : payload.minRating,
            maxRating : payload.maxRating,
            search : payload.search,
            page : payload.page
        }
    });

    // check whether or not we indeed got an response from the backend server or not
    if(!fetchAllProductsResponse.data) {
        throw new Error("EMPTY_RESPONSE")
    }

    // check if there is products details in the backend response or not
    if(!fetchAllProductsResponse.data.products) {
        throw new Error("INVALID_RESPONSE")
    }

    // say everything went fine 
    return fetchAllProductsResponse.data as FetchAllProductsResponse;
}   





export const fetchSingleProductDetailsApi = async (payload : FetchProductDetailRequestPayload) => {
    // given the axios instance we need to make the get api call to fetch the product details 
    const fetchProductDetailsResponse = await axiosInstance.get(`/v1/product/${payload.productId}`);

    // check whether or not we indeed got an response from the backend server or not
    if(!fetchProductDetailsResponse.data) {
        throw new Error("EMPTY_RESPONSE")
    }

    // check if there is products details in the backend response or not
    if(!fetchProductDetailsResponse.data.productDetails) {
        throw new Error("INVALID_RESPONSE")
    }

    // say everything went fine 
    return fetchProductDetailsResponse.data as FetchProductDetailsResponse;
}



export const postProductReviewApi = async (payload : PostProductReviewRequestPayload) => {  
    // given the axios instance we need to make the post api call to post the product review
    const postProductReviewResponse = await axiosInstance.post(`/v1/product/review/${payload.productId}`, {
        rating : payload.rating,
        comment : payload.comment
    });

    // check whether or not we indeed got an response from the backend server or not
    if(!postProductReviewResponse.data) {
        throw new Error("EMPTY_RESPONSE")
    }

    // check if there is success field in the backend response or not
    if(postProductReviewResponse.data.success === undefined) {
        throw new Error("INVALID_RESPONSE")
    }

    // say everything went fine 
    return postProductReviewResponse.data as PostProductReviewResponse;
}




export const deleteProductReviewApi = async (reviewId : string) => {
    // given the axios instance we need to make the delete api call to delete the product review
    const deleteProductReviewResponse = await axiosInstance.delete(`/v1/product/review/${reviewId}`);

    // check whether or not we indeed got an response from the backend server or not
    if(!deleteProductReviewResponse.data) {
        throw new Error("EMPTY_RESPONSE")
    }

    // check if there is success field in the backend response or not
    if(deleteProductReviewResponse.data.success === undefined) {
        throw new Error("INVALID_RESPONSE")
    }

    // say everything went fine 
    return deleteProductReviewResponse.data as { success : boolean, message : string };
}