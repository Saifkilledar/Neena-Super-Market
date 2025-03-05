const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Placeholder for user functionality
router.get('/profile', auth, (req, res) => {
  res.json({ message: 'User profile route working' });
});

module.exports = router;
