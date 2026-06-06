// this is hook to abstract all the UI related logics which interacts with the API layer and 
// the atom layer 

import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { productAtom } from "../recoil/atoms/productAtom";
import type { CreateProductRequestPayload, CreateProductResponse, DeleteProductRequestPayload, DeleteProductResponse, FetchAIFilteredProductsRequestPayload, FetchAllProductsRequestPayload, FetchAllProductsResponse, FetchProductDetailRequestPayload, PostProductReviewRequestPayload, UpdateProductRequestPayload, UpdateProductRequestPayload, UpdateProductResponse, UpdateProductResponse } from "../types/product.types";
import { createProductApi, deleteProductApi, fetchAllProductsApi, fetchSingleProductDetailsApi, postProductReviewApi, updateProductApi } from "../api/productApi";
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


    const fetchSingleProductDetails = async (payload : FetchProductDetailRequestPayload) => {
        // we will make the api call to fetch the product details and then we will update the product details in the atom state
        // lets update the loading related states in the productstate 
        setProductState({...productState, productError : ""});
        setProductState({...productState, loading : {...productState.loading, areProductsLoading : true}});
        
        try {
            const response = await fetchSingleProductDetailsApi(payload);
            setProductState({...productState, productDetails : response.productDetails});
        }catch(error){
            const parsedError : ParsedApiError = globalAxiosErrorHandler(error);
            setProductState({...productState, productError : parsedError.message});
        } finally {
            setProductState({...productState, loading : {...productState.loading, areProductsLoading : false}});
        }
    }



    
    const postProductReview = async (payload : PostProductReviewRequestPayload) => {
        // we will make the api call to post the product review and then we will update the product details in the atom state
            // lets update the loading related states in the productstate
        setProductState({...productState, productError : ""});
        setProductState({...productState, loading : {...productState.loading, isReviewGettingPosted : true}});

        try {
            await postProductReviewApi(payload);
            // now we need to update the product details in the atom state 
            // we will update the product details in the allProducts list and also in the productDetails if the updated product is same as the one which is there in the productDetails
            const updatedAllProducts = productState.allProducts.map(product => {
                if(product.id === payload.productId) {
                    // we need to update the reviews and ratings of the product 
                    const updatedReviews = [...product.reviewList, { rating : payload.rating, comment : payload.comment }];
                    const totalRating = updatedReviews.reduce((acc, review) => acc + review.rating, 0);
                    const averageRating = totalRating / updatedReviews.length;
                    return {...product, reviews : updatedReviews, rating : averageRating};
                }
                return product;
            });
            setProductState({...productState, allProducts : updatedAllProducts, productDetails : productState.productDetails?.id === payload.productId ? {...productState.productDetails, reviews : [...(productState.productDetails.reviews || []), { rating : payload.rating, comment : payload.comment }], rating : productState.productDetails.rating ? (productState.productDetails.rating * (productState.productDetails.reviews ? productState.productDetails.reviews.length : 0) + payload.rating) / ((productState.productDetails.reviews ? productState.productDetails.reviews.length : 0) + 1) : payload.rating} : productState.productDetails});
        }catch(error){
            const parsedError : ParsedApiError = globalAxiosErrorHandler(error);
            setProductState({...productState, productError : parsedError.message});
        } finally {
            setProductState({...productState, loading : {...productState.loading, isReviewGettingPosted : false}});
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
        deleteProduct,
        fetchSingleProductDetails,
        postProductReview
    }


    

}