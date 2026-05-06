import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play, Star, Zap, Target, Users, Award, Briefcase, Code, BarChart2, ChevronDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { coursesAPI } from '../services/api';

const FEATURES = [
  { icon: Zap,       title: 'AI-Powered Learning',   desc: 'Personalized paths that adapt in real-time using advanced ML models trained on millions of learner sessions.' },
  { icon: BarChart2, title: 'Deep Analytics',          desc: 'Crystal-clear progress tracking with beautiful charts. Know exactly where you stand and what to tackle next.' },
  { icon: Users,     title: 'Expert Community',        desc: 'Learn alongside 50,000+ peers. Get mentorship from engineers at FAANG, startups, and research labs.' },
  { icon: Award,     title: 'Verified Certificates',   desc: 'Industry-recognized credentials trusted by 1,000+ companies. Stand out in every job application.' },
  { icon: Briefcase, title: '87% Job Placement',       desc: 'Direct pipeline to hiring partners. Most graduates land offers within 3 months of completion.' },
  { icon: Code,      title: 'Project-First Curriculum', desc: 'Ship real products. Graduate with a portfolio that proves your skills — not just a certificate.' },
];

const STATS = [
  { value: '50K+', label: 'Active Learners' },
  { value: '200+', label: 'Expert Courses' },
  { value: '87%',  label: 'Job Placement' },
  { value: '4.9★', label: 'Avg Rating' },
];

const TESTIMONIALS = [
  { name: 'Leila Ahmadi',   role: 'ML Engineer @ Google',  text: 'NeuralLearn transformed my career in under 6 months. The ML course curriculum is better than any bootcamp I tried.', avatar: 'LA' },
  { name: 'Raj Patel',      role: 'Senior Dev @ Stripe',   text: 'The best investment I made. Quality rivals top bootcamps at a fraction of the cost. Got hired 3 months after finishing.', avatar: 'RP' },
  { name: 'Mei Zhou',       role: 'Data Scientist @ Netflix', text: 'The AI assistant alone is worth the price. It explains complex concepts better than most human tutors.', avatar: 'MZ' },
];

function Blob({ style }) {
  return (
    <div
      className="absolute rounded-[60%_40%_30%_70%/60%_30%_70%_40%] animate-blob filter blur-3xl opacity-15 pointer-events-none"
      style={style}
    />
  );
}

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);

  // ✅ FIX: Use window scroll directly instead of target-based useScroll.
  // target=heroRef fires scroll progress relative to the element's scroll
  // container, which on a full-height section means progress hits 1 almost
  // immediately — fading out the hero content before the user scrolls at all.
  // Instead we track raw window scrollY and derive opacity/y manually.
  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Only start fading after 120px of scroll, fully gone at 500px
  const heroOpacity = Math.max(0, 1 - Math.max(0, scrollY - 120) / 380);
  // Subtle upward drift — max 50px
  const heroY = Math.min(50, Math.max(0, scrollY - 120) * 0.13);

  const { data: coursesData } = useQuery({
    queryKey: ['featured-courses'],
    queryFn: () => coursesAPI.getFeatured().then(r => r.data),
  });

  const featured = coursesData?.courses?.slice(0, 3) || [];

  const navStyle = scrollY > 60
    ? 'bg-bg/95 backdrop-blur-xl border-b border-white/[0.06] shadow-xl'
    : 'bg-transparent';

  return (
    <div className="min-h-screen bg-bg overflow-x-hidden">
      {/* NAV */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navStyle}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent2 flex items-center justify-center font-head font-black text-white text-sm">N</div>
            <span className="font-head font-bold text-white tracking-tight">NeuralLearn</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-white/50">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#courses" className="hover:text-white transition-colors">Courses</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Reviews</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn btn-ghost btn-sm">Log in</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get Started <ArrowRight size={14} /></Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ zIndex: 1 }}>
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          {/* Grid */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'linear-gradient(rgba(91,106,245,1) 1px, transparent 1px), linear-gradient(90deg, rgba(91,106,245,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
          {/* Scan line */}
          <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent animate-scan" />
          {/* Blobs */}
          <Blob style={{ width: 600, height: 600, background: '#5b6af5', top: '-5%', left: '-10%' }} />
          <Blob style={{ width: 500, height: 500, background: '#7c3aed', bottom: '5%', right: '-5%', animationDelay: '-4s' }} />
          <Blob style={{ width: 300, height: 300, background: '#06b6d4', top: '40%', right: '15%', animationDelay: '-2s' }} />
          {/* Radial glow */}
          <div className="absolute inset-0 bg-radial-gradient" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(91,106,245,0.08) 0%, transparent 70%)' }} />
        </div>

        <div
          style={{ opacity: heroOpacity, transform: `translateY(${heroY}px)`, transition: 'none', position: 'relative', zIndex: 10 }}
          className="text-center px-6 max-w-5xl mx-auto pt-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-8"
          >
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
            AI-Powered Learning Platform · 50,000+ Learners
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-head font-black text-5xl md:text-7xl leading-[1.05] tracking-[-0.04em] text-white mb-6" style={{ color: "#f0f0ff" }}
          >
            Learn Faster.<br />
            <span className="grad-text">Build Smarter.</span><br />
            Get Hired.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            The world's most intelligent learning platform. Personalized AI tutoring,
            expert-led courses, and a direct pipeline to top tech companies.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-16"
          >
            <Link to="/register" className="btn btn-primary btn-lg animate-glow-pulse">
              Start Learning Free <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-ghost btn-lg">
              <Play size={16} /> Explore Courses
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-10 text-center"
          >
            {STATS.map(s => (
              <div key={s.label}>
                <div className="font-head font-black text-2xl text-white">{s.value}</div>
                <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/20"
          style={{ opacity: Math.max(0, 1 - scrollY / 200) }}
        >
          <ChevronDown size={24} />
        </motion.div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-28 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm mb-4"
          >
            Everything you need
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="font-head font-black text-4xl md:text-5xl tracking-tight mb-4"
          >
            Why NeuralLearn?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="text-white/40 text-lg max-w-xl mx-auto"
          >
            Built by engineers, for serious learners who demand real-world outcomes.
          </motion.p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="card card-glow p-7 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/20 to-accent2/15 border border-accent/15 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <f.icon size={22} className="text-accent" />
              </div>
              <h3 className="font-head font-bold text-base mb-2">{f.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURED COURSES */}
      <section id="courses" className="py-20 px-6" style={{ background: 'linear-gradient(180deg, transparent, rgba(91,106,245,0.04), transparent)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-head font-black text-3xl md:text-4xl tracking-tight">Featured Courses</h2>
              <p className="text-white/40 mt-2">Handpicked by our curriculum experts</p>
            </div>
            <Link to="/login" className="btn btn-ghost hidden md:flex">View All <ArrowRight size={16} /></Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {featured.length === 0
              ? Array(3).fill(null).map((_, i) => (
                  <div key={i} className="card overflow-hidden animate-pulse">
                    <div className="h-44 bg-white/[0.06]" />
                    <div className="p-5 space-y-3">
                      <div className="h-3 bg-white/[0.06] rounded-lg w-3/4" />
                      <div className="h-2 bg-white/[0.04] rounded-lg w-1/2" />
                      <div className="h-3 bg-white/[0.06] rounded-lg w-1/3" />
                    </div>
                  </div>
                ))
              : featured.map((course, i) => (
                  <motion.div
                    key={course._id}
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -4 }}
                    className="card card-glow overflow-hidden cursor-pointer group"
                    onClick={() => window.location.href = '/login'}
                  >
                    <div className="relative h-44 overflow-hidden">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-accent/20 to-accent2/10 flex items-center justify-center">
                          <span className="text-4xl opacity-30">📚</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
                      <span className="badge badge-blue absolute top-3 left-3 text-[10px]">{course.category}</span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-head font-bold text-sm mb-1 line-clamp-2 group-hover:text-accent transition-colors">{course.title}</h3>
                      <p className="text-xs text-white/40 mb-3">{course.instructor?.name}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-head font-black text-xl text-accent">${course.price}</span>
                        <span className="text-xs text-amber-400 flex items-center gap-1">
                          <Star size={10} fill="currentColor" /> {course.rating?.toFixed(1) || '0.0'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
            }
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-head font-black text-4xl tracking-tight mb-3">Loved by Learners</h2>
          <p className="text-white/40">Real results from real people</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="card p-7"
            >
              <div className="flex gap-0.5 mb-4">
                {Array(5).fill(null).map((_, i) => <Star key={i} size={14} className="text-amber-400 fill-amber-400" />)}
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

      {/* CTA */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(91,106,245,0.12) 0%, transparent 70%)' }} />
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center relative max-w-2xl mx-auto"
        >
          <h2 className="font-head font-black text-4xl md:text-5xl tracking-tight mb-4">
            Ready to transform<br /><span className="grad-text">your career?</span>
          </h2>
          <p className="text-white/40 text-lg mb-10">Join 50,000+ learners already building their future on NeuralLearn.</p>
          <Link to="/register" className="btn btn-primary btn-lg animate-glow-pulse">
            Start for Free Today <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>

      <footer className="border-t border-white/[0.06] py-8 px-6 text-center text-white/20 text-sm">
        © 2025 NeuralLearn — The intelligent learning platform
      </footer>
    </div>
  );
}
