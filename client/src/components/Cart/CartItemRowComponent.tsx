// Cart item row component
// Shows a single cart item with image, name, category, price, quantity controls and remove

import { Link } from "react-router-dom"
import type { CartItem } from "../../types/cartType"

interface CartItemRowComponentProps {
    item: CartItem
    onQuantityChange: (itemId: string, quantity: number) => void
    onRemove: (itemId: string) => void
}

export const CartItemRowComponent = ({
    item,
    onQuantityChange,
    onRemove,
}: CartItemRowComponentProps) => {
    const lineTotal = Number(item.price) * item.quantity

    const handleDecrease = () => {
        if (item.quantity > 1) {
            onQuantityChange(item.id, item.quantity - 1)
        }
    }

    const handleIncrease = () => {
        if (item.quantity < item.stock) {
            onQuantityChange(item.id, item.quantity + 1)
        }
    }

    return (
        <div className="flex flex-row items-center gap-5 bg-component-background-500 border border-white/10 rounded-2xl p-4 transition-all duration-200 hover:border-white/20">

            {/* Product image */}
            <Link to={`/product/${item.id}`} className="shrink-0">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl border border-white/10"
                />
            </Link>

            {/* Name + category */}
            <div className="flex flex-col gap-1 flex-1 min-w-0">
                <Link to={`/product/${item.id}`} className="hover:text-blue-400 transition-colors duration-200">
                    <h3 className="text-white font-semibold text-base truncate">{item.name}</h3>
                </Link>
                {/* category is optional — add it to CartItem type to show it here */}
                {(item as any).category && (
                    <span className="text-xs text-blue-400 bg-blue-600/15 px-2 py-0.5 rounded-full self-start">
                        {(item as any).category}
                    </span>
                )}
                <span className="text-gray-400 text-sm">${Number(item.price).toFixed(2)} each</span>
            </div>

            {/* Quantity controls */}
            <div className="flex items-center gap-2 shrink-0">
                <button
                    onClick={handleDecrease}
                    disabled={item.quantity <= 1}
                    className="w-8 h-8 rounded-lg bg-background-500 border border-white/20 text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                </button>
                <span className="text-white font-semibold text-sm w-6 text-center">{item.quantity}</span>
                <button
                    onClick={handleIncrease}
                    disabled={item.quantity >= item.stock}
                    className="w-8 h-8 rounded-lg bg-background-500 border border-white/20 text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </div>

            {/* Line total */}
            <div className="shrink-0 w-24 text-right">
                <span className="text-white font-bold text-base">${lineTotal.toFixed(2)}</span>
            </div>

            {/* Remove button */}
            <button
                onClick={() => onRemove(item.id)}
                className="shrink-0 text-gray-500 hover:text-red-400 transition-colors duration-200 p-1"
                title="Remove from cart"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>

        </div>
    )
}