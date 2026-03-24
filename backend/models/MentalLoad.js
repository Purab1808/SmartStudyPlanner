const mongoose = require('mongoose');

const mentalLoadSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    fatigueLevel: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    stressLevel: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    motivationLevel: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    sleepHours: {
      type: Number,
      required: true,
      min: 0,
      max: 24
    },
    date: {
      type: Date,
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

mentalLoadSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('MentalLoad', mentalLoadSchema);
