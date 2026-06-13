// Order summary — shown on the right side of the payments page across both steps.
// Lists the cart items and the subtotal / shipping / tax / total breakdown.

import type { CartItem } from "../../types/cartType"

// pricing constants kept in sync with CartPage
const SHIPPING_THRESHOLD = 50
const SHIPPING_COST = 2
const TAX_RATE = 0.18

interface OrderSummaryComponentProps {
    cartItems: CartItem[]
}

export const computePricing = (cartItems: CartItem[]) => {
    const subtotal = cartItems.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0
    )
    const shipping = subtotal > 0 && subtotal < SHIPPING_THRESHOLD ? SHIPPING_COST : 0
    const tax = subtotal * TAX_RATE
    const total = subtotal + shipping + tax
    return { subtotal, shipping, tax, total }
}

export const OrderSummaryComponent = ({ cartItems }: OrderSummaryComponentProps) => {
    const { subtotal, shipping, tax, total } = computePricing(cartItems)
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <div className="bg-component-background-500 border border-white/10 rounded-2xl p-6 flex flex-col gap-5 w-full lg:w-96 shrink-0 sticky top-6">

            <h2 className="text-white text-xl font-bold">Order Summary</h2>

            <div className="border-t border-white/10" />

            {/* Cart items */}
            <div className="flex flex-col gap-4 max-h-72 overflow-y-auto">
                {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                        <div className="relative shrink-0">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-14 h-14 object-cover rounded-xl border border-white/10"
                            />
                            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                                {item.quantity}
                            </span>
                        </div>
                        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                            <span className="text-white text-sm font-medium truncate">{item.name}</span>
                            <span className="text-gray-500 text-xs">${Number(item.price).toFixed(2)} each</span>
                        </div>
                        <span className="text-white font-semibold text-sm shrink-0">
                            ${(Number(item.price) * item.quantity).toFixed(2)}
                        </span>
                    </div>
                ))}
            </div>

            <div className="border-t border-white/10" />

            {/* Price breakdown */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">
                        Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})
                    </span>
                    <span className="text-white font-semibold text-sm">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Shipping</span>
                    {shipping === 0 ? (
                        <span className="text-green-400 font-semibold text-sm">Free</span>
                    ) : (
                        <span className="text-white font-semibold text-sm">${shipping.toFixed(2)}</span>
                    )}
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Tax (18%)</span>
                    <span className="text-white font-semibold text-sm">${tax.toFixed(2)}</span>
                </div>
            </div>

            <div className="border-t border-white/10" />

            {/* Total */}
            <div className="flex items-center justify-between">
                <span className="text-white font-bold text-lg">Total</span>
                <span className="text-white font-bold text-2xl">${total.toFixed(2)}</span>
            </div>
        </div>
    )
}
