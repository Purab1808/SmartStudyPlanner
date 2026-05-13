const { body, param } = require('express-validator');

const taskIdValidator = [param('id').isMongoId().withMessage('Task id is invalid')];

const taskValidator = [
  body('title').trim().notEmpty().withMessage('Task title is required'),
  body('subjectId').isMongoId().withMessage('Subject id is invalid'),
  body('estimatedDuration')
    .isFloat({ min: 0.25, max: 24 })
    .withMessage('Estimated duration must be between 0.25 and 24 hours'),
  body('difficultyLevel')
    .isInt({ min: 1, max: 5 })
    .withMessage('Difficulty level must be between 1 and 5'),
  body('deadline').isISO8601().withMessage('Deadline must be a valid date'),
  body('status').optional().isIn(['pending', 'completed']).withMessage('Status is invalid'),
  body('priority').isInt({ min: 1, max: 5 }).withMessage('Priority must be between 1 and 5')
];

module.exports = { taskValidator, taskIdValidator };
