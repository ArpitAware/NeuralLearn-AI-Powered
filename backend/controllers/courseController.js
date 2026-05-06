const Course = require('../models/Course');
const User = require('../models/User');
const Progress = require('../models/Progress');

exports.getCourses = async (req, res, next) => {
  try {
    const { category, level, search, sort, page = 1, limit = 12 } = req.query;
    const query = { isPublished: true };
    if (category && category !== 'All') query.category = category;
    if (level) query.level = level;
    if (search) query.$text = { $search: search };
    let sortObj = { createdAt: -1 };
    if (sort === 'rating') sortObj = { rating: -1 };
    if (sort === 'popular') sortObj = { totalStudents: -1 };
    if (sort === 'price-asc') sortObj = { price: 1 };
    if (sort === 'price-desc') sortObj = { price: -1 };
    const skip = (page - 1) * limit;
    const [courses, total] = await Promise.all([
      Course.find(query).populate('instructor', 'name avatar').sort(sortObj).skip(skip).limit(Number(limit)),
      Course.countDocuments(query),
    ]);
    res.json({
      success: true,
      courses,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

exports.getCourse = async (req, res, next) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug })
      .populate('instructor', 'name avatar bio createdCourses')
      .populate('reviews.user', 'name avatar');
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, course });
  } catch (err) {
    next(err);
  }
};

exports.createCourse = async (req, res, next) => {
  try {
    req.body.instructor = req.user._id;
    const course = await Course.create(req.body);
    await User.findByIdAndUpdate(req.user._id, { $push: { createdCourses: course._id } });
    res.status(201).json({ success: true, course });
  } catch (err) {
    next(err);
  }
};

exports.updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, course });
  } catch (err) {
    next(err);
  }
};

exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await course.deleteOne();
    res.json({ success: true, message: 'Course deleted' });
  } catch (err) {
    next(err);
  }
};

exports.enrollCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    const user = await User.findById(req.user._id);
    if (user.enrolledCourses.includes(course._id)) {
      return res.status(400).json({ success: false, message: 'Already enrolled' });
    }
    user.enrolledCourses.push(course._id);
    await user.save({ validateBeforeSave: false });
    course.totalStudents += 1;
    await course.save();
    await Progress.create({ user: req.user._id, course: course._id });
    res.json({ success: true, message: 'Enrolled successfully' });
  } catch (err) {
    next(err);
  }
};

exports.addReview = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    const exists = course.reviews.find((r) => r.user.toString() === req.user._id.toString());
    if (exists) return res.status(400).json({ success: false, message: 'Already reviewed' });
    course.reviews.push({ user: req.user._id, rating: req.body.rating, comment: req.body.comment });
    await course.save();
    res.json({ success: true, course });
  } catch (err) {
    next(err);
  }
};

exports.getFeaturedCourses = async (req, res, next) => {
  try {
    // Try featured first, fall back to top-rated published courses
    let courses = await Course.find({ isPublished: true, isFeatured: true })
      .populate('instructor', 'name avatar')
      .sort({ rating: -1 })
      .limit(6);

    if (courses.length === 0) {
      courses = await Course.find({ isPublished: true })
        .populate('instructor', 'name avatar')
        .sort({ rating: -1, totalStudents: -1 })
        .limit(6);
    }

    res.json({ success: true, courses });
  } catch (err) {
    next(err);
  }
};
