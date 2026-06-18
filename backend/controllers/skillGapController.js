// backend/controllers/skillGapController.js

const { analyzeSkillGap } = require('../services/geminiService');
const { getSupportedCompanies } = require('../utils/companyRequirements');
const { findResumeById, findLatestResumeByUser } = require('../models/resumeModel');
const { createSkillGapAnalysis, findHistoryByUser } = require('../models/skillGapModel');
const { logActivity } = require('../models/activityModel');

// GET /api/skill-gap/companies  (public-ish, but kept protected for consistency)
async function listCompanies(req, res) {
  res.status(200).json({ companies: getSupportedCompanies() });
}

// POST /api/skill-gap/analyze   body: { targetCompany }
// Uses the user's most recently uploaded resume.
async function analyzeGap(req, res, next) {
  try {
    const { targetCompany } = req.body;

    if (!targetCompany) {
      res.status(400);
      return next(new Error('targetCompany is required.'));
    }

    const resume = await findLatestResumeByUser(req.user.id);
    if (!resume) {
      res.status(404);
      return next(new Error('No resume found. Please upload a resume first.'));
    }

    const aiResult = await analyzeSkillGap(resume.extracted_text, targetCompany);

    const skillGapId = await createSkillGapAnalysis({
      resumeId: resume.id,
      userId: req.user.id,
      targetCompany,
      matchedSkills: aiResult.matchedSkills,
      missingSkills: aiResult.missingSkills,
      learningRoadmap: aiResult.learningRoadmap,
      matchPercentage: aiResult.matchPercentage,
    });

    await logActivity(
      req.user.id,
      'SKILL_GAP',
      `Skill gap analysis for ${targetCompany} — ${aiResult.matchPercentage}% match`
    );

    res.status(200).json({
      message: 'Skill gap analysis complete.',
      skillGapId,
      result: aiResult,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/skill-gap/history  (protected — dashboard)
async function getHistory(req, res, next) {
  try {
    const history = await findHistoryByUser(req.user.id);
    res.status(200).json({ history });
  } catch (error) {
    next(error);
  }
}

module.exports = { listCompanies, analyzeGap, getHistory };