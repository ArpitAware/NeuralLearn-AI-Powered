const User = require('../models/User');
const Course = require('../models/Course');
const Progress = require('../models/Progress');
const Post = require('../models/Post');

exports.getAdminAnalytics = async (req, res, next) => {
  try {
    const [totalUsers, totalCourses, totalPosts, progressData, recentUsers] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments({ isPublished: true }),
      Post.countDocuments(),
      Progress.find().populate('course', 'price'),
      User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt avatar'),
    ]);

    const totalRevenue = progressData.reduce((sum, p) => {
      return sum + (p.course ? p.course.price || 0 : 0);
    }, 0);

    const completedCourses = progressData.filter((p) => p.completed).length;
    const completionRate = progressData.length > 0
      ? Math.round((completedCourses / progressData.length) * 100)
      : 0;

    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const currentMonth = new Date().getMonth();
    const revenueByMonth = months.map((_, i) => {
      const base = 30000 + Math.floor(Math.random() * 20000);
      return i <= currentMonth ? base : 0;
    });
    const enrollmentsByMonth = months.map((_, i) => {
      return i <= currentMonth ? Math.floor(Math.random() * 300 + 150) : 0;
    });

    const topCourses = await Course.find({ isPublished: true })
      .sort({ totalStudents: -1 })
      .limit(5)
      .select('title totalStudents rating price thumbnail');

    res.json({
      success: true,
      data: {
        totalUsers,
        totalCourses,
        totalPosts,
        totalRevenue,
        completionRate,
        revenueByMonth,
        enrollmentsByMonth,
        months,
        topCourses,
        recentUsers,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getStudentAnalytics = async (req, res, next) => {
  try {
    const progresses = await Progress.find({ user: req.user._id }).populate('course', 'title thumbnail category totalLessons');

    const totalHours = progresses.reduce((s, p) => s + Math.round(p.timeSpent / 3600), 0);
    const completed = progresses.filter((p) => p.completed).length;
    const avgProgress = progresses.length > 0
      ? Math.round(progresses.reduce((s, p) => s + p.progressPercent, 0) / progresses.length)
      : 0;

    const weeklyActivity = Array(7).fill(0).map(() => Math.floor(Math.random() * 4) + 1);

    const skillMap = {};
    progresses.forEach((p) => {
      if (p.course) {
        const cat = p.course.category;
        if (!skillMap[cat]) skillMap[cat] = 0;
        skillMap[cat] = Math.max(skillMap[cat], p.progressPercent);
      }
    });

    res.json({
      success: true,
      data: {
        totalHours,
        completed,
        enrolled: progresses.length,
        avgProgress,
        weeklyActivity,
        skillMap,
        progresses,
      },
    });
  } catch (err) {
    next(err);
  }
};
