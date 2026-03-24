const Task = require('../models/Task');
const MentalLoad = require('../models/MentalLoad');
const StudySchedule = require('../models/StudySchedule');
const asyncHandler = require('../utils/asyncHandler');
const { getEndOfDay, getStartOfDay } = require('../utils/date');

const buildDateFilter = (userId, query) => {
  const filter = { userId };
  if (query.startDate || query.endDate) {
    filter.date = {};
    if (query.startDate) filter.date.$gte = getStartOfDay(query.startDate);
    if (query.endDate) filter.date.$lte = getEndOfDay(query.endDate);
  }
  return filter;
};

const getStudyTimeAnalytics = asyncHandler(async (req, res) => {
  const schedules = await StudySchedule.find(buildDateFilter(req.user._id, req.query));
  const tasks = await Task.find({ createdBy: req.user._id, status: 'completed' });

  const totalStudyHours = schedules.reduce((sum, schedule) => sum + schedule.totalStudyHours, 0);
  const completedTasks = tasks.length;

  res.json({
    totalStudyHours: Number(totalStudyHours.toFixed(2)),
    completedTasks,
    averageDailyStudyHours: schedules.length ? Number((totalStudyHours / schedules.length).toFixed(2)) : 0
  });
});

const getFatiguePatternAnalytics = asyncHandler(async (req, res) => {
  const entries = await MentalLoad.find(buildDateFilter(req.user._id, req.query)).sort({ date: 1 });

  const trend = entries.map((entry) => ({
    date: entry.date,
    fatigueLevel: entry.fatigueLevel,
    stressLevel: entry.stressLevel,
    motivationLevel: entry.motivationLevel,
    sleepHours: entry.sleepHours
  }));

  const averages = entries.length
    ? {
        fatigueLevel: Number((entries.reduce((sum, item) => sum + item.fatigueLevel, 0) / entries.length).toFixed(2)),
        stressLevel: Number((entries.reduce((sum, item) => sum + item.stressLevel, 0) / entries.length).toFixed(2)),
        motivationLevel: Number(
          (entries.reduce((sum, item) => sum + item.motivationLevel, 0) / entries.length).toFixed(2)
        ),
        sleepHours: Number((entries.reduce((sum, item) => sum + item.sleepHours, 0) / entries.length).toFixed(2))
      }
    : { fatigueLevel: 0, stressLevel: 0, motivationLevel: 0, sleepHours: 0 };

  res.json({ averages, trend });
});

const getProductivityScore = asyncHandler(async (req, res) => {
  const [completedTasks, pendingTasks, schedules, mentalLoads] = await Promise.all([
    Task.countDocuments({ createdBy: req.user._id, status: 'completed' }),
    Task.countDocuments({ createdBy: req.user._id, status: 'pending' }),
    StudySchedule.find(buildDateFilter(req.user._id, req.query)),
    MentalLoad.find(buildDateFilter(req.user._id, req.query))
  ]);

  const taskCompletionRate = completedTasks + pendingTasks ? completedTasks / (completedTasks + pendingTasks) : 0;
  const averageStudyHours = schedules.length
    ? schedules.reduce((sum, schedule) => sum + schedule.totalStudyHours, 0) / schedules.length
    : 0;
  const averageFatigue = mentalLoads.length
    ? mentalLoads.reduce((sum, entry) => sum + entry.fatigueLevel, 0) / mentalLoads.length
    : 5;

  const productivityScore = Math.max(
    0,
    Math.min(100, Math.round(taskCompletionRate * 55 + averageStudyHours * 8 + (10 - averageFatigue) * 5))
  );

  res.json({
    productivityScore,
    summary: {
      completedTasks,
      pendingTasks,
      averageStudyHours: Number(averageStudyHours.toFixed(2)),
      averageFatigue: Number(averageFatigue.toFixed(2))
    }
  });
});

module.exports = {
  getStudyTimeAnalytics,
  getFatiguePatternAnalytics,
  getProductivityScore
};
