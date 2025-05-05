const Aparthotel = require('../models/Aparthotel');

exports.createAparthotel = async (req, res) => {
  try {
    const { name } = req.body;
    const code = Math.random().toString(36).substring(2, 10); 

    const aparthotel = await Aparthotel.create({
      name,
      code,
      createdBy: req.user._id
    });

    res.status(201).json(aparthotel);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to create aparthotel' });
  }
};
