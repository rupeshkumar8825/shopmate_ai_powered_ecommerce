import { selector } from "recoil";
import type { CartItem } from "../../types/cartType";
import { cartItemsAtom } from "../atoms/cartAtom";

// all cart related selectors comes here
export const cartTotalSelector = selector<number>({
    key : "cartTotalSelector",
     get : (get : any) => {
        const cartItems = get(cartItemsAtom);
        const total = cartItems.reduce((acc : number, item : CartItem) => acc + item.price * item.quantity, 0);
        return total;
    }
})


export const cartItemCountSelector = selector<number>({
    key : "cartItemCountSelector",
    get : (get : any) => {
        const cartItems = get(cartItemsAtom);
        const itemCount = cartItems.reduce((acc : number, item : CartItem) => acc + item.quantity, 0);
        return itemCount;
    }
})