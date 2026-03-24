const express = require('express');
const {
  requestRegisterOtp,
  verifyRegisterOtp,
  requestPasswordResetOtp,
  resetPasswordWithOtp,
  loginUser,
  logoutUser,
  getProfile,
  updateProfile,
  deleteAccount
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const {
  registerValidator,
  verifyOtpValidator,
  forgotPasswordRequestValidator,
  resetPasswordValidator,
  loginValidator,
  updateProfileValidator
} = require('../validators/authValidators');

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     security: []
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, example: "Ava Patel" }
 *               email: { type: string, example: "ava@example.com" }
 *               password: { type: string, example: "StrongPass1" }
 *               university: { type: string, example: "State University" }
 *               course: { type: string, example: "Computer Science" }
 *     responses:
 *       201:
 *         description: User registered
 */
router.post('/register/request-otp', registerValidator, validateRequest, requestRegisterOtp);
router.post('/register/verify-otp', verifyOtpValidator, validateRequest, verifyRegisterOtp);
router.post('/forgot-password/request-otp', forgotPasswordRequestValidator, validateRequest, requestPasswordResetOtp);
router.post('/forgot-password/reset', resetPasswordValidator, validateRequest, resetPasswordWithOtp);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     security: []
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', loginValidator, validateRequest, loginUser);
router.post('/logout', protect, logoutUser);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfileValidator, validateRequest, updateProfile);
router.delete('/profile', protect, deleteAccount);

module.exports = router;
