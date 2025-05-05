require('dotenv').config(); 
const User = require('../models/User');
const Aparthotel = require('../models/Aparthotel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  try {
    const { name, surname, email, password, role, aparthotelCode } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });

    const aparthotel = await Aparthotel.findOne({ code: aparthotelCode });
    if (!aparthotel) return res.status(400).json({ msg: 'Invalid aparthotel code' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const formattedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    const formattedSurname = surname.charAt(0).toUpperCase() + surname.slice(1).toLowerCase();

    const newUser = await User.create({
      name: formattedName,
      surname: formattedSurname,
      email,
      password: hashedPassword,
      role,
      aparthotelId: aparthotel._id
    });

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        surname: user.surname,
        role: user.role,
        aparthotelId: user.aparthotelId
      }
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};