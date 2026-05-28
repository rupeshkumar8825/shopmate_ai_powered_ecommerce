import { atom } from "recoil";
import type { CartItem } from "../../types/cartType";

// atom related to cart comes here
export const cartItemsAtom = atom<CartItem[]>({
    key : "cartItemsAtom", 
    default : []
});