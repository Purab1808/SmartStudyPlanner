const mongoose = require('mongoose');

const scheduledTaskSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true
    },
    subjectName: {
      type: String,
      required: true
    },
    allocatedHours: {
      type: Number,
      required: true,
      min: 0.25
    },
    priorityScore: {
      type: Number,
      required: true
    },
    taskDifficulty: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    suggestedStartWindow: {
      type: String,
      enum: ['morning', 'afternoon', 'evening', 'flexible'],
      default: 'flexible'
    }
  },
  { _id: false }
);

const studyScheduleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    date: {
      type: Date,
      required: true,
      index: true
    },
    tasks: {
      type: [scheduledTaskSchema],
      default: []
    },
    totalStudyHours: {
      type: Number,
      default: 0
    },
    fatiguePrediction: {
      type: Number,
      default: 1
    },
    workloadLevel: {
      type: String,
      enum: ['light', 'balanced', 'heavy', 'overloaded'],
      default: 'light'
    },
    overloadReason: {
      type: String,
      default: ''
    },
    calendarIntegration: {
      synced: {
        type: Boolean,
        default: false
      },
      provider: {
        type: String,
        default: 'none'
      }
    },
    aiStudySuggestion: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

studyScheduleSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('StudySchedule', studyScheduleSchema);
