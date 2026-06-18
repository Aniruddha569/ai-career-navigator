// backend/models/analysisModel.js

const pool = require('../config/db');

// Save a Gemini analysis result against a resume.
// JSON.stringify is needed because mysql2 won't auto-convert JS arrays/objects
// into the MySQL JSON column type — we do it ourselves before inserting.
async function createAnalysis({
  resumeId,
  userId,
  resumeScore,
  atsScore,
  sapReadinessScore,
  strengths,
  weaknesses,
  missingSkills,
  improvementSuggestions,
  rawAiResponse,
}) {
  const [result] = await pool.query(
    `INSERT INTO resume_analysis
      (resume_id, user_id, resume_score, ats_score, sap_readiness_score,
       strengths, weaknesses, missing_skills, improvement_suggestions, raw_ai_response)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      resumeId,
      userId,
      resumeScore,
      atsScore,
      sapReadinessScore,
      JSON.stringify(strengths),
      JSON.stringify(weaknesses),
      JSON.stringify(missingSkills),
      JSON.stringify(improvementSuggestions),
      JSON.stringify(rawAiResponse),
    ]
  );
  return result.insertId;
}

// Get the most recent analysis for a user — powers the dashboard summary card.
async function findLatestAnalysisByUser(userId) {
  const [rows] = await pool.query(
    `SELECT * FROM resume_analysis WHERE user_id = ? ORDER BY created_at DESC LIMIT 1`,
    [userId]
  );
  return rows[0];
}

// Get full analysis history for a user — powers the dashboard history list
// and the "skill progress over time" view.
async function findAnalysisHistoryByUser(userId) {
  const [rows] = await pool.query(
    `SELECT id, resume_score, ats_score, sap_readiness_score, created_at
     FROM resume_analysis WHERE user_id = ? ORDER BY created_at DESC`,
    [userId]
  );
  return rows;
}

async function findAnalysisById(analysisId) {
  const [rows] = await pool.query('SELECT * FROM resume_analysis WHERE id = ?', [analysisId]);
  return rows[0];
}

module.exports = {
  createAnalysis,
  findLatestAnalysisByUser,
  findAnalysisHistoryByUser,
  findAnalysisById,
};