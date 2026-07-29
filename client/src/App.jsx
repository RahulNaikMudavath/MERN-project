import React from 'react'
import Navbar from './components/Navbar'
import { Route,Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import { Toaster } from 'react-hot-toast'
import Footer from './components/Footer'
import { useAppContext } from './context/AppContext'
import Login from './components/Login'
import Allproducts from './pages/Allproducts'
import Productcategory from './pages/Productcategory'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import AddAddress from './pages/AddAddress'
import MyOrders from './pages/MyOrders'
import Sellerlogin from './components/Seller/Sellerlogin'
import SellerLayout from './pages/Seller/SellerLayout'
import AddProduct from './pages/Seller/AddProduct'
import ProductList from './pages/Seller/ProductList'
import Orders from './pages/Seller/Orders'

const App = () => {

  const isSellerPath = useLocation().pathname.includes('seller')
  const {showuserlogin , isSeller} = useAppContext();

  return (
    <div className='text-default min-h-screen text-gray-700 bg-white'>
      {isSellerPath ? null :<Navbar /> }
      {showuserlogin ? <Login/> : null}
      <Toaster/>
      
      <div className={`${isSellerPath ? " " : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/products' element={<Allproducts/>} />
          <Route path='/products/:category' element={<Productcategory/>} />
          <Route path='/products/:category/:id' element={<ProductDetails/>} />
          <Route path='/cart' element={<Cart/>} />
          <Route path='/add-address' element={<AddAddress/>} />
          <Route path='/my-orders' element={<MyOrders/>} />
          <Route path='/seller' element={isSeller ? <SellerLayout/> : <Sellerlogin/> }>
          <Route path='product-list' element={<ProductList/>} />
          <Route path='orders' element={<Orders/>} />
          <Route index element={isSeller ? <AddProduct/> : null } />
          </Route>
        </Routes>
      </div>
            {!isSellerPath && <Footer/>}

    </div>
  )
}

export default App
