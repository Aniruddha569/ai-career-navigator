// backend/models/resumeModel.js

const pool = require('../config/db');

// Save a record of an uploaded resume file + its extracted text.
async function createResume({ userId, fileName, originalName, filePath, extractedText }) {
  const [result] = await pool.query(
    `INSERT INTO resumes (user_id, file_name, original_name, file_path, extracted_text)
     VALUES (?, ?, ?, ?, ?)`,
    [userId, fileName, originalName, filePath, extractedText]
  );
  return result.insertId;
}

// Get one resume by id — used to fetch extracted_text before sending to Gemini.
async function findResumeById(resumeId) {
  const [rows] = await pool.query('SELECT * FROM resumes WHERE id = ?', [resumeId]);
  return rows[0];
}

// Get a user's most recently uploaded resume — used so the user doesn't
// have to re-upload every time they want a new analysis.
async function findLatestResumeByUser(userId) {
  const [rows] = await pool.query(
    'SELECT * FROM resumes WHERE user_id = ? ORDER BY uploaded_at DESC LIMIT 1',
    [userId]
  );
  return rows[0];
}

// List all resumes a user has ever uploaded (for dashboard history).
async function findResumesByUser(userId) {
  const [rows] = await pool.query(
    'SELECT id, original_name, uploaded_at FROM resumes WHERE user_id = ? ORDER BY uploaded_at DESC',
    [userId]
  );
  return rows;
}

module.exports = {
  createResume,
  findResumeById,
  findLatestResumeByUser,
  findResumesByUser,
};