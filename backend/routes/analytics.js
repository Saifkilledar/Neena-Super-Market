const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Order = require('../models/Order');
const User = require('../models/User');

// @route   GET api/analytics
// @desc    Get analytics data
// @access  Private Admin
router.get('/', [auth, admin], async (req, res) => {
  try {
    const { timeRange = 'week' } = req.query;
    let startDate;
    const now = new Date();

    switch (timeRange) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 7));
    }

    // Get total sales and orders
    const orders = await Order.find({
      createdAt: { $gte: startDate },
    }).populate('items.product');

    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    // Get new customers count
    const newCustomers = await User.countDocuments({
      createdAt: { $gte: startDate },
      role: 'user',
    });

    // Calculate sales trend
    const salesTrend = [];
    const dateMap = new Map();

    orders.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0];
      if (dateMap.has(date)) {
        const data = dateMap.get(date);
        data.sales += order.total;
        data.orders += 1;
      } else {
        dateMap.set(date, {
          date,
          sales: order.total,
          orders: 1,
        });
      }
    });

    dateMap.forEach(data => {
      salesTrend.push(data);
    });

    // Sort sales trend by date
    salesTrend.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Calculate category distribution
    const categoryMap = new Map();
    orders.forEach(order => {
      order.items.forEach(item => {
        const category = item.product.category;
        const value = item.price * item.quantity;
        if (categoryMap.has(category)) {
          categoryMap.set(category, categoryMap.get(category) + value);
        } else {
          categoryMap.set(category, value);
        }
      });
    });

    const categoryDistribution = Array.from(categoryMap).map(([name, value]) => ({
      name,
      value,
    }));

    // Calculate payment method distribution
    const paymentMap = new Map();
    orders.forEach(order => {
      const method = order.paymentMethod;
      if (paymentMap.has(method)) {
        paymentMap.set(method, paymentMap.get(method) + 1);
      } else {
        paymentMap.set(method, 1);
      }
    });

    const paymentMethodDistribution = Array.from(paymentMap).map(([name, value]) => ({
      name,
      value,
    }));

    res.json({
      summary: {
        totalSales,
        totalOrders,
        averageOrderValue,
        newCustomers,
      },
      salesTrend,
      categoryDistribution,
      paymentMethodDistribution,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
