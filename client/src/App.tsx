import { Route, Routes } from 'react-router-dom'
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

function App() {
  const { fetchUserDetails } = useAuth();
  const { fetchAllProducts, searchFilter } = useProduct();

  // whenever this component renders then we will try to fetch the user details 
  useEffect(() => {
    fetchUserDetails()
  }, [])

  // whenever the component renders then we will try to fetch the 
  // list of all products 
  useEffect(() => {
    fetchAllProducts(searchFilter);
  }, [])





  // TODO : add logic to add loading component until the user details are being fetched
  // if(isAuthenticated && !user){
  //   // this means that the app is fetching the details of the user
  // }

  return (
    <>
      <NavbarLayout></NavbarLayout>
      <SideBarLayout></SideBarLayout>
      <SearchOverLayLayout></SearchOverLayLayout>
      <CartSidebar></CartSidebar>
      <ProfilePanelLayout></ProfilePanelLayout>
      <LoginModalLayout></LoginModalLayout>
      <Routes>
        <Route path='/' element={<HomePage></HomePage>} />
        <Route path='/password/reset/:token' element={<HomePage></HomePage>} />
        <Route path='/products' element={<ProductsPage></ProductsPage>} />
        <Route path='/products/:id' element={<ProductDetailsPage></ProductDetailsPage>} />
        <Route path='/cart' element={<CartPage></CartPage>} />
        <Route path='/orders' element={<OrdersPage></OrdersPage>} />
        <Route path='/payment' element={<PaymentsPage></PaymentsPage>} />
        <Route path='/about' element={<AboutPage></AboutPage>} />
        <Route path='/faq' element={<FAQsPage></FAQsPage>} />
        <Route path='/contact' element={<ContactPage></ContactPage>} />
        <Route path='*' element={<NotFoundPage></NotFoundPage>} />
      </Routes>
      
    </>
  )
}

export default App
