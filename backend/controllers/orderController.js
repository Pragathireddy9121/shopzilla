// controllers/orderController.js
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');

// Cancel order and restore stock
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Only allow cancel if pending
  if (order.status !== 'pending') {
    res.status(400);
    throw new Error('Only pending orders can be cancelled');
  }

  // Restore stock for each item
  for (const item of order.items) {
    const product = await Product.findById(item.product);
    if (product) {
      product.countInStock += item.quantity;
      await product.save();
    }
  }

  order.status = 'cancelled';
  await order.save();

  res.json({ message: 'Order cancelled and stock restored' });
});

module.exports = {
  cancelOrder,
};
