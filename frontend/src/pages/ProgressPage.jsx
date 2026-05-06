import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Award, Clock, BookOpen, TrendingUp, CheckCircle2, Play } from 'lucide-react';
import { analyticsAPI, progressAPI } from '../services/api';
import { StatCard, ProgressBar, PageLoader, SectionHeader } from '../components/common/UI';

const ACHIEVEMENTS = [
  { icon: '🔥', name: '14-Day Streak',  desc: '14 days learning in a row',  earned: true  },
  { icon: '⚡', name: 'Fast Learner',    desc: 'Finished a course in record time', earned: true  },
  { icon: '🌟', name: 'Top 5%',          desc: 'Top 5% this week',          earned: true  },
  { icon: '🎯', name: 'Perfect Score',   desc: '100% on 5 quizzes',         earned: false },
  { icon: '🏆', name: 'First Complete',  desc: 'Completed first course',    earned: true  },
  { icon: '🚀', name: 'Speed Runner',    desc: 'Finish 3 courses in a month', earned: false },
  { icon: '💡', name: 'Curious Mind',    desc: 'Explored 5 categories',     earned: false },
  { icon: '👥', name: 'Community Star',  desc: '10 community posts',        earned: false },
];

export default function ProgressPage() {
  const navigate = useNavigate();

  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['student-analytics'],
    queryFn:  () => analyticsAPI.getStudent().then(r => r.data),
  });

  const { data: progressData } = useQuery({
    queryKey: ['my-progress'],
    queryFn:  () => progressAPI.getAll().then(r => r.data),
  });

  if (isLoading) return <PageLoader />;

  const analytics  = analyticsData?.data || {};
  const progresses = progressData?.progress || [];
  const weeklyActivity = analytics.weeklyActivity || Array(7).fill(0);
  const maxH = Math.max(...weeklyActivity);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const skillMap = analytics.skillMap || {};
  // ✅ FIX: Build skills ONLY from real enrolled course categories.
  // Never use fallback numbers — if skillMap is empty, skills list is empty.
  const CATEGORY_DISPLAY = {
    'AI/ML':        'Machine Learning',
    'Web Dev':      'Web Development',
    'Design':       'UI/UX Design',
    'Data Science': 'Data Science',
    'Cloud':        'Cloud / AWS',
    'Blockchain':   'Blockchain',
    'Mobile':       'Mobile Dev',
    'DevOps':       'DevOps',
  };
  const skills = Object.entries(skillMap)
    .map(([cat, pct]) => ({ name: CATEGORY_DISPLAY[cat] || cat, pct }))
    .sort((a, b) => b.pct - a.pct);

  const stats = [
    { label: 'Total Hours',   value: `${analytics.totalHours ?? 0}h`,    icon: Clock,       color: '#5b6af5' },
    { label: 'Completed',     value: analytics.completed ?? 0,           icon: CheckCircle2, color: '#10b981' },
    { label: 'Enrolled',      value: analytics.enrolled ?? 0,            icon: BookOpen,     color: '#f59e0b' },
    { label: 'Avg Progress',  value: `${analytics.avgProgress ?? 0}%`,   icon: TrendingUp,   color: '#ec4899' },
  ];

  return (
    <div className="space-y-7 pb-8">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => <StatCard key={s.label} {...s} index={i} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Chart */}
        <div className="card p-6">
          <SectionHeader title="Weekly Activity" subtitle="Hours learned per day" />
          <div className="flex items-end gap-2 h-40 mt-2">
            {weeklyActivity.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-white/30">{h}h</span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(h / maxH) * 110}px` }}
                  transition={{ delay: i * 0.08, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                  className="w-full rounded-t-lg bg-gradient-to-t from-accent to-accent3"
                  style={{ minHeight: 4 }}
                />
                <span className="text-[10px] text-white/30">{days[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="card p-6">
          <SectionHeader title="Skill Progress" />
          {skills.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="text-4xl mb-3">📊</div>
              <p className="text-white/40 text-sm">No skills tracked yet.</p>
              <p className="text-white/25 text-xs mt-1">Enroll in courses to see your skill progress here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {skills.map((s, i) => (
                <motion.div key={s.name} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-white/70">{s.name}</span>
                    <span className="font-semibold text-accent">{s.pct}%</span>
                  </div>
                  <ProgressBar value={s.pct} height="h-2" />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Course Progress */}
      <div>
        <SectionHeader title="Course Progress" subtitle={`${progresses.length} enrolled courses`} />
        {progresses.length === 0 ? (
          <div className="card p-10 text-center">
            <div className="text-4xl mb-3">📚</div>
            <p className="text-white/40 text-sm">Enroll in courses to track your progress</p>
          </div>
        ) : (
          <div className="space-y-3">
            {progresses.map((p, i) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="card card-hover p-5 flex gap-4 items-center cursor-pointer"
                onClick={() => navigate(`/courses/${p.course?.slug || p.course?._id}`)}
              >
                {p.course?.thumbnail && (
                  <img src={p.course.thumbnail} alt="" className="w-16 h-12 object-cover rounded-xl flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-sm truncate">{p.course?.title || 'Course'}</p>
                    <span className={`text-sm font-bold flex-shrink-0 ml-3 ${p.completed ? 'text-emerald-400' : 'text-accent'}`}>
                      {p.progressPercent}%
                    </span>
                  </div>
                  <ProgressBar value={p.progressPercent} height="h-2" className="mb-1.5" />
                  <div className="flex justify-between text-[11px] text-white/30">
                    <span>{p.course?.category}</span>
                    <span>{Math.round((p.timeSpent || 0) / 3600)}h spent</span>
                  </div>
                </div>
                {p.completed ? (
                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    <CheckCircle2 size={22} className="text-emerald-400" />
                    <span className="text-[10px] text-emerald-400">Done</span>
                  </div>
                ) : (
                  <button className="btn btn-ghost btn-sm flex-shrink-0 btn-icon" onClick={e => { e.stopPropagation(); navigate(`/courses/${p.course?.slug}/learn`); }}>
                    <Play size={14} />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Achievements */}
      <div>
        <SectionHeader title="Achievements" subtitle={`${ACHIEVEMENTS.filter(a => a.earned).length} / ${ACHIEVEMENTS.length} earned`} />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {ACHIEVEMENTS.map((a, i) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
              className={`card p-4 text-center transition-all ${a.earned ? 'card-glow' : 'opacity-40 grayscale'}`}
              style={a.earned ? { borderColor: 'rgba(91,106,245,0.25)' } : {}}
            >
              <div className="text-3xl mb-2">{a.icon}</div>
              <p className="font-head font-bold text-xs mb-1">{a.name}</p>
              <p className="text-[10px] text-white/40 leading-snug">{a.desc}</p>
              {a.earned && <div className="mt-2 inline-flex items-center gap-1 text-[10px] text-emerald-400"><CheckCircle2 size={10} /> Earned</div>}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Certificates */}
      {progresses.filter(p => p.certificateIssued).length > 0 && (
        <div>
          <SectionHeader title="Certificates" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {progresses.filter(p => p.certificateIssued).map((p, i) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}
                className="card p-5 flex items-center gap-4"
                style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.06), rgba(239,68,68,0.04))', borderColor: 'rgba(245,158,11,0.15)' }}
              >
                <Award size={32} className="text-amber-400 flex-shrink-0" />
                <div>
                  <p className="font-head font-bold text-sm">{p.course?.title}</p>
                  <p className="text-xs text-white/40 mt-0.5">Certificate of Completion</p>
                </div>
                <button className="btn btn-ghost btn-sm ml-auto">Download</button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
