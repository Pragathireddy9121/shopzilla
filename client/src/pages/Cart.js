// File: src/pages/Cart.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(cart);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    setTotal(totalPrice);
  };

  const updateCart = (updatedCart) => {
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    loadCart();
  };

  const handleQuantityChange = (index, type) => {
    const updatedCart = [...cartItems];
    if (type === 'inc') {
      updatedCart[index].quantity += 1;
    } else if (type === 'dec' && updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
    }
    updateCart(updatedCart);
  };

  const handleDelete = (indexToRemove) => {
    const updatedCart = cartItems.filter((_, index) => index !== indexToRemove);
    updateCart(updatedCart);
  };

  const handleClearCart = () => {
    localStorage.removeItem('cart');
    loadCart();
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h2>🛒 Your Cart</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <ul>
              {cartItems.map((item, index) => (
                <li key={index} style={{ marginBottom: '15px' }}>
                  {item.name} - ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                  <button onClick={() => handleQuantityChange(index, 'dec')} style={buttonStyle}>➖</button>
                  <button onClick={() => handleQuantityChange(index, 'inc')} style={buttonStyle}>➕</button>
                  <button onClick={() => handleDelete(index)} style={deleteStyle}>🗑️ Delete</button>
                </li>
              ))}
            </ul>
            <h3>Total: ₹{total}</h3>
            <button onClick={handleCheckout} style={checkoutStyle}>✅ Proceed to Checkout</button>
            <button onClick={handleClearCart} style={clearStyle}>🧹 Clear Cart</button>
          </>
        )}
      </div>
    </>
  );
};

const buttonStyle = {
  marginLeft: '8px',
  padding: '2px 8px',
  backgroundColor: '#3498db',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

const deleteStyle = {
  ...buttonStyle,
  backgroundColor: '#e74c3c'
};

const clearStyle = {
  marginTop: '10px',
  padding: '8px 16px',
  backgroundColor: '#c0392b',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  marginLeft: '10px'
};

const checkoutStyle = {
  marginTop: '10px',
  padding: '8px 16px',
  backgroundColor: '#2ecc71',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer'
};

export default Cart;
