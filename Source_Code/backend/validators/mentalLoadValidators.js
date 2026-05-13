const { body, param, query } = require('express-validator');

const mentalLoadValidator = [
  body('fatigueLevel').isInt({ min: 1, max: 10 }).withMessage('Fatigue level must be between 1 and 10'),
  body('sleepHours').isFloat({ min: 0, max: 24 }).withMessage('Sleep hours must be between 0 and 24'),
  body('date').isISO8601().withMessage('Date must be valid')
];

const mentalLoadDateParamValidator = [param('date').isISO8601().withMessage('Date must be valid')];

const mentalLoadQueryValidator = [
  query('startDate').optional().isISO8601().withMessage('startDate must be valid'),
  query('endDate').optional().isISO8601().withMessage('endDate must be valid')
];

module.exports = {
  mentalLoadValidator,
  mentalLoadDateParamValidator,
  mentalLoadQueryValidator
};
