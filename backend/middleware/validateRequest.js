const { validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  return res.status(400).json({
    message: 'Validation failed',
    errors: errors.array().map(({ msg, path, value }) => ({ message: msg, field: path, value }))
  });
};

module.exports = validateRequest;
