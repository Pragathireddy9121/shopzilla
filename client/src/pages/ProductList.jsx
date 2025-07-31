import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const pageSize = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products?keyword=${keyword}&page=${page}`);
        setProducts(res.data.products);
        setPages(res.data.pages);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
    };
    fetchProducts();

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartCount(cart.reduce((sum, item) => sum + (item.quantity || 1), 0));
  }, [keyword, page, refreshTrigger]);

  const addToCart = (product) => {
    if (product.countInStock === 0) {
      alert('Product is out of stock!');
      return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingIndex = cart.findIndex((item) => item._id === product._id);
    if (existingIndex !== -1) {
      cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    setCartCount(cart.reduce((sum, item) => sum + (item.quantity || 1), 0));
  };

  const handleBuyNow = (product) => {
    if (product.countInStock === 0) {
      alert('Product is out of stock!');
      return;
    }
    localStorage.setItem('cart', JSON.stringify([{ ...product, quantity: 1 }]));
    window.location.href = '/checkout';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <>
      <Navbar cartCount={cartCount} />

      <div style={{ padding: '30px', background: '#f9f9f9', minHeight: '100vh' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>🛍️ Our Products</h2>

        {/* 🔍 Search Bar */}
        <form onSubmit={handleSearch} style={{ textAlign: 'center', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search products..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{
              padding: '10px',
              width: '250px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              marginRight: '10px'
            }}
          />
          <button type="submit" style={{ padding: '10px 20px', borderRadius: '5px' }}>Search</button>
        </form>

        {/* 🧱 Product Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '20px',
            justifyContent: 'center',
          }}
        >
          {products.map((product) => (
            <div
              key={product._id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '12px',
                padding: '15px',
                backgroundColor: 'white',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                cursor: 'pointer'
              }}
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <img src={product.image} alt={product.name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
              <h3 style={{ fontSize: '1.1rem', marginTop: '10px' }}>{product.name}</h3>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>
                {product.description ? product.description.slice(0, 50) + '...' : 'No description available'}
              </p>

              <strong>₹{product.price}</strong>
              <br />
              {product.countInStock === 0 && (
                <p style={{ color: 'red', fontWeight: 'bold' }}>Out of Stock</p>
              )}
              {product.countInStock > 0 && (
                <p style={{ color: 'green', fontWeight: 'bold' }}>In Stock: {product.countInStock}</p>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (product.countInStock === 0) {
                    alert('This product is out of stock!');
                    return;
                  }
                  addToCart(product);
                }}
                style={{ marginTop: '10px' }}
              >
                ➕ Add to Cart
              </button>
            </div>
          ))}
        </div>

        {/* 📄 Pagination */}
        {pages > 1 && (
          <div style={{ marginTop: '30px', textAlign: 'center' }}>
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                style={{
                  margin: '0 5px',
                  padding: '8px 12px',
                  borderRadius: '5px',
                  border: i + 1 === page ? '2px solid #333' : '1px solid #aaa',
                  background: i + 1 === page ? '#333' : '#fff',
                  color: i + 1 === page ? '#fff' : '#333',
                  cursor: 'pointer'
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ProductList;
