const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

dotenv.config(); // Load environment variables

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // ✅ Required to serve images


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/orders', orderRoutes);
app.use('/api/users', authRoutes);
app.use('/api/products', productRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// 🔁 Cron Job: Auto-complete pending orders after 10 minutes
const cron = require('node-cron');
const Order = require('./models/Order');

// Runs every minute
cron.schedule('* * * * *', async () => {
  try {
    const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000);

    const result = await Order.updateMany(
      { status: 'pending', createdAt: { $lte: tenMinsAgo } },
      { $set: { status: 'completed' } }
    );

    if (result.modifiedCount > 0) {
      console.log(`🕒 Auto-updated ${result.modifiedCount} order(s) to "completed"`);
    }
  } catch (err) {
    console.error('❌ Error running order status cron job:', err.message);
  }
});
