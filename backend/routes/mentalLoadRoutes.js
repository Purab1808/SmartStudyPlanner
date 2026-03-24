const express = require('express');
const {
  upsertMentalLoad,
  getMentalLoads,
  getMentalLoadByDate
} = require('../controllers/mentalLoadController');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const {
  mentalLoadValidator,
  mentalLoadDateParamValidator,
  mentalLoadQueryValidator
} = require('../validators/mentalLoadValidators');

const router = express.Router();

/**
 * @swagger
 * /mental-load:
 *   get:
 *     summary: Get mental load entries
 *     tags: [Mental Load]
 *   post:
 *     summary: Record daily mental load
 *     tags: [Mental Load]
 */
router.use(protect);
router
  .route('/')
  .get(mentalLoadQueryValidator, validateRequest, getMentalLoads)
  .post(mentalLoadValidator, validateRequest, upsertMentalLoad);
router.get('/:date', mentalLoadDateParamValidator, validateRequest, getMentalLoadByDate);

module.exports = router;
