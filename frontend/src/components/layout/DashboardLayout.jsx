import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import useUIStore from '../../store/uiStore';

export default function DashboardLayout() {
  const { sidebarOpen } = useUIStore();

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <div
        className="flex-1 flex flex-col transition-all duration-300 min-w-0"
        style={{ marginLeft: sidebarOpen ? 240 : 0 }}
      >
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="p-3 sm:p-5 lg:p-6 max-w-[1280px] mx-auto"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
