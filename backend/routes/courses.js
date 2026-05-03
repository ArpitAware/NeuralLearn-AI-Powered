const express = require('express');
const router = express.Router();
const {
  getCourses, getCourse, createCourse, updateCourse,
  deleteCourse, enrollCourse, addReview, getFeaturedCourses,
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getCourses);
router.get('/featured', getFeaturedCourses);
router.get('/:slug', getCourse);
router.post('/', protect, authorize('instructor', 'admin'), createCourse);
router.put('/:id', protect, authorize('instructor', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteCourse);
router.post('/:id/enroll', protect, enrollCourse);
router.post('/:id/reviews', protect, addReview);

module.exports = router;
