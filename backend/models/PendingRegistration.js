const mongoose = require('mongoose');

const pendingRegistrationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    university: {
      type: String,
      required: true,
      trim: true
    },
    course: {
      type: String,
      required: true,
      trim: true
    },
    studyPreferences: {
      availableDailyHours: {
        type: Number,
        required: true
      },
      preferredStudyWindow: {
        type: String,
        required: true,
        enum: ['morning', 'afternoon', 'evening', 'flexible']
      },
      breakPreferenceMinutes: {
        type: Number,
        required: true
      }
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

module.exports = mongoose.model('PendingRegistration', pendingRegistrationSchema);
