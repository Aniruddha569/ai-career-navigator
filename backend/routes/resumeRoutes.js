// backend/routes/resumeRoutes.js

const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');
const {
  uploadResume,
  analyzeResumeById,
  getLatestAnalysis,
  getAnalysisHistory,
  getLatestResume,
  getAllResumes,
} = require('../controllers/resumeController');

// Order matters: protect() runs first so req.user exists, THEN multer's
// upload.single() runs (it needs req.user.id to name the file).
router.post('/upload', protect, upload.single('resume'), uploadResume);
router.post('/analyze/:resumeId', protect, analyzeResumeById);
router.get('/latest-analysis', protect, getLatestAnalysis);
router.get('/analysis-history', protect, getAnalysisHistory);
router.get('/latest', protect, getLatestResume);
router.get('/all', protect, getAllResumes);

module.exports = router;