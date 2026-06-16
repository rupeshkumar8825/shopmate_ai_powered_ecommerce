import { selector } from "recoil";
import { productStateAtom } from "../atoms/product.atom";
import type { ProductDetail } from "../../types/product.types";

// this is the selectors related to the product state for this purpose


// true while any product operation (fetch / create / update / delete) is in flight
export const isProductOperationInProgressSelector = selector<boolean>({
    key : "isProductOperationInProgressSelector",
    get : ({ get }) => {
        return get(productStateAtom).productOperationInProgress
    }
})


// the full list of products currently held in the store
export const productsSelector = selector<ProductDetail[]>({
    key : "productsSelector",
    get : ({ get }) => {
        return get(productStateAtom).products
    }
})


// the latest product related error message (null when there is none)
export const productErrorSelector = selector<string | null>({
    key : "productErrorSelector",
    get : ({ get }) => {
        return get(productStateAtom).error
    }
})


// derived : the total number of products in the store (handy for dashboard counts)
export const productsCountSelector = selector<number>({
    key : "productsCountSelector",
    get : ({ get }) => {
        return get(productStateAtom).products.length
    }
})
