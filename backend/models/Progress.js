const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId }],
    currentLesson: { type: mongoose.Schema.Types.ObjectId },
    progressPercent: { type: Number, default: 0 },
    timeSpent: { type: Number, default: 0 },
    quizScores: [
      {
        lessonId: mongoose.Schema.Types.ObjectId,
        score: Number,
        maxScore: Number,
        completedAt: Date,
      },
    ],
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
    certificateIssued: { type: Boolean, default: false },
    lastAccessed: { type: Date, default: Date.now },
    notes: [
      {
        lessonId: mongoose.Schema.Types.ObjectId,
        content: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

progressSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
