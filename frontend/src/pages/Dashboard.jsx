import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Clock, Award, Zap, ArrowRight, Play, TrendingUp } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { analyticsAPI, progressAPI } from '../services/api';
import { StatCard, ProgressBar, PageLoader, SectionHeader } from '../components/common/UI';
import CourseCard from '../components/common/CourseCard';
import { useNavigate } from 'react-router-dom';

const ACTIVITY = [
  { text: 'Completed "Neural Networks" lesson', time: '2h ago', icon: '✅' },
  { text: 'Quiz passed: Python Data Structures', time: '1d ago', icon: '🏆' },
  { text: 'Posted in ML Community Forum',       time: '2d ago', icon: '💬' },
  { text: 'Enrolled in Full-Stack course',      time: '3d ago', icon: '📚' },
];

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ['student-analytics'],
    queryFn: () => analyticsAPI.getStudent().then(r => r.data),
  });

  const { data: progressData } = useQuery({
    queryKey: ['my-progress'],
    queryFn: () => progressAPI.getAll().then(r => r.data),
  });

  const analytics = analyticsData?.data || {};
  const progresses = progressData?.progress || [];
  const firstName = user?.name?.split(' ')[0] || 'Learner';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const stats = [
    { label: 'Enrolled Courses', value: analytics.enrolled ?? progresses.length, icon: BookOpen, color: '#5b6af5' },
    { label: 'Hours Learned',    value: `${analytics.totalHours ?? 0}h`,         icon: Clock,     color: '#10b981' },
    { label: 'Completed',        value: analytics.completed ?? 0,                icon: Award,     color: '#f59e0b' },
    { label: 'Avg Progress',     value: `${analytics.avgProgress ?? 0}%`,        icon: TrendingUp, color: '#ec4899' },
  ];

  if (analyticsLoading) return <PageLoader />;

  return (
    <div className="space-y-7 pb-8">
      {/* WELCOME BANNER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-7"
        style={{ background: 'linear-gradient(135deg, rgba(91,106,245,0.15) 0%, rgba(124,58,237,0.08) 100%)', border: '1px solid rgba(91,106,245,0.2)' }}
      >
        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-8xl opacity-[0.06] pointer-events-none select-none">🧠</div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative">
          <p className="text-white/50 text-sm mb-1">{greeting},</p>
          <h1 className="font-head font-black text-3xl tracking-tight mb-2">
            <span className="grad-text">{firstName}</span> 👋
          </h1>
          <p className="text-white/50 text-sm mb-5 max-w-md">
            {analytics.completed > 0
              ? `You've completed ${analytics.completed} course${analytics.completed > 1 ? 's' : ''}. Keep pushing — you're in the top 5% this week!`
              : "You're just getting started. Pick up a course and begin your learning journey!"}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/courses" className="btn btn-primary btn-sm">Continue Learning <ArrowRight size={14} /></Link>
            <Link to="/ai-assistant" className="btn btn-ghost btn-sm"><Zap size={14} /> Ask AI</Link>
          </div>
        </div>
      </motion.div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => <StatCard key={s.label} {...s} index={i} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CONTINUE LEARNING */}
        <div className="lg:col-span-2 space-y-4">
          <SectionHeader
            title="Continue Learning"
            action={<Link to="/courses" className="btn btn-ghost btn-sm">View all <ArrowRight size={14} /></Link>}
          />
          {progresses.length === 0 ? (
            <div className="card p-8 text-center">
              <div className="text-4xl mb-3">📚</div>
              <p className="text-white/40 text-sm mb-4">No courses yet. Start exploring!</p>
              <Link to="/courses" className="btn btn-primary btn-sm inline-flex">Browse Courses</Link>
            </div>
          ) : (
            progresses.slice(0, 4).map((p, i) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="card card-hover p-4 flex gap-4 items-center cursor-pointer"
                onClick={() => navigate(`/courses/${p.course?.slug || ''}/learn`)}
              >
                {p.course?.thumbnail && (
                  <img src={p.course.thumbnail} alt="" className="w-16 h-12 object-cover rounded-xl flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm mb-1 truncate">{p.course?.title || 'Course'}</p>
                  <div className="flex items-center gap-2">
                    <ProgressBar value={p.progressPercent} height="h-1.5" className="flex-1" />
                    <span className="text-xs text-accent font-semibold flex-shrink-0">{p.progressPercent}%</span>
                  </div>
                </div>
                <button className="btn btn-primary btn-sm flex-shrink-0">
                  <Play size={12} /> Resume
                </button>
              </motion.div>
            ))
          )}
        </div>

        {/* SIDEBAR */}
        <div className="space-y-4">
          {/* Weekly goal */}
          <div className="card p-5">
            <h3 className="font-head font-bold text-sm mb-4">Weekly Goal</h3>
            <div className="flex items-baseline gap-1 mb-3">
              <span className="font-head font-black text-2xl">{Math.min(analytics.totalHours ?? 0, 20)}</span>
              <span className="text-white/40 text-sm">/ 20h</span>
            </div>
            <ProgressBar value={Math.min(((analytics.totalHours ?? 0) / 20) * 100, 100)} height="h-2.5" />
            <p className="text-xs text-white/30 mt-2">
              {20 - Math.min(analytics.totalHours ?? 0, 20)}h remaining this week
            </p>
          </div>

          {/* Activity */}
          <div className="card p-5">
            <h3 className="font-head font-bold text-sm mb-4">Recent Activity</h3>
            <div className="space-y-0">
              {ACTIVITY.map((a, i) => (
                <div key={i} className={`flex gap-3 py-3 ${i < ACTIVITY.length - 1 ? 'border-b border-white/[0.04]' : ''}`}>
                  <span className="text-base flex-shrink-0 mt-0.5">{a.icon}</span>
                  <div>
                    <p className="text-xs leading-snug text-white/70">{a.text}</p>
                    <p className="text-xs text-white/30 mt-1">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Streak */}
          <div className="card p-5" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(239,68,68,0.05))', borderColor: 'rgba(245,158,11,0.15)' }}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">🔥</span>
              <div>
                <p className="font-head font-black text-xl text-amber-400">{user?.streak || 14} days</p>
                <p className="text-xs text-white/40">Current streak</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WEEKLY CHART */}
      {analytics.weeklyActivity && (
        <div className="card p-6">
          <SectionHeader title="This Week's Activity" subtitle="Hours learned per day" />
          <div className="flex items-end gap-3 h-24">
            {analytics.weeklyActivity.map((h, i) => {
              const max = Math.max(...analytics.weeklyActivity);
              const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div
                    initial={{ height: 0 }} animate={{ height: `${(h / max) * 80}px` }}
                    transition={{ delay: i * 0.1, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                    className="w-full rounded-t-lg bg-gradient-to-t from-accent to-accent3"
                    style={{ minHeight: 4 }}
                  />
                  <span className="text-[10px] text-white/30">{days[i]}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
