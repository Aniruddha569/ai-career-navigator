// backend/controllers/resumeController.js

const path = require('path');
const { extractTextFromPDF } = require('../services/pdfService');
const { analyzeResume } = require('../services/geminiService');
const {
  createResume,
  findResumeById,
  findLatestResumeByUser,
  findResumesByUser,
} = require('../models/resumeModel');
const {
  createAnalysis,
  findLatestAnalysisByUser,
  findAnalysisHistoryByUser,
} = require('../models/analysisModel');
const { logActivity } = require('../models/activityModel');

// POST /api/resume/upload  (protected, multipart/form-data, field name: "resume")
async function uploadResume(req, res, next) {
  try {
    if (!req.file) {
      res.status(400);
      return next(new Error('No file uploaded. Please attach a PDF resume.'));
    }

    const filePath = req.file.path;
    const extractedText = await extractTextFromPDF(filePath);

    const resumeId = await createResume({
      userId: req.user.id,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      filePath,
      extractedText,
    });

    await logActivity(req.user.id, 'RESUME_UPLOAD', `Uploaded resume: ${req.file.originalname}`);

    res.status(201).json({
      message: 'Resume uploaded and parsed successfully.',
      resume: {
        id: resumeId,
        originalName: req.file.originalname,
      },
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/resume/analyze/:resumeId  (protected)
// Sends the already-extracted resume text to Gemini and stores the result.
async function analyzeResumeById(req, res, next) {
  try {
    const { resumeId } = req.params;

    const resume = await findResumeById(resumeId);

    if (!resume) {
      res.status(404);
      return next(new Error('Resume not found.'));
    }

    // Make sure users can only analyze their own resumes.
    if (resume.user_id !== req.user.id) {
      res.status(403);
      return next(new Error('You are not authorized to analyze this resume.'));
    }

    const aiResult = await analyzeResume(resume.extracted_text);

    const analysisId = await createAnalysis({
      resumeId: resume.id,
      userId: req.user.id,
      resumeScore: aiResult.resumeScore,
      atsScore: aiResult.atsScore,
      sapReadinessScore: aiResult.sapReadinessScore,
      strengths: aiResult.strengths,
      weaknesses: aiResult.weaknesses,
      missingSkills: aiResult.missingSkills,
      improvementSuggestions: aiResult.improvementSuggestions,
      rawAiResponse: aiResult,
    });

    await logActivity(req.user.id, 'ANALYSIS', `Resume analyzed — score ${aiResult.resumeScore}/100`);

    res.status(200).json({
      message: 'Resume analyzed successfully.',
      analysisId,
      analysis: aiResult,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/resume/latest-analysis  (protected — used by dashboard)
async function getLatestAnalysis(req, res, next) {
  try {
    const analysis = await findLatestAnalysisByUser(req.user.id);
    res.status(200).json({ analysis: analysis || null });
  } catch (error) {
    next(error);
  }
}

// GET /api/resume/analysis-history  (protected — used by dashboard)
async function getAnalysisHistory(req, res, next) {
  try {
    const history = await findAnalysisHistoryByUser(req.user.id);
    res.status(200).json({ history });
  } catch (error) {
    next(error);
  }
}

// GET /api/resume/latest  (protected — used so frontend knows if a resume
// already exists before asking the user to upload again)
async function getLatestResume(req, res, next) {
  try {
    const resume = await findLatestResumeByUser(req.user.id);
    if (!resume) {
      return res.status(200).json({ resume: null });
    }
    res.status(200).json({
      resume: { id: resume.id, originalName: resume.original_name, uploadedAt: resume.uploaded_at },
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/resume/all  (protected — full upload history)
async function getAllResumes(req, res, next) {
  try {
    const resumes = await findResumesByUser(req.user.id);
    res.status(200).json({ resumes });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  uploadResume,
  analyzeResumeById,
  getLatestAnalysis,
  getAnalysisHistory,
  getLatestResume,
  getAllResumes,
};