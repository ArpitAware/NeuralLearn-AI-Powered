const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: String, default: '0:00' },
  type: { type: String, enum: ['video', 'quiz', 'article', 'assignment'], default: 'video' },
  videoUrl: { type: String, default: '' },
  content: { type: String, default: '' },
  isPreview: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
});

const sectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  order: { type: Number, default: 0 },
  lessons: [lessonSchema],
});

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, maxlength: 1000 },
  },
  { timestamps: true }
);

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    slug: { type: String, unique: true, lowercase: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: {
      type: String,
      enum: ['AI/ML', 'Web Dev', 'Design', 'Data Science', 'Blockchain', 'Cloud', 'Mobile', 'DevOps'],
      required: true,
    },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number },
    description: { type: String, required: true },
    shortDescription: { type: String },
    thumbnail: { type: String, default: '' },
    previewVideo: { type: String, default: '' },
    duration: { type: String, default: '0h' },
    totalLessons: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    totalStudents: { type: Number, default: 0 },
    tags: [String],
    requirements: [String],
    outcomes: [String],
    sections: [sectionSchema],
    reviews: [reviewSchema],
    isPublished: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    language: { type: String, default: 'English' },
    certificate: { type: Boolean, default: true },
  },
  { timestamps: true }
);

courseSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  let count = 0;
  this.sections.forEach((s) => { count += s.lessons.length; });
  this.totalLessons = count;
  if (this.reviews.length > 0) {
    this.rating = this.reviews.reduce((s, r) => s + r.rating, 0) / this.reviews.length;
  }
  next();
});

courseSchema.index({ title: 'text', description: 'text', tags: 'text' });
courseSchema.index({ category: 1, level: 1, isPublished: 1 });

module.exports = mongoose.model('Course', courseSchema);
