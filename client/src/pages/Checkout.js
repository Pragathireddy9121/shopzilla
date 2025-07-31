// File: src/pages/Checkout.jsx
import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Checkout = () => {
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const token = localStorage.getItem('token');

    // ✅ Ensure the product ID is preserved
    const orderItems = cart.map(item => ({
      product: item.product || item._id,  // Some may have "product", some "_id"
      name: item.name,
      price: item.price,
      quantity: item.quantity
    }));

    try {
      await axios.post(
        'http://localhost:5000/api/orders',
        { items: orderItems },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.removeItem('cart');
      alert('✅ Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      alert('❌ Failed to place order.');
      console.error('Order placement failed:', err.response?.data || err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h2>✅ Confirm Checkout</h2>
        <p>Click below to place your order.</p>
        <button
          onClick={handlePlaceOrder}
          style={{
            padding: '10px 20px',
            backgroundColor: '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          🛍️ Place Order
        </button>
      </div>
    </>
  );
};

export default Checkout;
