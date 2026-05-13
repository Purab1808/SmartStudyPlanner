const MentalLoad = require('../models/MentalLoad');
const Task = require('../models/Task');
const StudySchedule = require('../models/StudySchedule');
const asyncHandler = require('../utils/asyncHandler');
const { getEndOfDay, getStartOfDay } = require('../utils/date');
const { estimateMentalState } = require('../utils/estimateMentalState');

const upsertMentalLoad = asyncHandler(async (req, res) => {
  const targetDate = getStartOfDay(req.body.date);
  const rangeStart = new Date(targetDate);
  rangeStart.setDate(rangeStart.getDate() - 6);

  const [pendingTasks, overdueTasks, heavyPendingTasks, completedRecently, overloadedDays] = await Promise.all([
    Task.countDocuments({
      createdBy: req.user._id,
      status: 'pending'
    }),
    Task.countDocuments({
      createdBy: req.user._id,
      status: 'pending',
      deadline: { $lt: targetDate }
    }),
    Task.countDocuments({
      createdBy: req.user._id,
      status: 'pending',
      $or: [{ difficultyLevel: { $gte: 4 } }, { estimatedDuration: { $gte: 2 } }]
    }),
    Task.countDocuments({
      createdBy: req.user._id,
      status: 'completed',
      updatedAt: { $gte: rangeStart, $lte: getEndOfDay(targetDate) }
    }),
    StudySchedule.countDocuments({
      userId: req.user._id,
      date: { $gte: rangeStart, $lte: getEndOfDay(targetDate) },
      workloadLevel: 'overloaded'
    })
  ]);

  const estimatedState = estimateMentalState({
    fatigueLevel: Number(req.body.fatigueLevel),
    sleepHours: Number(req.body.sleepHours),
    pendingTasks,
    overdueTasks,
    heavyPendingTasks,
    completedRecently,
    overloadedDays
  });

  const mentalLoad = await MentalLoad.findOneAndUpdate(
    { userId: req.user._id, date: targetDate },
    {
      userId: req.user._id,
      date: targetDate,
      fatigueLevel: Number(req.body.fatigueLevel),
      sleepHours: Number(req.body.sleepHours),
      stressLevel: estimatedState.stressLevel,
      motivationLevel: estimatedState.motivationLevel
    },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  res.status(201).json({
    message: 'Mental load recorded successfully with behavior-based stress and motivation estimates',
    mentalLoad,
    estimationContext: {
      pendingTasks,
      overdueTasks,
      heavyPendingTasks,
      completedRecently,
      overloadedDays
    }
  });
});

const getMentalLoads = asyncHandler(async (req, res) => {
  const filter = { userId: req.user._id };
  if (req.query.startDate || req.query.endDate) {
    filter.date = {};
    if (req.query.startDate) filter.date.$gte = getStartOfDay(req.query.startDate);
    if (req.query.endDate) filter.date.$lte = getEndOfDay(req.query.endDate);
  }

  const entries = await MentalLoad.find(filter).sort({ date: -1 });
  res.json({ count: entries.length, mentalLoads: entries });
});

const getMentalLoadByDate = asyncHandler(async (req, res) => {
  const targetDate = getStartOfDay(req.params.date);
  const mentalLoad = await MentalLoad.findOne({ userId: req.user._id, date: targetDate });

  if (!mentalLoad) {
    res.status(404);
    throw new Error('Mental load entry not found for the selected date');
  }

  res.json({ mentalLoad });
});

module.exports = {
  upsertMentalLoad,
  getMentalLoads,
  getMentalLoadByDate
};
