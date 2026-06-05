// this is hook to abstract all the UI related logics which interacts with the API layer and 
// the atom layer 

import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { productAtom } from "../recoil/atoms/productAtom";
import type { CreateProductRequestPayload, CreateProductResponse, FetchAllProductsRequestPayload, FetchAllProductsResponse } from "../types/product.types";
import { createProductApi, fetchAllProductsApi } from "../api/productApi";
import { allProductsSelector, areProductsLoadingSelector, isAISearchResponseLoadingSelector, isReviewGettingDeletedSelector, isReviewGettingPostedSelector, newArrivalProductSelector, productDetailsSelector, productErrorSelector, topRatedProductSelector, totalNumberOfProductsSelector } from "../recoil/selectors/productSelectors";
import { useCallback } from "react";
import axiosInstance from "../api/axiosInstance";
import type { ParsedApiError } from "../types/error.types";
import { globalAxiosErrorHandler } from "../error/globalAxiosHandler";

export const useProduct = () => {
    // all the recoil related states comes here 
    const [productState, setProductState] = useRecoilState(productAtom);
    
    // all the selectors related to the product comes here
    // Note : Selectors are used for reads so components that consume individual 
    // values get fine-grained re-renders. The atom is only set, never reed directly 
    // in this hook
    const allProductList = useRecoilValue(allProductsSelector);
    const topRatedProducts = useRecoilValue(topRatedProductSelector);
    const newArrivalProducts = useRecoilValue(newArrivalProductSelector);
    const productDetails = useRecoilValue(productDetailsSelector);
    const totalNumbertOfProducts = useRecoilValue(totalNumberOfProductsSelector);
    const productError = useRecoilValue(productErrorSelector);
    const areProductsLoading = useRecoilValue(areProductsLoadingSelector);
    const isAISearchResponseLoading = useRecoilValue(isAISearchResponseLoadingSelector);
    const isReviewGettingDeleted = useRecoilValue(isReviewGettingDeletedSelector);
    const isReviewGettingPosted = useRecoilValue(isReviewGettingPostedSelector);








   
    // now here we will define all the function which 
    // will interact with the API layer and then
    // update the atom state accordingly based on the response 
    // we get from the backend server.
    export const fetchAllProducts = async (payload : FetchAllProductsRequestPayload) => {
        // lets update the loading related states in the productstate 
        setProductState({...productState, productError : ""});
        setProductState({...productState, loading : {...productState.loading, areProductsLoading : true}});

        // lets use the try catch here 
        try {   
            const response : FetchAllProductsResponse = await fetchAllProductsApi(payload);
            setProductState({...productState, allProducts : response.productList, totalNumberOfProducts : response.totalNumberOfProducts});
        }catch (error){
            // some error occurred while making an api request
            // lets set an error here 
            const parsedError : ParsedApiError = globalAxiosErrorHandler(error);
            setProductState({...productState, productError : parsedError.message});
        }finally{
            setProductState({...productState, loading : {...productState.loading, areProductsLoading : false}});
        }
    }
}