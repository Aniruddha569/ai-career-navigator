// backend/routes/interviewRoutes.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { generateQuestions, getHistory, getQuestionSetById } = require('../controllers/interviewController');

router.post('/generate', protect, generateQuestions);
router.get('/history', protect, getHistory);
router.get('/:id', protect, getQuestionSetById);

module.exports = router;