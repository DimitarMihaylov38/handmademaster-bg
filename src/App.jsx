import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import Masters from './pages/Masters'
import MasterDetails from './pages/MasterDetails'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import CreateProduct from './pages/CreateProduct'
import EditProduct from './pages/EditProduct'
import Favorites from './pages/Favorites'
import NotFound from './pages/NotFound'
import Header from './components/Header'

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/products" element={<Products />} />
        <Route path="/products/:productId" element={<ProductDetails />} />
        <Route path="/products/create" element={<CreateProduct />} />
        <Route path="/products/:productId/edit" element={<EditProduct />} />

        <Route path="/masters" element={<Masters />} />
        <Route path="/masters/:masterId" element={<MasterDetails />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/favorites" element={<Favorites />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
