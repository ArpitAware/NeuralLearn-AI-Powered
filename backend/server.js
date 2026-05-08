const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const userRoutes = require('./routes/users');
const progressRoutes = require('./routes/progress');
const jobRoutes = require('./routes/jobs');
const communityRoutes = require('./routes/community');
const analyticsRoutes = require('./routes/analytics');

const app = express();

/* =========================
   CORS CONFIGURATION
========================= */

const allowedOrigins = [
  'http://localhost:5173',
  'https://neural-learn-ai-powered.vercel.app',
  'https://neural-learn-ai-powered-acbd4fxfi-arpitawares-projects.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin
    // (mobile apps, Postman, server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  },
  credentials: true,
}));

/* =========================
   MIDDLEWARE
========================= */

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

/* =========================
   STATIC FILES
========================= */

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* =========================
   API ROUTES
========================= */

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/analytics', analyticsRoutes);

/* =========================
   HEALTH CHECK
========================= */

app.get('/', (req, res) => {
  res.send('NeuralLearn Backend Running 🚀');
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    time: new Date(),
  });
});

/* =========================
   ERROR HANDLER
========================= */

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
  });
});

/* =========================
   DATABASE CONNECTION
========================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');

    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });

module.exports = app;