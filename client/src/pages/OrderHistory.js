// File: src/pages/OrderHistory.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/api/orders/myorders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Cancel this order?')) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOrders(); // Refresh
    } catch (err) {
      alert('Failed to cancel order.');
    }
  };

  const handleDownload = (order) => {
    const invoice = `
      Order ID: ${order._id}
      Status: ${order.status.toUpperCase()}
      ---------------------------
      ${order.items.map(i => `${i.name} x${i.quantity} = ₹${i.price * i.quantity}`).join('\n')}
      ---------------------------
      Total: ₹${order.totalPrice}
    `;
    const blob = new Blob([invoice], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${order._id}.txt`;
    a.click();
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h2>📦 Your Orders</h2>
        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          orders.map(order => (
            <div key={order._id} style={{ border: '1px solid #ccc', padding: 15, marginBottom: 15, borderRadius: 8 }}>
              <h4>🧾 Order #{order._id}</h4>
              <p><strong>Status:</strong> {
                order.status === 'cancelled' ? '❌ Cancelled' :
                order.status === 'completed' ? '✅ Completed' :
                '🕑 Pending'
              }</p>
              <ul>
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.name} × {item.quantity} = ₹{item.price * item.quantity}
                  </li>
                ))}
              </ul>
              <p><strong>Total:</strong> ₹{order.totalPrice}</p>
              <button onClick={() => handleDownload(order)} style={{ marginRight: '10px' }}>
                📄 Download Invoice
              </button>
              {order.status === 'pending' && (
                <button onClick={() => handleCancelOrder(order._id)} style={{ backgroundColor: '#e74c3c', color: '#fff' }}>
                  ❌ Cancel Order
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default OrderHistory;
