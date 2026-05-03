const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: 80 },
    email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, match: [/^\S+@\S+\.\S+$/, 'Invalid email'] },
    password: { type: String, required: [true, 'Password is required'], minlength: 6, select: false },
    role: { type: String, enum: ['student', 'instructor', 'admin'], default: 'student' },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '', maxlength: 500 },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    createdCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    resume: {
      title: { type: String, default: '' },
      summary: { type: String, default: '' },
      skills: [String],
      experience: [{ company: String, role: String, period: String, description: String }],
      education: [{ school: String, degree: String, period: String }],
      links: { github: String, linkedin: String, portfolio: String },
    },
    notifications: [
      {
        text: String,
        icon: String,
        read: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    streak: { type: Number, default: 0 },
    totalHours: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

userSchema.methods.getSignedJwt = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

userSchema.methods.toPublic = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
