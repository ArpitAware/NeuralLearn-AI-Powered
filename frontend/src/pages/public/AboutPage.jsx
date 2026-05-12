/**
 * pages/public/AboutPage.jsx - Full dark redesign
 */
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../../components/home/PublicNavbar';
import { FiArrowRight, FiCode, FiHeart, FiAward, FiGlobe, FiGithub } from 'react-icons/fi';

function useScrollReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal,.reveal-left').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const VALUES = [
  { icon: FiCode,   color:'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',  title:'Clean Code',      desc:'Every file is well-commented, modular, and follows industry best practices — MVC, custom hooks, context API.' },
  { icon: FiHeart,  color:'bg-rose-500/10 border-rose-500/20 text-rose-400',        title:'User First',      desc:'Every design decision starts with what makes the experience simpler, faster, and more delightful.' },
  { icon: FiAward,  color:'bg-amber-500/10 border-amber-500/20 text-amber-400',     title:'Portfolio Grade', desc:'Built to showcase real full-stack depth — MongoDB aggregation, JWT refresh rotation, Recharts, Vite.' },
  { icon: FiGlobe,  color:'bg-emerald-500/10 border-emerald-500/20 text-emerald-400', title:'Open Source',   desc:'Free to use, fork, and learn from. The entire codebase is MIT licensed and documented.' },
];

const TECH = [
  { name:'MongoDB',     icon:'🍃', color:'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-400/10 border-green-200 dark:border-green-400/20'  },
  { name:'Express.js',  icon:'⚡', color:'text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-400/10 border-gray-200 dark:border-gray-400/20'   },
  { name:'React 18',    icon:'⚛️', color:'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-400/10 border-cyan-200 dark:border-cyan-400/20'   },
  { name:'Node.js',     icon:'🟢', color:'text-lime-600 dark:text-lime-400 bg-lime-50 dark:bg-lime-400/10 border-lime-200 dark:border-lime-400/20'   },
  { name:'Tailwind CSS',icon:'🎨', color:'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-400/10 border-sky-200 dark:border-sky-400/20'    },
  { name:'JWT Auth',    icon:'🔐', color:'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-400/10 border-purple-200 dark:border-purple-400/20' },
  { name:'Recharts',    icon:'📊', color:'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-400/10 border-indigo-200 dark:border-indigo-400/20' },
  { name:'Vite',        icon:'⚡', color:'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-400/10 border-yellow-200 dark:border-yellow-400/20' },
];

const TIMELINE = [
  { year:'Week 1', label:'Idea & Architecture', desc:'Designed the MVC structure, MongoDB schemas, and React component hierarchy.' },
  { year:'Week 2', label:'Backend Built',       desc:'Node.js + Express API with JWT auth, validation, and MongoDB aggregation pipelines.' },
  { year:'Week 3', label:'Frontend Complete',   desc:'React dashboard with Recharts, dark mode, responsive layout, and all CRUD flows.' },
  { year:'Week 4', label:'Polish & Deploy',     desc:'Landing pages, animations, INR currency, budget alerts, and CSV export added.' },
];

export default function AboutPage() {
  useScrollReveal();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      <PublicNavbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="pt-24 pb-16 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background:'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(99,102,241,0.15) 0%, transparent 70%)' }} />
          <div className="animate-blob absolute top-20 left-1/4 w-72 h-72 bg-indigo-600/8 rounded-full blur-3xl" />
          <div className="animate-blob delay-3000 absolute top-20 right-1/4 w-64 h-64 bg-purple-600/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto">
          <div className="animate-slide-up inline-block text-indigo-400 text-sm font-bold uppercase tracking-widest mb-5 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
            Our Story
          </div>
          <h1 className="animate-slide-up delay-100 text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
            Built with purpose,<br />
            <span className="shimmer-text">for real people.</span>
          </h1>
          <p className="animate-slide-up delay-200 text-xl text-gray-600 dark:text-gray-500 leading-relaxed">
            SpendWise started as a MERN portfolio project and became a tool people actually use every day.
          </p>
        </div>
      </section>

      {/* ── Founder Section ──────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="reveal grid grid-cols-1 lg:grid-cols-5 gap-0 rounded-3xl overflow-hidden border border-white/5 shadow-2xl">

          {/* Left: Photo panel */}
          <div className="lg:col-span-2 relative min-h-80 flex flex-col items-center justify-center p-10"
            style={{ background:'linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#1e1b4b 100%)' }}>
            <div className="absolute inset-0 opacity-[0.05]"
              style={{ backgroundImage:'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize:'30px 30px' }} />
            <div className="absolute top-10 right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl" />
            <div className="absolute bottom-10 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />

            {/* Avatar — replace src with real photo */}
            <div className="relative z-10 w-36 h-36 rounded-3xl bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-indigo-500/40 mb-6 animate-tilt">
              YN
            </div>
            <div className="relative z-10 text-center">
              <p className="text-white text-xl font-black">Your Name</p>
              <p className="text-indigo-300 text-sm mt-1">Founder & Full-Stack Developer</p>
            </div>
            <div className="relative z-10 flex flex-wrap gap-2 mt-5 justify-center">
              {['MERN Dev 🚀', 'India 🇮🇳', 'Open Source'].map((t) => (
                <span key={t} className="px-3 py-1 bg-white/8 border border-white/15 rounded-full text-white/70 text-xs">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Message */}
          <div className="lg:col-span-3 bg-gray-50 dark:bg-gray-900 p-10 lg:p-12">
            <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest block mb-5">
              — A Message from the Founder
            </span>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
              Built from <span className="text-indigo-400">real frustration,</span><br />
              for real users.
            </h2>

            <blockquote className="border-l-4 border-indigo-500 pl-5 mb-6">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic text-lg">
                "I couldn't find a simple, beautiful expense tracker that worked in ₹ INR and didn't charge me a subscription. So I built one — and made it completely free."
              </p>
            </blockquote>

            <div className="space-y-4 text-gray-600 dark:text-gray-500 text-sm leading-relaxed">
              <p>
                SpendWise was born out of a real problem: existing tools were either too complex, too expensive, or didn't support Indian currency properly. As a MERN developer, I knew I could build something better.
              </p>
              <p>
                I designed every feature — from the MongoDB ObjectId aggregation fix to the animated 3D dashboard cards — to be both technically impressive and genuinely useful for everyday budgeting.
              </p>
              <p>
                This isn't just a portfolio project collecting dust. It's a real tool, with real users, solving a real problem — and it's completely free.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 mt-8">
              {[
                { icon:'✅', text:'Full-Stack MERN Developer' },
                { icon:'🇮🇳', text:'Based in India'           },
                { icon:'🎓', text:'CS Graduate'               },
              ].map((b) => (
                <div key={b.text} className="flex items-center gap-2 bg-gray-200 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-3 py-2">
                  <span>{b.icon}</span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{b.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Build Timeline ────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="text-center mb-12 reveal">
          <span className="text-indigo-600 dark:text-indigo-400 text-sm font-bold uppercase tracking-widest">How It Was Built</span>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white mt-3">The build timeline</h2>
        </div>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500 via-purple-500 to-transparent" />
          <div className="space-y-8">
            {TIMELINE.map((t, i) => (
              <div key={t.year} className={`reveal delay-${(i+1)*100} flex gap-6 items-start`}>
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white font-black text-xs text-center leading-tight shadow-lg shadow-indigo-500/30">
                    {t.year}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-white/5 flex-1">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">{t.label}</h3>
                  <p className="text-gray-600 dark:text-gray-500 text-sm">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12 reveal">
          <span className="text-indigo-600 dark:text-indigo-400 text-sm font-bold uppercase tracking-widest">What We Stand For</span>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white mt-3">Our values</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {VALUES.map((v, i) => (
            <div key={v.title} className={`reveal delay-${(i%2+1)*100} flex gap-4 p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-indigo-300 dark:hover:border-indigo-500/20 transition-all card-hover`}>
              <div className={`w-12 h-12 rounded-xl ${v.color} border flex items-center justify-center flex-shrink-0`}>
                <v.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">{v.title}</h3>
                <p className="text-gray-600 dark:text-gray-500 text-sm">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tech Stack ───────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6" style={{ background:'linear-gradient(180deg,rgba(99,102,241,0.04) 0%,transparent 100%)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 reveal">
            <span className="text-indigo-600 dark:text-indigo-400 text-sm font-bold uppercase tracking-widest">Technology</span>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white mt-3">Built with modern tools</h2>
          </div>
          <div className="flex flex-wrap gap-3 justify-center reveal">
            {TECH.map((t) => (
              <div key={t.name} className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl border text-sm font-semibold card-hover transition-all ${t.color}`}>
                <span className="text-base">{t.icon}</span> {t.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto reveal">
          <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">Ready to start?</h2>
          <p className="text-gray-600 dark:text-gray-500 mb-8 text-lg">Join hundreds of users who track their money smarter with SpendWise.</p>
          <Link to="/register"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all hover:-translate-y-1">
            Create Free Account
            <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-200 dark:border-white/5 py-8 px-4 text-center text-sm text-gray-500 dark:text-gray-700">
        <p>© 2025 SpendWise — MIT License. Made with ❤️ in India 🇮🇳</p>
      </footer>
    </div>
  );
}
