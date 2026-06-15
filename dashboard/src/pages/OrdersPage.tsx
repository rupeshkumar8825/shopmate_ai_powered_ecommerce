// Orders management page (admin).
// Fetches every order via the useOrder hook, lets the admin filter the list by order
// status (client-side, since the backend `getall` route returns all orders at once),
// and renders the result as cards.

import { useEffect, useMemo, useState } from "react"
import { Check, Loader2, MapPin, PackageX, Phone, RefreshCw, Trash2, X } from "lucide-react"
import { useOrder } from "../hooks/use.order.hook"
import type { OrderDetails, OrderStatus } from "../types/order.types"

// the filter dropdown options — "all" plus every order lifecycle status
type StatusFilter = "all" | OrderStatus
const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
    { value: "all", label: "All statuses" },
    { value: "Processing", label: "Processing" },
    { value: "Shipped", label: "Shipped" },
    { value: "Delivered", label: "Delivered" },
    { value: "Cancelled", label: "Cancelled" },
]

// tinted badge styles per status, matching the dashboard's translucent-pill convention
const STATUS_BADGE_STYLES: Record<OrderStatus, string> = {
    Processing: "bg-amber-500/10 border-amber-500/30 text-amber-400",
    Shipped: "bg-blue-500/10 border-blue-500/30 text-blue-400",
    Delivered: "bg-green-500/10 border-green-500/30 text-green-400",
    Cancelled: "bg-red-500/10 border-red-500/30 text-red-400",
}

// the statuses an admin can set an order to (the badge map keys are the source of truth)
const ORDER_STATUSES = Object.keys(STATUS_BADGE_STYLES) as OrderStatus[]

// short, human-friendly date e.g. "Jun 14, 2026"
const formatDate = (date: Date | string): string =>
    new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })

// count of units across all line items of an order
const totalItems = (order: OrderDetails): number =>
    order.orderItemList.reduce((sum, item) => sum + item.quantity, 0)


export const OrdersPage = () => {
    // ── custom hook ──
    const { orders, orderOperationInProgress, error, fetchAllOrders, updateOrderStatus, deleteOrder } = useOrder()

    // ── local state ──
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
    // the order currently being updated/deleted — used to scope the spinner/disabled
    // state to a single card (the hook's orderOperationInProgress is global)
    const [pendingOrderId, setPendingOrderId] = useState<string | null>(null)
    // the order whose delete button has been clicked and is awaiting confirmation
    const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null)

    // change an order's status (no-op if the status is unchanged)
    const handleStatusChange = async (order: OrderDetails, nextStatus: OrderStatus) => {
        if (nextStatus === order.order_status) return
        setPendingOrderId(order.id)
        await updateOrderStatus({ orderId: order.id, orderStatus: nextStatus })
        setPendingOrderId(null)
    }

    // delete an order after the inline confirmation has been accepted
    const handleDelete = async (orderId: string) => {
        setPendingOrderId(orderId)
        await deleteOrder({ orderId })
        setPendingOrderId(null)
        setConfirmingDeleteId(null)
    }

    // load every order once on mount
    useEffect(() => {
        fetchAllOrders()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // client-side filter over the fetched orders
    const visibleOrders = useMemo(() => {
        if (statusFilter === "all") return orders
        return orders.filter((order) => order.order_status === statusFilter)
    }, [orders, statusFilter])

    // first load (no data yet) → full-page spinner
    const isInitialLoading = orderOperationInProgress && orders.length === 0

    return (
        <div className="px-8 py-10 flex flex-col gap-6">
            {/* ── Header ── */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-white text-4xl font-bold">Orders</h1>
                    <p className="text-gray-400 text-sm">View and manage all customer orders.</p>
                </div>
                <button
                    type="button"
                    onClick={() => fetchAllOrders()}
                    disabled={orderOperationInProgress}
                    className="bg-component-background-500 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 text-gray-300 text-sm rounded-xl px-4 py-2.5 flex items-center gap-2 transition-colors duration-200"
                >
                    <RefreshCw className={`w-4 h-4 ${orderOperationInProgress ? "animate-spin" : ""}`} />
                    Refresh
                </button>
            </div>

            {/* ── Filter ── */}
            <div className="flex items-center gap-3">
                <label className="text-gray-400 text-xs font-medium uppercase tracking-wider">Status</label>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                    className="bg-background-500 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors duration-200"
                >
                    {STATUS_FILTERS.map((option) => (
                        <option key={option.value} value={option.value} className="bg-background-500">
                            {option.label}
                        </option>
                    ))}
                </select>
                {!isInitialLoading && (
                    <span className="text-gray-500 text-sm">
                        {visibleOrders.length} {visibleOrders.length === 1 ? "order" : "orders"}
                    </span>
                )}
            </div>

            {/* ── Error ── */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
                    {error}
                </div>
            )}

            {/* ── Content ── */}
            {isInitialLoading ? (
                <div className="flex items-center justify-center gap-2 text-gray-400 py-20">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Loading orders…
                </div>
            ) : visibleOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 text-gray-500 py-20">
                    <PackageX className="w-10 h-10" />
                    <p className="text-sm">
                        {orders.length === 0
                            ? "No orders have been placed yet."
                            : "No orders match the selected status."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {visibleOrders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-component-background-500 border border-white/10 rounded-2xl p-5 flex flex-col gap-4"
                        >
                            {/* top row: id + status */}
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-white text-sm font-semibold font-mono">
                                    #{order.id.slice(0, 8)}
                                </span>
                                <span
                                    className={`text-xs font-medium rounded-full border px-2.5 py-1 ${STATUS_BADGE_STYLES[order.order_status]}`}
                                >
                                    {order.order_status}
                                </span>
                            </div>

                            {/* customer + item count */}
                            <div className="flex flex-col gap-1">
                                <span className="text-gray-300 text-sm">
                                    {order.shippingInfoList?.full_name ?? "Unknown customer"}
                                </span>
                                <span className="text-gray-500 text-xs">
                                    {totalItems(order)} {totalItems(order) === 1 ? "item" : "items"}
                                </span>
                            </div>

                            {/* shipping address */}
                            {order.shippingInfoList ? (
                                <div className="flex flex-col gap-1.5 text-xs">
                                    <div className="flex items-start gap-2 text-gray-400">
                                        <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-gray-500" />
                                        <span className="flex flex-col gap-0.5">
                                            <span>{order.shippingInfoList.address}</span>
                                            <span>
                                                {order.shippingInfoList.city}, {order.shippingInfoList.state},{" "}
                                                {order.shippingInfoList.country} - {order.shippingInfoList.pincode}
                                            </span>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Phone className="w-3.5 h-3.5 shrink-0 text-gray-500" />
                                        <span>{order.shippingInfoList.phone}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-gray-600 text-xs">
                                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                                    <span>No shipping address on file</span>
                                </div>
                            )}

                            {/* bottom row: total + payment + date */}
                            <div className="flex items-end justify-between gap-3 border-t border-white/5 pt-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-white text-lg font-bold">
                                        ${Number(order.total_price).toFixed(2)}
                                    </span>
                                    <span
                                        className={`text-xs font-medium ${order.paid_at ? "text-green-400" : "text-gray-500"}`}
                                    >
                                        {order.paid_at ? "Paid" : "Unpaid"}
                                    </span>
                                </div>
                                <span className="text-gray-500 text-xs">{formatDate(order.created_at)}</span>
                            </div>

                            {/* actions: change status + delete */}
                            <div className="flex items-center gap-2 border-t border-white/5 pt-4">
                                <select
                                    value={order.order_status}
                                    disabled={pendingOrderId === order.id}
                                    onChange={(e) => handleStatusChange(order, e.target.value as OrderStatus)}
                                    className="flex-1 bg-background-500 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                >
                                    {ORDER_STATUSES.map((status) => (
                                        <option key={status} value={status} className="bg-background-500">
                                            {status}
                                        </option>
                                    ))}
                                </select>

                                {pendingOrderId === order.id ? (
                                    <div className="flex items-center justify-center w-9 h-9 text-gray-400">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    </div>
                                ) : confirmingDeleteId === order.id ? (
                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            title="Confirm delete"
                                            onClick={() => handleDelete(order.id)}
                                            className="flex items-center justify-center w-9 h-9 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl transition-colors duration-200"
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            title="Cancel"
                                            onClick={() => setConfirmingDeleteId(null)}
                                            className="flex items-center justify-center w-9 h-9 bg-component-background-500 hover:bg-white/5 border border-white/10 text-gray-400 rounded-xl transition-colors duration-200"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        title="Delete order"
                                        onClick={() => setConfirmingDeleteId(order.id)}
                                        className="flex items-center justify-center w-9 h-9 bg-component-background-500 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-gray-400 hover:text-red-400 rounded-xl transition-colors duration-200"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
