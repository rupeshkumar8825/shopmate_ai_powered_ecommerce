import { selector } from "recoil";
import type { CartItem } from "../../types/cartType";
import { cartItemsAtom } from "../atoms/cartAtom";

// all cart related selectors comes here
export const cartTotalWithoutTaxSelector = selector<number>({
    key : "cartTotalWithoutTaxSelector",
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


export const cartTaxSelector = selector<number>({
    key : "cartTaxSelector",
    get : (get : any) => {
        const total = get(cartTotalWithoutTaxSelector);
        const tax = total * 0.18; // Assuming a tax rate of 18%
        return tax;
    }
})


export const cartTotalWithTaxSelector = selector<number>({
    key : "cartTotalWithTaxSelector",
    get : (get : any) => {
        const totalWithoutTax = get(cartTotalWithoutTaxSelector);
        const tax = get(cartTaxSelector);
        const totalWithTax = totalWithoutTax + tax;
        return totalWithTax;
    }
})


export const isItemInCartSelector = (itemId : string) => selector<boolean>({
    key : "isItemInCartSelector",
    get : (get : any) => {
        const cartItems : CartItem[] = get(cartItemsAtom);
        const getItemInCart = cartItems.filter((item : CartItem) => item.id === itemId);
        
        if(getItemInCart.length === 0) {
            return false;
        }else {
            return true;
        }
    }
})
