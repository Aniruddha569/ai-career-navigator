// backend/models/skillGapModel.js

const pool = require('../config/db');

async function createSkillGapAnalysis({
  resumeId,
  userId,
  targetCompany,
  matchedSkills,
  missingSkills,
  learningRoadmap,
  matchPercentage,
}) {
  const [result] = await pool.query(
    `INSERT INTO skill_gap_analysis
      (resume_id, user_id, target_company, matched_skills, missing_skills, learning_roadmap, match_percentage)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      resumeId,
      userId,
      targetCompany,
      JSON.stringify(matchedSkills),
      JSON.stringify(missingSkills),
      JSON.stringify(learningRoadmap),
      matchPercentage,
    ]
  );
  return result.insertId;
}

// Get a user's most recent skill-gap result for a specific company —
// avoids re-calling Gemini if they just checked the same company.
async function findLatestByUserAndCompany(userId, targetCompany) {
  const [rows] = await pool.query(
    `SELECT * FROM skill_gap_analysis
     WHERE user_id = ? AND target_company = ?
     ORDER BY created_at DESC LIMIT 1`,
    [userId, targetCompany]
  );
  return rows[0];
}

async function findHistoryByUser(userId) {
  const [rows] = await pool.query(
    `SELECT id, target_company, match_percentage, created_at
     FROM skill_gap_analysis WHERE user_id = ? ORDER BY created_at DESC`,
    [userId]
  );
  return rows;
}

module.exports = {
  createSkillGapAnalysis,
  findLatestByUserAndCompany,
  findHistoryByUser,
};