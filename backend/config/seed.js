const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const Course = require('../models/Course');
const Job = require('../models/Job');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB for seeding...');

  await User.deleteMany({});
  await Course.deleteMany({});
  await Job.deleteMany({});

  // ✅ FIX: Let each User.create() call go through the pre-save hook normally.
  // Do NOT pre-hash the password — the hook will hash it once with salt rounds 12.
  // Pre-hashing + hook = double hash = matchPassword always fails for seeded users.

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@neurallearn.io',
    password: 'password123',          // plain text — hook hashes it
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?img=1',
    bio: 'Platform administrator',
  });

  const instructor = await User.create({
    name: 'Dr. Sarah Chen',
    email: 'sarah@neurallearn.io',
    password: 'password123',          // plain text — hook hashes it
    role: 'instructor',
    avatar: 'https://i.pravatar.cc/150?img=5',
    bio: 'ML researcher with 10+ years experience at Google Brain.',
  });

  const student = await User.create({
    name: 'Alex Morgan',
    email: 'alex@neurallearn.io',
    password: 'password123',          // plain text — hook hashes it
    role: 'student',
    avatar: 'https://i.pravatar.cc/150?img=8',
    bio: 'Aspiring ML engineer, building projects.',
  });

  const courses = await Course.insertMany([
    {
      title: 'Advanced Machine Learning',
      slug: 'advanced-machine-learning',
      instructor: instructor._id,
      category: 'AI/ML',
      level: 'Advanced',
      price: 89,
      description: 'Master deep learning, neural networks, and production ML systems.',
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
      duration: '42h',
      totalLessons: 86,
      rating: 4.9,
      totalStudents: 12847,
      tags: ['Python', 'TensorFlow', 'PyTorch'],
      sections: [
        {
          title: 'Introduction to ML',
          lessons: [
            { title: 'What is Machine Learning?', duration: '12:30', type: 'video', videoUrl: 'https://www.youtube.com/embed/ukzFI9rgwfU' },
            { title: 'Setting Up Your Environment', duration: '08:45', type: 'video', videoUrl: 'https://www.youtube.com/embed/ukzFI9rgwfU' },
            { title: 'Python Refresher', duration: '20:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/ukzFI9rgwfU' },
          ],
        },
        {
          title: 'Supervised Learning',
          lessons: [
            { title: 'Linear Regression', duration: '18:20', type: 'video', videoUrl: 'https://www.youtube.com/embed/ukzFI9rgwfU' },
            { title: 'Logistic Regression', duration: '22:15', type: 'video', videoUrl: 'https://www.youtube.com/embed/ukzFI9rgwfU' },
            { title: 'Decision Trees', duration: '25:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/ukzFI9rgwfU' },
          ],
        },
        {
          title: 'Neural Networks',
          lessons: [
            { title: 'Intro to Neural Networks', duration: '30:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/ukzFI9rgwfU' },
            { title: 'Backpropagation Deep Dive', duration: '35:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/ukzFI9rgwfU' },
            { title: 'Quiz: Neural Networks', duration: '10:00', type: 'quiz' },
          ],
        },
      ],
      isPublished: true,
      isFeatured: true,
    },
    {
      title: 'Full-Stack Web Development',
      slug: 'full-stack-web-development',
      instructor: instructor._id,
      category: 'Web Dev',
      level: 'Intermediate',
      price: 79,
      description: 'Build production-grade web apps with React, Node.js, and PostgreSQL.',
      thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400',
      duration: '68h',
      totalLessons: 142,
      rating: 4.8,
      totalStudents: 23156,
      tags: ['React', 'Node', 'PostgreSQL'],
      sections: [
        {
          title: 'HTML & CSS Foundations',
          lessons: [
            { title: 'HTML Deep Dive', duration: '20:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/ukzFI9rgwfU' },
            { title: 'CSS Mastery', duration: '25:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/ukzFI9rgwfU' },
          ],
        },
        {
          title: 'React Fundamentals',
          lessons: [
            { title: 'Components & Props', duration: '18:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/ukzFI9rgwfU' },
            { title: 'Hooks Deep Dive', duration: '22:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/ukzFI9rgwfU' },
            { title: 'State Management', duration: '28:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/ukzFI9rgwfU' },
          ],
        },
      ],
      isPublished: true,
      isFeatured: true,
    },
    {
      title: 'UI/UX Design Mastery',
      slug: 'ui-ux-design-mastery',
      instructor: instructor._id,
      category: 'Design',
      level: 'Beginner',
      price: 69,
      description: 'Design stunning interfaces with Figma. Learn design systems, prototyping.',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
      duration: '28h',
      totalLessons: 64,
      rating: 4.7,
      totalStudents: 8932,
      tags: ['Figma', 'Design Systems', 'UX'],
      sections: [
        {
          title: 'Design Fundamentals',
          lessons: [
            { title: 'Color Theory', duration: '15:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/ukzFI9rgwfU' },
            { title: 'Typography', duration: '18:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/ukzFI9rgwfU' },
          ],
        },
      ],
      isPublished: true,
      isFeatured: true,
    },
    {
      title: 'Data Science with Python',
      slug: 'data-science-python',
      instructor: instructor._id,
      category: 'Data Science',
      level: 'Intermediate',
      price: 74,
      description: 'From data wrangling to predictive modeling. Master Pandas, NumPy.',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
      duration: '54h',
      totalLessons: 110,
      rating: 4.8,
      totalStudents: 18764,
      tags: ['Python', 'Pandas', 'Scikit-learn'],
      sections: [
        {
          title: 'Data Wrangling',
          lessons: [
            { title: 'Pandas Fundamentals', duration: '22:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/ukzFI9rgwfU' },
            { title: 'NumPy Deep Dive', duration: '20:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/ukzFI9rgwfU' },
          ],
        },
      ],
      isPublished: true,
    },
    {
      title: 'Cloud Architecture on AWS',
      slug: 'cloud-architecture-aws',
      instructor: instructor._id,
      category: 'Cloud',
      level: 'Advanced',
      price: 119,
      description: 'Architect scalable cloud systems. Prepare for AWS Solutions Architect cert.',
      thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400',
      duration: '46h',
      totalLessons: 92,
      rating: 4.9,
      totalStudents: 9871,
      tags: ['AWS', 'DevOps', 'Terraform'],
      sections: [
        {
          title: 'AWS Fundamentals',
          lessons: [
            { title: 'IAM & Security', duration: '25:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/ukzFI9rgwfU' },
            { title: 'EC2 Deep Dive', duration: '30:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/ukzFI9rgwfU' },
          ],
        },
      ],
      isPublished: true,
    },
  ]);

  await Job.insertMany([
    { title: 'ML Engineer', company: 'Anthropic', location: 'Remote', salary: '$180k-$240k', type: 'Full-time', tags: ['Python', 'TensorFlow', 'LLMs'], description: 'Build cutting-edge AI systems.', applyUrl: 'https://anthropic.com/careers' },
    { title: 'Senior Frontend Dev', company: 'Vercel', location: 'San Francisco', salary: '$150k-$200k', type: 'Full-time', tags: ['React', 'TypeScript', 'Next.js'], description: 'Shape the future of web development.', applyUrl: 'https://vercel.com/careers' },
    { title: 'Data Scientist', company: 'OpenAI', location: 'Remote', salary: '$160k-$220k', type: 'Full-time', tags: ['Python', 'Statistics', 'ML'], description: 'Drive insights from large-scale data.', applyUrl: 'https://openai.com/careers' },
    { title: 'DevOps Engineer', company: 'Stripe', location: 'New York', salary: '$140k-$180k', type: 'Full-time', tags: ['AWS', 'Kubernetes', 'CI/CD'], description: 'Build infrastructure at global scale.', applyUrl: 'https://stripe.com/jobs' },
    { title: 'UI/UX Designer', company: 'Figma', location: 'Remote', salary: '$130k-$170k', type: 'Contract', tags: ['Figma', 'Design Systems', 'Research'], description: 'Design the tools designers use.', applyUrl: 'https://figma.com/careers' },
  ]);

  // ✅ Enroll student in first 3 courses with real progress records
  const Progress = require('../models/Progress');
  await Progress.deleteMany({});
  const enrollCourses = courses.slice(0, 3);
  for (const course of enrollCourses) {
    const pct = Math.floor(Math.random() * 80) + 10; // 10-90%
    const totalLessons = course.sections.reduce((s, sec) => s + sec.lessons.length, 0);
    const completedCount = Math.floor((pct / 100) * totalLessons);
    const completedLessons = course.sections
      .flatMap(s => s.lessons)
      .slice(0, completedCount)
      .map(l => l._id);

    await Progress.create({
      user: student._id,
      course: course._id,
      completedLessons,
      progressPercent: pct,
      timeSpent: pct * 120,
      lastAccessed: new Date(Date.now() - Math.random() * 6 * 86400000),
    });

    student.enrolledCourses.push(course._id);
  }
  await student.save({ validateBeforeSave: false });

  console.log('Seed complete!');
  console.log('Admin:      admin@neurallearn.io / password123');
  console.log('Instructor: sarah@neurallearn.io / password123');
  console.log('Student:    alex@neurallearn.io  / password123');
  process.exit(0);
};

seed().catch((e) => { console.error(e); process.exit(1); });
