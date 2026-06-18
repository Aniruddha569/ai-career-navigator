// backend/utils/generateToken.js
// Wraps jsonwebtoken so controllers don't repeat the same 3 lines everywhere.

const jwt = require('jsonwebtoken');

function generateToken(userId) {
  return jwt.sign(
    { id: userId },                 // payload: just the user's id is enough
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

module.exports = generateToken;