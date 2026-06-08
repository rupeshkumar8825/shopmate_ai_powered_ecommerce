import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart"
import { CartItemRowComponent } from "../components/Cart/CartItemRowComponent";


// COMPONENT CONSTANTS COMES HERE 
const SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 2;
const TAX_RATE = 0.18;

export const CartPage = () => {
    // all the states related to this component comes here 
    
    
    // all the hook functions to be used from different custom hooks comes here
    const { cartItems, updateCartItemQuantity, removeFromCart, addToCart, clearCart } = useCart(); 
    
    // all the inbuilt hooks of the component comes here 
    const navigate = useNavigate();
    

    // ── Pricing calculations ──────────────────────────────────────────────────
    const subtotal = cartItems.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0
    )
    const shipping = subtotal > 0 && subtotal < SHIPPING_THRESHOLD ? SHIPPING_COST : 0
    const tax = subtotal * TAX_RATE
    const total = subtotal + shipping + tax
 
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
 
    // ── Empty cart state ──────────────────────────────────────────────────────
    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-background-500 flex items-center justify-center">
                <div className="flex flex-col items-center gap-6 text-center px-6">
                    <div className="bg-component-background-500 border border-white/10 rounded-full p-8">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h2 className="text-white text-2xl font-bold">Your cart is empty</h2>
                        <p className="text-gray-400 text-sm max-w-xs">
                            Looks like you haven't added anything yet. Browse our products and find something you love.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/products")}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors duration-200"
                    >
                        Browse Products
                    </button>
                </div>
            </div>
        )
    }
 
    return (
        <div className="min-h-screen bg-background-500">
            <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col gap-8">
 
                {/* ── Page heading ── */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-white text-4xl font-bold">Shopping Cart</h1>
                        <p className="text-gray-400 text-sm">
                            {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
                        </p>
                    </div>
                    <button
                        onClick={clearCart}
                        className="text-gray-500 hover:text-red-400 text-sm transition-colors duration-200 flex items-center gap-1.5"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Clear Cart
                    </button>
                </div>
 
                {/* ── Main layout ── */}
                <div className="flex flex-col lg:flex-row gap-8 items-start">
 
                    {/* LEFT — Cart items list */}
                    <div className="flex flex-col gap-4 flex-1 min-w-0">
 
                        {/* Column headers */}
                        <div className="hidden md:grid grid-cols-[1fr_auto_auto_auto] gap-5 px-4 text-gray-500 text-xs uppercase tracking-wider">
                            <span>Product</span>
                            <span className="text-center w-24">Quantity</span>
                            <span className="text-right w-24">Total</span>
                            <span className="w-7" />
                        </div>
 
                        {/* Item rows */}
                        <div className="flex flex-col gap-3">
                            {cartItems.map((item) => (
                                <CartItemRowComponent
                                    key={item.id}
                                    item={item}
                                    onQuantityChange={updateCartItemQuantity}
                                    onRemove={removeFromCart}
                                />
                            ))}
                        </div>
 
                        {/* Continue shopping link */}
                        <button
                            onClick={() => navigate("/products")}
                            className="self-start flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition-colors duration-200 mt-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Continue Shopping
                        </button>
                    </div>
 
                    {/* RIGHT — Order summary */}
                    <div className="bg-component-background-500 border border-white/10 rounded-2xl p-6 flex flex-col gap-5 w-full lg:w-96 shrink-0 sticky top-6">
 
                        <h2 className="text-white text-xl font-bold">Order Summary</h2>
 
                        {/* Divider */}
                        <div className="border-t border-white/10" />
 
                        {/* Line items */}
                        <div className="flex flex-col gap-3">
 
                            {/* Subtotal */}
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400 text-sm">
                                    Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})
                                </span>
                                <span className="text-white font-semibold text-sm">${subtotal.toFixed(2)}</span>
                            </div>
 
                            {/* Shipping */}
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-gray-400 text-sm">Shipping</span>
                                    {shipping === 0 && subtotal >= SHIPPING_THRESHOLD && (
                                        <span className="text-green-400 text-xs">Free on orders over ${SHIPPING_THRESHOLD}</span>
                                    )}
                                    {shipping > 0 && (
                                        <span className="text-gray-500 text-xs">
                                            Add ${(SHIPPING_THRESHOLD - subtotal).toFixed(2)} more for free shipping
                                        </span>
                                    )}
                                </div>
                                {shipping === 0 ? (
                                    <span className="text-green-400 font-semibold text-sm">Free</span>
                                ) : (
                                    <span className="text-white font-semibold text-sm">${shipping.toFixed(2)}</span>
                                )}
                            </div>
 
                            {/* Tax */}
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400 text-sm">Tax (18%)</span>
                                <span className="text-white font-semibold text-sm">${tax.toFixed(2)}</span>
                            </div>
                        </div>
 
                        {/* Divider */}
                        <div className="border-t border-white/10" />
 
                        {/* Total */}
                        <div className="flex items-center justify-between">
                            <span className="text-white font-bold text-lg">Total</span>
                            <span className="text-white font-bold text-2xl">${total.toFixed(2)}</span>
                        </div>
 
                        {/* Free shipping progress bar */}
                        {subtotal < SHIPPING_THRESHOLD && (
                            <div className="flex flex-col gap-1.5">
                                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                                        style={{ width: `${Math.min((subtotal / SHIPPING_THRESHOLD) * 100, 100)}%` }}
                                    />
                                </div>
                                <p className="text-gray-500 text-xs text-center">
                                    ${(SHIPPING_THRESHOLD - subtotal).toFixed(2)} away from free shipping
                                </p>
                            </div>
                        )}
 
                        {/* Checkout button */}
                        <button
                            onClick={() => navigate("/payment")}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Proceed to Checkout
                        </button>
 
                        {/* Continue shopping */}
                        <button
                            onClick={() => navigate("/products")}
                            className="w-full bg-transparent hover:bg-white/5 text-gray-400 hover:text-white border border-white/10 font-semibold py-3 rounded-xl transition-colors duration-200"
                        >
                            Continue Shopping
                        </button>
 
                        {/* Secure badge */}
                        <div className="flex items-center justify-center gap-2 text-gray-600 text-xs">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Secure checkout
                        </div>
 
                    </div>
                </div>
            </div>
        </div>
    )
}