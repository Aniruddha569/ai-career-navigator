// backend/routes/skillGapRoutes.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { listCompanies, analyzeGap, getHistory } = require('../controllers/skillGapController');

router.get('/companies', protect, listCompanies);
router.post('/analyze', protect, analyzeGap);
router.get('/history', protect, getHistory);

module.exports = router;