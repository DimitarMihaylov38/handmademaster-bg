import Footer from './components/Footer'
import { Routes, Route } from 'react-router-dom'

import Header from './components/Header'

import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import Masters from './pages/Masters'
import MasterDetails from './pages/MasterDetails'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import CreateProduct from './pages/CreateProduct'
import EditProduct from './pages/EditProduct'
import Favorites from './pages/Favorites'
import NotFound from './pages/NotFound'

import AuthGuard from './guards/AuthGuard'
import GuestGuard from './guards/GuestGuard'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-200 text-slate-900">
      <Header />

      <main className="w-full flex-1">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/products" element={<Products />} />

          <Route
            path="/products/:productId"
            element={<ProductDetails />}
          />

          <Route
            path="/products/create"
            element={
              <AuthGuard>
                <CreateProduct />
              </AuthGuard>
            }
          />

          <Route
            path="/products/:productId/edit"
            element={
              <AuthGuard>
                <EditProduct />
              </AuthGuard>
            }
          />

          <Route path="/masters" element={<Masters />} />

          <Route
            path="/masters/:masterId"
            element={<MasterDetails />}
          />

          <Route
            path="/login"
            element={
              <GuestGuard>
                <Login />
              </GuestGuard>
            }
          />

          <Route
            path="/register"
            element={
              <GuestGuard>
                <Register />
              </GuestGuard>
            }
          />

          <Route
            path="/profile"
            element={
              <AuthGuard>
                <Profile />
              </AuthGuard>
            }
          />

          <Route
            path="/profile/edit"
            element={
              <AuthGuard>
                <EditProfile />
              </AuthGuard>
            }
          />

          <Route
            path="/favorites"
            element={
              <AuthGuard>
                <Favorites />
              </AuthGuard>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
