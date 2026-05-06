const User = require('../models/User');
const { validationResult } = require('express-validator');

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedJwt();
  user.password = undefined;
  res.status(statusCode).json({ success: true, token, user });
};

exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    const user = await User.create({
      name,
      email,
      password,
      role: role === 'instructor' ? 'instructor' : 'student',
      notifications: [
        { text: `Welcome to NeuralLearn, ${name}!`, icon: '🎉', read: false },
      ],
    });
    sendToken(user, 201, res);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });
    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('enrolledCourses', 'title thumbnail category slug')
      .populate('createdCourses', 'title thumbnail totalStudents');
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

exports.updateMe = async (req, res, next) => {
  try {
    const { name, bio, avatar, resume } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio, avatar, resume },
      { new: true, runValidators: true }
    );
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('+password');
    const { currentPassword, newPassword } = req.body;
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(400).json({ success: false, message: 'Current password incorrect' });
    }
    user.password = newPassword;
    await user.save();
    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};
