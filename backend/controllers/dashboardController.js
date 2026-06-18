// backend/controllers/dashboardController.js
// Aggregates data from multiple models into one response so the frontend
// dashboard can render everything with a single API call.

const { findLatestAnalysisByUser, findAnalysisHistoryByUser } = require('../models/analysisModel');
const { findHistoryByUser: findSkillGapHistory } = require('../models/skillGapModel');
const { findHistoryByUser: findInterviewHistory } = require('../models/interviewModel');
const { getRecentActivity } = require('../models/activityModel');
const { findResumesByUser } = require('../models/resumeModel');

// GET /api/dashboard/summary  (protected)
async function getDashboardSummary(req, res, next) {
  try {
    const userId = req.user.id;

    const [latestAnalysis, analysisHistory, skillGapHistory, interviewHistory, recentActivity, resumes] =
      await Promise.all([
        findLatestAnalysisByUser(userId),
        findAnalysisHistoryByUser(userId),
        findSkillGapHistory(userId),
        findInterviewHistory(userId),
        getRecentActivity(userId, 8),
        findResumesByUser(userId),
      ]);

    res.status(200).json({
      latestAnalysis: latestAnalysis || null,
      analysisHistory,
      skillGapHistory,
      interviewHistory,
      recentActivity,
      resumeCount: resumes.length,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getDashboardSummary };