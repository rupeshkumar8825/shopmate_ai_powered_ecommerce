import { Navigate, Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { ProductDetailsPage } from './pages/ProductDetailsPage'
import { ProductsPage } from './pages/ProductsPage'
import { CartPage } from './pages/CartPage'
import { OrdersPage } from './pages/OrdersPage'
import { PaymentsPage } from './pages/PaymentsPage'
import { AboutPage } from './pages/AboutPage'
import { FAQsPage } from './pages/FAQPage'
import { ContactPage } from './pages/ContactPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { NavbarLayout } from './components/Layout/NavbarLayout'
import { SideBarLayout } from './components/Layout/SideBarLayout'
import { SearchOverLayLayout } from './components/Layout/SearchOverLayLayout'
import { CartSidebar } from './components/Layout/CartSidebar'
import { ProfilePanelLayout } from './components/Layout/ProfilePanelLayout'
import { LoginModalLayout } from './components/Layout/LoginModalLayout'
import { useEffect } from 'react'
import { useAuth } from './hooks/useAuth'
import { useProduct } from './hooks/useProduct'

// ── Full page spinner shown while auth state is being determined ──────────────
const FullPageSpinner = () => (
    <div className="min-h-screen bg-background-500 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-white/10 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-gray-400 text-sm">Loading...</p>
        </div>
    </div>
)

function App() {
    const { fetchUserDetails, isFetchingUser, isAuthenticated } = useAuth();
    const { fetchAllProducts, searchFilter } = useProduct();

    // fetch user details on mount to confirm auth state
    useEffect(() => {
        fetchUserDetails()
    }, [])

    // fetch all products on mount for the home and products pages
    useEffect(() => {
        fetchAllProducts(searchFilter);
    }, [])

    // ── Auth guard ────────────────────────────────────────────────────────────
    // Block ALL rendering until we know whether the user is logged in or not.
    // Without this, React renders the routes synchronously before fetchUserDetails
    // completes, causing a flash of wrong content or unauthenticated access.
    // isFetchingUser is true from the moment fetchUserDetails starts until
    // the API responds (set in the finally block of the hook).
    if (isFetchingUser) {
        return <FullPageSpinner />
    }

    return (
        <>
            <NavbarLayout />
            <SideBarLayout />
            <SearchOverLayLayout />
            <CartSidebar />
            <ProfilePanelLayout />
            <LoginModalLayout />

            <Routes>
                {/* ── Public routes — accessible to everyone ── */}
                <Route path='/' element={<HomePage />} />
                <Route path='/password/reset/:token' element={<HomePage />} />
                <Route path='/products' element={<ProductsPage />} />
                <Route path='/products/:id' element={<ProductDetailsPage />} />
                <Route path='/about' element={<AboutPage />} />
                <Route path='/faq' element={<FAQsPage />} />
                <Route path='/contact' element={<ContactPage />} />

                {/* ── Protected routes — redirect to "/" if not authenticated ──
                    Note: redirecting to "/" because your login is handled via
                    LoginModalLayout (a modal overlay on the homepage) and not
                    a separate /login page. If you add a dedicated login page
                    later, change the Navigate target to "/login" instead.     */}
                <Route path='/cart' element={
                    isAuthenticated ? <CartPage /> : <Navigate to="/" replace />
                } />
                <Route path='/orders' element={
                    isAuthenticated ? <OrdersPage /> : <Navigate to="/" replace />
                } />
                <Route path='/payment' element={
                    isAuthenticated ? <PaymentsPage /> : <Navigate to="/" replace />
                } />

                {/* ── 404 ── */}
                <Route path='*' element={<NotFoundPage />} />
            </Routes>
        </>
    )
}

export default App