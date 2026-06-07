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
    // values get fine-grained re-renders. The atom is only set, never read directly 
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
        setProductState((prev) => ({ ...prev, productError: "", loading: { ...prev.loading, isCreatingProduct: true } }));
        try{
            const response : CreateProductResponse = await createProductApi(payload);
            setProductState((prev) => ({ ...prev, allProducts: [...prev.allProducts, response.productDetails] }));
        }catch(error){
            const parsedError : ParsedApiError = globalAxiosErrorHandler(error);
            setProductState((prev) => ({ ...prev, productError: parsedError.message }));
        } finally {
            setProductState((prev) => ({ ...prev, loading: { ...prev.loading, isCreatingProduct: false } }));
        }
    }


    const fetchAllProducts = async (payload : FetchAllProductsRequestPayload) => {
        setProductState((prev) => ({ ...prev, productError: "", loading: { ...prev.loading, areProductsLoading: true } }));
        try {   
            console.log("the payload that we are sending to get the list of all the products are : \n", payload)
            const response : FetchAllProductsResponse = await fetchAllProductsApi(payload);
            console.log("[fetchAllProducts] the response that we got from the fetchallproduct apis are : \n", response)
            console.log("[fetchAllProducts] the list of all the products that we got is : \n", response.productList)
            console.log("[fetchAllProducts] the list of all the products that we got is : \n", response.newlyCreatedProductList)
            console.log("[fetchAllProducts] the list of all the products that we got is : \n", response.topRatedProducts)
            setProductState((prev) => ({
                ...prev,
                allProducts: response.productList,
                totalNumberOfProducts: response.totalNumberOfProducts,
                newlyCreatedProductList: response.newlyCreatedProductList,
                topRatedProducts: response.topRatedProducts,
            }));
        }catch (error){
            const parsedError : ParsedApiError = globalAxiosErrorHandler(error);
            setProductState((prev) => ({ ...prev, productError: parsedError.message }));
            console.log("The error that we got is as follows\n", parsedError)
        }finally{
            setProductState((prev) => ({ ...prev, loading: { ...prev.loading, areProductsLoading: false } }));
        }
    }


    const updateProduct = async (payload : UpdateProductRequestPayload) => {    
        setProductState((prev) => ({ ...prev, productError: "", loading: { ...prev.loading, isCreatingProduct: true } }));
        try {
            const response : UpdateProductResponse = await updateProductApi(payload);
            const updatedProductDetails = response.updatedProductDetails;
            const updatedAllProducts = productState.allProducts.map(product => {
                if(product.id === updatedProductDetails.id) {
                    return updatedProductDetails;
                }
                return product;
            });
            setProductState((prev) => ({
                ...prev,
                allProducts: updatedAllProducts,
                productDetails: prev.productDetails?.id === updatedProductDetails.id ? updatedProductDetails : prev.productDetails
            }));
        }catch(error){
            const parsedError : ParsedApiError = globalAxiosErrorHandler(error);
            setProductState((prev) => ({ ...prev, productError: parsedError.message }));
        } finally {
            setProductState((prev) => ({ ...prev, loading: { ...prev.loading, isCreatingProduct: false } }));
        }
    }


    const deleteProduct = async (payload : DeleteProductRequestPayload) => {
        setProductState((prev) => ({ ...prev, productError: "", loading: { ...prev.loading, isCreatingProduct: true } }));
        try {
            await deleteProductApi(payload);
            const deletedProductId = payload.productId;
            setProductState((prev) => ({
                ...prev,
                allProducts: prev.allProducts.filter(product => product.id !== deletedProductId),
                productDetails: prev.productDetails?.id === deletedProductId ? null : prev.productDetails
            }));
        }catch(error){
            const parsedError : ParsedApiError = globalAxiosErrorHandler(error);
            setProductState((prev) => ({ ...prev, productError: parsedError.message }));
        } finally {
            setProductState((prev) => ({ ...prev, loading: { ...prev.loading, isCreatingProduct: false } }));
        }
    }


    const fetchSingleProductDetails = async (payload : FetchProductDetailRequestPayload) => {
        setProductState((prev) => ({ ...prev, productError: "", loading: { ...prev.loading, areProductsLoading: true } }));
        try {
            const response = await fetchSingleProductDetailsApi(payload);
            setProductState((prev) => ({ ...prev, productDetails: response.productDetails }));
        }catch(error){
            const parsedError : ParsedApiError = globalAxiosErrorHandler(error);
            setProductState((prev) => ({ ...prev, productError: parsedError.message }));
        } finally {
            setProductState((prev) => ({ ...prev, loading: { ...prev.loading, areProductsLoading: false } }));
        }
    }


    const postProductReview = async (payload : PostProductReviewRequestPayload) => {
        setProductState((prev) => ({ ...prev, productError: "", loading: { ...prev.loading, isReviewGettingPosted: true } }));
        try {
            const response : PostProductReviewResponse = await postProductReviewApi(payload);
            const updatedAllProducts = productState.allProducts.map(product => {
                if(product.id === payload.productId) {
                    return response.product;
                }
                return product;
            });
            setProductState((prev) => ({
                ...prev,
                allProducts: updatedAllProducts,
                productDetails: prev.productDetails?.id === payload.productId ? response.product : prev.productDetails
            }));
        }catch(error){
            const parsedError : ParsedApiError = globalAxiosErrorHandler(error);
            setProductState((prev) => ({ ...prev, productError: parsedError.message }));
        } finally {
            setProductState((prev) => ({ ...prev, loading: { ...prev.loading, isReviewGettingPosted: false } }));
        }   
    }


    const deleteProductReview = async (payload : DeleteProductReviewRequestPayload) => {
        setProductState((prev) => ({ ...prev, loading: { ...prev.loading, isReviewGettingDeleted: true } }));
        try{
            const response : DeleteProductReviewResponse = await deleteProductReviewApi(payload);
            const updatedAllProducts : ProductDetail[] = allProductList.map((currProduct : ProductDetail) => {
                if(currProduct.id === response.product.id)
                {
                    return response.product;
                } 
                return currProduct;
            })
            setProductState((prev) => ({
                ...prev,
                allProducts: updatedAllProducts,
                productDetails: prev.productDetails?.id === response.product.id ? response.product : prev.productDetails
            }));
        }catch(error){
            const parsedError : ParsedApiError = globalAxiosErrorHandler(error);
            setProductState((prev) => ({ ...prev, productError: parsedError.message }));
        }finally {
            setProductState((prev) => ({ ...prev, loading: { ...prev.loading, isReviewGettingDeleted: false } }));
        }
    }


    const fetchAIFilteredProducts = async (payload : FetchAIFilteredProductsRequestPayload) => {
        setProductState((prev) => ({ ...prev, loading: { ...prev.loading, isAISearchResponseLoading: true } }));
        try{
            const response : FetchAIFilteredProductsResponse = await fetchAIFilteredProductsAPI(payload)
            setProductState((prev) => ({ ...prev, allProducts: response.aiFilteredProducts, totalNumberOfProducts: response.aiFilteredProducts.length }));
        }catch(error) {
            const parsedError : ParsedApiError = globalAxiosErrorHandler(error);
            setProductState((prev) => ({ ...prev, productError: parsedError.message }));
        }finally {
            setProductState((prev) => ({ ...prev, loading: { ...prev.loading, isAISearchResponseLoading: false } }));
        }
    }


    const updateFilters = async (updatedFilters : Partial<FetchAllProductsRequestPayload>) => {
        // whenever the filter is updated then we will set the page to 1 
        let mergedFilters : FetchAllProductsRequestPayload = {...productState.searchFilter, ...updatedFilters, page : 1}

        setProductState((prev) => ({ ...prev, searchFilter: mergedFilters }));
        
        // now here lets call the function to fetch all the products based on this updated filter 
        await fetchAllProducts(mergedFilters)
    }
    

    const changePage = async (page : number) => {
        let mergedFilter : FetchAllProductsRequestPayload = {...productState.searchFilter, page : page}

        setProductState((prev) => ({ ...prev, searchFilter: mergedFilter }));

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