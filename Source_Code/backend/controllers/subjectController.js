const Subject = require('../models/Subject');
const asyncHandler = require('../utils/asyncHandler');

const createSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.create({
    ...req.body,
    createdBy: req.user._id
  });

  res.status(201).json({
    message: 'Subject created successfully',
    subject
  });
});

const getSubjects = asyncHandler(async (req, res) => {
  const subjects = await Subject.find({ createdBy: req.user._id }).sort({ examDate: 1, priority: -1 });
  res.json({ count: subjects.length, subjects });
});

const getSubjectById = asyncHandler(async (req, res) => {
  const subject = await Subject.findOne({ _id: req.params.id, createdBy: req.user._id });
  if (!subject) {
    res.status(404);
    throw new Error('Subject not found');
  }

  res.json({ subject });
});

const updateSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findOneAndUpdate(
    { _id: req.params.id, createdBy: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!subject) {
    res.status(404);
    throw new Error('Subject not found');
  }

  res.json({
    message: 'Subject updated successfully',
    subject
  });
});

const deleteSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
  if (!subject) {
    res.status(404);
    throw new Error('Subject not found');
  }

  res.json({ message: 'Subject deleted successfully' });
});

module.exports = {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject
};
