import { useEffect, useRef, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import founder from '../assets/founder.png';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence, useInView } from 'framer-motion';
import {
  ArrowRight, Star, Zap, Users, Award, Briefcase, Code, BarChart2,
  ChevronDown, Brain, FileText, Calendar, MessageSquare, Lock,
  Play, CheckCircle2, Globe, Cpu, TrendingUp, Sparkles,
  Github, Linkedin, Twitter, MapPin, Mail, ShoppingCart
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { coursesAPI, jobsAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';

/* ─── Smooth cursor ──────────────────────────────────────────── */
function CursorGlow() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 80, damping: 20 });
  const sy = useSpring(y, { stiffness: 80, damping: 20 });
  useEffect(() => {
    const move = (e) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);
  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[999] hidden md:block"
      style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%' }}
    >
      <div className="w-5 h-5 rounded-full border border-white/40 mix-blend-difference" />
    </motion.div>
  );
}

/* ─── Animated counter ──────────────────────────────────────── */
function Counter({ to, suffix = '', duration = 2 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = parseInt(to.replace(/[^0-9]/g, ''));
    const step = end / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, to, duration]);
  const display = to.includes('K') ? `${count >= 1000 ? Math.floor(count/1000) : count}K` :
    to.includes('%') ? `${count}%` : to.includes('₹') ? `₹${count}K` : `${count}${suffix}`;
  return <span ref={ref}>{inView ? display : '0'}</span>;
}

/* ─── Magnetic button ───────────────────────────────────────── */
function MagneticBtn({ children, className, onClick, to, style }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });
  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.3);
    y.set((e.clientY - cy) * 0.3);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };
  const El = to ? Link : motion.button;
  return (
    <El to={to} ref={ref} style={style}
      className={className} onClick={onClick}
      onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <motion.span style={{ x: sx, y: sy }} className="flex items-center gap-2">
        {children}
      </motion.span>
    </El>
  );
}

/* ─── Floating orb ──────────────────────────────────────────── */
function Orb({ size, color, x, y, delay = 0, duration = 8 }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ width: size, height: size, left: x, top: y,
        background: `radial-gradient(circle at 30% 30%, ${color}40, ${color}05)`,
        filter: 'blur(60px)' }}
      animate={{ y: [0, -40, 0], x: [0, 20, 0], scale: [1, 1.1, 1] }}
      transition={{ duration, repeat: Infinity, delay, ease: 'easeInOut' }}
    />
  );
}

/* ─── Glowing grid ──────────────────────────────────────────── */
function GridBg() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(rgba(91,106,245,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(91,106,245,0.06) 1px, transparent 1px)',
        backgroundSize: '80px 80px',
      }} />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(91,106,245,0.15) 0%, transparent 70%)',
      }} />
    </div>
  );
}

/* ─── Section reveal ────────────────────────────────────────── */
function Reveal({ children, delay = 0, y = 40 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

/* ─── Animated word reveal ──────────────────────────────────── */
function WordReveal({ text, className, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const words = text.split(' ');
  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <motion.span key={i} className="inline-block mr-[0.25em]"
          initial={{ opacity: 0, y: 30, rotateX: -30 }}
          animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{ duration: 0.7, delay: delay + i * 0.08, ease: [0.16, 1, 0.3, 1] }}>
          {word}
        </motion.span>
      ))}
    </span>
  );
}

/* ─── Holographic card ──────────────────────────────────────── */
function HoloCard({ children, className = '' }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
    setTilt({ x, y });
  };
  return (
    <motion.div ref={ref} onMouseMove={handleMove} onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      animate={{ rotateY: tilt.x, rotateX: tilt.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
      className={`relative ${className}`}>
      {children}
      {/* Holographic sheen */}
      <div className="absolute inset-0 rounded-[inherit] pointer-events-none opacity-0 hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(${tilt.x * 5}deg, rgba(91,106,245,0.15) 0%, rgba(6,182,212,0.1) 50%, rgba(124,58,237,0.15) 100%)`, mixBlendMode: 'overlay' }} />
    </motion.div>
  );
}

/* ─── AI Orb hero visual ─────────────────────────────────────── */
function AIOrb() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 420, height: 420 }}>
      {/* Outer rings */}
      {[1, 2, 3].map(i => (
        <motion.div key={i} className="absolute rounded-full border border-accent/20"
          style={{ width: 160 + i * 80, height: 160 + i * 80 }}
          animate={{ rotate: 360 * (i % 2 === 0 ? 1 : -1) }}
          transition={{ duration: 8 + i * 4, repeat: Infinity, ease: 'linear' }}>
          <div className="absolute w-2.5 h-2.5 rounded-full bg-accent top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_12px_4px_rgba(91,106,245,0.6)]" />
        </motion.div>
      ))}
      {/* Core glow */}
      <motion.div className="absolute rounded-full"
        style={{ width: 180, height: 180, background: 'radial-gradient(circle at 35% 35%, rgba(124,58,237,0.8), rgba(91,106,245,0.4) 40%, rgba(6,182,212,0.2) 70%, transparent)' }}
        animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} />
      {/* Inner core */}
      <div className="relative z-10 w-28 h-28 rounded-full flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, rgba(91,106,245,0.9), rgba(124,58,237,0.8))', boxShadow: '0 0 60px 20px rgba(91,106,245,0.4), inset 0 0 30px rgba(255,255,255,0.1)' }}>
        <Brain size={44} className="text-white" />
      </div>
      {/* Floating particles */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const r = 160;
        return (
          <motion.div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-accent3"
            style={{ left: '50%', top: '50%' }}
            animate={{
              x: [Math.cos(angle) * r, Math.cos(angle + 0.5) * (r + 20), Math.cos(angle) * r],
              y: [Math.sin(angle) * r, Math.sin(angle + 0.5) * (r + 20), Math.sin(angle) * r],
              opacity: [0.4, 1, 0.4], scale: [1, 1.5, 1],
            }}
            transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
          />
        );
      })}
      {/* Scanning line */}
      <motion.div className="absolute rounded-full overflow-hidden" style={{ width: 180, height: 180 }}>
        <motion.div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-accent3 to-transparent"
          animate={{ y: [-90, 90, -90] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }} />
      </motion.div>
    </div>
  );
}

/* ─── Feature visual cards ───────────────────────────────────── */
function FeatureVisual({ type }) {
  if (type === 'ai') return (
    <div className="w-full h-52 rounded-2xl overflow-hidden relative"
      style={{ background: 'linear-gradient(135deg, rgba(91,106,245,0.15), rgba(124,58,237,0.08))' }}>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div className="relative">
          <motion.div className="w-16 h-16 rounded-2xl bg-accent/20 border border-accent/30 flex items-center justify-center"
            animate={{ y: [-5, 5, -5] }} transition={{ duration: 3, repeat: Infinity }}>
            <Brain size={28} className="text-accent" />
          </motion.div>
          {['React', 'Python', 'ML'].map((t, i) => (
            <motion.div key={t} className="absolute text-[10px] px-2 py-1 rounded-full bg-bg3 border border-white/10 text-accent font-mono whitespace-nowrap"
              style={{ top: ['-28px', '28px', '-28px'][i], left: ['-60px', '60px', '40px'][i] }}
              animate={{ y: [-2, 2, -2] }} transition={{ duration: 2.5, delay: i * 0.4, repeat: Infinity }}>
              {t}
            </motion.div>
          ))}
        </motion.div>
      </div>
      {/* Chat bubbles */}
      <div className="absolute bottom-4 left-4 right-4 space-y-2">
        {[{ r: false, t: 'Explain neural networks' }, { r: true, t: 'Think of it as...' }].map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: m.r ? 20 : -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.4 }}
            className={`text-[10px] px-3 py-1.5 rounded-xl max-w-[70%] ${m.r ? 'ml-auto bg-accent/20 border border-accent/20 text-accent' : 'bg-white/[0.06] border border-white/10 text-white/70'}`}>
            {m.t}
          </motion.div>
        ))}
      </div>
    </div>
  );

  if (type === 'resume') return (
    <div className="w-full h-52 rounded-2xl overflow-hidden bg-white p-4 relative">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent2 flex items-center justify-center text-white text-xs font-bold">A</div>
        <div>
          <div className="h-2 w-20 bg-gray-800 rounded mb-1" />
          <div className="h-1.5 w-14 bg-accent rounded" />
        </div>
      </div>
      {['Experience', 'Skills', 'Education'].map((s, i) => (
        <div key={s} className="mb-2">
          <div className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-1">{s}</div>
          <motion.div className="h-1.5 bg-gray-100 rounded overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-accent to-accent2 rounded"
              initial={{ width: 0 }} animate={{ width: `${[85, 70, 60][i]}%` }}
              transition={{ duration: 1.2, delay: 0.3 + i * 0.2, ease: [0.16, 1, 0.3, 1] }} />
          </motion.div>
        </div>
      ))}
      <motion.div className="absolute bottom-3 right-3 bg-accent text-white text-[9px] px-2 py-1 rounded-lg font-semibold"
        animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}>
        ATS Score: 98%
      </motion.div>
    </div>
  );

  if (type === 'progress') return (
    <div className="w-full h-52 rounded-2xl overflow-hidden relative"
      style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(6,182,212,0.05))' }}>
      <div className="p-4">
        <div className="text-xs text-white/40 mb-3 font-medium">Your Learning Journey</div>
        {[['Machine Learning', 74, '#5b6af5'], ['React', 89, '#10b981'], ['AWS', 52, '#f59e0b']].map(([n, v, c]) => (
          <div key={n} className="mb-2.5">
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-white/60">{n}</span>
              <span style={{ color: c }} className="font-bold">{v}%</span>
            </div>
            <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full" style={{ background: c }}
                initial={{ width: 0 }} animate={{ width: `${v}%` }}
                transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }} />
            </div>
          </div>
        ))}
        <motion.div className="mt-4 flex items-center gap-2 bg-white/[0.04] rounded-xl p-2.5 border border-white/[0.06]">
          <div className="text-xl">🔥</div>
          <div>
            <div className="text-[10px] text-white/60">Current streak</div>
            <div className="text-sm font-bold text-amber-400">14 days</div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  if (type === 'jobs') return (
    <div className="w-full h-52 rounded-2xl overflow-hidden relative"
      style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.06), rgba(91,106,245,0.06))' }}>
      <div className="p-4 space-y-2">
        {[
          { co: 'Google', role: 'ML Engineer', pay: '₹35L+', col: '#4285f4' },
          { co: 'Stripe',  role: 'Frontend Dev', pay: '₹28L+', col: '#635bff' },
          { co: 'OpenAI',  role: 'AI Researcher', pay: '₹42L+', col: '#10a37f' },
        ].map((j, i) => (
          <motion.div key={j.co}
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.2 }}
            className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.06] rounded-xl p-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm" style={{ background: `${j.col}20` }}>
              {j.co[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-semibold text-white/80">{j.role}</div>
              <div className="text-[9px] text-white/40">{j.co}</div>
            </div>
            <div className="text-[10px] font-bold text-emerald-400">{j.pay}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return null;
}

/* ─── Testimonial card ───────────────────────────────────────── */
const TESTIMONIALS = [
  { name: 'Leila Ahmadi',  role: 'ML Engineer @ Google',      text: 'NeuralLearn transformed my career. The AI assistant explains things better than most human tutors. Hired at Google in 6 months.', av: 'LA', rating: 5 },
  { name: 'Raj Patel',     role: 'Senior Dev @ Stripe',       text: 'Quality rivals top bootcamps at a fraction of the cost. The resume builder alone helped me land 3 callbacks in the first week.', av: 'RP', rating: 5 },
  { name: 'Mei Zhou',      role: 'Data Scientist @ Netflix',  text: 'The personalized learning paths are mind-blowing. It knew exactly what I needed before I did. Best investment in my career.', av: 'MZ', rating: 5 },
  { name: 'Carlos M.',     role: 'Frontend Dev @ Vercel',     text: 'The community here is world-class. Got code reviews from senior engineers within hours. This platform is genuinely different.', av: 'CM', rating: 5 },
  { name: 'Yuki Tanaka',   role: 'Cloud Architect @ AWS',     text: 'Passed AWS Solutions Architect on first try. The practice labs are exceptional and the AI tutor caught every gap in my knowledge.', av: 'YT', rating: 5 },
  { name: 'Priya Sharma',  role: 'Data Engineer @ Airbnb',    text: 'From zero coding to Airbnb in 8 months. NeuralLearn gave me both the skills and the confidence to make that leap.', av: 'PS', rating: 5 },
];

const FEATURES_GRID = [
  { icon: Brain,     title: 'AI-Powered Paths',      desc: 'Adaptive curriculum that learns you as you learn.',          type: 'ai'       },
  { icon: FileText,  title: 'Resume Builder',         desc: 'ATS-optimized resume from your history in one click.',       type: 'resume'   },
  { icon: BarChart2, title: 'Deep Analytics',         desc: 'Real-time skill map, streak tracking, and gap analysis.',    type: 'progress' },
  { icon: Briefcase, title: 'Live Job Portal',        desc: '1,000+ vetted roles matched to your exact skill level.',     type: 'jobs'     },
];

/* ════════════════════════════════════════════════════════════════
   MAIN LANDING PAGE
════════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const { token } = useAuthStore();
  const cartCount = useCartStore(s => s.cartCount());
  const navigate  = useNavigate();
  const heroRef   = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [navSolid, setNavSolid] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroScale   = useTransform(scrollYProgress, [0, 0.6], [1, 0.92]);
  const heroBlur    = useTransform(scrollYProgress, [0, 0.6], [0, 20]);

  useEffect(() => {
    const onScroll = () => { setScrollY(window.scrollY); setNavSolid(window.scrollY > 50); };
    const onMouse  = (e) => setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouse, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('mousemove', onMouse); };
  }, []);

  const { data: coursesData } = useQuery({
    queryKey: ['featured-courses'],
    queryFn:  () => coursesAPI.getFeatured().then(r => r.data),
  });
  const { data: jobsData } = useQuery({
    queryKey: ['landing-jobs'],
    queryFn:  () => jobsAPI.getAll({ limit: 4 }).then(r => r.data),
  });

  const featured = coursesData?.courses?.slice(0, 3) || [];
  const jobs     = jobsData?.jobs?.slice(0, 4) || [];

  const NAV_FEATURES = [
    { label: 'AI Assistant', path: '/ai-assistant' },
    { label: 'Resume',       path: '/resume'        },
    { label: 'Community',    path: '/community'     },
    { label: 'Jobs',         path: '/jobs'          },
  ];

  return (
    <div className="min-h-screen bg-bg overflow-x-hidden" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      <CursorGlow />

      {/* ══ NAVBAR ══════════════════════════════════════════════ */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{ background: navSolid ? 'rgba(4,4,10,0.92)' : 'transparent',
          backdropFilter: navSolid ? 'blur(24px)' : 'none',
          borderBottom: navSolid ? '1px solid rgba(255,255,255,0.06)' : 'none' }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <motion.div
              className="w-8 h-8 rounded-xl flex items-center justify-center font-head font-black text-white text-sm"
              style={{ background: 'linear-gradient(135deg,#5b6af5,#7c3aed)' }}
              whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: 'spring', stiffness: 400 }}>
              N
            </motion.div>
            <span className="font-head font-bold text-white tracking-tight text-base">NeuralLearn</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {[
              { label: 'Features', href: '#features' },
              { label: 'Courses',  to: token ? '/courses' : '/register' },
              { label: 'About',    to: '/about' },
            ].map(item => item.href ? (
              <a key={item.label} href={item.href}
                className="px-3 py-1.5 text-sm text-white/50 hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]">
                {item.label}
              </a>
            ) : (
              <Link key={item.label} to={item.to}
                className="px-3 py-1.5 text-sm text-white/50 hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]">
                {item.label}
              </Link>
            ))}
            {NAV_FEATURES.map(f => (
              token ? (
                <Link key={f.label} to={f.path}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-white/50 hover:text-accent transition-colors rounded-lg hover:bg-accent/[0.06]">
                  {f.label}
                </Link>
              ) : (
                <button key={f.label} onClick={() => navigate('/register')}
                  className="group flex items-center gap-1 px-3 py-1.5 text-sm text-white/30 hover:text-white/60 transition-colors rounded-lg hover:bg-white/[0.04]">
                  {f.label}
                  <Lock size={9} className="opacity-40 group-hover:opacity-80" />
                </button>
              )
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {token ? (
              <>
                <Link to="/cart" className="relative p-2 rounded-xl hover:bg-white/[0.06] text-white/50 hover:text-white transition-colors">
                  <ShoppingCart size={18} />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>
                  )}
                </Link>
                <MagneticBtn to="/dashboard"
                  className="btn btn-primary btn-sm"
                  style={{ background: 'linear-gradient(135deg,#5b6af5,#7c3aed)', boxShadow: '0 0 20px rgba(91,106,245,0.35)' }}>
                  Dashboard <ArrowRight size={14} />
                </MagneticBtn>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm hidden sm:flex">Log in</Link>
                <MagneticBtn to="/register"
                  className="btn btn-primary btn-sm"
                  style={{ background: 'linear-gradient(135deg,#5b6af5,#7c3aed)', boxShadow: '0 0 20px rgba(91,106,245,0.3)' }}>
                  Get Started <ArrowRight size={14} />
                </MagneticBtn>
              </>
            )}
          </div>
        </div>
      </motion.nav>

      {/* ══ HERO ════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <GridBg />
        <Orb size={700} color="#5b6af5" x="-15%" y="-10%" delay={0} duration={10} />
        <Orb size={600} color="#7c3aed" x="60%" y="30%"  delay={3} duration={8}  />
        <Orb size={400} color="#06b6d4" x="20%" y="60%"  delay={1.5} duration={12} />

        {/* Mouse-reactive light */}
        <motion.div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(600px at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(91,106,245,0.08) 0%, transparent 60%)` }} />

        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, filter: `blur(${heroBlur}px)` }}
          className="relative z-10 text-center px-5 sm:px-8 max-w-6xl mx-auto pt-20"
        >
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold tracking-widest uppercase mb-8"
            style={{ background: 'rgba(91,106,245,0.1)', borderColor: 'rgba(91,106,245,0.3)', color: '#818cf8' }}>
            <motion.span className="w-1.5 h-1.5 rounded-full bg-accent"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
            AI-Powered Learning Platform · v2.0
          </motion.div>

          {/* Hero headline */}
          <h1 className="font-head font-black leading-[1.02] tracking-[-0.05em] mb-6"
            style={{ fontSize: 'clamp(2.8rem, 8vw, 7rem)', color: '#f0f0ff' }}>
            <WordReveal text="Learn" className="block" delay={0.15} />
            <div className="block" style={{ overflow: 'hidden' }}>
              <motion.span
                initial={{ y: '100%' }} animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="block"
                style={{ background: 'linear-gradient(135deg, #818cf8, #a78bfa, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Smarter.
              </motion.span>
            </div>
            <WordReveal text="Get Hired." className="block" delay={0.5} />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
            className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            The most intelligent learning platform. AI tutoring, expert courses, a live resume builder,
            and a direct pipeline to top tech companies — in one seamless experience.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <MagneticBtn to={token ? '/dashboard' : '/register'}
              className="relative overflow-hidden text-white font-semibold px-8 py-4 rounded-2xl text-base"
              style={{ background: 'linear-gradient(135deg,#5b6af5,#7c3aed)', boxShadow: '0 0 40px rgba(91,106,245,0.5), 0 4px 24px rgba(0,0,0,0.4)' }}>
              <motion.div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#5b6af5)' }} />
              <span className="relative flex items-center gap-2">
                {token ? 'Open Dashboard' : 'Start for Free'} <ArrowRight size={18} />
              </span>
            </MagneticBtn>
            <a href="#features"
              className="flex items-center gap-2.5 px-7 py-4 rounded-2xl text-base font-medium text-white/70 hover:text-white transition-all border border-white/10 hover:border-white/20 hover:bg-white/[0.04]">
              <Play size={16} /> See How It Works
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
            className="flex flex-wrap justify-center gap-8 sm:gap-16">
            {[['50K+','Learners'],['200+','Courses'],['87%','Job Rate'],['₹92K','Avg Salary']].map(([v, l]) => (
              <div key={l} className="text-center">
                <div className="font-head font-black text-2xl sm:text-3xl"
                  style={{ background: 'linear-gradient(135deg,#818cf8,#38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {v}
                </div>
                <div className="text-white/35 text-xs mt-0.5">{l}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* AI Orb (desktop only) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 0.6, scale: 1 }}
          transition={{ delay: 1.2, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute right-[5%] top-1/2 -translate-y-1/2 hidden xl:block pointer-events-none">
          <AIOrb />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          style={{ opacity: Math.max(0, 1 - scrollY / 200) }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="text-[10px] text-white/30 uppercase tracking-widest">Scroll</div>
          <ChevronDown size={18} className="text-white/30" />
        </motion.div>
      </section>

      {/* ══ STATS BAND ══════════════════════════════════════════ */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(91,106,245,0.05), rgba(124,58,237,0.07), rgba(6,182,212,0.05))' }} />
        <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-accent/30 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-accent/30 to-transparent" />
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap justify-center gap-10 sm:gap-20">
          {[['50K+','Active Learners'],['200+','Expert Courses'],['87%','Job Placement'],['₹92K','Avg Package']].map(([v, l], i) => (
            <Reveal key={l} delay={i * 0.1}>
              <div className="text-center">
                <div className="font-head font-black text-4xl sm:text-5xl mb-1"
                  style={{ background: 'linear-gradient(135deg,#818cf8,#a78bfa,#38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', whiteSpace: 'nowrap' }}>
                  <Counter to={v} />
                </div>
                <div className="text-white/40 text-sm">{l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ FEATURES — INTERACTIVE DEMOS ════════════════════════ */}
      <section id="features" className="py-28 px-5 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <Reveal>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-5"
              style={{ background: 'rgba(91,106,245,0.1)', border: '1px solid rgba(91,106,245,0.25)', color: '#818cf8' }}>
              <Sparkles size={12} /> Platform Features
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-head font-black tracking-tight mb-4"
              style={{ fontSize: 'clamp(2.2rem,5vw,4rem)', color: '#f0f0ff' }}>
              Everything you need to<br />
              <span style={{ background: 'linear-gradient(135deg,#818cf8,#38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                land your dream role
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-white/40 text-lg max-w-xl mx-auto">
              {token ? 'You have full access to every feature below.' : 'Hover any card to preview the experience.'}
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {FEATURES_GRID.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08}>
              <HoloCard className="card overflow-hidden cursor-pointer group"
                style={{ borderColor: 'rgba(91,106,245,0.12)' }}>
                <motion.div
                  className="absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'linear-gradient(135deg,rgba(91,106,245,0.05),rgba(124,58,237,0.03))' }} />
                <div className="p-5 pb-0">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center border"
                      style={{ background: 'rgba(91,106,245,0.12)', borderColor: 'rgba(91,106,245,0.2)' }}>
                      <f.icon size={20} className="text-accent" />
                    </div>
                    <div>
                      <h3 className="font-head font-bold text-sm text-white">{f.title}</h3>
                      <p className="text-white/40 text-xs">{f.desc}</p>
                    </div>
                    {token && <span className="ml-auto badge badge-green text-[9px]">Active</span>}
                    {!token && <Lock size={13} className="ml-auto text-white/20" />}
                  </div>
                  <FeatureVisual type={f.type} />
                </div>
                <div className="px-5 py-4">
                  <button
                    onClick={() => navigate(token ? (f.type === 'ai' ? '/ai-assistant' : f.type === 'resume' ? '/resume' : f.type === 'jobs' ? '/jobs' : '/progress') : '/register')}
                    className="text-accent text-xs font-semibold hover:gap-2 flex items-center gap-1.5 transition-all">
                    {token ? 'Open Feature' : 'Unlock Free'} <ArrowRight size={12} />
                  </button>
                </div>
              </HoloCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ 8-FEATURE GRID ══════════════════════════════════════ */}
      <section className="py-20 px-5 sm:px-8" style={{ background: 'linear-gradient(180deg,transparent,rgba(91,106,245,0.04),transparent)' }}>
        <div className="max-w-7xl mx-auto">
          <Reveal><div className="text-center mb-14">
            <h2 className="font-head font-black tracking-tight" style={{ fontSize: 'clamp(2rem,4vw,3.5rem)', color: '#f0f0ff' }}>
              Built for serious learners
            </h2>
          </div></Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Zap,        title: 'Adaptive AI Paths',       desc: 'Curriculum that evolves with you every session.' },
              { icon: BarChart2,  title: 'Real-time Analytics',     desc: 'Live skill map, streak and gap analysis.' },
              { icon: Users,      title: 'Expert Community',        desc: '50K+ learners and FAANG mentors.' },
              { icon: Award,      title: 'Verified Certificates',   desc: 'Trusted by 1,000+ hiring companies.' },
              { icon: Briefcase,  title: 'Live Job Portal',         desc: 'Roles matched to your exact skill set.' },
              { icon: Code,       title: 'Project-First Learning',  desc: 'Ship real products. Build a real portfolio.' },
              { icon: FileText,   title: 'AI Resume Builder',       desc: 'ATS-perfect resume generated in seconds.' },
              { icon: Globe,      title: 'Weekly Live Sessions',    desc: 'Expert AMAs every week. Never stop growing.' },
            ].map((f, i) => (
              <Reveal key={f.title} delay={i * 0.06}>
                <motion.div whileHover={{ y: -5, borderColor: 'rgba(91,106,245,0.3)' }}
                  transition={{ type: 'spring', stiffness: 400 }}
                  className="card p-6 group cursor-default h-full">
                  <div className="w-11 h-11 rounded-2xl mb-4 flex items-center justify-center border group-hover:scale-110 transition-transform"
                    style={{ background: 'rgba(91,106,245,0.1)', borderColor: 'rgba(91,106,245,0.15)' }}>
                    <f.icon size={20} className="text-accent" />
                  </div>
                  <h3 className="font-head font-bold text-sm mb-2 text-white">{f.title}</h3>
                  <p className="text-white/40 text-xs leading-relaxed">{f.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURED COURSES ════════════════════════════════════ */}
      <section className="py-24 px-5 sm:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12 flex-wrap gap-4">
          <Reveal>
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ background: 'rgba(91,106,245,0.08)', border: '1px solid rgba(91,106,245,0.2)', color: '#818cf8' }}>
                Featured
              </span>
              <h2 className="font-head font-black text-3xl sm:text-4xl tracking-tight" style={{ color: '#f0f0ff' }}>
                Courses built for outcomes
              </h2>
            </div>
          </Reveal>
          <Link to={token ? '/courses' : '/register'} className="btn btn-ghost">
            View all <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {(featured.length ? featured : Array(3).fill(null)).map((course, i) =>
            course ? (
              <Reveal key={course._id} delay={i * 0.1}>
                <HoloCard className="card overflow-hidden cursor-pointer group h-full">
                  <div className="relative h-44 overflow-hidden">
                    {course.thumbnail
                      ? <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      : <div className="w-full h-full" style={{ background: 'linear-gradient(135deg,rgba(91,106,245,0.2),rgba(124,58,237,0.1))' }} />
                    }
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(4,4,10,0.9), transparent)' }} />
                    <span className="badge badge-blue absolute top-3 left-3 text-[10px]">{course.category}</span>
                    {!token && <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center"><Lock size={10} className="text-white/60" /></div>}
                  </div>
                  <div className="p-5">
                    <h3 className="font-head font-bold text-sm mb-1 line-clamp-2 group-hover:text-accent transition-colors">{course.title}</h3>
                    <p className="text-white/40 text-xs mb-3">{course.instructor?.name}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-head font-black text-xl text-accent">₹{course.price?.toLocaleString('en-IN')}</span>
                      <span className="text-amber-400 text-xs flex items-center gap-1"><Star size={10} fill="currentColor" />{course.rating?.toFixed(1)}</span>
                    </div>
                  </div>
                </HoloCard>
              </Reveal>
            ) : (
              <div key={i} className="card overflow-hidden animate-pulse">
                <div className="h-44 bg-white/[0.04]" />
                <div className="p-5 space-y-2">
                  <div className="h-3 bg-white/[0.04] rounded w-3/4" />
                  <div className="h-2 bg-white/[0.03] rounded w-1/2" />
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* ══ JOBS SECTION ════════════════════════════════════════ */}
      <section className="py-24 px-5 sm:px-8" style={{ background: 'linear-gradient(180deg,transparent,rgba(124,58,237,0.04),transparent)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12 flex-wrap gap-4">
            <Reveal>
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399' }}>
                  <Briefcase size={11} /> Hiring Now
                </span>
                <h2 className="font-head font-black text-3xl sm:text-4xl tracking-tight" style={{ color: '#f0f0ff' }}>
                  Land your next role
                </h2>
              </div>
            </Reveal>
            <Link to={token ? '/jobs' : '/register'} className="btn btn-ghost">Browse all <ArrowRight size={16} /></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(jobs.length ? jobs : Array(4).fill(null)).map((job, i) =>
              job ? (
                <Reveal key={job._id} delay={i * 0.08}>
                  <motion.div whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 400 }}
                    className="card p-5 flex items-center gap-4 cursor-pointer group"
                    onClick={() => navigate(token ? '/jobs' : '/register')}>
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 border border-white/[0.06]"
                      style={{ background: 'rgba(255,255,255,0.04)' }}>
                      {['🤖','▲','🧠','💳','✦'][i % 5]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-head font-bold text-sm group-hover:text-accent transition-colors">{job.title}</p>
                      <p className="text-white/40 text-xs">{job.company} · {job.location}</p>
                      <div className="flex gap-1.5 mt-1.5 flex-wrap">
                        {job.tags?.slice(0, 3).map(t => <span key={t} className="badge badge-blue text-[9px]">{t}</span>)}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-emerald-400 text-sm font-bold">{job.salary}</p>
                      <span className="badge badge-green text-[9px] mt-1">{job.type}</span>
                    </div>
                    {!token && <Lock size={13} className="text-white/20 flex-shrink-0" />}
                  </motion.div>
                </Reveal>
              ) : (
                <div key={i} className="card p-5 flex items-center gap-4 animate-pulse">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.04] flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-white/[0.04] rounded w-2/3" />
                    <div className="h-2 bg-white/[0.03] rounded w-1/2" />
                  </div>
                </div>
              )
            )}
          </div>
          {!token && (
            <Reveal delay={0.3}>
              <div className="text-center mt-8 py-6 rounded-2xl border border-dashed border-white/[0.08]">
                <p className="text-white/30 text-sm mb-3">Sign up to view full details and apply</p>
                <Link to="/register" className="btn btn-primary btn-sm inline-flex">
                  Unlock Job Portal <ArrowRight size={14} />
                </Link>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* ══ TESTIMONIALS ════════════════════════════════════════ */}
      <section className="py-24 px-5 sm:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="text-center mb-14">
          <Reveal>
            <h2 className="font-head font-black tracking-tight" style={{ fontSize: 'clamp(2rem,4vw,3.5rem)', color: '#f0f0ff' }}>
              Real results. Real people.
            </h2>
          </Reveal>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.07}>
              <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300 }}
                className="card p-6 h-full flex flex-col">
                <div className="flex gap-0.5 mb-4">
                  {Array(t.rating).fill(null).map((_, j) => <Star key={j} size={13} className="text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-white/55 text-sm leading-relaxed italic flex-1 mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg,#5b6af5,#7c3aed)' }}>{t.av}</div>
                  <div>
                    <p className="font-semibold text-sm text-white">{t.name}</p>
                    <p className="text-white/35 text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ FOUNDER SECTION ═════════════════════════════════════ */}
      <section className="py-24 px-5 sm:px-8" style={{ background: 'linear-gradient(180deg,transparent,rgba(91,106,245,0.05),transparent)' }}>
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-14">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-5"
                style={{ background: 'rgba(91,106,245,0.1)', border: '1px solid rgba(91,106,245,0.25)', color: '#818cf8' }}>
                Meet the Founder
              </span>
              <h2 className="font-head font-black tracking-tight" style={{ fontSize: 'clamp(2rem,4vw,3.5rem)', color: '#f0f0ff' }}>
                The person behind NeuralLearn
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <HoloCard className="card overflow-hidden" style={{ background: 'linear-gradient(135deg,rgba(91,106,245,0.08),rgba(124,58,237,0.05))', borderColor: 'rgba(91,106,245,0.2)' }}>
              <div className="flex flex-col md:flex-row items-center gap-8 sm:gap-12 p-8 sm:p-10">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="absolute -inset-3 rounded-[24px] blur-xl" style={{ background: 'linear-gradient(135deg,rgba(91,106,245,0.3),rgba(124,58,237,0.2))' }} />
                    <div className="relative w-48 h-52 sm:w-56 sm:h-64 rounded-[20px] overflow-hidden border-2"
                      style={{ borderColor: 'rgba(91,106,245,0.35)', boxShadow: '0 0 50px rgba(91,106,245,0.25)' }}>
                      <img src={founder} alt="Arpit Aware" className="w-full h-full object-cover object-top" />
                    </div>
                    <motion.div className="absolute -bottom-3 -right-3 px-4 py-2 rounded-2xl border shadow-xl"
                      style={{ background: 'rgba(8,8,16,0.95)', borderColor: 'rgba(91,106,245,0.3)' }}
                      animate={{ y: [-2, 2, -2] }} transition={{ duration: 3, repeat: Infinity }}>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                        <span className="text-xs font-semibold text-white">Building NeuralLearn</span>
                      </div>
                    </motion.div>
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="font-head font-black text-3xl mb-1" style={{ color: '#f0f0ff' }}>Arpit Aware</h3>
                  <p className="text-accent font-semibold text-base mb-4">Founder, CEO & Lead Developer</p>
                  <div className="flex flex-wrap gap-2 mb-5 justify-center md:justify-start">
                    {['Full-Stack Dev','AI Enthusiast','MERN Stack','React Native'].map(tag => (
                      <span key={tag} className="badge badge-blue">{tag}</span>
                    ))}
                  </div>
                  <p className="text-white/55 text-sm leading-relaxed mb-5 max-w-xl">
                    Hi! I am Arpit, a passionate full-stack developer from India. I built NeuralLearn because
                    I experienced firsthand how hard it is to break into tech without good resources.
                    I wanted to create the platform I wished had existed — combining AI-powered learning,
                    real-world projects, and a direct path to employment.
                  </p>
                  <div className="flex flex-wrap gap-4 text-white/40 text-sm mb-5 justify-center md:justify-start">
                    <span className="flex items-center gap-1.5"><MapPin size={13} /> India</span>
                    <span className="flex items-center gap-1.5"><Mail size={13} /> arpit@neurallearn.io</span>
                  </div>
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm gap-2"><Github size={15} /> GitHub</a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm gap-2"><Linkedin size={15} /> LinkedIn</a>
                    <Link to="/about" className="btn btn-ghost btn-sm gap-2">Full Story <ArrowRight size={13} /></Link>
                  </div>
                </div>
              </div>
            </HoloCard>
          </Reveal>
        </div>
      </section>

      {/* ══ FINAL CTA ════════════════════════════════════════════ */}
      <section className="py-32 px-5 sm:px-8 relative overflow-hidden">
        <Orb size={600} color="#5b6af5" x="10%" y="10%" delay={0} duration={10} />
        <Orb size={500} color="#7c3aed" x="50%" y="20%" delay={2} duration={8} />
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <Reveal>
            <h2 className="font-head font-black tracking-tight mb-5"
              style={{ fontSize: 'clamp(2.5rem,6vw,5rem)', color: '#f0f0ff', lineHeight: 1.05 }}>
              Your future starts<br />
              <span style={{ background: 'linear-gradient(135deg,#818cf8,#a78bfa,#38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                today.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-white/40 text-xl mb-10 leading-relaxed">
              Join 50,000+ learners building careers in tech.<br />No credit card. Cancel anytime.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              <MagneticBtn to={token ? '/dashboard' : '/register'}
                className="relative overflow-hidden text-white font-semibold px-10 py-4 rounded-2xl text-lg"
                style={{ background: 'linear-gradient(135deg,#5b6af5,#7c3aed)', boxShadow: '0 0 60px rgba(91,106,245,0.5), 0 4px 30px rgba(0,0,0,0.4)' }}>
                <span className="flex items-center gap-2">
                  {token ? 'Go to Dashboard' : 'Start for Free'} <ArrowRight size={20} />
                </span>
              </MagneticBtn>
              {!token && <Link to="/login" className="flex items-center gap-2 px-8 py-4 rounded-2xl text-lg font-medium text-white/60 hover:text-white border border-white/10 hover:border-white/20 transition-all">Already a member</Link>}
            </div>
            <div className="flex items-center justify-center gap-6 text-white/25 text-xs flex-wrap">
              {['No credit card','Cancel anytime','Instant access'].map(t => (
                <span key={t} className="flex items-center gap-1.5"><CheckCircle2 size={11} className="text-emerald-400" />{t}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════════ */}
      <footer className="border-t py-14 px-5 sm:px-8" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center font-head font-black text-white text-sm"
                  style={{ background: 'linear-gradient(135deg,#5b6af5,#7c3aed)' }}>N</div>
                <span className="font-head font-bold text-white">NeuralLearn</span>
              </div>
              <p className="text-white/30 text-xs leading-relaxed max-w-[180px]">
                The intelligent platform that turns learners into hired engineers.
              </p>
            </div>
            {[
              { title: 'Platform', links: [['Courses','/courses'],['AI Assistant','/ai-assistant'],['Resume Builder','/resume'],['Job Portal','/jobs'],['Community','/community']] },
              { title: 'Company',  links: [['About','/about'],['Blog','/'],['Careers','/'],['Contact','/']] },
              { title: 'Legal',    links: [['Privacy','/'],['Terms','/'],['Cookies','/']] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="font-head font-bold text-sm text-white mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map(([l, path]) => (
                    <li key={l}>
                      <Link to={token ? path : '/register'} className="text-white/30 hover:text-white text-xs transition-colors">{l}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t pt-6 flex flex-wrap items-center justify-between gap-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <p className="text-white/20 text-xs">© 2025 NeuralLearn — Built by Arpit Aware</p>
            <div className="flex gap-4">
              {[Github, Linkedin, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="text-white/20 hover:text-white transition-colors"><Icon size={15} /></a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
