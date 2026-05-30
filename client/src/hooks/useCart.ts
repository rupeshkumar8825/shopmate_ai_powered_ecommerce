// hook to handle all the cart related logics at a single place


import { useRecoilState } from "recoil";
import { cartItemsAtom } from "../recoil/atoms/cartAtom";
import type { CartItem } from "../types/cartType";

export const useCart = () => {
    const [cartItems, setCartItems] = useRecoilState(cartItemsAtom);

    const addToCart = (item : CartItem) => {
        // check if the item is already in the cart 
        const existingItemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id);
        if(existingItemIndex !== -1) {
            // if the item is already in the cart then we need to update the quantity of that item
            const updatedCartItems = [...cartItems];
            updatedCartItems[existingItemIndex].quantity += item.quantity;
            setCartItems(updatedCartItems);
        }else {
            // if the item is not in the cart then we need to add that item to the cart 
            setCartItems([...cartItems, item]);
        }
    }

    const removeFromCart = (itemId : string) => {
        const updatedCartItems = cartItems.filter(cartItem => cartItem.id !== itemId);
        setCartItems(updatedCartItems);
    }

    const updateCartItemQuantity = (itemId : string, quantity : number) => {
        const existingItemIndex = cartItems.findIndex(cartItem => cartItem.id === itemId);
        if(existingItemIndex !== -1) {
            const updatedCartItems = [...cartItems];
            updatedCartItems[existingItemIndex].quantity = quantity;
            setCartItems(updatedCartItems);
        }
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