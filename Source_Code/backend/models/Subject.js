const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
  {
    subjectName: {
      type: String,
      required: true,
      trim: true
    },
    difficultyLevel: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    priority: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    estimatedHours: {
      type: Number,
      required: true,
      min: 0.5
    },
    examDate: {
      type: Date,
      required: true,
      index: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

subjectSchema.index({ createdBy: 1, subjectName: 1 }, { unique: true });

module.exports = mongoose.model('Subject', subjectSchema);
