import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Clock, Award, TrendingUp, ArrowRight, Play, Zap, CheckCircle2 } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { analyticsAPI, progressAPI, communityAPI } from '../services/api';
import { StatCard, ProgressBar, PageLoader, SectionHeader, Skeleton } from '../components/common/UI';
import { formatDistanceToNow } from '../components/common/utils';

export default function Dashboard() {
  const { user }  = useAuthStore();
  const navigate  = useNavigate();
  const firstName = user?.name?.split(' ')[0] || 'Learner';
  const hour      = new Date().getHours();
  const greeting  = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey:  ['student-analytics'],
    queryFn:   () => analyticsAPI.getStudent().then(r => r.data),
    staleTime: 30_000,
  });

  const { data: progressData, isLoading: progressLoading } = useQuery({
    queryKey:  ['my-progress'],
    queryFn:   () => progressAPI.getAll().then(r => r.data),
    staleTime: 30_000,
  });

  const { data: postsData } = useQuery({
    queryKey:  ['recent-posts-dashboard'],
    queryFn:   () => communityAPI.getPosts({ limit: 3, sort: 'newest' }).then(r => r.data),
    staleTime: 60_000,
  });

  const analytics   = analyticsData?.data   || {};
  const progresses  = progressData?.progress || [];
  const inProgress  = progresses.filter(p => p.progressPercent > 0 && !p.completed);
  const notStarted  = progresses.filter(p => p.progressPercent === 0);
  const completed   = progresses.filter(p => p.completed);
  const recentPosts = postsData?.posts || [];

  const stats = [
    { label: 'Enrolled',     value: analytics.enrolled    ?? progresses.length,      icon: BookOpen,   color: '#5b6af5' },
    { label: 'Hours Learned',value: `${analytics.totalHours ?? 0}h`,                 icon: Clock,      color: '#10b981' },
    { label: 'Completed',    value: analytics.completed   ?? 0,                       icon: Award,      color: '#f59e0b' },
    { label: 'Avg Progress', value: `${analytics.avgProgress ?? 0}%`,                icon: TrendingUp, color: '#ec4899' },
  ];

  const weeklyActivity = analytics.weeklyActivity || Array(7).fill(0);
  const maxActivity    = Math.max(...weeklyActivity, 1);
  const dayLabels      = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Real skill list derived from enrolled course categories
  const skillList = Object.entries(analytics.skillMap || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (analyticsLoading) return <PageLoader />;

  const courseList = [...inProgress, ...notStarted].slice(0, 4);

  return (
    <div className="space-y-7 pb-8">
      {/* WELCOME BANNER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-7"
        style={{ background: 'linear-gradient(135deg,rgba(91,106,245,.15),rgba(124,58,237,.08))', border: '1px solid rgba(91,106,245,.2)' }}
      >
        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-8xl opacity-[.06] pointer-events-none select-none">🧠</div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative">
          <p className="text-white/50 text-sm mb-1">{greeting},</p>
          <h1 className="font-head font-black text-3xl tracking-tight mb-2">
            <span className="grad-text">{firstName}</span> 👋
          </h1>
          <p className="text-white/50 text-sm mb-5 max-w-md">
            {completed.length > 0
              ? `You've completed ${completed.length} course${completed.length > 1 ? 's' : ''}. Outstanding work!`
              : inProgress.length > 0
              ? `${inProgress.length} course${inProgress.length > 1 ? 's' : ''} in progress. Keep the momentum going!`
              : 'Welcome to NeuralLearn! Browse courses to start your journey.'}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/courses"      className="btn btn-primary btn-sm">{inProgress.length > 0 ? 'Continue Learning' : 'Browse Courses'} <ArrowRight size={14} /></Link>
            <Link to="/ai-assistant" className="btn btn-ghost   btn-sm"><Zap size={14} /> Ask AI</Link>
          </div>
        </div>
      </motion.div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s, i) => <StatCard key={s.label} {...s} index={i} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COURSE LIST */}
        <div className="lg:col-span-2 space-y-3">
          <SectionHeader
            title="Continue Learning"
            subtitle={inProgress.length > 0 ? `${inProgress.length} in progress` : undefined}
            action={<Link to="/courses" className="btn btn-ghost btn-sm">All Courses <ArrowRight size={14} /></Link>}
          />

          {progressLoading
            ? Array(2).fill(null).map((_, i) => (
                <div key={i} className="card p-4 flex gap-4 items-center">
                  <Skeleton className="w-16 h-12 flex-shrink-0" />
                  <div className="flex-1 space-y-2"><Skeleton className="h-3 w-3/4" /><Skeleton className="h-2 w-full" /></div>
                </div>
              ))
            : courseList.length === 0 ? (
                <div className="card p-10 text-center">
                  <div className="text-4xl mb-3">📚</div>
                  <p className="text-white/40 text-sm mb-4">You haven't enrolled in any courses yet.</p>
                  <Link to="/courses" className="btn btn-primary btn-sm inline-flex">Browse Courses</Link>
                </div>
              ) : (
                courseList.map((p, i) => (
                  <motion.div
                    key={p._id}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="card card-hover p-4 flex gap-4 items-center cursor-pointer group"
                    onClick={() => navigate(`/courses/${p.course?.slug || p.course?._id || ''}/learn`)}
                  >
                    {p.course?.thumbnail
                      ? <img src={p.course.thumbnail} alt="" className="w-16 h-12 object-cover rounded-xl flex-shrink-0 group-hover:scale-105 transition-transform" />
                      : <div className="w-16 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0"><BookOpen size={18} className="text-accent" /></div>
                    }
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm mb-1 truncate group-hover:text-accent transition-colors">{p.course?.title || 'Course'}</p>
                      <div className="flex items-center gap-2">
                        <ProgressBar value={p.progressPercent} height="h-1.5" className="flex-1" />
                        <span className="text-xs text-accent font-semibold flex-shrink-0">{p.progressPercent}%</span>
                      </div>
                      {p.course?.category && <p className="text-[10px] text-white/30 mt-1">{p.course.category}</p>}
                    </div>
                    <button className="btn btn-primary btn-sm flex-shrink-0">
                      <Play size={12} /> {p.progressPercent > 0 ? 'Resume' : 'Start'}
                    </button>
                  </motion.div>
                ))
              )
          }

          {/* Completed section */}
          {completed.length > 0 && (
            <div className="card p-4">
              <p className="text-xs text-white/40 uppercase tracking-widest font-semibold mb-3">Completed ({completed.length})</p>
              <div className="space-y-2">
                {completed.slice(0, 3).map(p => (
                  <div key={p._id} className="flex items-center gap-3">
                    {p.course?.thumbnail && <img src={p.course.thumbnail} alt="" className="w-10 h-7 object-cover rounded-lg flex-shrink-0" />}
                    <p className="text-sm flex-1 truncate text-white/60">{p.course?.title}</p>
                    <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
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
            <p className="text-xs text-white/30 mt-2">{Math.max(0, 20 - (analytics.totalHours ?? 0))}h remaining this week</p>
          </div>

          {/* Skills from real enrolled categories */}
          {skillList.length > 0 ? (
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-head font-bold text-sm">Your Skills</h3>
                <Link to="/progress" className="text-xs text-accent hover:underline">Details</Link>
              </div>
              <div className="space-y-3">
                {skillList.map(([cat, pct]) => (
                  <div key={cat}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/60">{cat}</span>
                      <span className="font-semibold text-accent">{pct}%</span>
                    </div>
                    <ProgressBar value={pct} height="h-1.5" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="card p-5 text-center">
              <p className="text-xs text-white/30">Enroll in courses to see your skills here.</p>
            </div>
          )}

          {/* Streak */}
          <div className="card p-5" style={{ background: 'linear-gradient(135deg,rgba(245,158,11,.08),rgba(239,68,68,.05))', borderColor: 'rgba(245,158,11,.15)' }}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">🔥</span>
              <div>
                <p className="font-head font-black text-xl text-amber-400">{user?.streak || 0} days</p>
                <p className="text-xs text-white/40">Learning streak</p>
              </div>
            </div>
          </div>

          {/* Live community feed */}
          {recentPosts.length > 0 && (
            <div className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-head font-bold text-sm">Community</h3>
                <Link to="/community" className="text-xs text-accent hover:underline">See all</Link>
              </div>
              <div className="space-y-3">
                {recentPosts.map(post => (
                  <Link key={post._id} to={`/community/${post._id}`} className="block group">
                    <p className="text-xs font-medium text-white/70 group-hover:text-accent transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </p>
                    <p className="text-[10px] text-white/30 mt-1">
                      {post.author?.name} · {formatDistanceToNow(new Date(post.createdAt))}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* REAL WEEKLY ACTIVITY CHART */}
      <div className="card p-6">
        <SectionHeader
          title="Weekly Activity"
          subtitle="Hours studied per day"
          action={<Link to="/progress" className="btn btn-ghost btn-sm">Full Report <ArrowRight size={14} /></Link>}
        />
        {weeklyActivity.every(v => v === 0) ? (
          <div className="h-24 flex items-center justify-center text-white/30 text-sm">
            No activity recorded yet — start learning to populate this chart!
          </div>
        ) : (
          <div className="flex items-end gap-1 sm:gap-3 h-20 sm:h-24 mt-2">
            {weeklyActivity.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                {h > 0 && <span className="text-[10px] text-white/30">{h}h</span>}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(h / maxActivity) * 70}px` }}
                  transition={{ delay: i * 0.08, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                  className="w-full rounded-t-lg bg-gradient-to-t from-accent to-accent3"
                  style={{ minHeight: h > 0 ? 6 : 2, opacity: h > 0 ? 1 : 0.15 }}
                />
                <span className="text-[10px] text-white/30">{dayLabels[i]}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
