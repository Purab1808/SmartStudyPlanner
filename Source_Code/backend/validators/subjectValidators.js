const { body, param } = require('express-validator');

const subjectIdValidator = [param('id').isMongoId().withMessage('Subject id is invalid')];

const subjectValidator = [
  body('subjectName').trim().notEmpty().withMessage('Subject name is required'),
  body('difficultyLevel')
    .isInt({ min: 1, max: 5 })
    .withMessage('Difficulty level must be between 1 and 5'),
  body('priority').isInt({ min: 1, max: 5 }).withMessage('Priority must be between 1 and 5'),
  body('estimatedHours')
    .isFloat({ min: 0.5, max: 500 })
    .withMessage('Estimated hours must be between 0.5 and 500'),
  body('examDate').isISO8601().withMessage('Exam date must be a valid date')
];

module.exports = { subjectValidator, subjectIdValidator };
