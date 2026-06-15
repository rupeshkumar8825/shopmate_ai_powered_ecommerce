// this is order atom section 

import { atom } from "recoil";
import type { OrderAtomState } from "../../types/order.types";





export const orderStateAtom = atom<OrderAtomState>({
    key : "orderStateAtom", 
    default : {
        orderOperationInProgress : false, 
        orders : [], 
        error : null
    }
})