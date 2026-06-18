// backend/models/interviewModel.js

const pool = require('../config/db');

async function createInterviewSet({
  userId,
  resumeId,
  targetCompany,
  technicalQuestions,
  hrQuestions,
  dsaQuestions,
  projectQuestions,
}) {
  const [result] = await pool.query(
    `INSERT INTO interview_questions
      (user_id, resume_id, target_company, technical_questions, hr_questions, dsa_questions, project_questions)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      resumeId || null,
      targetCompany,
      JSON.stringify(technicalQuestions),
      JSON.stringify(hrQuestions),
      JSON.stringify(dsaQuestions),
      JSON.stringify(projectQuestions),
    ]
  );
  return result.insertId;
}

async function findHistoryByUser(userId) {
  const [rows] = await pool.query(
    `SELECT id, target_company, created_at FROM interview_questions
     WHERE user_id = ? ORDER BY created_at DESC`,
    [userId]
  );
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM interview_questions WHERE id = ?', [id]);
  return rows[0];
}

module.exports = {
  createInterviewSet,
  findHistoryByUser,
  findById,
};