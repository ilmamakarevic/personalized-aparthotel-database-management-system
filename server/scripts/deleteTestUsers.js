require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to DB');

    const deleted = await User.deleteMany({
      email: { $in: [
        'alice@example.com',
        'front@example.com',
        'house@example.com',
        'manager@example.com'
      ]}
    });

    console.log(`Deleted ${deleted.deletedCount} users`);
    mongoose.disconnect();
  })
  .catch(err => console.error(err));
