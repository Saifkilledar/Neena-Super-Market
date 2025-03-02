const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// @route   POST api/orders
// @desc    Create a new order
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('items', 'Items are required').isArray(),
      check('shippingAddress', 'Shipping address is required').not().isEmpty(),
      check('paymentMethod', 'Payment method is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { items, shippingAddress, paymentMethod } = req.body;

      // Calculate order totals
      let subtotal = 0;
      const orderItems = [];

      for (const item of items) {
        const product = await Product.findById(item.product);
        if (!product) {
          return res.status(400).json({ message: 'Product not found' });
        }
        if (product.stock < item.quantity) {
          return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
        }

        subtotal += product.price * item.quantity;
        orderItems.push({
          product: item.product,
          quantity: item.quantity,
          price: product.price,
        });

        // Update product stock
        product.stock -= item.quantity;
        await product.save();
      }

      const tax = subtotal * 0.18; // 18% GST
      const deliveryCharge = subtotal > 1000 ? 0 : 50; // Free delivery above ₹1000
      const total = subtotal + tax + deliveryCharge;

      // Create Razorpay order if payment method is online
      let paymentDetails = {};
      if (paymentMethod !== 'cod') {
        const razorpayOrder = await razorpay.orders.create({
          amount: Math.round(total * 100), // Amount in paise
          currency: 'INR',
          receipt: `order_${Date.now()}`,
        });
        paymentDetails = {
          orderId: razorpayOrder.id,
        };
      }

      const order = new Order({
        user: req.user.id,
        items: orderItems,
        shippingAddress,
        paymentMethod,
        subtotal,
        tax,
        deliveryCharge,
        total,
        paymentDetails,
        expectedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      });

      await order.save();

      // Add initial tracking info
      order.trackingInfo.push({
        status: 'Order Placed',
        location: 'Online',
      });

      await order.save();
      res.json(order);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/orders
// @desc    Get all orders (admin) or user orders
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { user: req.user.id };
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('items.product', 'name images')
      .sort('-createdAt');
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name images price');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is authorized to view this order
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/orders/:id/status
// @desc    Update order status (admin only)
// @access  Private Admin
router.put(
  '/:id/status',
  [auth, admin],
  async (req, res) => {
    try {
      const { status, location } = req.body;
      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      order.status = status;
      order.trackingInfo.push({
        status,
        location: location || 'Processing Center',
      });

      await order.save();
      res.json(order);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   POST api/orders/:id/payment-verify
// @desc    Verify Razorpay payment
// @access  Private
router.post('/:id/payment-verify', auth, async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify payment signature
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      order.paymentStatus = 'completed';
      order.paymentDetails.paymentId = razorpay_payment_id;
      await order.save();
      res.json({ message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ message: 'Payment verification failed' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
