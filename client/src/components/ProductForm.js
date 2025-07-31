import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductForm = ({ onAdd, selectedProduct, clearSelection }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [image, setImage] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (selectedProduct) {
      setName(selectedProduct.name || '');
      setDescription(selectedProduct.description || '');
      setPrice(selectedProduct.price || '');
      setCountInStock(selectedProduct.countInStock || '');
      setImage(null); // reset image on edit
    }
  }, [selectedProduct]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('countInStock', countInStock);
    if (image) formData.append('image', image);

    try {
      if (selectedProduct) {
        await axios.put(
          `http://localhost:5000/api/products/${selectedProduct._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        clearSelection();
      } else {
        await axios.post('http://localhost:5000/api/products', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      onAdd();
      resetForm();
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Failed to save product');
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setCountInStock('');
    setImage(null);
  };

  const inputStyle = {
    padding: '8px 10px',
    width: '250px',
    marginBottom: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    display: 'block',
  };

  return (
    <div style={{ marginBottom: '25px' }}>
      <h3 style={{ fontSize: '20px', color: '#5a2a8f', display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: '8px', fontSize: '24px' }}>➕</span>
        <span style={{ fontWeight: '600' }}>{selectedProduct ? 'Edit Product' : 'Add Product'}</span>
      </h3>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          style={inputStyle}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          style={{ ...inputStyle, height: '80px', resize: 'vertical' }}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={e => setPrice(e.target.value)}
          style={inputStyle}
          required
        />
        <input
          type="number"
          placeholder="Stock"
          value={countInStock}
          onChange={e => setCountInStock(e.target.value)}
          style={inputStyle}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={e => setImage(e.target.files[0])}
          style={{ marginBottom: '10px' }}
        />

        <button
          type="submit"
          style={{
            padding: '8px 14px',
            backgroundColor: '#5a2a8f',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '500',
            cursor: 'pointer',
          }}
        >
          {selectedProduct ? 'Update Product' : 'Add Product'}
        </button>

        {selectedProduct && (
          <button
            type="button"
            onClick={() => {
              clearSelection();
              resetForm();
            }}
            style={{
              marginLeft: '10px',
              padding: '8px 14px',
              backgroundColor: '#6c757d',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
};

export default ProductForm;
