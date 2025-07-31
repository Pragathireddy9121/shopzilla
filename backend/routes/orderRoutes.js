const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { authMiddleware, isAdmin } = require('../middleware/auth');
const { cancelOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');


// ✅ 1. Create Order with Stock Deduction
router.post('/', authMiddleware, async (req, res) => {
  const { items } = req.body;

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  try {
    // Check and deduct stock
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.name}` });
      }

      if (product.countInStock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      product.countInStock -= item.quantity;
      await product.save();
    }

    const order = new Order({
      user: req.user.id,
      items,
      totalPrice,
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Error placing order', error: err.message });
  }
});

// ✅ 2. Get logged-in user's orders
router.get('/myorders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders', error: err.message });
  }
});

// ✅ 3. Admin: Get ALL orders
router.get('/', authMiddleware, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching all orders', error: err.message });
  }
});

// ✅ 4. Update Order Status (Admin only)
router.put('/:id/status', authMiddleware, isAdmin, async (req, res) => {
  const { status } = req.body;

  if (!['pending', 'completed', 'cancelled'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    await order.save();

    res.json({ message: 'Order status updated', order });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update order status', error: err.message });
  }
});

// ✅ 5. Cancel an Order (User or Admin)
const mongoose = require('mongoose');

// ✅ 5. Cancel an Order (User or Admin) — FIXED stock restore issue
// ✅ 5. Cancel an Order (User or Admin) — Final Fix
router.put('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (order.status === 'cancelled') {
      return res.status(400).json({ message: 'Order is already cancelled' });
    }

    // ✅ Properly restore product stock
    for (const item of order.items) {
      const productId = typeof item.product === 'object' && item.product._id
        ? item.product._id
        : item.product;

      const product = await Product.findById(productId);
      if (product) {
        product.countInStock += item.quantity;
        await product.save();
      } else {
        console.warn(`⚠️ Could not restore stock: Product not found for ID ${productId}`);
      }
    }

    order.status = 'cancelled';
    await order.save();

    res.json({ message: 'Order cancelled and stock restored', order });
  } catch (err) {
    res.status(500).json({ message: 'Error cancelling order', error: err.message });
  }
});



// ✅ 6. Get Single Order (for user or admin)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.user._id.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch order details', error: err.message });
  }
});

module.exports = router;
