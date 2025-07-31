import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const ProductDetails = () => {
  const { id } = useParams(); // Get the product ID from the route
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error('Failed to fetch product', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleBuyNow = () => {
    localStorage.setItem('cart', JSON.stringify([{ ...product, quantity: 1 }]));
    navigate('/checkout');
  };

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h2>{product.name}</h2>
        <img src={product.image} alt={product.name} width="200" />
        <p>{product.description}</p>
        <h3>Price: ₹{product.price}</h3>
        <p><strong>In Stock:</strong> {product.countInStock}</p>

        <button
          onClick={handleBuyNow}
          disabled={product.countInStock === 0}
          style={{
            backgroundColor: product.countInStock === 0 ? 'gray' : '#007bff',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: product.countInStock === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          {product.countInStock === 0 ? 'Out of Stock' : 'Buy Now'}
        </button>
      </div>
    </>
  );
};

export default ProductDetails;
