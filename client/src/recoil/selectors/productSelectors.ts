// file consists of selectors related to products. 

import { selector } from "recoil";
import type { FetchAllProductsRequestPayload, ProductDetail } from "../../types/product.types";
import { productAtom } from "../atoms/productAtom";



// all the atoms related to the Product comes here
export const allProductsSelector = selector<ProductDetail[]>({
    key : "allProductsSelector", 
    get : ({ get }) => {
        return get(productAtom).allProducts;
    }
});

// top rated product atoms 
export const topRatedProductSelector = selector<ProductDetail[]>({
    key : "topRatedProductSelector", 
    get : ({ get }) => {
        return get(productAtom).topRatedProducts;
    }
});


// new arrival product selector
export const newArrivalProductSelector = selector<ProductDetail[]>({
    key : "newArrivalProductSelector", 
    get : ({ get }) => {
        return get(productAtom).newArrivalProducts;
    }
});



export const areProductsLoadingSelector = selector<boolean>({
    key : "areProductsLoadingSelector", 
    get : ({ get }) => {
        return get(productAtom).loading.areProductsLoading;
    }
});



export const isAISearchResponseLoadingSelector = selector<boolean>({
    key : "isAISearchResponseLoadingSelector", 
    get : ({ get }) => {
        return get(productAtom).loading.isAISearchResponseLoading;
    }
});



export const isReviewGettingDeletedSelector = selector<boolean>({
    key : "isReviewGettingDeletedSelector", 
    get : ({ get }) => {
        return get(productAtom).loading.isReviewGettingDeleted;
    }
});



export const isReviewGettingPostedSelector = selector<boolean>({
    key : "isReviewGettingPostedSelector", 
    get : ({ get }) => {
        return get(productAtom).loading.isReviewGettingPosted;
    }
});




export const productDetailsSelector = selector<ProductDetail | null>({
    key : "productDetailsSelector", 
    get : ({ get }) => {
        return get(productAtom).productDetails;
    }
});


export const productErrorSelector = selector<string>({
    key : "productError", 
    get : ({ get }) => {
        return get(productAtom).productError;
    }
});


export const totalNumberOfProductsSelector = selector<number>({
    key : "totalNumberOfProductsSelector", 
    get : ({ get }) => {
        return get(productAtom).totalNumberOfProducts;
    }
});




export const searchFilterSelector = selector<FetchAllProductsRequestPayload>({
    key : "searchFilterSelector", 
    get : ( { get }) => {
        return get(productAtom).searchFilter
    }
})