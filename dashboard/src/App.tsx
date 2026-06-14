import { Navigate, Route, Routes } from "react-router-dom"
import { LoginPage } from "./pages/LoginPage"
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage"
import { ResetPasswordPage } from "./pages/ResetPasswordPage"
import { AdminProfilePage } from "./pages/AdminProfilePage"
import { DashboardPage } from "./pages/DashboardPage"
import { OrdersPage } from "./pages/OrdersPage"
import { ProductsPage } from "./pages/ProductsPage"
import { UsersPage } from "./pages/UsersPage"
import { DashboardLayout } from "./components/DashboardLayout"
import { useEffect } from "react"
import { useAuth } from "./hooks/use.auth.hook"

// ── Full page spinner shown while auth state is being determined ──────────────
const FullPageSpinner = () => (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-white/10 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-gray-400 text-sm">Loading...</p>
        </div>
    </div>
)

function App() {
    const { fetchAdminDetails, loading, isAuthenticated } = useAuth();
    // fetch admin details on mount to confirm auth state
    useEffect(() => {
        fetchAdminDetails();
    }, [])

    // ── Auth guard ────────────────────────────────────────────────────────────
    // Block ALL rendering until fetchAdminDetails completes.
    // isFetchingUser is true from the moment fetchAdminDetails starts
    // and flips to false in the finally block once the API responds.
    // Without this, routes render before we know if the user is logged in.
    if (loading) {
        return <FullPageSpinner />
    }

    return (
        <div>
            <Routes>
                {/* ── Guest-only routes ─────────────────────────────────────────
                    If the admin is already authenticated and visits /login or the
                    password pages, redirect them straight to the dashboard.
                    No point showing a login page to someone already logged in.  */}
                <Route path="/login" element={
                    isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
                } />
                <Route path="/password/forgot" element={
                    isAuthenticated ? <Navigate to="/" replace /> : <ForgotPasswordPage />
                } />
                <Route path="/password/reset/:token" element={
                    isAuthenticated ? <Navigate to="/" replace /> : <ResetPasswordPage />
                } />

                {/* ── Protected routes ──────────────────────────────────────────
                    Require authentication. The guard is applied once on the layout
                    route — if not logged in we redirect to /login, otherwise the
                    DashboardLayout (persistent sidebar) renders and the selected child
                    page shows on the right via <Outlet/>. */}
                <Route element={
                    isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" replace />
                }>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/users" element={<UsersPage />} />
                    <Route path="/profile" element={<AdminProfilePage />} />
                </Route>
            </Routes>
        </div>
    )
}

export default App