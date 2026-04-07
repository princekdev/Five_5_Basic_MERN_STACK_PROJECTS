const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  toggleTaskStatus,
  deleteTask,
  getTaskStats,
} = require('../controllers/taskController');
const { validateTask } = require('../middleware/validation');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.get('/stats', getTaskStats);
router.route('/').get(getTasks).post(validateTask, createTask);
router.route('/:id').get(getTask).put(validateTask, updateTask).delete(deleteTask);
router.patch('/:id/toggle', toggleTaskStatus);

module.exports = router;
