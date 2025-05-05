const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Apartment = require('../models/Apartment');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// 📦 Add new booking
router.post('/', protect, authorizeRoles('front_office'), async (req, res) => {
  try {
    const { guestName, apartment, checkInDate, checkOutDate, status } = req.body;

    const newBooking = await Booking.create({
      guestName,
      apartment,
      checkInDate,
      checkOutDate,
      status,
      aparthotelId: req.user.aparthotelId
    });

    res.status(201).json(newBooking);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to create booking' });
  }
});

// 📅 View all bookings (manager/front_office)
router.get('/', protect, authorizeRoles('manager', 'front_office'), async (req, res) => {
  try {
    const bookings = await Booking.find({ aparthotelId: req.user.aparthotelId }).populate('apartment');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to load bookings' });
  }
});

// 📅 View bookings for one apartment (for Finance view)
router.get('/apartment/:id', protect, authorizeRoles('manager'), async (req, res) => {
  try {
    const bookings = await Booking.find({ apartment: req.params.id });
    const apartment = await Apartment.findById(req.params.id);

    if (!apartment) {
      return res.status(404).json({ msg: 'Apartment not found' });
    }

    res.json({
      bookings,
      apartment: {
        name: apartment.name,
        pricePerNight: apartment.pricePerNight || 0
      }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch bookings and apartment data' });
  }
});

module.exports = router;
