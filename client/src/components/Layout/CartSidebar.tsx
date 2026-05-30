// component for the cartside bar
// this will show the list of items present in the cart and the total price of the items in the cart and also the checkout button which will divert the user to the checkout page.

import { useRecoilState } from "recoil";
import { useCart } from "../../hooks/useCart";
import { isCartPopupOpenAtom } from "../../recoil/atoms/popupAtom";
import { useNavigate } from "react-router-dom";


export const CartSidebar = () => {
    const navigate = useNavigate();
    // all the recoil related states of this component comes here
    const { cartItems, addToCart, removeFromCart, updateCartItemQuantity, clearCart } = useCart();
    const [isCartPopupOpen, setIsCartPopupOpen] = useRecoilState(isCartPopupOpenAtom);
    // states related to this component comes here

    // all the handlers of the component comes here
    const browseProductsClickHandler = () => {
        setIsCartPopupOpen(false);
        // and then we need to divert the user to the products page
        // we can use the useNavigate hook from react-router-dom to divert the user to the products page
        navigate("/products");
    }


    // all hooks related to this component comes here   


    return (
        <div>
            <div onClick={() => setIsCartPopupOpen(false)} className={`fixed top-0 right-0 w-full h-full bg-black/50 bg-opacity-50 z-40  ${isCartPopupOpen ? "block" : "hidden"}`}></div>

            {
                cartItems.length === 0 ? (
                    <div className={`border-2 border-black fixed top-0 right-0 w-[60%] h-full bg-neutral-200 shadow-lg z-50 transform ${isCartPopupOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out  flex flex-col justify-center items-center gap-10`}>
                        <h1 className="text-2xl font-semibold">Your cart is empty</h1>
                        <p className="text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
                        <button onClick={browseProductsClickHandler} className="px-4 py-2 bg-neutral-300 shadow-2xl  text-black rounded-lg mt-5 cursor-pointer">Start Shopping</button>
                    </div>
                ) : (
                    <div className={`border-2 border-black fixed top-0 right-0 w-[60%] h-full bg-neutral-200 shadow-lg z-50 transform ${isCartPopupOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out  flex flex-col justify-center items-center gap-10`}>
                        {
                            cartItems.map((item) => (
                                <div key={item.id} className=" border-2 border-black flex flex-row justify-between items-center gap-5">
                                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                                    <div className="flex flex-col justify-start items-start gap-2">
                                        <h1 className="text-lg font-semibold">{item.name}</h1>
                                        <p className="text-sm text-muted-foreground">Price: ${item.price}</p>
                                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                                    </div>
                                    <div className="flex flex-row justify-center items-center gap-2">
                                        <button onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)} className="px-2 py-1 bg-primary text-white rounded-lg">+</button>
                                        <button onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)} className="px-2 py-1 bg-primary text-white rounded-lg">-</button>
                                        <button onClick={() => removeFromCart(item.id)} className="px-2 py-1 bg-red-500 text-white rounded-lg">Remove</button>
                                    </div>
                                </div>
                            ))
                        }
                        <div className="flex flex-row justify-between items-center gap-5 mt-5">
                            <h1 className="text-lg font-semibold">Total: ${cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)}</h1>
                            <button className="px-4 py-2 bg-green-500 text-white rounded-lg">Checkout</button>
                        </div>
                    </div>
                )
            }
        </div>
    )
}