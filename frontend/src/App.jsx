import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from './store/authStore';
import DashboardLayout from './components/layout/DashboardLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import CoursePlayerPage from './pages/CoursePlayerPage';
import ProgressPage from './pages/ProgressPage';
import CalendarPage from './pages/CalendarPage';
import ChatbotPage from './pages/ChatbotPage';
import CommunityPage from './pages/CommunityPage';
import PostDetailPage from './pages/PostDetailPage';
import ResumePage from './pages/ResumePage';
import JobsPage from './pages/JobsPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import ModalManager from './components/common/ModalManager';

// ✅ FIX: Read token directly from localStorage inside guard — Zustand hydration
// can lag behind the first render causing a flicker-redirect to /login.
const PrivateRoute = ({ children, roles }) => {
  const { user } = useAuthStore();
  // Also check localStorage directly so the guard works even before Zustand hydrates
  const token = useAuthStore(s => s.token) || localStorage.getItem('nl_token');

  if (!token) return <Navigate to="/login" replace />;

  // Role guard: if roles specified and user loaded, enforce them
  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// ✅ FIX: PublicRoute — if already logged in, redirect to dashboard
const PublicRoute = ({ children }) => {
  const token = useAuthStore(s => s.token) || localStorage.getItem('nl_token');
  if (token) return <Navigate to="/dashboard" replace />;
  return children;
};

export default function App() {
  const { token, refreshMe } = useAuthStore();

  // ✅ FIX: On app mount, if a token exists validate it by fetching /auth/me.
  // This keeps the user object in sync after page refresh and catches expired tokens.
  useEffect(() => {
    const storedToken = token || localStorage.getItem('nl_token');
    if (storedToken) {
      refreshMe();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

        {/* ✅ FIX: Single PrivateRoute wrapping the layout — no double-wrapping */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard"        element={<Dashboard />} />
          <Route path="courses"          element={<CoursesPage />} />
          <Route path="courses/:slug"    element={<CourseDetailPage />} />
          <Route path="courses/:slug/learn" element={<CoursePlayerPage />} />
          <Route path="progress"         element={<ProgressPage />} />
          <Route path="calendar"         element={<CalendarPage />} />
          <Route path="ai-assistant"     element={<ChatbotPage />} />
          <Route path="community"        element={<CommunityPage />} />
          <Route path="community/:id"    element={<PostDetailPage />} />
          <Route path="resume"           element={<ResumePage />} />
          <Route path="jobs"             element={<JobsPage />} />
          <Route path="profile"          element={<ProfilePage />} />
          {/* ✅ FIX: Admin uses same PrivateRoute but with roles — no nesting conflict */}
          <Route
            path="admin"
            element={
              <PrivateRoute roles={['admin']}>
                <AdminPage />
              </PrivateRoute>
            }
          />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ModalManager />
    </>
  );
}
