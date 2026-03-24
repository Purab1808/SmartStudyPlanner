const Subject = require('../models/Subject');
const Task = require('../models/Task');
const MentalLoad = require('../models/MentalLoad');
const StudySchedule = require('../models/StudySchedule');
const asyncHandler = require('../utils/asyncHandler');
const { generateSchedule, evaluateOverload } = require('../utils/schedulingAlgorithm');
const { addDays, getEndOfDay, getStartOfDay } = require('../utils/date');

const mapMentalLoads = (entries) =>
  entries.reduce((acc, entry) => {
    acc[getStartOfDay(entry.date).toISOString().slice(0, 10)] = entry.toObject();
    return acc;
  }, {});

const buildSubjectsMap = (subjects) =>
  subjects.reduce((acc, subject) => {
    acc[subject._id.toString()] = subject.toObject();
    return acc;
  }, {});

const generateStudySchedule = asyncHandler(async (req, res) => {
  const startDate = getStartOfDay(req.body.startDate || new Date());
  const days = Number(req.body.days || 7);
  const availableDailyTime =
    Number(req.body.availableDailyTime) ||
    req.user.studyPreferences?.availableDailyHours ||
    Number(process.env.DEFAULT_DAILY_STUDY_LIMIT || 6);

  const [subjects, tasks, mentalLoads] = await Promise.all([
    Subject.find({ createdBy: req.user._id }),
    Task.find({
      createdBy: req.user._id,
      status: 'pending',
      deadline: { $gte: startDate }
    }),
    MentalLoad.find({
      userId: req.user._id,
      date: { $gte: startDate, $lte: getEndOfDay(addDays(startDate, days - 1)) }
    })
  ]);

  const generated = generateSchedule({
    tasks,
    subjectsById: buildSubjectsMap(subjects),
    mentalLoadsByDate: mapMentalLoads(mentalLoads),
    startDate,
    days,
    availableDailyTime,
    studyPreferences: req.user.studyPreferences || {}
  });

  await Promise.all(
    generated.schedule.map((day) =>
      StudySchedule.findOneAndUpdate(
        { userId: req.user._id, date: day.date },
        {
          userId: req.user._id,
          date: day.date,
          tasks: day.tasks,
          totalStudyHours: day.totalStudyHours,
          fatiguePrediction: day.fatiguePrediction,
          workloadLevel: day.workloadLevel,
          overloadReason: day.overloadReason,
          aiStudySuggestion: day.aiStudySuggestion,
          calendarIntegration: { synced: false, provider: 'none' }
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
    )
  );

  if (generated.schedule.length) {
    const bulkOps = generated.schedule.flatMap((day) =>
      day.tasks.map((task) => ({
        updateOne: {
          filter: { _id: task.taskId, createdBy: req.user._id },
          update: { scheduledDate: day.date }
        }
      }))
    );

    if (bulkOps.length) {
      await Task.bulkWrite(bulkOps);
    }
  }

  res.status(201).json({
    message: 'Weekly study plan generated successfully',
    planningWindow: {
      startDate,
      endDate: addDays(startDate, days - 1),
      availableDailyTime
    },
    schedule: generated.schedule,
    unscheduledTasks: generated.unscheduledTasks
  });
});

const getSchedules = asyncHandler(async (req, res) => {
  const filter = { userId: req.user._id };
  if (req.query.startDate || req.query.endDate) {
    filter.date = {};
    if (req.query.startDate) filter.date.$gte = getStartOfDay(req.query.startDate);
    if (req.query.endDate) filter.date.$lte = getEndOfDay(req.query.endDate);
  }

  const schedules = await StudySchedule.find(filter).sort({ date: 1 });
  res.json({ count: schedules.length, schedules });
});

const getScheduleByDate = asyncHandler(async (req, res) => {
  const date = getStartOfDay(req.params.date);
  const schedule = await StudySchedule.findOne({ userId: req.user._id, date });
  if (!schedule) {
    res.status(404);
    throw new Error('Schedule not found for the selected date');
  }

  res.json({ schedule });
});

const deleteSchedules = asyncHandler(async (req, res) => {
  await StudySchedule.deleteMany({ userId: req.user._id });
  await Task.updateMany({ createdBy: req.user._id }, { $unset: { scheduledDate: 1 } });
  res.json({ message: 'Stored schedules cleared successfully' });
});

const overloadCheck = asyncHandler(async (req, res) => {
  const startDate = getStartOfDay(req.query.startDate || new Date());
  const days = Number(req.query.days || 7);
  const endDate = getEndOfDay(addDays(startDate, days - 1));
  const schedules = await StudySchedule.find({
    userId: req.user._id,
    date: { $gte: startDate, $lte: endDate }
  }).sort({ date: 1 });

  const dailyLimit =
    req.user.studyPreferences?.availableDailyHours || Number(process.env.DEFAULT_DAILY_STUDY_LIMIT || 6);
  const fatigueThreshold = Number(process.env.FATIGUE_OVERLOAD_THRESHOLD || 8);
  const analysis = evaluateOverload(schedules, dailyLimit, fatigueThreshold);

  res.json({
    dailyLimit,
    fatigueThreshold,
    overloadedDays: analysis.filter((entry) => entry.overloaded),
    analysis
  });
});

module.exports = {
  generateStudySchedule,
  getSchedules,
  getScheduleByDate,
  deleteSchedules,
  overloadCheck
};
