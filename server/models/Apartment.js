const mongoose = require('mongoose');

const apartmentSchema = new mongoose.Schema({
  name: String,
  address: String,
  city: String,
  country: String,
  rooms: {
    type: Number,
    default: 1,
    min: 1
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  aparthotelId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Aparthotel',
    required: true,
  },
  isClean: {
    type: Boolean,
    default: false,
  },
  isOccupied: {
    type: Boolean,
    default: false
  },
  pricePerNight: {
    type: Number,
    default: 100,
    required: true
  },
  damageReport: {
    type: String,
    default: ''
  }  
}, { timestamps: true });

module.exports = mongoose.model('Apartment', apartmentSchema);
