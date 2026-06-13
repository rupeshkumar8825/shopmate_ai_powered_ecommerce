// Order card component
// Shows a single order: id, placed date, status badge, item thumbnails and price breakdown

import { Link } from "react-router-dom"
import { Package } from "lucide-react"
import type { OrderDetails } from "../../types/order.types"

interface OrderCardComponentProps {
    order: OrderDetails
}

// ── Status badge styling ──────────────────────────────────────────────────────
// keys mirror the backend OrderStatus enum (Processing | Shipped | Delivered | Cancelled)
const STATUS_STYLES: Record<string, string> = {
    Processing: "text-amber-400 bg-amber-500/15",
    Shipped: "text-blue-400 bg-blue-500/15",
    Delivered: "text-green-400 bg-green-500/15",
    Cancelled: "text-red-400 bg-red-500/15",
}

const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    })

export const OrderCardComponent = ({ order }: OrderCardComponentProps) => {
    const items = order.orderItemList ?? []
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
    const badgeStyle = STATUS_STYLES[order.order_status] ?? "text-gray-400 bg-white/10"

    return (
        <div className="flex flex-col bg-component-background-500 border border-white/10 rounded-2xl overflow-hidden transition-all duration-200 hover:border-white/20">

            {/* ── Header: order id + date + status ── */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-white/10">
                <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-white font-semibold text-sm truncate">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className="text-gray-500 text-xs">
                        Placed on {formatDate(order.created_at)}
                    </span>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${badgeStyle}`}>
                    {order.order_status}
                </span>
            </div>

            {/* ── Items ── */}
            <div className="flex flex-col gap-3 px-5 py-4">
                {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                        <Link to={`/products/${item.product_id}`} className="shrink-0">
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-14 h-14 object-cover rounded-xl border border-white/10"
                            />
                        </Link>
                        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                            <Link
                                to={`/products/${item.product_id}`}
                                className="text-white text-sm font-medium truncate hover:text-blue-400 transition-colors duration-200"
                            >
                                {item.title}
                            </Link>
                            <span className="text-gray-500 text-xs">
                                Qty {item.quantity} × ${Number(item.price).toFixed(2)}
                            </span>
                        </div>
                        <span className="text-white font-semibold text-sm shrink-0">
                            ${(Number(item.price) * item.quantity).toFixed(2)}
                        </span>
                    </div>
                ))}

                {items.length === 0 && (
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Package className="w-4 h-4" />
                        No items found for this order.
                    </div>
                )}
            </div>

            {/* ── Footer: price breakdown + total ── */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-t border-white/10 bg-white/[0.02]">
                <div className="flex items-center gap-4 text-gray-500 text-xs">
                    <span>{totalItems} {totalItems === 1 ? "item" : "items"}</span>
                    <span>Shipping ${Number(order.shipping_price).toFixed(2)}</span>
                    <span>Tax ${Number(order.tax_price).toFixed(2)}</span>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-gray-400 text-xs">Total</span>
                    <span className="text-white font-bold text-lg">
                        ${Number(order.total_price).toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    )
}
