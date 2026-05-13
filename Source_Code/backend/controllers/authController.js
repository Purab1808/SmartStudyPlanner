const User = require('../models/User');
const PendingRegistration = require('../models/PendingRegistration');
const PasswordResetRequest = require('../models/PasswordResetRequest');
const Task = require('../models/Task');
const Subject = require('../models/Subject');
const MentalLoad = require('../models/MentalLoad');
const StudySchedule = require('../models/StudySchedule');
const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/generateToken');
const { sendRegistrationOtp, sendPasswordResetOtp } = require('../utils/email');

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  university: user.university,
  course: user.course,
  studyPreferences: user.studyPreferences,
  createdAt: user.createdAt
});

const generateOtpCode = () => `${Math.floor(100000 + Math.random() * 900000)}`;

const requestRegisterOtp = asyncHandler(async (req, res) => {
  const { name, email, password, university, course, studyPreferences } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(409);
    throw new Error('User with this email already exists');
  }

  const otpCode = generateOtpCode();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await PendingRegistration.findOneAndUpdate(
    { email },
    {
      name,
      email,
      password,
      university,
      course,
      studyPreferences,
      otpCode,
      otpExpiresAt,
      otpAttempts: 0
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true
    }
  );

  await sendRegistrationOtp({ email, name, otpCode });

  res.status(201).json({
    message: 'OTP sent to your email address. Verify it to complete registration.',
    email
  });
});

const verifyRegisterOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const pending = await PendingRegistration.findOne({ email });
  if (!pending) {
    res.status(404);
    throw new Error('No pending registration found for this email');
  }

  if (pending.otpExpiresAt < new Date()) {
    await PendingRegistration.deleteOne({ _id: pending._id });
    res.status(410);
    throw new Error('OTP expired. Request a new one.');
  }

  if (pending.otpCode !== otp) {
    pending.otpAttempts += 1;
    await pending.save();

    res.status(400);
    throw new Error('Invalid OTP');
  }

  const user = await User.create({
    name: pending.name,
    email: pending.email,
    password: pending.password,
    university: pending.university,
    course: pending.course,
    studyPreferences: pending.studyPreferences
  });

  await PendingRegistration.deleteOne({ _id: pending._id });

  res.status(201).json({
    message: 'User registered successfully',
    token: generateToken(user._id),
    user: sanitizeUser(user)
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.json({
    message: 'Login successful',
    token: generateToken(user._id),
    user: sanitizeUser(user)
  });
});

const requestPasswordResetOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error('No account found for this email');
  }

  const otpCode = generateOtpCode();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await PasswordResetRequest.findOneAndUpdate(
    { email },
    {
      email,
      otpCode,
      otpExpiresAt,
      otpAttempts: 0
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true
    }
  );

  await sendPasswordResetOtp({
    email,
    name: user.name,
    otpCode
  });

  res.status(200).json({
    message: 'Password reset OTP sent to your email address.',
    email
  });
});

const resetPasswordWithOtp = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const resetRequest = await PasswordResetRequest.findOne({ email });
  if (!resetRequest) {
    res.status(404);
    throw new Error('No password reset request found for this email');
  }

  if (resetRequest.otpExpiresAt < new Date()) {
    await PasswordResetRequest.deleteOne({ _id: resetRequest._id });
    res.status(410);
    throw new Error('OTP expired. Request a new one.');
  }

  if (resetRequest.otpCode !== otp) {
    resetRequest.otpAttempts += 1;
    await resetRequest.save();

    res.status(400);
    throw new Error('Invalid OTP');
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    await PasswordResetRequest.deleteOne({ _id: resetRequest._id });
    res.status(404);
    throw new Error('No account found for this email');
  }

  user.password = newPassword;
  await user.save();
  await PasswordResetRequest.deleteOne({ _id: resetRequest._id });

  res.status(200).json({
    message: 'Password reset successful. You can now log in with your new password.'
  });
});

const logoutUser = asyncHandler(async (req, res) => {
  res.json({
    message: 'Logout successful. Discard the JWT token on the client side.'
  });
});

const getProfile = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

const updateProfile = asyncHandler(async (req, res) => {
  if (req.body.email && req.body.email !== req.user.email) {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      res.status(409);
      throw new Error('User with this email already exists');
    }
  }

  const fields = ['name', 'email', 'university', 'course', 'studyPreferences'];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      req.user[field] = req.body[field];
    }
  });

  const updatedUser = await req.user.save();

  res.json({
    message: 'Profile updated successfully',
    user: sanitizeUser(updatedUser)
  });
});

const deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  await Promise.all([
    User.findByIdAndDelete(userId),
    Subject.deleteMany({ createdBy: userId }),
    Task.deleteMany({ createdBy: userId }),
    MentalLoad.deleteMany({ userId }),
    StudySchedule.deleteMany({ userId })
  ]);

  res.json({ message: 'Account and related data deleted successfully' });
});

module.exports = {
  requestRegisterOtp,
  verifyRegisterOtp,
  requestPasswordResetOtp,
  resetPasswordWithOtp,
  loginUser,
  logoutUser,
  getProfile,
  updateProfile,
  deleteAccount
};
