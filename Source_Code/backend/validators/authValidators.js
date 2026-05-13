const { body } = require('express-validator');

const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/)
    .withMessage('Password must include at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must include at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must include at least one number'),
  body('university').trim().notEmpty().withMessage('University is required').isLength({ max: 120 }),
  body('course').trim().notEmpty().withMessage('Course is required').isLength({ max: 120 }),
  body('studyPreferences.availableDailyHours')
    .notEmpty()
    .withMessage('Available daily hours is required')
    .isFloat({ min: 1, max: 16 })
    .withMessage('Available daily hours must be between 1 and 16'),
  body('studyPreferences.preferredStudyWindow')
    .notEmpty()
    .withMessage('Preferred study window is required')
    .isIn(['morning', 'afternoon', 'evening', 'flexible'])
    .withMessage('Preferred study window is invalid'),
  body('studyPreferences.breakPreferenceMinutes')
    .notEmpty()
    .withMessage('Break preference is required')
    .isInt({ min: 5, max: 120 })
    .withMessage('Break preference must be between 5 and 120 minutes')
];

const verifyOtpValidator = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('otp')
    .trim()
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be 6 digits')
    .isNumeric()
    .withMessage('OTP must contain only digits')
];

const forgotPasswordRequestValidator = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail()
];

const resetPasswordValidator = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('otp')
    .trim()
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be 6 digits')
    .isNumeric()
    .withMessage('OTP must contain only digits'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/)
    .withMessage('Password must include at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must include at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must include at least one number')
];

const loginValidator = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
];

const updateProfileValidator = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Email is invalid').normalizeEmail(),
  body('university').optional().trim().isLength({ max: 120 }),
  body('course').optional().trim().isLength({ max: 120 }),
  body('studyPreferences.availableDailyHours').optional().isFloat({ min: 1, max: 16 }),
  body('studyPreferences.preferredStudyWindow')
    .optional()
    .isIn(['morning', 'afternoon', 'evening', 'flexible']),
  body('studyPreferences.breakPreferenceMinutes').optional().isInt({ min: 5, max: 120 })
];

module.exports = {
  registerValidator,
  verifyOtpValidator,
  forgotPasswordRequestValidator,
  resetPasswordValidator,
  loginValidator,
  updateProfileValidator
};
