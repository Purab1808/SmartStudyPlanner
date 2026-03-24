const MentalLoad = require('../models/MentalLoad');
const asyncHandler = require('../utils/asyncHandler');
const { getEndOfDay, getStartOfDay } = require('../utils/date');

const upsertMentalLoad = asyncHandler(async (req, res) => {
  const targetDate = getStartOfDay(req.body.date);
  const mentalLoad = await MentalLoad.findOneAndUpdate(
    { userId: req.user._id, date: targetDate },
    { ...req.body, userId: req.user._id, date: targetDate },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  res.status(201).json({
    message: 'Mental load recorded successfully',
    mentalLoad
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
