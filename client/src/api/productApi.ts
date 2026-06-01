import type { FetchAllProductsRequest, FetchAllProductsResponse, FetchProductDetailRequest } from "../types/product.types";
import axiosInstance from "./axiosInstance";

// all the api related to the products comes here
export const fetchAllProductsApi = async (payload : FetchAllProductsRequest) => {
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




export const fetchProductDetailsApi = async (payload : FetchProductDetailRequest) => {
    // given the axios instance we need to make the get api call to fetch the product details 
    const fetchProductDetailsResponse = await axiosInstance.get(`/v1/products/${payload.productId}`);

    // check whether or not we indeed got an response from the backend server or not
    if(!fetchProductDetailsResponse.data) {
        throw new Error("EMPTY_RESPONSE")
    }

    // check if there is products details in the backend response or not
    if(!fetchProductDetailsResponse.data.productDetails) {
        throw new Error("INVALID_RESPONSE")
    }

    // say everything went fine 
    return fetchProductDetailsResponse.data as FetchProductDetailRequest;
}
