// backend/models/userModel.js
// All direct database operations for the `users` table live here.
// Controllers call these functions instead of writing raw SQL themselves.

const pool = require('../config/db');

// Create a new user. Returns the inserted row's id.
async function createUser({ name, email, hashedPassword, college, branch, graduationYear }) {
  const [result] = await pool.query(
    `INSERT INTO users (name, email, password, college, branch, graduation_year)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, email, hashedPassword, college || null, branch || null, graduationYear || null]
  );
  return result.insertId;
}

// Find a user by email — used during login and during registration
// (to check if the email is already taken).
async function findUserByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0]; // undefined if not found
}

// Find a user by id — used by auth middleware to attach the logged-in
// user to each request, and by the dashboard to show profile info.
async function findUserById(id) {
  const [rows] = await pool.query(
    'SELECT id, name, email, college, branch, graduation_year, created_at FROM users WHERE id = ?',
    [id]
  );
  return rows[0];
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
};