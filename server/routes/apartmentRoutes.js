const express = require('express');
const router = express.Router();
const Apartment = require('../models/Apartment');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', protect, authorizeRoles('manager', 'owner', 'front_office'), async (req, res) => {
  try {
    const filter = { aparthotelId: req.user.aparthotelId };
    if (req.user.role === 'owner') filter.owner = req.user._id;

    const apartments = await Apartment.find(filter).populate('owner');
    res.json(apartments);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch apartments' });
  }
});

router.post('/', protect, authorizeRoles('manager', 'owner'), async (req, res) => {
  try {
    const newApartment = await Apartment.create({
      ...req.body,
      aparthotelId: req.user.aparthotelId
    });
    res.status(201).json(newApartment);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.put('/:id', protect, authorizeRoles('manager', 'owner'), async (req, res) => {
  try {
    const updated = await Apartment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update apartment' });
  }
});

module.exports = router;

