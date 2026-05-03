const Progress = require('../models/Progress');
const Course = require('../models/Course');

exports.getProgress = async (req, res, next) => {
  try {
    const progress = await Progress.find({ user: req.user._id }).populate('course', 'title thumbnail category totalLessons');
    res.json({ success: true, progress });
  } catch (err) {
    next(err);
  }
};

exports.getCourseProgress = async (req, res, next) => {
  try {
    const progress = await Progress.findOne({ user: req.user._id, course: req.params.courseId }).populate('course');
    if (!progress) return res.status(404).json({ success: false, message: 'Progress not found' });
    res.json({ success: true, progress });
  } catch (err) {
    next(err);
  }
};

exports.markLessonComplete = async (req, res, next) => {
  try {
    const { courseId, lessonId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    let progress = await Progress.findOne({ user: req.user._id, course: courseId });
    if (!progress) {
      progress = await Progress.create({ user: req.user._id, course: courseId });
    }

    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
    }
    progress.currentLesson = lessonId;
    progress.lastAccessed = new Date();

    const totalLessons = course.sections.reduce((s, sec) => s + sec.lessons.length, 0);
    progress.progressPercent = totalLessons > 0
      ? Math.round((progress.completedLessons.length / totalLessons) * 100)
      : 0;

    if (progress.progressPercent === 100 && !progress.completed) {
      progress.completed = true;
      progress.completedAt = new Date();
      progress.certificateIssued = true;
    }

    await progress.save();
    res.json({ success: true, progress });
  } catch (err) {
    next(err);
  }
};

exports.updateTimeSpent = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { seconds } = req.body;
    const progress = await Progress.findOneAndUpdate(
      { user: req.user._id, course: courseId },
      { $inc: { timeSpent: seconds }, lastAccessed: new Date() },
      { new: true, upsert: true }
    );
    res.json({ success: true, progress });
  } catch (err) {
    next(err);
  }
};

exports.addNote = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { lessonId, content } = req.body;
    const progress = await Progress.findOneAndUpdate(
      { user: req.user._id, course: courseId },
      { $push: { notes: { lessonId, content } } },
      { new: true, upsert: true }
    );
    res.json({ success: true, progress });
  } catch (err) {
    next(err);
  }
};
