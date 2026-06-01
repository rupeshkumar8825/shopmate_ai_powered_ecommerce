// this is hook to abstract all the UI related logics which interacts with the API layer and 
// the atom layer 

import { useRecoilState } from "recoil";
import { allProductsAtom, areProductsLoadingAtom, isAISearchResponseLoadingAtom, isReviewGettingDeletedAtom, isReviewGettingPostedAtom, newArrivalProductAtom, productDetailsAtom, productErrorAtom, topRatedProductAtom, totalNumberOfProductsAtom } from "../recoil/atoms/productAtom";
import type { FetchProductDetailRequestPayload,  } from "../types/product.types"

import type { FetchAllProductsRequestPayload } from "../types/product.types"
import { fetchAllProductsApi, fetchSingleProductDetailsApi } from "../api/productApi";
import { globalAxiosErrorHandler } from "../error/globalAxiosHandler";
import type { ParsedApiError } from "../types/error.types";

export const useProduct = () => {
    // all the recoil states related atoms or selectors comes here
    const [areProductsLoading, setAreProductsLoading] = useRecoilState(areProductsLoadingAtom);
    const [isAISearchResponseLoading, setIsAISearchResponseLoading] = useRecoilState(isAISearchResponseLoadingAtom);
    const [isReviewGettingDeleted, setIsReviewGettingDeleted] = useRecoilState(isReviewGettingDeletedAtom);
    const [isReviewGettingPosted, setIsReviewGettingPosted] = useRecoilState(isReviewGettingPostedAtom);
    const [allProducts, setAllProducts] = useRecoilState(allProductsAtom);
    const [topRatedProducts, setTopRatedProducts] = useRecoilState(topRatedProductAtom);
    const [newArrivalProducts, setNewArrivalProducts] = useRecoilState(newArrivalProductAtom);
    const [productDetails, setProductDetails] = useRecoilState(productDetailsAtom);
    const [productError, setProductError] = useRecoilState(productErrorAtom);
    const [totalNumberOfProducts, setTotalNumberOfProducts] = useRecoilState(totalNumberOfProductsAtom);

    
    // all the states variables related to this hooks comes here  



    // here we are going to write all the logics related to the product 
    // which interacts with the API layer and the atom layer

    const fetchAllProducts = async (payload : FetchAllProductsRequestPayload) => {
        // here we are going to write the logic to fetch all the products 
        setAreProductsLoading(true);
        // lets use the try catch here and then call the API layer to fetch all the 
        // products and then set the response in the respective atoms and then set the loading to false
        try {
            // call the API layer to fetch all the products 
            // set the response in the respective atoms 
            const fetchAllProductsResponse = await fetchAllProductsApi(payload);
            setAllProducts(fetchAllProductsResponse.productList);
            setTopRatedProducts(fetchAllProductsResponse.topRatedProducts);
            setNewArrivalProducts(fetchAllProductsResponse.newlyCreatedProducts);
            setTotalNumberOfProducts(fetchAllProductsResponse.totalNumberOfProducts);
        } catch (error) {
            // handle the error here 
            const parsedApiErrorResponse : ParsedApiError = globalAxiosErrorHandler(error);
            setProductError(parsedApiErrorResponse.message);
            // this is not a protected route so we are not going to check for the token 
            // expiry error here
        } finally {
            setAreProductsLoading(false);
        }   
    }



    
    const fetchSingleProductDetails = async (payload : FetchProductDetailRequestPayload) => {
        setAreProductsLoading(true);
        try {
            // call the API layer to fetch the product details
            // set the response in the respective atoms 
            const fetchProductDetailsResponse = await fetchSingleProductDetailsApi(payload);
            setProductDetails(fetchProductDetailsResponse.productDetails);
        } catch (error) {
            // handle the error here 
            const parsedApiErrorResponse : ParsedApiError = globalAxiosErrorHandler(error);
            setProductError(parsedApiErrorResponse.message);
            // this is not a protected route so we are not going to check for the token 
            // expiry error here
        } finally {
            setAreProductsLoading(false);
        }
    }


    return {
        // here we are going to return all the functions and variables which are related to the product 
    }
}