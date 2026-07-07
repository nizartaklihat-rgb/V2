import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Checkout from './pages/Checkout'
import ThankYou from './pages/ThankYou'
import Admin from './pages/Admin'
import AdminLogin from './pages/AdminLogin'
import Nav from './components/Nav'
import CartDrawer from './components/CartDrawer'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-bone text-ink grain">
      <Nav />
      <CartDrawer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <Footer />
    </div>
  )
}
