// Dashboard overview page (admin).
// The single landing page for the admin: it pulls the aggregated store statistics from the
// backend (GET /v1/admin/dashboard-stats via the useDashboard hook) and lays them out as
// summary cards, a 12-month revenue trend, an order-status breakdown, the best sellers and
// the products that are running low on stock.
//
// No charting library is used — the revenue trend is a plain CSS bar chart driven off the
// monthly series, which keeps the dashboard dependency-free.

import { useEffect } from "react"
import {
    ArrowDownRight,
    ArrowUpRight,
    DollarSign,
    Loader2,
    Package,
    PackageX,
    RefreshCw,
    ShoppingCart,
    TrendingUp,
    Trophy,
    Users,
} from "lucide-react"
import { useDashboard } from "../hooks/use.dashboard.hook"
import type { OrderStatusCounts } from "../recoil/atoms/dashboard.atom"

// ── formatting helpers ────────────────────────────────────────────────────────
// money with thousands separators, e.g. $12,480.50 (matches the `$` + 2dp used elsewhere)
const formatCurrency = (value: number | string): string =>
    `$${Number(value).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`

// compact whole numbers, e.g. 1,204
const formatCount = (value: number): string => value.toLocaleString("en-US")

// short month label for the trend chart, e.g. "Jun"
const formatMonth = (date: Date | string): string =>
    new Date(date).toLocaleDateString("en-US", { month: "short" })

// percentage change of `current` over `previous`; null when there's no baseline to compare to
const percentChange = (current: number, previous: number): number | null => {
    if (previous === 0) return null
    return ((current - previous) / previous) * 100
}


// ── small presentational pieces ───────────────────────────────────────────────

// a single headline metric card with an icon and an optional trend delta
const StatCard = ({
    label,
    value,
    icon,
    delta,
    deltaLabel,
}: {
    label: string
    value: string
    icon: React.ReactNode
    delta?: number | null
    deltaLabel?: string
}) => {
    const isUp = (delta ?? 0) >= 0
    return (
        <div className="bg-component-background-500 border border-white/10 rounded-2xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">{label}</span>
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                    {icon}
                </div>
            </div>
            <span className="text-white text-2xl font-bold">{value}</span>
            {delta !== undefined && delta !== null && (
                <span
                    className={`text-xs font-medium flex items-center gap-1 ${
                        isUp ? "text-green-400" : "text-red-400"
                    }`}
                >
                    {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    {Math.abs(delta).toFixed(1)}%
                    {deltaLabel && <span className="text-gray-500 font-normal">{deltaLabel}</span>}
                </span>
            )}
        </div>
    )
}

// a labelled section wrapper (header + card body)
const Panel = ({
    title,
    icon,
    children,
    className = "",
}: {
    title: string
    icon: React.ReactNode
    children: React.ReactNode
    className?: string
}) => (
    <div className={`bg-component-background-500 border border-white/10 rounded-2xl p-5 flex flex-col gap-4 ${className}`}>
        <div className="flex items-center gap-2 text-gray-300">
            {icon}
            <h2 className="text-sm font-semibold">{title}</h2>
        </div>
        {children}
    </div>
)

// the order-status breakdown uses a fixed set of statuses, each with its own colour
const STATUS_META: { key: keyof OrderStatusCounts; label: string; dot: string; bar: string }[] = [
    { key: "Processing", label: "Processing", dot: "bg-amber-400", bar: "bg-amber-400/70" },
    { key: "Shipped", label: "Shipped", dot: "bg-blue-400", bar: "bg-blue-400/70" },
    { key: "Delivered", label: "Delivered", dot: "bg-green-400", bar: "bg-green-400/70" },
    { key: "Cancelled", label: "Cancelled", dot: "bg-red-400", bar: "bg-red-400/70" },
]


export const DashboardPage = () => {
    // ── custom hook ──
    const {
        isDashboardRelatedWorkInProgress,
        error,
        allTimeRevenue,
        todaysRevenue,
        yesterdayRevenue,
        revenueOfLastMonth,
        lastMonthRevenue,
        monthlyRevenueResponse,
        totalPaidOrdersCount,
        totalUsersCount,
        newUserRegisteredThisMonth,
        orderStatusCounts,
        topSellingProductDetails,
        lowStockProductListQueryResponse,
        fetchDashboardStats,
    } = useDashboard()

    // load the stats once on mount
    useEffect(() => {
        fetchDashboardStats()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // first load (no data yet) → full section spinner
    const isInitialLoading = isDashboardRelatedWorkInProgress && allTimeRevenue === 0 && totalPaidOrdersCount === 0

    // trend chart: the tallest bar is scaled to 100% so the series is always readable
    const maxMonthlyRevenue = monthlyRevenueResponse.reduce(
        (max, entry) => Math.max(max, Number(entry.revenue)),
        0,
    )

    // order-status totals (used to scale the status bars and show a grand total)
    const totalOrdersByStatus = orderStatusCounts
        ? STATUS_META.reduce((sum, { key }) => sum + orderStatusCounts[key], 0)
        : 0

    // day-over-day / month-over-month deltas for the stat cards
    const revenueDayDelta = percentChange(todaysRevenue, yesterdayRevenue)
    const revenueMonthDelta = percentChange(revenueOfLastMonth, lastMonthRevenue)

    return (
        <div className="px-8 py-10 flex flex-col gap-6">
            {/* ── Header ── */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-white text-4xl font-bold">Dashboard</h1>
                    <p className="text-gray-400 text-sm">Welcome back — here's an overview of your store.</p>
                </div>
                <button
                    type="button"
                    onClick={() => fetchDashboardStats()}
                    disabled={isDashboardRelatedWorkInProgress}
                    className="bg-component-background-500 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 text-gray-300 text-sm rounded-xl px-4 py-2.5 flex items-center gap-2 transition-colors duration-200"
                >
                    <RefreshCw className={`w-4 h-4 ${isDashboardRelatedWorkInProgress ? "animate-spin" : ""}`} />
                    Refresh
                </button>
            </div>

            {/* ── Error ── */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
                    {error}
                </div>
            )}

            {isInitialLoading ? (
                <div className="flex items-center justify-center gap-2 text-gray-400 py-20">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Loading dashboard…
                </div>
            ) : (
                <>
                    {/* ── Summary cards ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                        <StatCard
                            label="All-time revenue"
                            value={formatCurrency(allTimeRevenue)}
                            icon={<DollarSign className="w-4.5 h-4.5" />}
                        />
                        <StatCard
                            label="Today's revenue"
                            value={formatCurrency(todaysRevenue)}
                            icon={<TrendingUp className="w-4.5 h-4.5" />}
                            delta={revenueDayDelta}
                            deltaLabel="vs yesterday"
                        />
                        <StatCard
                            label="Paid orders"
                            value={formatCount(totalPaidOrdersCount)}
                            icon={<ShoppingCart className="w-4.5 h-4.5" />}
                        />
                        <StatCard
                            label="Total users"
                            value={formatCount(totalUsersCount)}
                            icon={<Users className="w-4.5 h-4.5" />}
                            delta={percentChange(newUserRegisteredThisMonth, totalUsersCount - newUserRegisteredThisMonth)}
                            deltaLabel="new this month"
                        />
                    </div>

                    {/* ── Revenue trend + order status ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* monthly revenue bar chart (last 12 months) */}
                        <Panel
                            title="Revenue (last 12 months)"
                            icon={<TrendingUp className="w-4 h-4" />}
                            className="lg:col-span-2"
                        >
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500">This month</span>
                                <span className="text-white font-medium">
                                    {formatCurrency(revenueOfLastMonth)}
                                </span>
                                {revenueMonthDelta !== null && (
                                    <span
                                        className={`flex items-center gap-1 font-medium ${
                                            revenueMonthDelta >= 0 ? "text-green-400" : "text-red-400"
                                        }`}
                                    >
                                        {revenueMonthDelta >= 0 ? (
                                            <ArrowUpRight className="w-3.5 h-3.5" />
                                        ) : (
                                            <ArrowDownRight className="w-3.5 h-3.5" />
                                        )}
                                        {Math.abs(revenueMonthDelta).toFixed(1)}% vs last month
                                    </span>
                                )}
                            </div>

                            {monthlyRevenueResponse.length === 0 ? (
                                <p className="text-gray-500 text-sm py-10 text-center">No revenue data yet.</p>
                            ) : (
                                <div className="flex items-end gap-2 h-48 pt-2">
                                    {monthlyRevenueResponse.map((entry) => {
                                        const revenue = Number(entry.revenue)
                                        const heightPct =
                                            maxMonthlyRevenue > 0 ? (revenue / maxMonthlyRevenue) * 100 : 0
                                        return (
                                            <div
                                                key={new Date(entry.month).toISOString()}
                                                className="flex-1 flex flex-col items-center gap-2 group"
                                            >
                                                <div className="w-full flex-1 flex items-end">
                                                    <div
                                                        className="w-full bg-blue-500/70 group-hover:bg-blue-400 rounded-t-md transition-all duration-200 relative"
                                                        style={{ height: `${Math.max(heightPct, 2)}%` }}
                                                        title={formatCurrency(revenue)}
                                                    />
                                                </div>
                                                <span className="text-gray-500 text-[10px]">
                                                    {formatMonth(entry.month)}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </Panel>

                        {/* order status breakdown */}
                        <Panel title="Orders by status" icon={<ShoppingCart className="w-4 h-4" />}>
                            {!orderStatusCounts || totalOrdersByStatus === 0 ? (
                                <p className="text-gray-500 text-sm py-10 text-center">No orders yet.</p>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {STATUS_META.map(({ key, label, dot, bar }) => {
                                        const count = orderStatusCounts[key]
                                        const pct = totalOrdersByStatus > 0 ? (count / totalOrdersByStatus) * 100 : 0
                                        return (
                                            <div key={key} className="flex flex-col gap-1.5">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="flex items-center gap-2 text-gray-300">
                                                        <span className={`w-2 h-2 rounded-full ${dot}`} />
                                                        {label}
                                                    </span>
                                                    <span className="text-gray-400 font-medium">{formatCount(count)}</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${bar} transition-all duration-200`}
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </Panel>
                    </div>

                    {/* ── Top sellers + low stock ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* best selling products */}
                        <Panel title="Top selling products" icon={<Trophy className="w-4 h-4" />}>
                            {topSellingProductDetails.length === 0 ? (
                                <p className="text-gray-500 text-sm py-10 text-center">No sales recorded yet.</p>
                            ) : (
                                <div className="flex flex-col">
                                    {topSellingProductDetails.map((item, index) => (
                                        <div
                                            key={item.product?.id ?? `top-${index}`}
                                            className="flex items-center gap-3 py-3 border-b border-white/5 last:border-b-0"
                                        >
                                            <span className="text-gray-500 text-sm font-semibold w-5 shrink-0">
                                                {index + 1}
                                            </span>
                                            {item.product?.images?.[0]?.url ? (
                                                <img
                                                    src={item.product.images[0].url}
                                                    alt={item.product.name}
                                                    className="w-10 h-10 rounded-lg object-cover shrink-0"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 text-gray-500 flex items-center justify-center shrink-0">
                                                    <Package className="w-4 h-4" />
                                                </div>
                                            )}
                                            <div className="flex flex-col min-w-0 flex-1">
                                                <span className="text-white text-sm font-medium truncate">
                                                    {item.product?.name ?? "Unknown product"}
                                                </span>
                                                <span className="text-gray-500 text-xs truncate">
                                                    {item.product ? formatCurrency(item.product.price) : "—"}
                                                </span>
                                            </div>
                                            <span className="text-xs font-medium rounded-full border px-2.5 py-1 bg-green-500/10 border-green-500/30 text-green-400 shrink-0">
                                                {formatCount(item.quantitySold)} sold
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Panel>

                        {/* low stock products */}
                        <Panel title="Low on stock" icon={<PackageX className="w-4 h-4" />}>
                            {lowStockProductListQueryResponse.length === 0 ? (
                                <p className="text-gray-500 text-sm py-10 text-center">
                                    Everything is well stocked.
                                </p>
                            ) : (
                                <div className="flex flex-col">
                                    {lowStockProductListQueryResponse.map((product) => (
                                        <div
                                            key={product.id}
                                            className="flex items-center gap-3 py-3 border-b border-white/5 last:border-b-0"
                                        >
                                            {product.images?.[0]?.url ? (
                                                <img
                                                    src={product.images[0].url}
                                                    alt={product.name}
                                                    className="w-10 h-10 rounded-lg object-cover shrink-0"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 text-gray-500 flex items-center justify-center shrink-0">
                                                    <Package className="w-4 h-4" />
                                                </div>
                                            )}
                                            <div className="flex flex-col min-w-0 flex-1">
                                                <span className="text-white text-sm font-medium truncate">
                                                    {product.name}
                                                </span>
                                                <span className="text-gray-500 text-xs truncate">{product.category}</span>
                                            </div>
                                            <span
                                                className={`text-xs font-medium rounded-full border px-2.5 py-1 shrink-0 ${
                                                    product.stock === 0
                                                        ? "bg-red-500/10 border-red-500/30 text-red-400"
                                                        : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                                                }`}
                                            >
                                                {product.stock === 0 ? "Out of stock" : `${product.stock} left`}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Panel>
                    </div>
                </>
            )}
        </div>
    )
}
