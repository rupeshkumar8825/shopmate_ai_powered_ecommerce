// this is product atom section

import { atom } from "recoil";
import type { ProductAtomState } from "../../types/product.types";


export const productStateAtom = atom<ProductAtomState>({
    key : "productStateAtom",
    default : {
        productOperationInProgress : false,
        products : [],
        error : null
    }
})
