import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (user) setUserName(user.name);
    updateCartCount(cart);
    fetchOrders();

    // Optionally, listen to storage changes (for multi-tab updates)
    const handleStorage = () => {
      const newCart = JSON.parse(localStorage.getItem('cart')) || [];
      updateCartCount(newCart);
      fetchOrders();
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const updateCartCount = (cart) => {
    const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    setCartCount(count);
  };

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await axios.get('http://localhost:5000/api/orders/myorders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrderCount(res.data.length);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.left}>
        <Link to="/products" style={styles.link}>🛍️ ShopZilla</Link>
        <Link to="/cart" style={styles.link}>🛒 Cart ({cartCount})</Link>
        <Link to="/orders" style={styles.link}>📦 Orders ({orderCount})</Link>
      </div>
      <div style={styles.right}>
        <span style={{ marginRight: '10px' }}>👤 {userName}</span>
        <button onClick={handleLogout} style={styles.logout}>Logout</button>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    padding: '10px 20px',
    backgroundColor: '#222',
    color: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  left: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center'
  },
  right: {
    display: 'flex',
    alignItems: 'center'
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 'bold'
  },
  logout: {
    padding: '6px 12px',
    background: '#f44336',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '4px'
  }
};

export default Navbar;
