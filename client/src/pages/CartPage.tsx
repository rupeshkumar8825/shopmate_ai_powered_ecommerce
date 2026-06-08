import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart"


// COMPONENT CONSTANTS COMES HERE 
const SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 2;
const TAX_RATE = 0.18;

export const CartPage = () => {
    // all the states related to this component comes here 
    
    
    // all the hook functions to be used from different custom hooks comes here
    const { cartItems, updateCartItemQuantity, removeFromCart, addToCart } = useCart(); 
    
    // all the inbuilt hooks of the component comes here 
    const navigate = useNavigate();
    

    // handle the case of empty cart for this case 
    if(!cartItems || cartItems.length === 0) {
        // this means that the cart is empty 
        return (
            <div>
                Cart it empty. Continue for shopping for this purpose
            </div>
        )
    }

    return (
        <div>
            Welcome to the cart page on the ecommerce website
        </div>
    )
}