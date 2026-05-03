import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Users, BookOpen, DollarSign, TrendingUp, Trash2, Pencil,
  Plus, Shield, CheckCircle2, XCircle, BarChart2, Eye
} from 'lucide-react';
import toast from 'react-hot-toast';
import { analyticsAPI, usersAPI, coursesAPI, jobsAPI } from '../services/api';
import { StatCard, PageLoader, Badge, SectionHeader, ConfirmDialog, Modal } from '../components/common/UI';
import { formatCurrency, formatNumber, formatDistanceToNow } from '../components/common/utils';

export default function AdminPage() {
  const [tab, setTab]           = useState('analytics');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteType, setDeleteType]     = useState(null);
  const [editCourse, setEditCourse]     = useState(null);
  const [newCourse, setNewCourse]       = useState(false);
  const [courseForm, setCourseForm]     = useState({ title:'', category:'AI/ML', level:'Beginner', price:'', description:'', thumbnail:'' });
  const qc = useQueryClient();

  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn:  () => analyticsAPI.getAdmin().then(r => r.data),
  });
  const { data: usersData } = useQuery({
    queryKey: ['admin-users'],
    queryFn:  () => usersAPI.getAll({ limit: 50 }).then(r => r.data),
    enabled:  tab === 'users',
  });
  const { data: coursesData } = useQuery({
    queryKey: ['admin-courses'],
    queryFn:  () => coursesAPI.getAll({ limit: 50 }).then(r => r.data),
    enabled:  tab === 'courses',
  });

  const deleteUserMut = useMutation({
    mutationFn: (id) => usersAPI.delete(id),
    onSuccess:  () => { toast.success('User deleted'); qc.invalidateQueries(['admin-users']); },
    onError:    () => toast.error('Delete failed'),
  });
  const deleteCourseMut = useMutation({
    mutationFn: (id) => coursesAPI.delete(id),
    onSuccess:  () => { toast.success('Course deleted'); qc.invalidateQueries(['admin-courses']); qc.invalidateQueries(['courses']); },
    onError:    () => toast.error('Delete failed'),
  });
  const createCourseMut = useMutation({
    mutationFn: () => coursesAPI.create({ ...courseForm, price: Number(courseForm.price), isPublished: true }),
    onSuccess:  () => { toast.success('Course created!'); setNewCourse(false); setCourseForm({ title:'', category:'AI/ML', level:'Beginner', price:'', description:'', thumbnail:'' }); qc.invalidateQueries(['admin-courses']); qc.invalidateQueries(['courses']); },
    onError:    (err) => toast.error(err.response?.data?.message || 'Error'),
  });
  const updateUserMut = useMutation({
    mutationFn: ({ id, data }) => usersAPI.update(id, data),
    onSuccess:  () => { toast.success('User updated'); qc.invalidateQueries(['admin-users']); },
  });

  if (isLoading) return <PageLoader />;

  const analytics   = analyticsData?.data || {};
  const users       = usersData?.users    || [];
  const courses     = coursesData?.courses || [];
  const maxRevenue  = Math.max(...(analytics.revenueByMonth || [1]));

  const TABS = [
    { id: 'analytics', label: 'Analytics',     icon: BarChart2 },
    { id: 'courses',   label: 'Courses',        icon: BookOpen  },
    { id: 'users',     label: 'Users',          icon: Users     },
  ];

  const roleColor  = { admin: 'red', instructor: 'amber', student: 'blue' };
  const statusColor = { active: 'green', inactive: 'red' };

  return (
    <div className="pb-8">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {[
          { label: 'Total Revenue',   value: formatCurrency(analytics.totalRevenue || 0),   icon: DollarSign, color: '#10b981' },
          { label: 'Total Students',  value: formatNumber(analytics.totalUsers || 0),        icon: Users,      color: '#5b6af5' },
          { label: 'Active Courses',  value: analytics.totalCourses || 0,                   icon: BookOpen,   color: '#f59e0b' },
          { label: 'Completion Rate', value: `${analytics.completionRate || 0}%`,           icon: TrendingUp, color: '#ec4899' },
        ].map((s, i) => <StatCard key={s.label} {...s} index={i} />)}
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-white/[0.03] rounded-2xl p-1 mb-6 w-fit">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`tab flex items-center gap-1.5 ${tab === t.id ? 'active' : ''}`}>
            <t.icon size={14} />{t.label}
          </button>
        ))}
      </div>

      {/* ── ANALYTICS ── */}
      {tab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <div className="card p-6">
              <SectionHeader title="Monthly Revenue" subtitle="2025 year-to-date" />
              <div className="flex items-end gap-2 h-44">
                {(analytics.revenueByMonth || []).map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: v > 0 ? `${(v / maxRevenue) * 150}px` : '4px' }}
                      transition={{ delay: i * 0.06, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                      className={`w-full rounded-t-lg ${v > 0 ? 'bg-gradient-to-t from-accent to-accent3' : 'bg-white/[0.06]'}`}
                    />
                    <span className="text-[9px] text-white/30">{(analytics.months || [])[i]?.slice(0, 1)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Enrollment Chart */}
            <div className="card p-6">
              <SectionHeader title="Monthly Enrollments" />
              <div className="flex items-end gap-2 h-44">
                {(analytics.enrollmentsByMonth || []).map((v, i) => {
                  const maxE = Math.max(...(analytics.enrollmentsByMonth || [1]));
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: v > 0 ? `${(v / maxE) * 150}px` : '4px' }}
                        transition={{ delay: i * 0.06, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                        className={`w-full rounded-t-lg ${v > 0 ? 'bg-gradient-to-t from-accent2 to-violet-400' : 'bg-white/[0.06]'}`}
                      />
                      <span className="text-[9px] text-white/30">{(analytics.months || [])[i]?.slice(0, 1)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Top Courses */}
          <div className="card p-6">
            <SectionHeader title="Top Performing Courses" />
            <div className="space-y-3">
              {(analytics.topCourses || []).map((c, i) => {
                const maxStudents = analytics.topCourses?.[0]?.totalStudents || 1;
                return (
                  <div key={c._id} className="flex items-center gap-4">
                    <span className="w-5 text-xs text-white/30 font-bold flex-shrink-0">#{i + 1}</span>
                    {c.thumbnail && <img src={c.thumbnail} alt="" className="w-10 h-7 object-cover rounded-lg flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate mb-1">{c.title}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(c.totalStudents / maxStudents) * 100}%` }}
                            transition={{ delay: i * 0.1, duration: 0.9 }}
                            className="h-full bg-gradient-to-r from-accent to-accent3 rounded-full"
                          />
                        </div>
                        <span className="text-xs text-white/40 flex-shrink-0">{formatNumber(c.totalStudents)}</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-emerald-400 flex-shrink-0">${c.price}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Users */}
          <div className="card p-6">
            <SectionHeader title="Recent Signups" />
            <div className="space-y-3">
              {(analytics.recentUsers || []).map((u) => (
                <div key={u._id} className="flex items-center gap-3 py-2 border-b border-white/[0.04] last:border-0">
                  {u.avatar ? (
                    <img src={u.avatar} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent2 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {u.name?.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{u.name}</p>
                    <p className="text-xs text-white/40">{u.email}</p>
                  </div>
                  <Badge variant={roleColor[u.role] || 'blue'}>{u.role}</Badge>
                  <span className="text-xs text-white/30">{formatDistanceToNow(new Date(u.createdAt))}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── COURSES ── */}
      {tab === 'courses' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-white/40 text-sm">{courses.length} courses total</p>
            <button onClick={() => setNewCourse(true)} className="btn btn-primary btn-sm"><Plus size={14} /> New Course</button>
          </div>

          <div className="space-y-3">
            {courses.map((course, i) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="card p-4 flex items-center gap-4"
              >
                {course.thumbnail && (
                  <img src={course.thumbnail} alt="" className="w-16 h-11 object-cover rounded-xl flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{course.title}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-white/40">
                    <span>{course.instructor?.name}</span>
                    <Badge variant="blue">{course.category}</Badge>
                    <Badge variant={course.level === 'Beginner' ? 'green' : course.level === 'Intermediate' ? 'amber' : 'red'}>{course.level}</Badge>
                    <span>{formatNumber(course.totalStudents)} students</span>
                    <span>★ {course.rating?.toFixed(1)}</span>
                  </div>
                </div>
                <span className="font-head font-black text-lg text-emerald-400 flex-shrink-0">${course.price}</span>
                <div className="flex gap-2 flex-shrink-0">
                  <button className="btn btn-ghost btn-sm btn-icon" title="View">
                    <Eye size={14} />
                  </button>
                  <button
                    className="btn btn-danger btn-sm btn-icon"
                    onClick={() => { setDeleteTarget(course._id); setDeleteType('course'); }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ── USERS ── */}
      {tab === 'users' && (
        <div className="space-y-3">
          <p className="text-white/40 text-sm">{users.length} registered users</p>
          {users.map((u, i) => (
            <motion.div
              key={u._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="card p-4 flex items-center gap-4"
            >
              {u.avatar ? (
                <img src={u.avatar} alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-accent2 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {u.name?.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{u.name}</p>
                <p className="text-xs text-white/40">{u.email}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant={roleColor[u.role] || 'blue'}>{u.role}</Badge>
                <Badge variant={u.isActive ? 'green' : 'red'}>{u.isActive ? 'Active' : 'Inactive'}</Badge>
                <span className="text-xs text-white/30 hidden sm:block">{u.enrolledCourses?.length || 0} courses</span>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  className="btn btn-ghost btn-sm btn-icon"
                  title={u.isActive ? 'Deactivate' : 'Activate'}
                  onClick={() => updateUserMut.mutate({ id: u._id, data: { isActive: !u.isActive } })}
                >
                  {u.isActive ? <XCircle size={14} className="text-amber-400" /> : <CheckCircle2 size={14} className="text-emerald-400" />}
                </button>
                <button
                  className="btn btn-danger btn-sm btn-icon"
                  onClick={() => { setDeleteTarget(u._id); setDeleteType('user'); }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => { setDeleteTarget(null); setDeleteType(null); }}
        onConfirm={() => {
          if (deleteType === 'user')   deleteUserMut.mutate(deleteTarget);
          if (deleteType === 'course') deleteCourseMut.mutate(deleteTarget);
        }}
        title={`Delete ${deleteType === 'user' ? 'User' : 'Course'}?`}
        message="This action cannot be undone. All associated data will be permanently deleted."
        danger
      />

      {/* Create Course Modal */}
      <Modal isOpen={newCourse} onClose={() => setNewCourse(false)} title="Create New Course" maxWidth="max-w-xl">
        <div className="space-y-4">
          <div>
            <label className="label">Course Title</label>
            <input className="input" placeholder="e.g. Advanced React Patterns" value={courseForm.title} onChange={e => setCourseForm(p => ({ ...p, title: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Category</label>
              <select className="input" value={courseForm.category} onChange={e => setCourseForm(p => ({ ...p, category: e.target.value }))}
                style={{ appearance: 'none' }}>
                {['AI/ML','Web Dev','Design','Data Science','Blockchain','Cloud','Mobile','DevOps'].map(c => (
                  <option key={c} value={c} style={{ background: '#0c0c18' }}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Level</label>
              <select className="input" value={courseForm.level} onChange={e => setCourseForm(p => ({ ...p, level: e.target.value }))}
                style={{ appearance: 'none' }}>
                {['Beginner','Intermediate','Advanced'].map(l => (
                  <option key={l} value={l} style={{ background: '#0c0c18' }}>{l}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Price (USD)</label>
            <input className="input" type="number" placeholder="79" value={courseForm.price} onChange={e => setCourseForm(p => ({ ...p, price: e.target.value }))} />
          </div>
          <div>
            <label className="label">Thumbnail URL</label>
            <input className="input" placeholder="https://images.unsplash.com/..." value={courseForm.thumbnail} onChange={e => setCourseForm(p => ({ ...p, thumbnail: e.target.value }))} />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input resize-none" rows={3} placeholder="Course description..." value={courseForm.description} onChange={e => setCourseForm(p => ({ ...p, description: e.target.value }))} />
          </div>
          <div className="flex gap-3 pt-2">
            <button className="btn btn-ghost flex-1 justify-center" onClick={() => setNewCourse(false)}>Cancel</button>
            <button
              className="btn btn-primary flex-1 justify-center"
              onClick={() => createCourseMut.mutate()}
              disabled={!courseForm.title || !courseForm.description || !courseForm.price || createCourseMut.isPending}
            >
              {createCourseMut.isPending ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
