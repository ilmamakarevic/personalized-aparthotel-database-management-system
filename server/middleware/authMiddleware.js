const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'bigFatDonkeySecret12345!';

// ✅ Protect: checks token and loads user
const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "No token. Authorization denied." });

    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ msg: "User not found" });
    }

    // 🔍 Debug log
    console.log("Authenticated user:", req.user);

    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(401).json({ msg: "Invalid token" });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    console.log(`Checking role: ${req.user.role}`);
    console.log(`Allowed roles:`, roles);
    
    if (!roles.includes(req.user.role)) {
      console.log(`❌ Access denied: ${req.user.role} not in [${roles.join(', ')}]`);
      return res.status(403).json({ msg: "Access denied: role not permitted" });
    }

    console.log(`✅ Access granted`);
    next();
  };
};


module.exports = { protect, authorizeRoles };
