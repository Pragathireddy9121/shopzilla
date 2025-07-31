import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <h2>📦 All Orders</h2>
      <ul>
        {orders.map((order) => (
          <li key={order._id}>
            {order.user?.name || 'Unknown'} – {order.status} – ${order.totalPrice}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminOrders;
