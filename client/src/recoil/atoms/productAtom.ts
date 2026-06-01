import { atom } from "recoil";
import type { ProductDetail } from "../../types/product.types";


// all the atoms related to the Product comes here
export const allProductsAtom = atom<ProductDetail[]>({
    key : "allProductsAtom", 
    default : []
});

// top rated product atoms 
export const topRatedProductAtom = atom<ProductDetail[]>({
    key : "topRatedProductAtom", 
    default : []
});


// new arrival product atom
export const newArrivalProductAtom = atom<ProductDetail[]>({
    key : "newArrivalProductAtom", 
    default : []
});



export const areProductsLoadingAtom = atom<boolean>({
    key : "areProductsLoadingAtom", 
    default : false
});



export const isAISearchResponseLoadingAtom = atom<boolean>({
    key : "isAISearchResponseLoadingAtom", 
    default : false
});



export const isReviewGettingDeletedAtom = atom<boolean>({
    key : "isReviewGettingDeletedAtom", 
    default : false
});



export const isReviewGettingPostedAtom = atom<boolean>({
    key : "isReviewGettingPostedAtom", 
    default : false
});




export const productDetailsAtom = atom<ProductDetail | null>({
    key : "productDetailsAtom", 
    default : null
});


export const productErrorAtom = atom<string>({
    key : "productError", 
    default : ""
});


export const totalNumberOfProductsAtom = atom<number>({
    key : "totalNumberOfProductsAtom", 
    default : 0
});