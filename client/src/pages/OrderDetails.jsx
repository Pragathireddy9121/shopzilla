import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const OrderDetails = () => {
  const location = useLocation();
  const order = location.state?.order;
  const navigate = useNavigate();

  if (!order) {
    return <p>Order not found</p>;
  }

  return (
    <>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h2>🧾 Order #{order._id}</h2>
        <ul>
          {order.items.map((item, index) => (
            <li key={index}>
              {item.name} - ₹{item.price} × {item.quantity || 1}
            </li>
          ))}
        </ul>
        <h3>Total: ₹{order.totalPrice}</h3>
        <button onClick={() => navigate('/orders')}>⬅ Back to Orders</button>
      </div>
    </>
  );
};

export default OrderDetails;
