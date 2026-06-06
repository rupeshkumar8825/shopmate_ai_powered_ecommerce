// this is hook to abstract all the UI related logics which interacts with the API layer and 
// the atom layer 

import { useRecoilState, useRecoilValue } from "recoil";
import { productAtom } from "../recoil/atoms/productAtom";
import type { CreateProductRequestPayload, CreateProductResponse, DeleteProductRequestPayload, DeleteProductReviewRequestPayload, DeleteProductReviewResponse, FetchAIFilteredProductsRequestPayload, FetchAIFilteredProductsResponse, FetchAllProductsRequestPayload, FetchAllProductsResponse, FetchProductDetailRequestPayload, PostProductReviewRequestPayload, PostProductReviewResponse, ProductDetail, UpdateProductRequestPayload, UpdateProductResponse } from "../types/product.types";
import { createProductApi, deleteProductApi, deleteProductReviewApi, fetchAIFilteredProductsAPI, fetchAllProductsApi, fetchSingleProductDetailsApi, postProductReviewApi, updateProductApi } from "../api/productApi";
import { allProductsSelector, areProductsLoadingSelector, isAISearchResponseLoadingSelector, isReviewGettingDeletedSelector, isReviewGettingPostedSelector, newArrivalProductSelector, productDetailsSelector, productErrorSelector, searchFilterSelector, topRatedProductSelector, totalNumberOfProductsSelector } from "../recoil/selectors/productSelectors";
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
    const searchFilter = useRecoilValue(searchFilterSelector)








   
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
            await deleteProductApi(payload);
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
            const response : PostProductReviewResponse =  await postProductReviewApi(payload);
            // now we need to update the product details in the atom state 
            // we will update the product details in the allProducts list and also in the productDetails if the updated product is same as the one which is there in the productDetails
            const updatedAllProducts = productState.allProducts.map(product => {
                if(product.id === payload.productId) {
                    return response.product;
                }
                return product;
            });
            setProductState({...productState, allProducts : updatedAllProducts, productDetails : productState.productDetails?.id === payload.productId ? response.product : productState.productDetails});
        }catch(error){
            const parsedError : ParsedApiError = globalAxiosErrorHandler(error);
            setProductState({...productState, productError : parsedError.message});
        } finally {
            setProductState({...productState, loading : {...productState.loading, isReviewGettingPosted : false}});
        }   
    }



    const deleteProductReview = async (payload : DeleteProductReviewRequestPayload) => {
        setProductState({...productState, loading : {...productState.loading, isReviewGettingDeleted : true}});

        try{
            // lets call the api here and get the response from the backend server 
            const response : DeleteProductReviewResponse = await deleteProductReviewApi(payload);
            // lets first remove the product from all product list 
            const updatedAllProducts : ProductDetail[] = allProductList.map((currProduct : ProductDetail) => {
                // check if any product with this product id exists or not 
                if(currProduct.id === response.product.id)
                {
                    // then we need to return the updated product 
                    return response.product;
                } 

                // else we simply return the same element 
                return currProduct;
            })


            setProductState({...productState, allProducts : updatedAllProducts, productDetails : productState.productDetails?.id === response.product.id? response.product : productState.productDetails  })
        }catch(error){
            const parsedError : ParsedApiError = globalAxiosErrorHandler(error);
            setProductState({...productState, productError : parsedError.message})
        }finally {
            setProductState({...productState, loading : {...productState.loading, isReviewGettingDeleted : false}})
        }
    }



    const fetchAIFilteredProducts = async (payload : FetchAIFilteredProductsRequestPayload) => {
        setProductState({...productState, loading : {...productState.loading, isAISearchResponseLoading : true}})
        try{
            const response : FetchAIFilteredProductsResponse = await fetchAIFilteredProductsAPI(payload)
            setProductState({...productState, allProducts : response.aiFilteredProducts, totalNumberOfProducts : response.aiFilteredProducts.length});
        }catch(error) {
            const parsedError : ParsedApiError = globalAxiosErrorHandler(error);
            setProductState({...productState, productError : parsedError.message})
        }finally {
            setProductState({...productState, loading : {...productState.loading, isAISearchResponseLoading : false}})
        }
    }



    const updateFilters = async (updatedFilters : Partial<FetchAllProductsRequestPayload>) => {
        // whenever the filter is updated then we will set the page to 1 
        let mergedFilters : FetchAllProductsRequestPayload = {...productState.searchFilter, ...updatedFilters, page : 1}

        setProductState({...productState, searchFilter : mergedFilters})
        
        // now here lets call the function to fetch all the products based on this updated filter 
        await fetchAllProducts(mergedFilters)

    }
    

    const changePage = async (page : number) => {
        let mergedFilter : FetchAllProductsRequestPayload = {...productState.searchFilter, page : page}

        // lets update the product state here with this updated filter 
        setProductState({...productState, searchFilter : mergedFilter})

        // now lets call the function to fetch the product  
        await fetchAllProducts(mergedFilter)
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
        searchFilter,

        // all the functions comes here
        createProducts,
        fetchAllProducts,
        updateProduct,
        deleteProduct,
        fetchSingleProductDetails,
        postProductReview, 
        deleteProductReview, 
        fetchAIFilteredProducts, 
        updateFilters, 
        changePage
    }


    

}