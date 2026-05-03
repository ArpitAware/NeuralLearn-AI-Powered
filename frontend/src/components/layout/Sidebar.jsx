import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, BookOpen, BarChart2, Calendar, Brain, Users, FileText,
  Briefcase, Settings, LogOut, ChevronLeft, Shield, Bell
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useUIStore from '../../store/uiStore';

const NAV = [
  { path: '/dashboard',    icon: Home,      label: 'Dashboard' },
  { path: '/courses',      icon: BookOpen,  label: 'Courses' },
  { path: '/progress',     icon: BarChart2, label: 'Progress' },
  { path: '/calendar',     icon: Calendar,  label: 'Calendar' },
  { path: '/ai-assistant', icon: Brain,     label: 'AI Assistant' },
  { path: '/community',    icon: Users,     label: 'Community' },
  { path: '/resume',       icon: FileText,  label: 'Resume Builder' },
  { path: '/jobs',         icon: Briefcase, label: 'Job Portal' },
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const { sidebarOpen, setSidebar } = useUIStore();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  const sidebarVariants = {
    open:   { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: -240, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  };

  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase() || 'U';

  return (
    <>
      {/* Overlay on mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebar(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className="fixed top-0 left-0 h-full w-60 bg-bg2 border-r border-white/[0.06] flex flex-col z-50 overflow-hidden"
        variants={sidebarVariants}
        animate={sidebarOpen ? 'open' : 'closed'}
        initial="open"
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent2 flex items-center justify-center font-head font-black text-white text-sm">
              N
            </div>
            <span className="font-head font-bold text-white tracking-tight">NeuralLearn</span>
          </div>
          <button
            onClick={() => setSidebar(false)}
            className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/40 hover:text-white transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {NAV.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={16} className="flex-shrink-0 opacity-70" />
              <span className="flex-1">{label}</span>
            </NavLink>
          ))}

          {user?.role === 'admin' && (
            <>
              <div className="my-2 border-t border-white/[0.06]" />
              <NavLink
                to="/admin"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <Shield size={16} className="flex-shrink-0 opacity-70" />
                <span className="flex-1">Admin Panel</span>
              </NavLink>
            </>
          )}
        </nav>

        {/* User footer */}
        <div className="border-t border-white/[0.06] p-3">
          <NavLink to="/profile" className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/[0.06] transition-colors mb-1 group">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-white/10 flex-shrink-0" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent2 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                {initials}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs text-white/40 capitalize">{user?.role}</p>
            </div>
          </NavLink>
          <button
            onClick={handleLogout}
            className="nav-item w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <LogOut size={16} className="flex-shrink-0" />
            <span>Sign out</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
}
