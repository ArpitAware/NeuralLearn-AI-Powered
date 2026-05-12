/**
 * components/layout/Layout.jsx
 * FIXES: logout→home, currency in topbar, "Go to App"→Dashboard/Profile links
 */
import { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useCurrency, CURRENCIES } from '../../context/CurrencyContext';
import {
  FiGrid, FiList, FiTarget, FiUser, FiLogOut,
  FiSun, FiMoon, FiMenu, FiX, FiHome, FiChevronDown,
} from 'react-icons/fi';

const NAV_ITEMS = [
  { to: '/dashboard', icon: FiGrid,   label: 'Dashboard' },
  { to: '/expenses',  icon: FiList,   label: 'Expenses'  },
  { to: '/budget',    icon: FiTarget, label: 'Budget'    },
  { to: '/profile',   icon: FiUser,   label: 'Profile'   },
];

function CurrencyPicker() {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const current = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition border border-indigo-100 dark:border-indigo-800"
      >
        <span className="text-base">{current.symbol}</span>
        <span className="hidden sm:inline text-xs">{current.code}</span>
        <FiChevronDown className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 py-2 z-50 animate-slide-up">
          <p className="px-4 py-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Currency</p>
          {CURRENCIES.map((c) => (
            <button
              key={c.code}
              onClick={() => { setCurrency(c.code); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition ${
                c.code === currency
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 font-semibold'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <span className="w-7 font-bold">{c.symbol}</span>
              <span className="flex-1">{c.name}</span>
              <span className="text-xs text-gray-400">{c.code}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Layout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // FIX: logout → home page
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const initial = user?.name?.charAt(0).toUpperCase() || '?';

  const SidebarContent = ({ mobile = false }) => (
    <>
      <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100 dark:border-gray-800/80">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
          <span className="text-white font-black text-lg">₹</span>
        </div>
        <span className="font-black text-gray-900 dark:text-white text-lg tracking-tight">SpendWise</span>
        {mobile && (
          <button onClick={() => setSidebarOpen(false)} className="ml-auto text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1">
            <FiX className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {label}
          </NavLink>
        ))}

        <div className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-800">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 transition-all">
            <FiHome className="w-5 h-5 flex-shrink-0" />
            Back to Home
          </Link>
        </div>
      </nav>

      {/* User footer */}
      <div className="px-3 pb-4 border-t border-gray-100 dark:border-gray-800 pt-3">
        <button onClick={toggleTheme}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition mb-1">
          {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">{initial}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
          <button onClick={handleLogout} title="Logout" className="text-gray-400 hover:text-red-500 transition p-1">
            <FiLogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800/80 h-full flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col lg:hidden shadow-2xl">
            <SidebarContent mobile />
          </aside>
        </>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar with currency switcher */}
        <header className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800/80 flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 p-1">
            <FiMenu className="w-6 h-6" />
          </button>
          <span className="font-black text-gray-900 dark:text-white lg:hidden">SpendWise</span>
          <div className="flex-1" />

          {/* Currency switcher */}
          <CurrencyPicker />

          {/* Theme */}
          <button onClick={toggleTheme} className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
          </button>

          {/* Avatar with dropdown links — Dashboard & Profile */}
          <div className="relative group">
            <button className="flex items-center gap-2 pl-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center ring-2 ring-white dark:ring-gray-900">
                <span className="text-white font-bold text-sm">{initial}</span>
              </div>
              <FiChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
            </button>
            {/* Dropdown */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <p className="px-4 py-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider truncate">{user?.name}</p>
              <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                <FiGrid className="w-4 h-4 text-indigo-500" /> Dashboard
              </Link>
              <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                <FiUser className="w-4 h-4 text-indigo-500" /> Profile
              </Link>
              <hr className="my-1 border-gray-100 dark:border-gray-700" />
              <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
                <FiLogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-gray-50 dark:bg-gray-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
