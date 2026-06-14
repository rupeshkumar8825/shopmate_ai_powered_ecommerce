// Sidebar — always visible on the left of the dashboard. Holds the primary navigation
// (Dashboard, Orders, Products, Users, Profile) plus the logged-in admin and a logout
// button. The actual page content is rendered to the right of this via <Outlet/> in
// the DashboardLayout.

import { NavLink, useNavigate } from "react-router-dom"
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    Users,
    UserCircle,
    LogOut,
    ShieldCheck,
} from "lucide-react"
import { useAuth } from "../hooks/use.auth.hook"

// `end` on the dashboard link so "/" isn't marked active on every nested route
const NAV_ITEMS = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/orders", label: "Orders", icon: ShoppingBag, end: false },
    { to: "/products", label: "Products", icon: Package, end: false },
    { to: "/users", label: "Users", icon: Users, end: false },
    { to: "/profile", label: "Profile", icon: UserCircle, end: false },
]

export const Sidebar = () => {
    const navigate = useNavigate()
    const { user, logoutAdmin } = useAuth()

    const handleLogout = async () => {
        await logoutAdmin()
        navigate("/login")
    }

    return (
        <aside className="w-64 shrink-0 sticky top-0 h-screen bg-component-background-500 border-r border-white/10 flex flex-col">

            {/* ── Brand ── */}
            <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
                <div className="bg-blue-600/15 border border-blue-500/30 rounded-xl p-2">
                    <ShieldCheck className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex flex-col leading-tight">
                    <span className="text-white font-bold text-lg">ShopMate</span>
                    <span className="text-gray-500 text-xs">Admin Panel</span>
                </div>
            </div>

            {/* ── Navigation ── */}
            <nav className="flex-1 flex flex-col gap-1 px-3 py-4 overflow-y-auto">
                {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={end}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 ${
                                isActive
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                            }`
                        }
                    >
                        <Icon className="w-5 h-5 shrink-0" />
                        {label}
                    </NavLink>
                ))}
            </nav>

            {/* ── Account + logout ── */}
            <div className="px-3 py-4 border-t border-white/10 flex flex-col gap-3">
                {user && (
                    <div className="flex items-center gap-3 px-3">
                        <div className="w-9 h-9 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-white text-sm font-medium truncate">{user.name}</span>
                            <span className="text-gray-500 text-xs truncate">{user.email}</span>
                        </div>
                    </div>
                )}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors duration-200"
                >
                    <LogOut className="w-5 h-5 shrink-0" />
                    Logout
                </button>
            </div>
        </aside>
    )
}
