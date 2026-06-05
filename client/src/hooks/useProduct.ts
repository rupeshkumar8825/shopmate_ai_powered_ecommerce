// this is hook to abstract all the UI related logics which interacts with the API layer and 
// the atom layer 

import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { productAtom } from "../recoil/atoms/productAtom";
import type { CreateProductRequestPayload, CreateProductResponse, DeleteProductRequestPayload, DeleteProductResponse, FetchAIFilteredProductsRequestPayload, FetchAllProductsRequestPayload, FetchAllProductsResponse, UpdateProductRequestPayload, UpdateProductRequestPayload, UpdateProductResponse, UpdateProductResponse } from "../types/product.types";
import { createProductApi, deleteProductApi, fetchAllProductsApi, updateProductApi } from "../api/productApi";
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


    const createProducts = async (payload : CreateProductRequestPayload) =>  {
        setProductState({...productState, productError : "", loading: {...productState.loading, isCreatingProduct : true}});
        try{
            const response : CreateProductResponse = await createProductApi(payload);
            setProductState({...productState, allProducts : [...productState.allProducts, response.productDetails]})
        }catch(error){
            const parsedError : ParsedApiError = globalAxiosErrorHandler(error);
            setProductState({...productState, productError : parsedError.message});
        } finally {
            setProductState({...productState, loading : {...productState.loading, isCreatingProduct : false}});
        }

    }




    const fetchAllProducts = async (payload : FetchAllProductsRequestPayload) => {
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


    const updateProduct = async (payload : UpdateProductRequestPayload) => {    
        // we will make the api call to update the product details and then we will update the product details in the atom state
        // lets update the loading related states in the productstate 
        setProductState({...productState, productError : ""});
        setProductState({...productState, loading : {...productState.loading, isCreatingProduct : true}});

        try {
            const response : UpdateProductResponse = await updateProductApi(payload);
            // now we need to update the product details in the atom state 
            // we will update the product details in the allProducts list and also in the productDetails if the updated product is same as the one which is there in the productDetails
            const updatedProductDetails = response.updatedProductDetails;
            const updatedAllProducts = productState.allProducts.map(product => {
                if(product.id === updatedProductDetails.id) {
                    return updatedProductDetails;
                }
                return product;
            });
            setProductState({...productState, allProducts : updatedAllProducts, productDetails : productState.productDetails?.id === updatedProductDetails.id ? updatedProductDetails : productState.productDetails});
        }catch(error){
            const parsedError : ParsedApiError = globalAxiosErrorHandler(error);
            setProductState({...productState, productError : parsedError.message});
        } finally {
            setProductState({...productState, loading : {...productState.loading, isCreatingProduct : false}});
        }
    }



    const deleteProduct = async (payload : DeleteProductRequestPayload) => {
        // we will make the api call to delete the product and then we will update the product details in the atom state
        // lets update the loading related states in the productstate 
        setProductState({...productState, productError : ""});
        setProductState({...productState, loading : {...productState.loading, isCreatingProduct : true}});

        try {
            const response : DeleteProductResponse= await deleteProductApi(payload);
            // now we need to remove the deleted product from the atom state 
            const deletedProductId = payload.productId;
            const updatedAllProducts = productState.allProducts.filter(product => product.id !== deletedProductId);
            setProductState({...productState, allProducts : updatedAllProducts, productDetails : productState.productDetails?.id === deletedProductId ? null : productState.productDetails});
        }catch(error){
            const parsedError : ParsedApiError = globalAxiosErrorHandler(error);
            setProductState({...productState, productError : parsedError.message});
        } finally {
            setProductState({...productState, loading : {...productState.loading, isCreatingProduct : false}});
        }
    }

    return {
        // all the states comes here 
        allProductList,
        topRatedProducts,
        newArrivalProducts,
        productDetails,
        totalNumbertOfProducts,
        productError,
        areProductsLoading,
        isAISearchResponseLoading,
        isReviewGettingDeleted,
        isReviewGettingPosted,

        // all the functions comes here
        createProducts,
        fetchAllProducts,
        updateProduct,
        deleteProduct
    }


    

}