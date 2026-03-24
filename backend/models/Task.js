const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
      index: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    estimatedDuration: {
      type: Number,
      required: true,
      min: 0.25
    },
    difficultyLevel: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    deadline: {
      type: Date,
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
      index: true
    },
    priority: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    scheduledDate: {
      type: Date,
      index: true
    },
    reminderEnabled: {
      type: Boolean,
      default: false
    },
    pomodoroSessionsCompleted: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  { timestamps: true }
);

taskSchema.index({ createdBy: 1, deadline: 1, status: 1 });

module.exports = mongoose.model('Task', taskSchema);
