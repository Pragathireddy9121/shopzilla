import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import ProductList from './pages/ProductList';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import ProductDetails from './pages/ProductDetails';
import OrderDetails from './pages/OrderDetails';
import AdminDashboard from './pages/AdminDashboard';
import AdminOrders from './pages/AdminOrders';

// 🔒 Protect routes for logged-in users
const RequireAuth = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

// 🔐 Protect admin routes
const RequireAdmin = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.isAdmin ? children : <Navigate to="/products" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User Routes */}
        <Route path="/products" element={<RequireAuth><ProductList /></RequireAuth>} />
        <Route path="/product-details" element={<RequireAuth><ProductDetails /></RequireAuth>} />
        <Route path="/cart" element={<RequireAuth><Cart /></RequireAuth>} />
        <Route path="/checkout" element={<RequireAuth><Checkout /></RequireAuth>} />
        <Route path="/orders" element={<RequireAuth><OrderHistory /></RequireAuth>} />
        <Route path="/order-details" element={<RequireAuth><OrderDetails /></RequireAuth>} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/product/:id" element={<ProductDetails />} />

 

        {/* Admin Routes */}
        <Route path="/admin" element={<RequireAuth><RequireAdmin><AdminDashboard /></RequireAdmin></RequireAuth>} />
        <Route path="/admin/orders" element={<RequireAuth><RequireAdmin><AdminOrders /></RequireAdmin></RequireAuth>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
