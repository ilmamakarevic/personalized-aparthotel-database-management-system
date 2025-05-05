const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  apartment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Apartment',
    required: true
  },
  guestName: {
    type: String,
    required: true
  },
  guestLastName: {
    type: String,
    required: true
  },
  apartment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Apartment'
  },
  checkInDate: {
    type: Date,
    required: true
  },
  checkOutDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['booked', 'checkedIn', 'checkedOut'],
    default: 'booked'
  },
  totalPrice: {
    type: Number,
    required: true
  },
  aparthotelId: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
