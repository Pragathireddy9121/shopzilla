const cron = require('node-cron');
const Order = require('../models/Order');

const checkAndUpdateOrderStatus = () => {
  cron.schedule('* * * * *', async () => {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    try {
      const result = await Order.updateMany(
        { status: 'pending', createdAt: { $lte: tenMinutesAgo } },
        { $set: { status: 'completed' } }
      );

      if (result.modifiedCount > 0) {
        console.log(`✅ ${result.modifiedCount} order(s) auto-marked as 'completed'`);
      }
    } catch (error) {
      console.error('❌ Failed to update orders:', error.message);
    }
  });
};

module.exports = checkAndUpdateOrderStatus;
