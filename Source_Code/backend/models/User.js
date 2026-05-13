const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studyPreferencesSchema = new mongoose.Schema(
  {
    availableDailyHours: {
      type: Number,
      default: Number(process.env.DEFAULT_DAILY_STUDY_LIMIT || 6),
      min: 1,
      max: 16
    },
    preferredStudyWindow: {
      type: String,
      enum: ['morning', 'afternoon', 'evening', 'flexible'],
      default: 'flexible'
    },
    breakPreferenceMinutes: {
      type: Number,
      default: 25,
      min: 5,
      max: 120
    }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false
    },
    university: {
      type: String,
      trim: true
    },
    course: {
      type: String,
      trim: true
    },
    studyPreferences: {
      type: studyPreferencesSchema,
      default: () => ({})
    }
  },
  { timestamps: true }
);

userSchema.pre('save', async function preSave(next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  return next();
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
