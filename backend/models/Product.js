const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, default: '' },
  description: { type: String },
  price: { type: Number, required: true },
  countInStock: { type: Number, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);