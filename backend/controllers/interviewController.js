// backend/controllers/interviewController.js

const { generateInterviewQuestions } = require('../services/geminiService');
const { findLatestResumeByUser } = require('../models/resumeModel');
const { createInterviewSet, findHistoryByUser, findById } = require('../models/interviewModel');
const { logActivity } = require('../models/activityModel');

// POST /api/interview/generate   body: { targetCompany }
async function generateQuestions(req, res, next) {
  try {
    const { targetCompany } = req.body;

    if (!targetCompany) {
      res.status(400);
      return next(new Error('targetCompany is required.'));
    }

    // Resume is optional here — generic questions can still be generated
    // without one, but tailored ones are better with it.
    const resume = await findLatestResumeByUser(req.user.id);
    const resumeText = resume ? resume.extracted_text : 'No resume provided. Generate general internship-level questions.';

    const aiResult = await generateInterviewQuestions(resumeText, targetCompany);

    const setId = await createInterviewSet({
      userId: req.user.id,
      resumeId: resume ? resume.id : null,
      targetCompany,
      technicalQuestions: aiResult.technicalQuestions,
      hrQuestions: aiResult.hrQuestions,
      dsaQuestions: aiResult.dsaQuestions,
      projectQuestions: aiResult.projectQuestions,
    });

    await logActivity(req.user.id, 'INTERVIEW_PREP', `Generated interview questions for ${targetCompany}`);

    res.status(200).json({
      message: 'Interview questions generated.',
      setId,
      questions: aiResult,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/interview/history  (protected — dashboard)
async function getHistory(req, res, next) {
  try {
    const history = await findHistoryByUser(req.user.id);
    res.status(200).json({ history });
  } catch (error) {
    next(error);
  }
}

// GET /api/interview/:id  (protected — view a specific past question set)
async function getQuestionSetById(req, res, next) {
  try {
    const set = await findById(req.params.id);

    if (!set) {
      res.status(404);
      return next(new Error('Question set not found.'));
    }

    if (set.user_id !== req.user.id) {
      res.status(403);
      return next(new Error('Not authorized to view this question set.'));
    }

    res.status(200).json({ questionSet: set });
  } catch (error) {
    next(error);
  }
}

module.exports = { generateQuestions, getHistory, getQuestionSetById };