const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const User = require('../models/User');

// GET /api/manager/users
router.get('/users', protect, authorizeRoles('manager'), async (req, res) => {
  try {
    const users = await User.find({ aparthotelId: req.user.aparthotelId }).select('-password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
