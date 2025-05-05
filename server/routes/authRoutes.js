const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { createAparthotel } = require('../controllers/aparthotelController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/aparthotel', protect, authorizeRoles('manager'), createAparthotel);

router.get('/users', protect, authorizeRoles('manager'), async (req, res) => {
    const users = await User.find({ aparthotelId: req.user.aparthotelId });
    res.json(users);
});
  
module.exports = router;