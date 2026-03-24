const express = require('express');
const {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject
} = require('../controllers/subjectController');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const { subjectValidator, subjectIdValidator } = require('../validators/subjectValidators');

const router = express.Router();

/**
 * @swagger
 * /subjects:
 *   get:
 *     summary: List subjects
 *     tags: [Subjects]
 *     responses:
 *       200:
 *         description: Subjects fetched
 *   post:
 *     summary: Create subject
 *     tags: [Subjects]
 *     responses:
 *       201:
 *         description: Subject created
 */
router.use(protect);
router.route('/').get(getSubjects).post(subjectValidator, validateRequest, createSubject);
router
  .route('/:id')
  .get(subjectIdValidator, validateRequest, getSubjectById)
  .put(subjectIdValidator, subjectValidator, validateRequest, updateSubject)
  .delete(subjectIdValidator, validateRequest, deleteSubject);

module.exports = router;
