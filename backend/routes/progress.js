const express = require('express');
const router = express.Router();
const {
  getProgress, getCourseProgress, markLessonComplete, updateTimeSpent, addNote,
} = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getProgress);
router.get('/:courseId', protect, getCourseProgress);
router.post('/:courseId/lessons/:lessonId/complete', protect, markLessonComplete);
router.post('/:courseId/time', protect, updateTimeSpent);
router.post('/:courseId/notes', protect, addNote);

module.exports = router;
