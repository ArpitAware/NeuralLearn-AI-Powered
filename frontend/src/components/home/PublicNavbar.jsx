/**
 * components/home/PublicNavbar.jsx
 * Premium floating pill navbar — always visible, glassmorphism, animated
 */
import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiMenu, FiX, FiGrid, FiUser, FiLogOut,
  FiChevronDown, FiHome, FiInfo, FiTag,
} from 'react-icons/fi';

const NAV_LINKS = [
  { to: '/',        label: 'Home',    icon: FiHome  },
  { to: '/about',   label: 'About',   icon: FiInfo  },
  { to: '/pricing', label: 'Pricing', icon: FiTag   },
];

export default function PublicNavbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen, setDropOpen]     = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const dropRef  = useRef(null);
  const navRef   = useRef(null);
  const linksRef = useRef({});

  /* ── Scroll listener ─────────────────────────────────────────────── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Outside click for dropdown ──────────────────────────────────── */
  useEffect(() => {
    const h = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  /* ── Sliding active indicator ────────────────────────────────────── */
  useEffect(() => {
    const activeLink = NAV_LINKS.find(l =>
      l.to === '/' ? location.pathname === '/' : location.pathname.startsWith(l.to)
    );
    if (activeLink && linksRef.current[activeLink.to] && navRef.current) {
      const el  = linksRef.current[activeLink.to];
      const nav = navRef.current;
      const elRect  = el.getBoundingClientRect();
      const navRect = nav.getBoundingClientRect();
      setIndicatorStyle({
        left:  elRect.left - navRect.left,
        width: elRect.width,
        opacity: 1,
      });
    }
  }, [location.pathname]);

  /* ── Close mobile menu on route change ───────────────────────────── */
  useEffect(() => { setMobileOpen(false); setDropOpen(false); }, [location.pathname]);

  const initial = user?.name?.charAt(0).toUpperCase() || '?';

  return (
    <>
      {/* ── DESKTOP NAV ─────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4 pointer-events-none">
        <nav
          className={`navbar-pill pointer-events-auto w-full max-w-4xl transition-all duration-500 ${
            scrolled
              ? 'rounded-2xl shadow-2xl shadow-black/40'
              : 'rounded-2xl'
          }`}
          style={{
            background: scrolled
              ? 'rgba(10, 10, 20, 0.85)'
              : 'rgba(10, 10, 20, 0.65)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            border: scrolled
              ? '1px solid rgba(99,102,241,0.25)'
              : '1px solid rgba(255,255,255,0.08)',
            boxShadow: scrolled
              ? '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 0 1px rgba(99,102,241,0.1)'
              : '0 2px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          <div className="flex items-center justify-between h-14 px-5">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg overflow-hidden">
                {/* Shine sweep */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative text-white font-black text-base">₹</span>
              </div>
              <span className="font-black text-lg text-white tracking-tight">
                Spend<span className="text-indigo-400">Wise</span>
              </span>
            </Link>

            {/* Center: nav links with sliding indicator */}
            <div className="hidden md:flex items-center relative" ref={navRef}>
              {/* Sliding background pill */}
              <div
                className="absolute h-8 bg-white/10 rounded-lg transition-all duration-300 ease-out pointer-events-none"
                style={{
                  left: indicatorStyle.left || 0,
                  width: indicatorStyle.width || 0,
                  opacity: indicatorStyle.opacity || 0,
                }}
              />
              {NAV_LINKS.map(({ to, label }) => (
                <span key={to} ref={el => { if (el) linksRef.current[to] = el; }}>
                  <NavLink
                    to={to}
                    end
                    className={({ isActive }) =>
                      `relative flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                </span>
              ))}
            </div>

            {/* Right: CTA */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <div className="relative" ref={dropRef}>
                  <button
                    onClick={() => setDropOpen(!dropOpen)}
                    className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl hover:bg-white/8 transition-all group"
                  >
                    {/* Avatar with ring */}
                    <div className="relative">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-indigo-500/30">
                        {initial}
                      </div>
                      {/* Online dot */}
                      <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full border border-gray-900" />
                    </div>
                    <span className="text-white text-sm font-semibold">{user.name?.split(' ')[0]}</span>
                    <FiChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${dropOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown */}
                  {dropOpen && (
                    <div
                      className="absolute right-0 top-full mt-3 w-52 rounded-2xl py-1.5 z-50"
                      style={{
                        background: 'rgba(12,12,24,0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1)',
                        animation: 'slide-up 0.15s ease-out both',
                      }}
                    >
                      {/* User info header */}
                      <div className="px-4 py-3 border-b border-white/5">
                        <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                        <p className="text-gray-500 text-xs truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link to="/dashboard" onClick={() => setDropOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                          <div className="w-7 h-7 rounded-lg bg-indigo-500/15 flex items-center justify-center">
                            <FiGrid className="w-3.5 h-3.5 text-indigo-400" />
                          </div>
                          Dashboard
                        </Link>
                        <Link to="/profile" onClick={() => setDropOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                          <div className="w-7 h-7 rounded-lg bg-purple-500/15 flex items-center justify-center">
                            <FiUser className="w-3.5 h-3.5 text-purple-400" />
                          </div>
                          Profile
                        </Link>
                      </div>
                      <div className="border-t border-white/5 py-1">
                        <button
                          onClick={() => { logout(); setDropOpen(false); }}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/8 transition-colors"
                        >
                          <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center">
                            <FiLogOut className="w-3.5 h-3.5 text-red-400" />
                          </div>
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="relative flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold text-white overflow-hidden group"
                    style={{
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      boxShadow: '0 0 20px rgba(99,102,241,0.35)',
                    }}
                  >
                    {/* Animated shine */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                    <span className="relative">Get Started</span>
                    <span className="relative text-indigo-200">↗</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile burger */}
            <button
              className="md:hidden relative w-9 h-9 flex items-center justify-center rounded-xl text-gray-300 hover:text-white hover:bg-white/8 transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <div className={`absolute transition-all duration-300 ${mobileOpen ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'}`}>
                <FiX className="w-5 h-5" />
              </div>
              <div className={`absolute transition-all duration-300 ${mobileOpen ? 'opacity-0 -rotate-90' : 'opacity-100 rotate-0'}`}>
                <FiMenu className="w-5 h-5" />
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* ── MOBILE DRAWER ───────────────────────────────────────────── */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        onClick={() => setMobileOpen(false)}
      />

      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-72 md:hidden transition-transform duration-300 ease-out ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{
          background: 'rgba(8,8,18,0.98)',
          backdropFilter: 'blur(24px)',
          borderLeft: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/5">
          <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-black text-sm">₹</span>
            </div>
            <span className="font-black text-white">Spend<span className="text-indigo-400">Wise</span></span>
          </Link>
          <button onClick={() => setMobileOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/8 transition">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Nav links */}
        <div className="px-3 py-4 space-y-1">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600/20 text-white border border-indigo-500/30'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </div>

        {/* Auth section */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-8 pt-4 border-t border-white/5">
          {user ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {initial}
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                  <p className="text-gray-500 text-xs truncate">{user.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link to="/dashboard" onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold">
                  <FiGrid className="w-4 h-4" /> Dashboard
                </Link>
                <button onClick={() => { logout(); setMobileOpen(false); }}
                  className="flex items-center justify-center gap-1.5 py-2.5 border border-white/10 text-gray-300 rounded-xl text-sm">
                  <FiLogOut className="w-4 h-4" /> Sign out
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Link to="/register" onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center w-full py-3 rounded-xl text-sm font-bold text-white"
                style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 0 20px rgba(99,102,241,0.3)' }}>
                Get Started Free ↗
              </Link>
              <Link to="/login" onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center w-full py-3 rounded-xl text-sm font-medium text-gray-400 border border-white/8 hover:text-white transition">
                Log in
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
