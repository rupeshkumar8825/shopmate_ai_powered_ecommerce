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


