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

function App() {

  return (
    <>
      <BrowserRouter>
        <NavbarLayout></NavbarLayout>
        <SideBarLayout></SideBarLayout>
        <SearchOverLayLayout></SearchOverLayLayout>
        <CartSidebar></CartSidebar>
        <ProfilePanelLayout></ProfilePanelLayout>
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
