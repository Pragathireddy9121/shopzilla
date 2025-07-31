const Product = require('../models/Product');

// @desc    Get all products with pagination and search (for users)
exports.getProducts = async (req, res) => {
  try {
    const pageSize = 6;
    const page = Number(req.query.page) || 1;
    const keyword = req.query.keyword
      ? {
          $or: [
            { name: { $regex: req.query.keyword, $options: 'i' } },
            { description: { $regex: req.query.keyword, $options: 'i' } },
          ]
        }
      : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// ✅ New: Get all products for admin (no pagination)
exports.getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, countInStock } = req.body;

    const newProduct = new Product({
      name,
      description,
      price,
      countInStock,
      image: req.file ? `/uploads/${req.file.filename}` : '', // ✅ image path
    });

    const created = await newProduct.save();
    res.status(201).json(created);
  } catch (err) {
    console.error('Create product error:', err.message);
    res.status(500).json({ message: 'Error creating product' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const { name, description, price, countInStock } = req.body;

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.countInStock = countInStock || product.countInStock;

    // ✅ Handle image update if new image is uploaded
    if (req.file) {
      product.image = `/uploads/${req.file.filename}`;
    }

    const updated = await product.save();
    res.json(updated);
  } catch (err) {
    console.error('Update product error:', err.message);
    res.status(500).json({ message: 'Error updating product' });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.deleteOne(); // preferred over remove() in newer Mongoose
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Delete product error:', err.message);
    res.status(500).json({ message: 'Server error while deleting product' });
  }
};

