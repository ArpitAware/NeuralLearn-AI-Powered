import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import founder from '../assets/founder.png'
import {
  ArrowRight, MapPin, Mail, Github, Linkedin, Twitter,
  Code, Cpu, Globe, TrendingUp, Users, Award, Heart,
  CheckCircle2, Zap, BookOpen
} from 'lucide-react';

const MILESTONES = [
  { year: '2024', title: 'NeuralLearn Founded',     desc: 'Started with a vision to democratize tech education using AI.' },
  { year: '2024', title: 'First 1,000 Students',    desc: 'Reached 1,000 enrolled students within the first 3 months of launch.' },
  { year: '2024', title: 'AI Assistant Launched',   desc: 'Introduced the AI tutoring assistant — a first in the LMS space.' },
  { year: '2025', title: '50,000+ Learners',        desc: 'Crossed 50,000 active learners with 87% job placement rate.' },
  { year: '2025', title: 'Job Portal Integration',  desc: 'Partnered with 1,000+ companies to offer direct job placements.' },
  { year: '2025', title: 'Resume Builder Launch',   desc: 'AI-powered resume builder helping graduates land interviews faster.' },
];

const VALUES = [
  { icon: Heart,       title: 'Learner First',      desc: 'Every decision we make starts with one question: does this help our students succeed?' },
  { icon: Globe,       title: 'Accessible to All',  desc: 'World-class education should not be a privilege. We price fairly and offer financial aid.' },
  { icon: Zap,         title: 'AI-Powered',         desc: 'We leverage cutting-edge AI to personalize every learning journey at scale.' },
  { icon: TrendingUp,  title: 'Outcome Obsessed',   desc: 'We are not happy until you are hired. We track real-world outcomes, not vanity metrics.' },
  { icon: Users,       title: 'Community Driven',   desc: 'Learning is social. Our community of 50K+ peers and mentors is a core part of NeuralLearn.' },
  { icon: Award,       title: 'Quality Relentless', desc: 'Every course goes through rigorous review. We would rather have fewer, better courses.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg overflow-x-hidden">

      {/* Fixed Nav */}
      <div className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-bg/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent2 flex items-center justify-center font-head font-black text-white text-sm">N</div>
            <span className="font-head font-bold text-white tracking-tight">NeuralLearn</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/" className="btn btn-ghost btn-sm">← Back to Home</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get Started <ArrowRight size={14} /></Link>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-96 h-96 rounded-full bg-accent/10 blur-3xl top-0 left-1/4 animate-blob" />
          <div className="absolute w-80 h-80 rounded-full bg-accent2/10 blur-3xl bottom-0 right-1/4 animate-blob" style={{ animationDelay: '-4s' }} />
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: 'linear-gradient(rgba(91,106,245,1) 1px,transparent 1px),linear-gradient(90deg,rgba(91,106,245,1) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold uppercase tracking-widest mb-6"
          >
            Our Story
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-head font-black text-5xl md:text-6xl tracking-tight mb-6"
            style={{ color: '#f0f0ff' }}
          >
            Building the future<br /><span className="grad-text">of learning</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-white/50 text-xl leading-relaxed max-w-2xl mx-auto"
          >
            NeuralLearn was born from a simple belief — that great tech education should be
            accessible, personalized, and directly connected to real career outcomes.
          </motion.p>
        </div>
      </section>

      {/* Stats Band */}
      <section className="py-12 border-y border-white/[0.06]"
        style={{ background: 'linear-gradient(90deg,rgba(91,106,245,0.04),rgba(124,58,237,0.06),rgba(6,182,212,0.04))' }}>
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-3 sm:flex sm:flex-wrap justify-center gap-5 sm:gap-14 md:gap-16">
          {[['50K+','Students'],['200+','Courses'],['87%','Job Rate'],['1,000+','Hiring Partners'],['4.9★','Rating']].map(([v, l]) => (
            <div key={l} className="text-center">
              <div className="font-head font-black text-3xl md:text-4xl grad-text mb-1">{v}</div>
              <div className="text-white/40 text-sm">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-28 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold uppercase tracking-widest mb-5">
            Meet the Founder
          </div>
          <h2 className="font-head font-black text-4xl md:text-5xl tracking-tight" style={{ color: '#f0f0ff' }}>
            The person behind<br /><span className="grad-text">NeuralLearn</span>
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
        >
          {/* Photo */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -inset-4 rounded-[36px] bg-gradient-to-br from-accent/20 to-accent2/10 blur-xl" />
              <div className="absolute -inset-1 rounded-[32px] border border-accent/20" />
              <div className="relative w-60 h-72 sm:w-72 sm:h-80 lg:w-80 lg:h-96 rounded-[28px] overflow-hidden border-2 border-accent/30 shadow-[0_0_60px_rgba(91,106,245,0.25)]">
                {/*
                  TO ADD YOUR REAL PHOTO:
                  Replace the div below with:
                  <img src={founder} alt="Arpit Aware" className="w-full h-full object-cover object-top" />
                  
                */}

                <img src={founder} alt="Arpit Aware" className="w-full h-full object-cover object-top" />
                
                <div className="w-full h-full bg-gradient-to-br from-accent/30 via-accent2/20 to-accent3/20 flex flex-col items-center justify-center gap-4">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-accent to-accent2 flex items-center justify-center shadow-[0_0_40px_rgba(91,106,245,0.4)]">
                    <span className="font-head font-black text-5xl text-white">A</span>
                  </div>
                  <div className="text-center">
                    <p className="font-head font-black text-2xl text-white">Arpit Aware</p>
                    <p className="text-accent text-sm mt-1">Founder & CEO</p>
                  </div>
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 bg-bg2 border border-accent/30 rounded-2xl px-4 py-3 shadow-xl">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-sm font-semibold text-white">Building NeuralLearn</span>
                </div>
                <p className="text-xs text-white/40 mt-0.5">Full-Stack Developer · India</p>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-6">
            <div>
              <h3 className="font-head font-black text-4xl mb-1" style={{ color: '#f0f0ff' }}>Arpit Aware</h3>
              <p className="text-accent font-semibold text-lg">Founder, CEO & Lead Developer</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {['Full-Stack Developer', 'AI Enthusiast', 'Open Source', 'MERN Stack', 'React Native'].map(tag => (
                <span key={tag} className="badge badge-blue">{tag}</span>
              ))}
            </div>

            <div className="space-y-4 text-white/60 text-base leading-relaxed">
              <p>
                Hi! I am Arpit, a passionate full-stack developer from India with a deep love for building
                products that make a real difference. I created NeuralLearn because I experienced firsthand
                how hard it is to break into tech without access to good resources.
              </p>
              <p>
                After spending months jumping between scattered tutorials, expensive courses, and
                disconnected communities, I decided to build the platform I wished had existed. NeuralLearn
                combines everything — AI-personalized learning, expert courses, a resume builder, job portal,
                and a supportive community — in one cohesive experience.
              </p>
              <p>
                My goal is simple: help 1 million developers land their first or next tech job through
                high-quality, affordable, and AI-powered education.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {[['5+','Years Coding'],['15+','Projects Built'],['50K+','Students Helped']].map(([v, l]) => (
                <div key={l} className="card p-4 text-center" style={{ borderColor: 'rgba(91,106,245,0.15)' }}>
                  <p className="font-head font-black text-2xl text-accent">{v}</p>
                  <p className="text-xs text-white/40 mt-1">{l}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-white/40">
              <div className="flex items-center gap-1.5"><MapPin size={14} /> India</div>
              <div className="flex items-center gap-1.5"><Mail size={14} /> arpit@neurallearn.io</div>
              <div className="flex items-center gap-1.5"><Code size={14} /> Full-Stack Dev</div>
              <div className="flex items-center gap-1.5"><Cpu size={14} /> AI Enthusiast</div>
            </div>

            <div className="flex items-center gap-3">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                className="btn btn-ghost btn-sm gap-2"><Github size={16} /> GitHub</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                className="btn btn-ghost btn-sm gap-2"><Linkedin size={16} /> LinkedIn</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="btn btn-ghost btn-sm gap-2"><Twitter size={16} /> Twitter</a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Values */}
      <section className="py-20 px-6" style={{ background: 'linear-gradient(180deg,transparent,rgba(91,106,245,0.04),transparent)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-head font-black text-4xl tracking-tight" style={{ color: '#f0f0ff' }}>Our Values</h2>
            <p className="text-white/40 mt-3">What drives every decision we make at NeuralLearn</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="card p-6"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/20 to-accent2/10 border border-accent/15 flex items-center justify-center mb-4">
                  <v.icon size={22} className="text-accent" />
                </div>
                <h3 className="font-head font-bold text-base mb-2">{v.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-head font-black text-4xl tracking-tight" style={{ color: '#f0f0ff' }}>Our Journey</h2>
        </div>
        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent/50 via-accent2/30 to-transparent" />
          {MILESTONES.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative flex items-start mb-10 pl-12 md:pl-0 ₹{i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
            >
              <div className="absolute left-2 md:left-1/2 md:-translate-x-1/2 w-5 h-5 rounded-full bg-accent border-2 border-bg shadow-[0_0_12px_rgba(91,106,245,0.5)] mt-1 flex-shrink-0" />
              <div className={`card p-5 md:w-[45%] ₹{i % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'}`}>
                <span className="badge badge-blue text-[10px] mb-2">{m.year}</span>
                <h4 className="font-head font-bold text-sm mb-1">{m.title}</h4>
                <p className="text-white/40 text-xs leading-relaxed">{m.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%,rgba(91,106,245,0.12) 0%,transparent 70%)' }} />
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center relative z-10 max-w-xl mx-auto"
        >
          <h2 className="font-head font-black text-4xl tracking-tight mb-4" style={{ color: '#f0f0ff' }}>
            Join our mission
          </h2>
          <p className="text-white/40 mb-8">Be part of the learning revolution. Start your journey today.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/register" className="btn btn-primary btn-lg">
              Start Learning Free <ArrowRight size={18} />
            </Link>
            <Link to="/" className="btn btn-ghost btn-lg">Back to Home</Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-6 text-white/30 text-xs flex-wrap">
            {['No credit card', 'Free forever plan', 'Cancel anytime'].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 size={11} className="text-emerald-400" />{t}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8 px-6 text-center text-white/20 text-sm">
        © 2025 NeuralLearn — Built by Arpit Aware
      </footer>
    </div>
  );
}
