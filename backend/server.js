// backend/server.js
// Entry point. Wires together middleware, routes, and error handling.

require('dotenv').config();  // ← MUST be first
console.log("GEMINI KEY:", process.env.GEMINI_API_KEY);  // now it will print the key
const express = require('express');
const cors = require('cors');
const path = require('path');

// Importing this runs the DB connection test on startup (see config/db.js).
require('./config/db');

const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const skillGapRoutes = require('./routes/skillGapRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// ---------- Global Middleware ----------
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json()); // parses JSON request bodies
app.use(express.urlencoded({ extended: true }));

// Serve uploaded resumes statically if ever needed (e.g. preview link).
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ---------- Health check ----------
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'AI Career Navigator API is running.' });
});

// ---------- Routes ----------
console.log("authRoutes:", typeof authRoutes);
console.log("resumeRoutes:", typeof resumeRoutes);
console.log("skillGapRoutes:", typeof skillGapRoutes);
console.log("interviewRoutes:", typeof interviewRoutes);
console.log("dashboardRoutes:", typeof dashboardRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/skill-gap', skillGapRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.send("Working");
});
// ---------- Error Handling (must be last) ----------
app.use(notFound);
app.use(errorHandler);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});