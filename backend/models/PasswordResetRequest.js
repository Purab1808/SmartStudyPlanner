const mongoose = require('mongoose');

const passwordResetRequestSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    otpCode: {
      type: String,
      required: true
    },
    otpExpiresAt: {
      type: Date,
      required: true,
      index: true
    },
    otpAttempts: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('PasswordResetRequest', passwordResetRequestSchema);
