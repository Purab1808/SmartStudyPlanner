const express = require('express');
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  completeTask
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const { taskValidator, taskIdValidator } = require('../validators/taskValidators');

const router = express.Router();

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: List tasks
 *     tags: [Tasks]
 *   post:
 *     summary: Create task
 *     tags: [Tasks]
 */
router.use(protect);
router.route('/').get(getTasks).post(taskValidator, validateRequest, createTask);
router
  .route('/:id')
  .get(taskIdValidator, validateRequest, getTaskById)
  .put(taskIdValidator, taskValidator, validateRequest, updateTask)
  .delete(taskIdValidator, validateRequest, deleteTask);
router.patch('/:id/complete', taskIdValidator, validateRequest, completeTask);

module.exports = router;
