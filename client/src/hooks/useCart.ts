// hook to handle all the cart related logics at a single place


import { useRecoilState } from "recoil";
import { cartItemsAtom } from "../recoil/atoms/cartAtom";
import type { CartItem } from "../types/cartType";

export const useCart = () => {
    const [cartItems, setCartItems] = useRecoilState(cartItemsAtom);

    const addToCart = (item : CartItem) => {
        setCartItems((prev) => {
            // check if the item is already in the cart 
            const existingItemIndex = prev.findIndex(cartItem => cartItem.id === item.id);
            if(existingItemIndex !== -1) {
                // if the item is already in the cart then we need to update the quantity of that item
                const updatedCartItems = [...prev];
                updatedCartItems[existingItemIndex] = {
                    ...updatedCartItems[existingItemIndex],
                    quantity: updatedCartItems[existingItemIndex].quantity + item.quantity
                };
                return updatedCartItems;
            }else {
                // if the item is not in the cart then we need to add that item to the cart 
                return [...prev, item];
            }
        });
    }

    const removeFromCart = (itemId : string) => {
        setCartItems((prev) => prev.filter(cartItem => cartItem.id !== itemId));
    }

    const updateCartItemQuantity = (itemId : string, quantity : number) => {
        setCartItems((prev) => {
            const existingItemIndex = prev.findIndex(cartItem => cartItem.id === itemId);
            if(existingItemIndex !== -1) {
                const updatedCartItems = [...prev];
                updatedCartItems[existingItemIndex] = {
                    ...updatedCartItems[existingItemIndex],
                    quantity
                };
                return updatedCartItems;
            }
            return prev;
        });
    }

    const clearCart = () => {
        setCartItems([]);
    }

    return {
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart
    }
}