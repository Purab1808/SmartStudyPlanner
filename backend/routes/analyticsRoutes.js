const express = require('express');
const {
  getStudyTimeAnalytics,
  getFatiguePatternAnalytics,
  getProductivityScore
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const { dateRangeQueryValidator } = require('../validators/commonValidators');

const router = express.Router();

/**
 * @swagger
 * /analytics/study-time:
 *   get:
 *     summary: Get study time analytics
 *     tags: [Analytics]
 */
router.use(protect);
router.get('/study-time', dateRangeQueryValidator, validateRequest, getStudyTimeAnalytics);
router.get('/fatigue-pattern', dateRangeQueryValidator, validateRequest, getFatiguePatternAnalytics);
router.get('/productivity-score', dateRangeQueryValidator, validateRequest, getProductivityScore);

module.exports = router;
