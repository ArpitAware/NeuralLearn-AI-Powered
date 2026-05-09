import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from './store/authStore';
import DashboardLayout from './components/layout/DashboardLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
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
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import ModalManager from './components/common/ModalManager';

const PrivateRoute = ({ children, roles }) => {
  const { user } = useAuthStore();
  const token = useAuthStore(s => s.token) || localStorage.getItem('nl_token');
  if (!token) return <Navigate to="/login" replace />;
  if (roles && user && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
};

const AuthRoute = ({ children }) => {
  const token = useAuthStore(s => s.token) || localStorage.getItem('nl_token');
  if (token) return <Navigate to="/dashboard" replace />;
  return children;
};

export default function App() {
  const { token, refreshMe } = useAuthStore();

  useEffect(() => {
    const stored = token || localStorage.getItem('nl_token');
    if (stored) refreshMe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Routes>
        {/* ── Fully public ── */}
        <Route path="/"       element={<LandingPage />} />
        <Route path="/about"  element={<AboutPage />} />
        <Route path="/login"    element={<AuthRoute><LoginPage /></AuthRoute>} />
        <Route path="/register" element={<AuthRoute><RegisterPage /></AuthRoute>} />

        {/* ── Protected ── */}
        <Route path="/" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
          <Route path="dashboard"           element={<Dashboard />} />
          <Route path="courses"             element={<CoursesPage />} />
          <Route path="courses/:slug"       element={<CourseDetailPage />} />
          <Route path="courses/:slug/learn" element={<CoursePlayerPage />} />
          <Route path="progress"            element={<ProgressPage />} />
          <Route path="calendar"            element={<CalendarPage />} />
          <Route path="ai-assistant"        element={<ChatbotPage />} />
          <Route path="community"           element={<CommunityPage />} />
          <Route path="community/:id"       element={<PostDetailPage />} />
          <Route path="resume"              element={<ResumePage />} />
          <Route path="jobs"                element={<JobsPage />} />
          <Route path="cart"                element={<CartPage />} />
          <Route path="wishlist"             element={<WishlistPage />} />
          <Route path="profile"             element={<ProfilePage />} />
          <Route path="admin"               element={<PrivateRoute roles={['admin']}><AdminPage /></PrivateRoute>} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ModalManager />
    </>
  );
}
