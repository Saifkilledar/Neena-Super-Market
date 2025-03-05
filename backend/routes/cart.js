const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Placeholder for cart functionality
router.get('/', auth, (req, res) => {
  res.json({ message: 'Cart route working' });
});

module.exports = router;
