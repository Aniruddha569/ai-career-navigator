// backend/controllers/authController.js

const bcrypt = require('bcryptjs');
const { createUser, findUserByEmail, findUserById } = require('../models/userModel');
const generateToken = require('../utils/generateToken');

// POST /api/auth/register
async function register(req, res, next) {
  try {
    const { name, email, password, college, branch, graduationYear } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      return next(new Error('Name, email, and password are required.'));
    }

    if (password.length < 6) {
      res.status(400);
      return next(new Error('Password must be at least 6 characters long.'));
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      res.status(409);
      return next(new Error('An account with this email already exists.'));
    }

    // Hash the password before ever storing it. Salt rounds = 10 is a
    // good balance of security vs speed for this kind of app.
    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = await createUser({
      name,
      email,
      hashedPassword,
      college,
      branch,
      graduationYear,
    });

    const token = generateToken(userId);

    res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: { id: userId, name, email },
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      return next(new Error('Email and password are required.'));
    }

    const user = await findUserByEmail(email);
    if (!user) {
      res.status(401);
      return next(new Error('Invalid email or password.'));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401);
      return next(new Error('Invalid email or password.'));
    }

    const token = generateToken(user.id);

    res.status(200).json({
      message: 'Logged in successfully.',
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/logout
// With JWT, logout is mostly a frontend action (delete the token from
// storage). This endpoint exists for a clean API contract and so we have
// a place to add token-blacklisting later if needed.
async function logout(req, res) {
  res.status(200).json({ message: 'Logged out successfully.' });
}

// GET /api/auth/me  (protected — used to fetch current user profile)
async function getProfile(req, res, next) {
  try {
    const user = await findUserById(req.user.id);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, logout, getProfile };