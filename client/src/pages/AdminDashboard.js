import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductForm from '../components/ProductForm';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchProducts = async () => {
    if (!token) {
      alert('Missing authentication token. Please log in.');
      navigate('/');
      return;
    }

    try {
      const res = await axios.get('http://localhost:5000/api/products/admin/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data.products || []);
    } catch (err) {
      console.error('Error fetching products:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Failed to fetch products');
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.isAdmin) {
      alert('Access Denied');
      navigate('/');
    } else {
      fetchProducts();
    }
  }, [navigate]);
console.log('Token:', token);

  const deleteProduct = async (id) => {
  if (!window.confirm('Delete this product?')) return;
  try {
    await axios.delete(`http://localhost:5000/api/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProducts();
  } catch (err) {
    console.error('Delete error:', err?.response?.data || err.message);
    alert(err?.response?.data?.message || 'Failed to delete product');
  }

  };

  // Pagination Logic
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Segoe UI, sans-serif' }}>
      <h2 style={{ fontSize: '28px', marginBottom: '20px', color: '#333' }}>
        🛠 <span style={{ fontWeight: '600' }}>Admin Dashboard</span>
      </h2>

      <ProductForm
        onAdd={fetchProducts}
        selectedProduct={selectedProduct}
        clearSelection={() => setSelectedProduct(null)}
      />

      <hr style={{ margin: '30px 0', borderColor: '#ccc' }} />
      <h3 style={{ fontSize: '22px', marginBottom: '15px', color: '#444' }}>
        📦 <span style={{ fontWeight: '500' }}>Product List</span>
      </h3>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {currentProducts.map((p) => (
          <li
            key={p._id}
            style={{
              padding: '12px 18px',
              backgroundColor: '#f9f9f9',
              borderRadius: '8px',
              marginBottom: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '1px solid #eee'
            }}
          >
            <span>
              <strong style={{ fontSize: '16px', color: '#222' }}>{p.name}</strong>{' '}
              <span style={{ color: '#777' }}>
                – ₹{p.price} | Stock: {p.countInStock}
              </span>
            </span>
            <span>
              <button
                onClick={() => setSelectedProduct(p)}
                style={{
                  marginLeft: '10px',
                  backgroundColor: '#ffc107',
                  border: 'none',
                  padding: '6px 10px',
                  borderRadius: '5px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => deleteProduct(p._id)}
                style={{
                  marginLeft: '8px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '6px 10px',
                  borderRadius: '5px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                🗑 Delete
              </button>
            </span>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            style={{ marginRight: '10px' }}
          >
            ⬅ Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => goToPage(i + 1)}
              style={{
                margin: '0 4px',
                fontWeight: currentPage === i + 1 ? 'bold' : 'normal',
                background: currentPage === i + 1 ? '#007bff' : '#f0f0f0',
                color: currentPage === i + 1 ? '#fff' : '#000',
                padding: '6px 10px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{ marginLeft: '10px' }}
          >
            Next ➡
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
