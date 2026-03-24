const express = require('express');
const {
  generateStudySchedule,
  getSchedules,
  getScheduleByDate,
  deleteSchedules,
  overloadCheck
} = require('../controllers/scheduleController');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const {
  generateScheduleValidator,
  scheduleDateValidator,
  overloadQueryValidator
} = require('../validators/scheduleValidators');
const { dateRangeQueryValidator } = require('../validators/commonValidators');

const router = express.Router();

/**
 * @swagger
 * /schedule/generate:
 *   post:
 *     summary: Generate an optimized weekly study plan
 *     tags: [Schedule]
 *     responses:
 *       201:
 *         description: Schedule generated
 */
router.use(protect);
router.post('/generate', generateScheduleValidator, validateRequest, generateStudySchedule);
router.get('/overload-check', overloadQueryValidator, validateRequest, overloadCheck);
router.route('/').get(dateRangeQueryValidator, validateRequest, getSchedules).delete(deleteSchedules);
router.get('/:date', scheduleDateValidator, validateRequest, getScheduleByDate);

module.exports = router;
