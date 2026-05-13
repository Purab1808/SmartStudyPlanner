const Subject = require('../models/Subject');
const Task = require('../models/Task');
const asyncHandler = require('../utils/asyncHandler');

const ensureSubjectOwnership = async (subjectId, userId) => {
  const subject = await Subject.findOne({ _id: subjectId, createdBy: userId });
  if (!subject) {
    const error = new Error('Related subject not found');
    error.statusCode = 404;
    throw error;
  }
  return subject;
};

const createTask = asyncHandler(async (req, res) => {
  await ensureSubjectOwnership(req.body.subjectId, req.user._id);

  const task = await Task.create({
    ...req.body,
    createdBy: req.user._id
  });

  res.status(201).json({
    message: 'Task created successfully',
    task
  });
});

const getTasks = asyncHandler(async (req, res) => {
  const filter = { createdBy: req.user._id };
  if (req.query.status) filter.status = req.query.status;
  if (req.query.subjectId) filter.subjectId = req.query.subjectId;

  const tasks = await Task.find(filter).populate('subjectId', 'subjectName examDate').sort({ deadline: 1, priority: -1 });
  res.json({ count: tasks.length, tasks });
});

const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, createdBy: req.user._id }).populate(
    'subjectId',
    'subjectName difficultyLevel examDate'
  );
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  res.json({ task });
});

const updateTask = asyncHandler(async (req, res) => {
  if (req.body.subjectId) {
    await ensureSubjectOwnership(req.body.subjectId, req.user._id);
  }

  const task = await Task.findOneAndUpdate({ _id: req.params.id, createdBy: req.user._id }, req.body, {
    new: true,
    runValidators: true
  });

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  res.json({
    message: 'Task updated successfully',
    task
  });
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  res.json({ message: 'Task deleted successfully' });
});

const completeTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, createdBy: req.user._id },
    { status: 'completed' },
    { new: true }
  );

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  res.json({
    message: 'Task marked as completed',
    task
  });
});

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  completeTask
};
