const Apartment = require('../models/Apartment');

exports.createApartment = async (req, res) => {
  try {
    const apartment = await Apartment.create({
      ...req.body,
      owner: req.user._id,
      aparthotelId: req.user.aparthotelId
    });
    res.status(201).json(apartment);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getMyApartments = async (req, res) => {
  try {
    const apartments = await Apartment.find({ aparthotelId: req.user.aparthotelId });
    res.json(apartments);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.updateApartment = async (req, res) => {
  try {
    const apt = await Apartment.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id, aparthotelId: req.user.aparthotelId },
      req.body,
      { new: true }
    );
    if (!apt) return res.status(404).json({ msg: 'Apartment not found' });
    res.json(apt);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.deleteApartment = async (req, res) => {
  try {
    const apt = await Apartment.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
      aparthotelId: req.user.aparthotelId
    });
    if (!apt) return res.status(404).json({ msg: 'Apartment not found' });
    res.json({ msg: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
