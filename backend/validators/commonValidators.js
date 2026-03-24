const { query } = require('express-validator');

const dateRangeQueryValidator = [
  query('startDate').optional().isISO8601().withMessage('startDate must be valid'),
  query('endDate').optional().isISO8601().withMessage('endDate must be valid')
];

module.exports = { dateRangeQueryValidator };
