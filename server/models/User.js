const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  surname: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: String,
  role: {
    type: String,
    enum: ['owner', 'manager', 'front_office', 'housekeeping', 'management'],
  },
  aparthotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Aparthotel',
    required: true
  }  
});

module.exports = mongoose.model('User', userSchema);
