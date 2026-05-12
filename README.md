# NeuralLearn — Full-Stack LMS

## Stack
- **Frontend**: React 18 + Vite + Tailwind CSS + Framer Motion
- **Backend**: Node.js + Express + MongoDB + Mongoose
- **Auth**: JWT (access tokens stored in localStorage)
- **State**: Zustand + React Query

## Quick Start

### 1. Clone & Install

```bash
# Backend
cd backend
cp .env.example .env        # edit MONGO_URI, JWT_SECRET
npm install
npm run seed                # seed DB with courses + demo users
npm run dev                 # http://localhost:5000

# Frontend (new terminal)
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

## Project Structure

```
neurallearn/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── seed.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── progressController.js
│   │   ├── userController.js
│   │   ├── communityController.js
│   │   ├── jobController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── error.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Progress.js
│   │   ├── Job.js
│   │   └── Post.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── courses.js
│   │   ├── users.js
│   │   ├── progress.js
│   │   ├── jobs.js
│   │   ├── community.js
│   │   └── analytics.js
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── common/
    │   │   │   ├── UI.jsx         (Button, Modal, Badge, etc.)
    │   │   │   ├── CourseCard.jsx
    │   │   │   ├── ModalManager.jsx
    │   │   │   └── utils.js
    │   │   └── layout/
    │   │       ├── DashboardLayout.jsx
    │   │       ├── Sidebar.jsx
    │   │       └── TopBar.jsx
    │   ├── pages/
    │   │   ├── LandingPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── CoursesPage.jsx
    │   │   ├── CourseDetailPage.jsx
    │   │   ├── CoursePlayerPage.jsx
    │   │   ├── ProgressPage.jsx
    │   │   ├── CalendarPage.jsx
    │   │   ├── ChatbotPage.jsx
    │   │   ├── CommunityPage.jsx
    │   │   ├── PostDetailPage.jsx
    │   │   ├── ResumePage.jsx
    │   │   ├── JobsPage.jsx
    │   │   ├── ProfilePage.jsx
    │   │   ├── AdminPage.jsx
    │   │   └── NotFoundPage.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── store/
    │   │   ├── authStore.js
    │   │   └── uiStore.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET  /api/auth/me`
- `PUT  /api/auth/me`
- `PUT  /api/auth/password`

### Courses
- `GET    /api/courses`
- `GET    /api/courses/featured`
- `GET    /api/courses/:slug`
- `POST   /api/courses`
- `PUT    /api/courses/:id`
- `DELETE /api/courses/:id`
- `POST   /api/courses/:id/enroll`
- `POST   /api/courses/:id/reviews`

### Progress
- `GET  /api/progress`
- `GET  /api/progress/:courseId`
- `POST /api/progress/:courseId/lessons/:lessonId/complete`
- `POST /api/progress/:courseId/time`
- `POST /api/progress/:courseId/notes`

### Users (Admin)
- `GET    /api/users`
- `GET    /api/users/:id`
- `PUT    /api/users/:id`
- `DELETE /api/users/:id`
- `GET    /api/users/notifications`
- `PUT    /api/users/notifications/:id/read`
- `PUT    /api/users/resume`

### Community
- `GET    /api/community`
- `GET    /api/community/:id`
- `POST   /api/community`
- `PUT    /api/community/:id`
- `DELETE /api/community/:id`
- `POST   /api/community/:id/like`
- `POST   /api/community/:id/comments`

### Jobs
- `GET    /api/jobs`
- `GET    /api/jobs/:id`
- `POST   /api/jobs`
- `POST   /api/jobs/:id/apply`
- `DELETE /api/jobs/:id`

### Analytics
- `GET /api/analytics/admin`
- `GET /api/analytics/student`

## Features
- JWT auth with role-based access (student/instructor/admin)
- Full course CRUD with curriculum sections & lessons
- Video player with lesson completion tracking
- Progress tracking with certificates
- AI Chatbot (frontend UI, plug in OpenAI/Claude API)
- Resume builder with live preview
- Job portal with application tracking
- Community forum with likes & comments
- Admin analytics dashboard with charts
- Calendar with custom events
- Dark theme + glassmorphism + Framer Motion animations
