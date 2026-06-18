// backend/models/activityModel.js
// Powers the "Recent Activity" feed on the dashboard.

const pool = require('../config/db');

async function logActivity(userId, activityType, description) {
  await pool.query(
    `INSERT INTO activity_log (user_id, activity_type, description) VALUES (?, ?, ?)`,
    [userId, activityType, description]
  );
}

async function getRecentActivity(userId, limit = 10) {
  const [rows] = await pool.query(
    `SELECT activity_type, description, created_at FROM activity_log
     WHERE user_id = ? ORDER BY created_at DESC LIMIT ?`,
    [userId, limit]
  );
  return rows;
}

module.exports = {
  logActivity,
  getRecentActivity,
};