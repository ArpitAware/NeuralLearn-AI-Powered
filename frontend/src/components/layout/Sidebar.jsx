import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, BarChart2, Calendar, Brain, Users, FileText,
  Briefcase, LogOut, ChevronLeft, Shield, Globe, ShoppingCart, Heart
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useUIStore from '../../store/uiStore';
import useCartStore from '../../store/cartStore';

const NAV = [
  { path: '/dashboard',    icon: Home,      label: 'Dashboard'     },
  { path: '/progress',     icon: BarChart2, label: 'Progress'      },
  { path: '/calendar',     icon: Calendar,  label: 'Calendar'      },
  { path: '/ai-assistant', icon: Brain,     label: 'AI Assistant'  },
  { path: '/community',    icon: Users,     label: 'Community'     },
  { path: '/resume',       icon: FileText,  label: 'Resume Builder'},
  { path: '/jobs',         icon: Briefcase, label: 'Job Portal'    },
];

export default function Sidebar() {
  const { user, logout }            = useAuthStore();
  const { sidebarOpen, setSidebar } = useUIStore();
  const { cartCount, wishlist }     = useCartStore();
  const navigate   = useNavigate();
  const count      = cartCount();
  const wishCount  = wishlist.length;
  const initials   = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase() || 'U';

  return (
    <>
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
        animate={{ x: sidebarOpen ? 0 : -240 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center justify-between px-4 py-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent2 flex items-center justify-center font-head font-black text-white text-sm">N</div>
            <span className="font-head font-bold text-white tracking-tight">NeuralLearn</span>
          </div>
          <button onClick={() => setSidebar(false)}
            className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/40 hover:text-white transition-colors">
            <ChevronLeft size={16} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Globe size={16} className="flex-shrink-0 opacity-70" />
            <span className="flex-1">Home Page</span>
          </NavLink>

          <div className="my-1.5 border-t border-white/[0.05]" />

          {NAV.map(({ path, icon: Icon, label }) => (
            <NavLink key={path} to={path} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Icon size={16} className="flex-shrink-0 opacity-70" />
              <span className="flex-1">{label}</span>
            </NavLink>
          ))}

          <div className="my-1.5 border-t border-white/[0.05]" />

          <NavLink to="/cart" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <ShoppingCart size={16} className="flex-shrink-0 opacity-70" />
            <span className="flex-1">Cart</span>
            {count > 0 && (
              <span className="w-5 h-5 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
                {count}
              </span>
            )}
          </NavLink>

          <NavLink to="/wishlist" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Heart size={16} className={`flex-shrink-0 ${wishCount > 0 ? 'text-red-400' : 'opacity-70'}`} fill={wishCount > 0 ? 'currentColor' : 'none'} />
            <span className={`flex-1 ${wishCount > 0 ? 'text-red-400/80' : ''}`}>Wishlist</span>
            {wishCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold flex items-center justify-center border border-red-500/30">
                {wishCount}
              </span>
            )}
          </NavLink>

          {user?.role === 'admin' && (
            <>
              <div className="my-1.5 border-t border-white/[0.05]" />
              <NavLink to="/admin" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Shield size={16} className="flex-shrink-0 opacity-70" />
                <span className="flex-1">Admin Panel</span>
              </NavLink>
            </>
          )}
        </nav>

        <div className="border-t border-white/[0.06] p-3">
          <NavLink to="/profile"
            className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/[0.06] transition-colors mb-1">
            {user?.avatar
              ? <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-white/10 flex-shrink-0" />
              : <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent2 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">{initials}</div>
            }
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs text-white/40 capitalize">{user?.role}</p>
            </div>
          </NavLink>
          <button onClick={() => { logout(); navigate('/'); }}
            className="nav-item w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
            <LogOut size={16} className="flex-shrink-0" />
            <span>Sign out</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
}
