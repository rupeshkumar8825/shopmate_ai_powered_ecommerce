import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { ProductDetailsPage } from './pages/ProductDetailsPage'
import { ProductPage } from './pages/ProductsPage'
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

function App() {
  const {fetchUserDetails, isAuthenticated, user } = useAuth()
  // whenever this component renders then we will try to fetch the user details 
  useEffect(() => {
    console.log("isauthenticated value checkpoint - 1 \n", isAuthenticated)
    fetchUserDetails()
    console.log("isauthenticated value checkpoint - 2 \n", isAuthenticated)
    // console.log("the value of the user is as follows \n", user)
  }, [])

  useEffect(() => {
    console.log("it seems that the user has changed. The updated user details are : \n", user)
    console.log("isauthenticated value checkpoint - 3 \n", isAuthenticated)
  }, [user])

  useEffect(() => {
    console.log("isauthenticated value checkpoint - 4 \n", isAuthenticated)
  }, [isAuthenticated])


  // check if the app is fetching the user and user is null 
  // TODO : add logic for adding a loading until the user details are being fetched
  if(isAuthenticated && !user){
    // this means that the app is fetching the details of the user
  }

  return (
    <>
      <BrowserRouter>
        <NavbarLayout></NavbarLayout>
        <SideBarLayout></SideBarLayout>
        <SearchOverLayLayout></SearchOverLayLayout>
        <CartSidebar></CartSidebar>
        <ProfilePanelLayout></ProfilePanelLayout>
        <LoginModalLayout></LoginModalLayout>
        <Routes>
          <Route path='/' element={<HomePage></HomePage>} />
          <Route path='/password/reset/:token' element={<HomePage></HomePage>} />
          <Route path='/products' element={<ProductPage></ProductPage>} />
          <Route path='/product/:id' element={<ProductDetailsPage></ProductDetailsPage>} />
          <Route path='/cart' element={<CartPage></CartPage>} />
          <Route path='/orders' element={<OrdersPage></OrdersPage>} />
          <Route path='/payment' element={<PaymentsPage></PaymentsPage>} />
          <Route path='/about' element={<AboutPage></AboutPage>} />
          <Route path='/faq' element={<FAQsPage></FAQsPage>} />
          <Route path='/contact' element={<ContactPage></ContactPage>} />
          <Route path='*' element={<NotFoundPage></NotFoundPage>} />
        </Routes>
      
      </BrowserRouter>
    </>
  )
}

export default App
