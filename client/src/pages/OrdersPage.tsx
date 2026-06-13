// My Orders page — heading, status filter row and the filtered list of the user's orders

import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Loader2, Package } from "lucide-react"
import { useOrder } from "../hooks/useOrder"
import { OrderCardComponent } from "../components/Orders/OrderCardComponent"

// ── Filters ───────────────────────────────────────────────────────────────────
// "All" is a UI-only bucket; the rest mirror the backend OrderStatus enum
const ORDER_FILTERS = ["All", "Processing", "Shipped", "Delivered", "Cancelled"] as const
type OrderFilter = (typeof ORDER_FILTERS)[number]

export const OrdersPage = () => {
    // ── local state ──
    const [activeFilter, setActiveFilter] = useState<OrderFilter>("All")

    // ── custom hook functions / state ──
    const { orderList, fetchingOrders, fetchMyOrders } = useOrder()

    // ── inbuilt hooks ──
    const navigate = useNavigate()

    // fetch the current user's orders on mount
    useEffect(() => {
        fetchMyOrders()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // ── derived: orders matching the active filter, newest first ──
    const filteredOrders = useMemo(() => {
        const sorted = [...orderList].sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        if (activeFilter === "All") return sorted
        return sorted.filter((order) => order.order_status === activeFilter)
    }, [orderList, activeFilter])

    return (
        <div className="min-h-screen bg-background-500">
            <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-8">

                {/* ── Page heading ── */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-white text-4xl font-bold">My Orders</h1>
                    <p className="text-gray-400 text-sm">
                        Track and review the orders you've placed.
                    </p>
                </div>

                {/* ── Filter row ── */}
                <div className="flex flex-wrap items-center gap-2">
                    {ORDER_FILTERS.map((filter) => {
                        const isActive = filter === activeFilter
                        return (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 border ${
                                    isActive
                                        ? "bg-blue-600 border-blue-600 text-white"
                                        : "bg-component-background-500 border-white/10 text-gray-400 hover:text-white hover:border-white/20"
                                }`}
                            >
                                {filter}
                            </button>
                        )
                    })}
                </div>

                {/* ── Content ── */}
                {fetchingOrders ? (
                    // Loading state
                    <div className="flex flex-col items-center justify-center gap-3 py-24 text-gray-400">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        <span className="text-sm">Loading your orders…</span>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    // Empty state
                    <div className="flex flex-col items-center gap-6 text-center py-24 px-6">
                        <div className="bg-component-background-500 border border-white/10 rounded-full p-8">
                            <Package className="w-16 h-16 text-gray-500" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h2 className="text-white text-2xl font-bold">
                                {activeFilter === "All"
                                    ? "No orders yet"
                                    : `No ${activeFilter.toLowerCase()} orders`}
                            </h2>
                            <p className="text-gray-400 text-sm max-w-xs">
                                {activeFilter === "All"
                                    ? "You haven't placed any orders yet. Browse our products and find something you love."
                                    : "Try a different filter to see more of your orders."}
                            </p>
                        </div>
                        {activeFilter === "All" && (
                            <button
                                onClick={() => navigate("/products")}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors duration-200"
                            >
                                Browse Products
                            </button>
                        )}
                    </div>
                ) : (
                    // Orders list
                    <div className="flex flex-col gap-5">
                        {filteredOrders.map((order) => (
                            <OrderCardComponent key={order.id} order={order} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
