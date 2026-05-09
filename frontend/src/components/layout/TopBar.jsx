import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Bell, ShoppingCart, BookOpen } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuthStore from '../../store/authStore';
import useUIStore from '../../store/uiStore';
import useCartStore from '../../store/cartStore';
import { usersAPI } from '../../services/api';
import { formatDistanceToNow } from '../common/utils';

const PAGE_TITLES = {
  '/dashboard':    'Dashboard',
  '/courses':      'Courses',
  '/progress':     'My Progress',
  '/calendar':     'Calendar',
  '/ai-assistant': 'AI Assistant',
  '/community':    'Community',
  '/resume':       'Resume Builder',
  '/jobs':         'Job Portal',
  '/cart':         'Shopping Cart',
  '/wishlist':      'My Wishlist',
  '/profile':      'Profile',
  '/admin':        'Admin Panel',
};

export default function TopBar() {
  const { user }                    = useAuthStore();
  const { sidebarOpen, setSidebar } = useUIStore();
  const cartCount                   = useCartStore(s => s.cartCount());
  const [notifOpen, setNotifOpen]   = useState(false);
  const location                    = useLocation();
  const qc                          = useQueryClient();

  const title = PAGE_TITLES[location.pathname] ||
    (location.pathname.startsWith('/courses/') ? 'Course' : 'NeuralLearn');

  const { data: notifData } = useQuery({
    queryKey: ['notifications'],
    queryFn:  () => usersAPI.getNotifications().then(r => r.data),
    refetchInterval: 30000,
  });

  const markAllMut = useMutation({
    mutationFn: usersAPI.markAllRead,
    onSuccess:  () => qc.invalidateQueries(['notifications']),
  });

  const notifications = notifData?.notifications || [];
  const unread        = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-6 bg-bg/90 backdrop-blur-xl border-b border-white/[0.06]">
      {/* Left */}
      <div className="flex items-center gap-3">
        {!sidebarOpen && (
          <button onClick={() => setSidebar(true)}
            className="p-2 rounded-xl hover:bg-white/[0.06] text-white/50 hover:text-white transition-colors">
            <Menu size={18} />
          </button>
        )}
        <h1 className="font-head font-bold text-lg tracking-tight">{title}</h1>
        {/* Courses quick link — visible on md+ */}
        <Link
          to="/courses"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/40 hover:text-accent hover:bg-accent/[0.06] rounded-lg transition-colors"
        >
          <BookOpen size={13} /> Courses
        </Link>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Cart */}
        <Link to="/cart"
          className="relative p-2 rounded-xl hover:bg-white/[0.06] text-white/50 hover:text-white transition-colors">
          <ShoppingCart size={18} />
          {cartCount > 0 && (
            <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>

        {/* Bell */}
        <div className="relative">
          <button onClick={() => setNotifOpen(o => !o)}
            className="relative p-2 rounded-xl hover:bg-white/[0.06] text-white/50 hover:text-white transition-colors">
            <Bell size={18} />
            {unread > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-80 bg-bg3 border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden z-50"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                  <span className="font-semibold text-sm">Notifications</span>
                  <button onClick={() => markAllMut.mutate()} className="text-accent text-xs hover:underline">Mark all read</button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0
                    ? <p className="text-center text-white/30 text-sm py-8">No notifications</p>
                    : notifications.slice(0, 8).map(n => (
                        <div key={n._id}
                          className={`flex gap-3 px-4 py-3 border-b border-white/[0.04] cursor-pointer hover:bg-white/[0.04] transition-colors ${!n.read ? 'opacity-100' : 'opacity-50'}`}>
                          <span className="text-lg flex-shrink-0">{n.icon || '🔔'}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs leading-relaxed">{n.text}</p>
                            <p className="text-xs text-white/30 mt-1">{formatDistanceToNow(new Date(n.createdAt))}</p>
                          </div>
                          {!n.read && <div className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0 mt-1" />}
                        </div>
                      ))
                  }
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar */}
        <Link to="/profile">
          {user?.avatar
            ? <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-white/10 cursor-pointer hover:border-accent transition-colors" />
            : <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent2 flex items-center justify-center text-xs font-bold text-white cursor-pointer">
                {user?.name?.split(' ').map(w => w[0]).join('') || 'U'}
              </div>
          }
        </Link>
      </div>
    </header>
  );
}
