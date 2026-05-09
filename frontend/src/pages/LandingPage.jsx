import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import founder from '../assets/founder.png'
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Star, Zap, Users, Award, Briefcase, Code, BarChart2,
  ChevronDown, Brain, FileText, Calendar, MessageSquare, Lock,
  Play, CheckCircle2, Globe, Cpu, TrendingUp, Sparkles, Github,
  Linkedin, Twitter, MapPin, Mail, ExternalLink, ShoppingCart
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { coursesAPI, jobsAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';

/* ── helpers ───────────────────────────────────────────────── */
function Blob({ style }) {
  return (
    <div
      className="absolute rounded-[60%_40%_30%_70%/60%_30%_70%_40%] animate-blob filter blur-3xl pointer-events-none"
      style={{ opacity: 0.12, ...style }}
    />
  );
}

function SectionLabel({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold tracking-widest uppercase mb-5"
    >
      {children}
    </motion.div>
  );
}

/* ── locked feature preview card ───────────────────────────── */
function LockedFeatureCard({ icon: Icon, title, desc, preview, color = '#5b6af5', onUnlock }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative card overflow-hidden cursor-pointer group"
      style={{ borderColor: hovered ? `${color}40` : undefined }}
      onClick={onUnlock}
    >
      {/* Locked overlay */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center backdrop-blur-sm rounded-2xl"
            style={{ background: 'rgba(4,4,10,0.82)' }}
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
              style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
              <Lock size={22} style={{ color }} />
            </div>
            <p className="font-head font-bold text-base text-white mb-1">Unlock {title}</p>
            <p className="text-white/50 text-xs mb-4 text-center px-6">Sign up free to access this feature</p>
            <div className="btn btn-primary btn-sm" style={{ background: `linear-gradient(135deg, ${color}, #7c3aed)` }}>
              Get Started Free <ArrowRight size={13} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview content (half-visible / blurred at bottom) */}
      <div className="p-6 pb-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center border"
            style={{ background: `${color}15`, borderColor: `${color}25` }}>
            <Icon size={20} style={{ color }} />
          </div>
          <div>
            <h3 className="font-head font-bold text-sm">{title}</h3>
            <p className="text-white/40 text-xs">{desc}</p>
          </div>
        </div>
        {/* Preview UI */}
        <div className="relative">
          {preview}
          {/* Gradient fade-out mask */}
          <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, transparent, #04040a)' }} />
        </div>
      </div>
      <div className="h-10" />
    </motion.div>
  );
}

/* ── stat counter ───────────────────────────────────────────── */
function StatCounter({ value, label, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay }}
      className="text-center"
    >
      <div className="font-head font-black text-4xl md:text-5xl grad-text mb-1">{value}</div>
      <div className="text-white/40 text-sm">{label}</div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const [scrollY, setScrollY]   = useState(0);
  const [navSolid, setNavSolid] = useState(false);
  const { user, token }         = useAuthStore();
  const cartCount                   = useCartStore(s => s.cartCount());
  const navigate                = useNavigate();

  useEffect(() => {
    const handler = () => {
      setScrollY(window.scrollY);
      setNavSolid(window.scrollY > 60);
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const heroOpacity = Math.max(0, 1 - Math.max(0, scrollY - 100) / 400);
  const heroY       = Math.min(60, Math.max(0, scrollY - 100) * 0.15);

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

  const handleFeatureClick = () => navigate(token ? '/dashboard' : '/register');

  const NAV_FEATURES = [
    { label: 'AI Assistant', path: '/ai-assistant', icon: Brain       },
    { label: 'Resume',       path: '/resume',       icon: FileText    },
    { label: 'Community',    path: '/community',    icon: MessageSquare },
    { label: 'Jobs',         path: '/jobs',         icon: Briefcase   },
  ];

  /* ── AI chatbot preview messages ───────────────────────────── */
  const chatPreview = (
    <div className="space-y-2 px-1 pb-2">
      {[
        { role: 'ai',   text: "Hi! What topic shall we explore today?" },
        { role: 'user', text: "Explain transformers in 2 lines"        },
        { role: 'ai',   text: "Transformers use self-attention to process all tokens in parallel — that makes them so fast and powerful for NLP tasks." },
      ].map((m, i) => (
        <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
          <div className={`text-xs px-3 py-2 rounded-xl max-w-[80%] leading-relaxed ${
            m.role === 'ai'
              ? 'bg-accent/10 border border-accent/15 rounded-tl-sm text-white/80'
              : 'bg-white/[0.07] border border-white/10 rounded-tr-sm text-white/80'
          }`}>{m.text}</div>
        </div>
      ))}
    </div>
  );

  /* ── resume preview ─────────────────────────────────────────── */
  const resumePreview = (
    <div className="bg-white/[0.03] rounded-xl p-3 text-xs space-y-2 border border-white/[0.06]">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-accent/20 border border-accent/30 flex-shrink-0" />
        <div className="space-y-1 flex-1">
          <div className="h-2 bg-white/20 rounded w-24" />
          <div className="h-1.5 bg-accent/40 rounded w-16" />
        </div>
      </div>
      {['Experience', 'Education', 'Skills'].map(s => (
        <div key={s}>
          <div className="text-white/30 text-[9px] uppercase tracking-wider mb-1">{s}</div>
          <div className="space-y-1">
            <div className="h-1.5 bg-white/10 rounded w-full" />
            <div className="h-1.5 bg-white/[0.06] rounded w-3/4" />
          </div>
        </div>
      ))}
      <div className="flex gap-1 flex-wrap">
        {['Python','React','AWS'].map(t => (
          <span key={t} className="px-2 py-0.5 bg-accent/15 border border-accent/20 rounded-full text-[9px] text-accent/80">{t}</span>
        ))}
      </div>
    </div>
  );

  /* ── calendar preview ─────────────────────────────────────── */
  const calPreview = (
    <div className="grid grid-cols-7 gap-0.5 text-[9px] text-center">
      {['S','M','T','W','T','F','S'].map((d, i) => (
        <div key={i} className="text-white/30 pb-1">{d}</div>
      ))}
      {Array(31).fill(null).map((_, i) => {
        const events = [4, 10, 15, 22, 28];
        const today  = 14;
        return (
          <div key={i} className={`rounded py-1 text-[9px] ${
            i+1 === today ? 'bg-accent text-white font-bold' :
            events.includes(i+1) ? 'bg-accent/20 text-accent' :
            'text-white/40'
          }`}>{i+1}</div>
        );
      })}
    </div>
  );

  /* ── community preview ────────────────────────────────────── */
  const communityPreview = (
    <div className="space-y-2">
      {[
        { name: 'Priya S.', title: 'How I went from 0 to ML Engineer in 8 months', likes: 234 },
        { name: 'Omar H.',  title: 'React best practices I wish I knew earlier',    likes: 301 },
      ].map((p, i) => (
        <div key={i} className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.05]">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-accent to-accent2 flex-shrink-0" />
            <span className="text-[10px] text-white/50">{p.name}</span>
          </div>
          <p className="text-xs text-white/70 leading-snug">{p.title}</p>
          <div className="flex items-center gap-1 mt-1.5 text-[10px] text-white/30">
            <span>❤ {p.likes}</span>
          </div>
        </div>
      ))}
    </div>
  );

  const LOCKED_FEATURES = [
    { icon: Brain,         title: 'AI Assistant',   desc: 'Your intelligent tutor',          color: '#5b6af5', preview: chatPreview      },
    { icon: FileText,      title: 'Resume Builder', desc: 'ATS-optimized in minutes',        color: '#10b981', preview: resumePreview    },
    { icon: Calendar,      title: 'Study Calendar', desc: 'Plan sessions & deadlines',       color: '#f59e0b', preview: calPreview       },
    { icon: MessageSquare, title: 'Community',      desc: '50K+ learners & mentors',         color: '#06b6d4', preview: communityPreview },
  ];

  const FEATURES_LIST = [
    { icon: Zap,       title: 'AI-Powered Paths',       desc: 'Adaptive learning that adjusts to your pace, style, and goals in real time.'         },
    { icon: BarChart2, title: 'Deep Analytics',          desc: 'Know exactly where you stand. Track hours, streaks, quiz scores, and skill gaps.'    },
    { icon: Users,     title: 'Expert Community',        desc: 'Learn alongside 50K+ peers. Get mentorship from engineers at top tech companies.'    },
    { icon: Award,     title: 'Verified Certificates',   desc: 'Industry-recognized credentials trusted by 1,000+ hiring companies worldwide.'      },
    { icon: Briefcase, title: 'Job Portal',              desc: 'Curated roles matched to your skills. Apply directly from your NeuralLearn profile.' },
    { icon: Code,      title: 'Project-First Learning',  desc: 'Build real products. Graduate with a portfolio that speaks louder than a degree.'   },
    { icon: FileText,  title: 'AI Resume Builder',       desc: 'Generate a polished, ATS-optimized resume from your course history in one click.'   },
    { icon: Globe,     title: 'Live Sessions',           desc: 'Weekly live coding sessions and AMAs with instructors and industry professionals.'   },
  ];

  const TESTIMONIALS = [
    { name: 'Leila Ahmadi',  role: 'ML Engineer @ Google',       text: "NeuralLearn transformed my career in 6 months. The ML course is better than any bootcamp I tried. Got hired at Google directly.", avatar: 'LA', rating: 5 },
    { name: 'Raj Patel',     role: 'Senior Engineer @ Stripe',   text: "The best investment I made in myself. Quality rivals top bootcamps at a fraction of the cost. Got hired 3 months after finishing.", avatar: 'RP', rating: 5 },
    { name: 'Mei Zhou',      role: 'Data Scientist @ Netflix',   text: "The AI assistant alone is worth the subscription. It explains complex ML concepts better than most human tutors I have had.", avatar: 'MZ', rating: 5 },
    { name: 'Carlos M.',     role: 'Frontend Dev @ Vercel',      text: "The community here is incredible. I got code reviews from senior engineers within hours of posting. Completely changed my trajectory.", avatar: 'CM', rating: 5 },
    { name: 'Yuki Tanaka',   role: 'Cloud Architect @ AWS',      text: "Passed my AWS Solutions Architect exam on the first try after completing the cloud course. The practice labs are exceptional.", avatar: 'YT', rating: 5 },
    { name: 'Priya Sharma',  role: 'Data Engineer @ Airbnb',     text: "Resume builder alone saved me 10+ hours. Had a polished, ATS-optimized resume in minutes that landed me 3 interview callbacks.", avatar: 'PS', rating: 5 },
  ];

  const LOGO_MAP = { Anthropic: '🤖', Vercel: '▲', OpenAI: '🧠', Stripe: '💳', Figma: '✦', Google: '🔍' };

  return (
    <div className="min-h-screen bg-bg overflow-x-hidden">

      {/* ══ NAVBAR ══════════════════════════════════════════════ */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        navSolid ? 'bg-bg/95 backdrop-blur-xl border-b border-white/[0.06] shadow-xl' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent2 flex items-center justify-center font-head font-black text-white text-sm">N</div>
            <span className="font-head font-bold text-white tracking-tight">NeuralLearn</span>
          </Link>

          {/* Center nav — feature links (half-locked for guests) */}
          <div className="hidden md:flex items-center gap-1">
            <a href="#features"  className="px-3 py-1.5 text-sm text-white/50 hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]">Features</a>
            <Link to={token ? "/courses" : "/register"} className="px-3 py-1.5 text-sm text-white/50 hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]">Courses</Link>
            <Link to="/about" className="px-3 py-1.5 text-sm text-white/50 hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]">About</Link>

            {/* Feature nav items — show lock tooltip for guests */}
            {NAV_FEATURES.map(f => (
              token ? (
                <Link key={f.label} to={f.path}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white/50 hover:text-accent transition-colors rounded-lg hover:bg-accent/[0.06]">
                  <f.icon size={13} />{f.label}
                </Link>
              ) : (
                <button key={f.label}
                  onClick={() => navigate('/register')}
                  className="group flex items-center gap-1.5 px-3 py-1.5 text-sm text-white/30 hover:text-white/60 transition-colors rounded-lg hover:bg-white/[0.04] relative"
                >
                  <f.icon size={13} />
                  <span>{f.label}</span>
                  <Lock size={9} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                </button>
              )
            ))}
          </div>

          {/* Right CTA */}
          <div className="flex items-center gap-3">
            {token ? (
              <>
                <Link to="/cart" className="relative p-2 rounded-xl hover:bg-white/[0.06] text-white/50 hover:text-white transition-colors">
                  <ShoppingCart size={18} />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link to="/dashboard" className="btn btn-primary btn-sm">
                  Dashboard <ArrowRight size={14} />
                </Link>
              </>
            ) : (
              <>
                <Link to="/login"    className="btn btn-ghost btn-sm hidden sm:flex">Log in</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Get Started <ArrowRight size={14} /></Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ══ HERO ════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <div className="absolute inset-0 opacity-[0.035]"
            style={{ backgroundImage: 'linear-gradient(rgba(91,106,245,1) 1px,transparent 1px),linear-gradient(90deg,rgba(91,106,245,1) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
          <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent animate-scan" />
          <Blob style={{ width: 700, height: 700, background: '#5b6af5', top: '-10%', left: '-15%' }} />
          <Blob style={{ width: 600, height: 600, background: '#7c3aed', bottom: '0%', right: '-10%', animationDelay: '-4s' }} />
          <Blob style={{ width: 400, height: 400, background: '#06b6d4', top: '30%', right: '10%', animationDelay: '-2s' }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%,rgba(91,106,245,0.1) 0%,transparent 70%)' }} />
        </div>

        {/* Content */}
        <div
          style={{ opacity: heroOpacity, transform: `translateY(${heroY}px)`, position: 'relative', zIndex: 10 }}
          className="text-center px-6 max-w-5xl mx-auto pt-24 pb-12"
        >
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold tracking-widest uppercase mb-8">
            <Sparkles size={12} /> AI-Powered Learning Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
            className="font-head font-black leading-[1.04] tracking-[-0.04em] mb-6 text-white"
            style={{ fontSize: 'clamp(2rem, 6vw, 5.5rem)', color: '#f0f0ff' }}
          >
            Learn Faster.<br />
            <span className="grad-text">Build Smarter.</span><br />
            Get Hired.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            The world's most intelligent learning platform. AI tutoring, expert-led courses,
            a built-in resume builder, job portal, and a community of 50,000+ learners —
            all in one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-16"
          >
            <Link to={token ? '/dashboard' : '/register'} className="btn btn-primary btn-lg" style={{ animation: 'glowPulse 2s ease infinite' }}>
              {token ? 'Go to Dashboard' : 'Start Learning Free'} <ArrowRight size={18} />
            </Link>
            <a href="#features" className="btn btn-ghost btn-lg">
              <Play size={16} /> See Features
            </a>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-8 md:gap-16"
          >
            {[['50K+','Active Learners'],['200+','Expert Courses'],['87%','Job Placement'],['4.9★','Avg Rating']].map(([v,l]) => (
              <div key={l} className="text-center">
                <div className="font-head font-black text-2xl text-white">{v}</div>
                <div className="text-xs text-white/40 mt-0.5">{l}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div animate={{ y: [0,10,0] }} transition={{ duration: 2, repeat: Infinity }}
          style={{ opacity: Math.max(0, 1 - scrollY / 180) }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/20">
          <ChevronDown size={24} />
        </motion.div>
      </section>

      {/* ══ STATS BAND ══════════════════════════════════════════ */}
      <section className="py-16 border-y border-white/[0.06]"
        style={{ background: 'linear-gradient(90deg,rgba(91,106,245,0.04),rgba(124,58,237,0.06),rgba(6,182,212,0.04))' }}>
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap justify-center gap-8 md:gap-16">
          <StatCounter value="50K+"  label="Active Learners"    delay={0}    />
          <StatCounter value="200+"  label="Expert Courses"     delay={0.1}  />
          <StatCounter value="87%"   label="Job Placement Rate" delay={0.2}  />
          <StatCounter value="₹92K"  label="Avg Salary Earned"  delay={0.3}  />
        </div>
      </section>

      {/* ══ LOCKED FEATURE PREVIEWS ═════════════════════════════ */}
      <section id="features" className="py-28 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <SectionLabel>Platform Features</SectionLabel>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="font-head font-black text-4xl md:text-5xl tracking-tight mb-4" style={{ color: '#f0f0ff' }}
          >
            Everything you need to<br /><span className="grad-text">land your dream job</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-white/40 text-lg max-w-xl mx-auto"
          >
            {token
              ? 'You have full access to all features below.'
              : 'Sign up free to unlock all features. Hover any card to preview.'}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {LOCKED_FEATURES.map((f, i) => (
            token ? (
              /* Logged-in: direct link, no lock */
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="card overflow-hidden cursor-pointer group"
                style={{ borderColor: `${f.color}20` }}
                onClick={() => navigate(
                  f.title === 'AI Assistant'   ? '/ai-assistant' :
                  f.title === 'Resume Builder' ? '/resume'       :
                  f.title === 'Study Calendar' ? '/calendar'     : '/community'
                )}
              >
                <div className="p-6 pb-0">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center border"
                      style={{ background: `${f.color}15`, borderColor: `${f.color}25` }}>
                      <f.icon size={20} style={{ color: f.color }} />
                    </div>
                    <div>
                      <h3 className="font-head font-bold text-sm">{f.title}</h3>
                      <p className="text-white/40 text-xs">{f.desc}</p>
                    </div>
                    <div className="ml-auto">
                      <span className="badge badge-green text-[10px]">Unlocked</span>
                    </div>
                  </div>
                  <div className="relative">
                    {f.preview}
                    <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
                      style={{ background: 'linear-gradient(to bottom, transparent, #04040a)' }} />
                  </div>
                </div>
                <div className="h-10" />
              </motion.div>
            ) : (
              <LockedFeatureCard key={f.title} {...f} onUnlock={handleFeatureClick} />
            )
          ))}
        </div>
      </section>

      {/* ══ FULL FEATURE GRID ═══════════════════════════════════ */}
      <section className="py-20 px-6" style={{ background: 'linear-gradient(180deg,transparent,rgba(91,106,245,0.04),transparent)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <SectionLabel>Why NeuralLearn</SectionLabel>
            <motion.h2
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="font-head font-black text-4xl md:text-5xl tracking-tight" style={{ color: '#f0f0ff' }}
            >
              Built for serious learners
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {FEATURES_LIST.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                whileHover={{ y: -4 }}
                className="card p-6 group"
              >
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-accent/20 to-accent2/10 border border-accent/15 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <f.icon size={20} className="text-accent" />
                </div>
                <h3 className="font-head font-bold text-sm mb-2">{f.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURED COURSES ════════════════════════════════════ */}
      <section id="courses" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12 flex-wrap gap-4">
          <div>
            <SectionLabel>Featured Courses</SectionLabel>
            <h2 className="font-head font-black text-3xl md:text-4xl tracking-tight" style={{ color: '#f0f0ff' }}>
              Handpicked by experts
            </h2>
          </div>
          <Link to={token ? '/courses' : '/register'} className="btn btn-ghost">
            View All Courses <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featured.length === 0
            ? Array(3).fill(null).map((_, i) => (
                <div key={i} className="card overflow-hidden animate-pulse">
                  <div className="h-44 bg-white/[0.06]" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 bg-white/[0.06] rounded w-3/4" />
                    <div className="h-2 bg-white/[0.04] rounded w-1/2" />
                    <div className="h-3 bg-white/[0.06] rounded w-1/4" />
                  </div>
                </div>
              ))
            : featured.map((course, i) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="card overflow-hidden cursor-pointer group"
                  style={{ borderColor: 'rgba(91,106,245,0.1)' }}
                  onClick={() => navigate(token ? `/courses/${course.slug}` : '/register')}
                >
                  <div className="relative h-44 overflow-hidden">
                    {course.thumbnail
                      ? <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={e => { e.target.style.display='none'; }} />
                      : <div className="w-full h-full bg-gradient-to-br from-accent/20 to-accent2/10 flex items-center justify-center"><span className="text-4xl opacity-20">📚</span></div>
                    }
                    <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
                    <span className="badge badge-blue absolute top-3 left-3 text-[10px]">{course.category}</span>
                    {!token && (
                      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center">
                        <Lock size={10} className="text-white/60" />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-head font-bold text-sm mb-1 line-clamp-2 group-hover:text-accent transition-colors">{course.title}</h3>
                    <p className="text-xs text-white/40 mb-3">{course.instructor?.name}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-head font-black text-xl text-accent">₹{course.price}</span>
                      <span className="text-xs text-amber-400 flex items-center gap-1">
                        <Star size={10} fill="currentColor" /> {course.rating?.toFixed(1) || '0.0'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
          }
        </div>
      </section>

      {/* ══ FEATURED JOBS ════════════════════════════════════════ */}
      <section className="py-24 px-6" style={{ background: 'linear-gradient(180deg,transparent,rgba(124,58,237,0.05),transparent)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12 flex-wrap gap-4">
            <div>
              <SectionLabel>Job Portal</SectionLabel>
              <h2 className="font-head font-black text-3xl md:text-4xl tracking-tight" style={{ color: '#f0f0ff' }}>
                Land your next role
              </h2>
              <p className="text-white/40 mt-2">Opportunities matched to your NeuralLearn skills</p>
            </div>
            <Link to={token ? '/jobs' : '/register'} className="btn btn-ghost">
              Browse All Jobs <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(jobs.length ? jobs : Array(4).fill(null)).map((job, i) =>
              job ? (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -2 }}
                  className="card p-5 flex items-center gap-4 cursor-pointer group"
                  onClick={() => navigate(token ? '/jobs' : '/register')}
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-2xl flex-shrink-0">
                    {['🤖','▲','🧠','💳','✦','🔍'][i % 6]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-head font-bold text-sm group-hover:text-accent transition-colors">{job.title}</p>
                    <p className="text-white/40 text-xs">{job.company} · {job.location}</p>
                    <div className="flex gap-1.5 mt-1.5 flex-wrap">
                      {job.tags?.slice(0,3).map(t => <span key={t} className="badge badge-blue text-[9px]">{t}</span>)}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-emerald-400 text-sm font-bold">{job.salary}</p>
                    <span className="badge badge-green text-[9px] mt-1">{job.type}</span>
                  </div>
                  {!token && <Lock size={14} className="text-white/20 flex-shrink-0" />}
                </motion.div>
              ) : (
                <div key={i} className="card p-5 flex items-center gap-4 animate-pulse">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.06] flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-white/[0.06] rounded w-2/3" />
                    <div className="h-2 bg-white/[0.04] rounded w-1/2" />
                  </div>
                </div>
              )
            )}
          </div>

          {!token && (
            <motion.div
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-center mt-8 py-6 rounded-2xl border border-dashed border-white/[0.1]"
            >
              <Lock size={20} className="text-white/30 mx-auto mb-2" />
              <p className="text-white/40 text-sm mb-3">Sign up to view full job details and apply directly</p>
              <Link to="/register" className="btn btn-primary btn-sm">Unlock Job Portal <ArrowRight size={14} /></Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* ══ TESTIMONIALS ════════════════════════════════════════ */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <SectionLabel>Student Stories</SectionLabel>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="font-head font-black text-4xl tracking-tight" style={{ color: '#f0f0ff' }}
          >
            Real results from real learners
          </motion.h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="card p-7"
            >
              <div className="flex gap-0.5 mb-4">
                {Array(t.rating).fill(null).map((_, j) => <Star key={j} size={13} className="text-amber-400 fill-amber-400" />)}
              </div>
              <p className="text-sm text-white/60 leading-relaxed mb-6 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent2 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">{t.avatar}</div>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-white/40">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══ ABOUT / FOUNDER ═════════════════════════════════════ */}
      <section id="about" className="py-28 px-6" style={{ background: 'linear-gradient(180deg,transparent,rgba(91,106,245,0.06),transparent)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <SectionLabel>About NeuralLearn</SectionLabel>
            <motion.h2
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="font-head font-black text-4xl md:text-5xl tracking-tight" style={{ color: '#f0f0ff' }}
            >
              Built with a mission
            </motion.h2>
          </div>

          {/* Mission */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-20">
            {[
              { icon: Cpu,       title: 'AI-First Design',       desc: 'Every feature is powered by AI — from personalized learning paths to resume generation and intelligent tutoring.' },
              { icon: Globe,     title: 'Accessible Education',  desc: 'World-class education should not cost a fortune. NeuralLearn delivers bootcamp-quality learning at a fraction of the price.' },
              { icon: TrendingUp,title: 'Outcome Focused',       desc: 'We measure success by your success. 87% of graduates land jobs in tech within 3 months of completing their first course.' },
            ].map((m, i) => (
              <motion.div
                key={m.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="card p-7 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-accent2/10 border border-accent/15 flex items-center justify-center mx-auto mb-5">
                  <m.icon size={24} className="text-accent" />
                </div>
                <h3 className="font-head font-bold text-base mb-3">{m.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{m.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Founder card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card overflow-hidden"
            style={{ background: 'linear-gradient(135deg,rgba(91,106,245,0.08),rgba(124,58,237,0.06))', borderColor: 'rgba(91,106,245,0.2)' }}
          >
            <div className="flex flex-col md:flex-row items-center gap-10 p-10">
              {/* Photo */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-40 h-40 rounded-3xl overflow-hidden border-2 border-accent/30 shadow-[0_0_40px_rgba(91,106,245,0.2)]">
                    <div className="w-full h-full bg-gradient-to-br from-accent/30 via-accent2/20 to-accent3/20 flex items-center justify-center">
                      {/* Replace src with your actual photo URL */}
                      <img
  src={founder}
  alt="Arpit Aware"
  className="w-full h-full object-cover"
/>
                    </div>
                  </div>
                  {/* Glow ring */}
                  <div className="absolute -inset-2 rounded-[28px] border border-accent/15 pointer-events-none" />
                </div>
              </div>

              {/* Bio */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-3 justify-center md:justify-start mb-3">
                  <span className="badge badge-blue">Founder & CEO</span>
                  <span className="badge badge-purple">Full-Stack Dev</span>
                </div>
                <h3 className="font-head font-black text-3xl mb-1" style={{ color: '#f0f0ff' }}>Arpit Aware</h3>
                <p className="text-accent text-sm font-medium mb-4">Creator of NeuralLearn</p>
                <p className="text-white/60 text-sm leading-relaxed mb-5 max-w-2xl">
                  Hi! I am Arpit, a passionate full-stack developer and lifelong learner. I built NeuralLearn
                  because I believe everyone deserves access to world-class tech education — not just those who
                  can afford expensive bootcamps. Starting from scratch, I wanted to create a platform that
                  combines AI-powered personalization, real-world projects, and a direct path to employment.
                  NeuralLearn is the learning platform I wish had existed when I started my coding journey.
                </p>
                <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
                  <div className="flex items-center gap-1.5 text-white/40 text-xs">
                    <MapPin size={13} /> India
                  </div>
                  <div className="flex items-center gap-1.5 text-white/40 text-xs">
                    <Code size={13} /> Full-Stack Developer
                  </div>
                  <div className="flex items-center gap-1.5 text-white/40 text-xs">
                    <Cpu size={13} /> AI Enthusiast
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4 justify-center md:justify-start">
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                    className="btn btn-ghost btn-sm btn-icon hover:text-white" title="GitHub">
                    <Github size={16} />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                    className="btn btn-ghost btn-sm btn-icon hover:text-accent" title="LinkedIn">
                    <Linkedin size={16} />
                  </a>
                  <a href="mailto:arpit@neurallearn.io"
                    className="btn btn-ghost btn-sm flex items-center gap-1.5 hover:text-accent">
                    <Mail size={14} /> arpit@neurallearn.io
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ CTA ══════════════════════════════════════════════════ */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%,rgba(91,106,245,0.14) 0%,transparent 70%)' }} />
        <Blob style={{ width: 500, height: 500, background: '#5b6af5', top: '-20%', left: '20%' }} />
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center relative z-10 max-w-2xl mx-auto"
        >
          <h2 className="font-head font-black text-4xl md:text-6xl tracking-tight mb-5" style={{ color: '#f0f0ff' }}>
            Your future starts<br /><span className="grad-text">today.</span>
          </h2>
          <p className="text-white/40 text-lg mb-10 leading-relaxed">
            Join 50,000+ learners already building careers in tech.<br />
            No credit card required. Cancel anytime.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to={token ? '/dashboard' : '/register'} className="btn btn-primary btn-lg" style={{ animation: 'glowPulse 2s ease infinite' }}>
              {token ? 'Go to Dashboard' : 'Start for Free Today'} <ArrowRight size={18} />
            </Link>
            {!token && <Link to="/login" className="btn btn-ghost btn-lg">Already have an account</Link>}
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 text-white/30 text-xs">
            {['No credit card','Cancel anytime','Instant access'].map(t => (
              <span key={t} className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-emerald-400" />{t}</span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════════ */}
      <footer className="border-t border-white/[0.06] py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent2 flex items-center justify-center font-head font-black text-white text-sm">N</div>
                <span className="font-head font-bold text-white tracking-tight">NeuralLearn</span>
              </div>
              <p className="text-white/30 text-xs leading-relaxed">The intelligent platform that turns learners into hired engineers.</p>
            </div>
            {[
              { title: 'Platform', links: ['Courses','AI Assistant','Resume Builder','Job Portal','Community','Calendar'] },
              { title: 'Company',  links: ['About','Blog','Careers','Press','Contact'] },
              { title: 'Legal',    links: ['Privacy Policy','Terms of Service','Cookie Policy'] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="font-head font-bold text-sm mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map(l => (
                    <li key={l}>
                      <Link to={token ? '/dashboard' : '/register'} className="text-white/30 hover:text-white text-xs transition-colors">{l}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/[0.06] pt-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-white/20 text-xs">© 2025 NeuralLearn. Built by Arpit Aware.</p>
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
