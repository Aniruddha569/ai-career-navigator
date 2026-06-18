// backend/middleware/authMiddleware.js
// Protects routes by verifying the JWT sent in the Authorization header.
// If valid, attaches the logged-in user's info to req.user so controllers
// can use it (e.g. req.user.id).

const jwt = require('jsonwebtoken');
const { findUserById } = require('../models/userModel');

async function protect(req, res, next) {
  let token;

  const authHeader = req.headers.authorization;

  // Expected header format: "Bearer <token>"
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await findUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Not authorized. User no longer exists.' });
    }

    req.user = user; // now available in every controller after this middleware
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized. Invalid or expired token.' });
  }
}

module.exports = { protect };