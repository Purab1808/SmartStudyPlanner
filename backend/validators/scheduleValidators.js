const { body, param, query } = require('express-validator');

const generateScheduleValidator = [
  body('startDate').optional().isISO8601().withMessage('startDate must be valid'),
  body('days').optional().isInt({ min: 1, max: 14 }).withMessage('days must be between 1 and 14'),
  body('availableDailyTime')
    .optional()
    .isFloat({ min: 1, max: 16 })
    .withMessage('availableDailyTime must be between 1 and 16')
];

const scheduleDateValidator = [param('date').isISO8601().withMessage('Date must be valid')];

const overloadQueryValidator = [
  query('startDate').optional().isISO8601().withMessage('startDate must be valid'),
  query('days').optional().isInt({ min: 1, max: 14 }).withMessage('days must be between 1 and 14')
];

module.exports = {
  generateScheduleValidator,
  scheduleDateValidator,
  overloadQueryValidator
};
