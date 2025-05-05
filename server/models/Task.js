const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  apartment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Apartment',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  aparthotelId: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'cleaned', 'maintenance', 'skipped'],
    default: 'pending'
  },
  notes: {
    type: String,
    default: ''
  },
  checkInDate: {
    type: Date
  },
  checkOutDate: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
