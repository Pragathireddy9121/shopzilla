// client/src/components/ProductCard.js

import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <div style={{ border: '1px solid gray', padding: '10px', width: '200px' }}>
      <img src={product.image} alt={product.name} style={{ width: '100%' }} />
      <h4>{product.name}</h4>
      <p>₹{product.price}</p>
      <p>{product.description}</p>
      <button>Add to Cart</button>
    </div>
  );
};

export default ProductCard;
