import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { Camera, Save, Lock, Bell, Shield, Trash2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import { authAPI } from '../services/api';
import { Input, Textarea, SectionHeader } from '../components/common/UI';

const TABS = [
  { id: 'profile',   label: 'Profile'   },
  { id: 'security',  label: 'Security'  },
  { id: 'notifications', label: 'Notifications' },
];

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuthStore();
  const [tab, setTab] = useState('profile');
  const [form, setForm] = useState({
    name:   user?.name  || '',
    bio:    user?.bio   || '',
    avatar: user?.avatar || '',
  });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [notifPrefs, setNotifPrefs] = useState({
    newLesson:    true,
    quizReminder: true,
    communityReply: false,
    jobAlerts:    true,
    weeklyDigest: true,
    promotions:   false,
  });

  const updateMut = useMutation({
    mutationFn: () => authAPI.updateMe(form),
    onSuccess:  (res) => { updateUser(res.data.user); toast.success('Profile updated!'); },
    onError:    () => toast.error('Update failed'),
  });

  const pwMut = useMutation({
    mutationFn: () => authAPI.updatePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
    onSuccess:  () => { toast.success('Password changed!'); setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); },
    onError:    (err) => toast.error(err.response?.data?.message || 'Password change failed'),
  });

  const validatePw = () => {
    const e = {};
    if (!pwForm.currentPassword)          e.currentPassword = 'Required';
    if (pwForm.newPassword.length < 6)    e.newPassword     = 'Min 6 characters';
    if (pwForm.newPassword !== pwForm.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setPwErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePwSubmit = () => { if (validatePw()) pwMut.mutate(); };

  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase() || 'U';

  return (
    <div className="max-w-2xl mx-auto pb-10">
      {/* Header */}
      <div className="card p-6 mb-6 flex items-center gap-5">
        <div className="relative flex-shrink-0">
          {form.avatar ? (
            <img src={form.avatar} alt={user?.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-white/10" />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent to-accent2 flex items-center justify-center text-2xl font-head font-black text-white">
              {initials}
            </div>
          )}
          <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-accent border-2 border-bg flex items-center justify-center hover:bg-accent2 transition-colors">
            <Camera size={12} className="text-white" />
          </button>
        </div>
        <div>
          <h1 className="font-head font-black text-xl">{user?.name}</h1>
          <p className="text-white/40 text-sm">{user?.email}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`badge ${user?.role === 'admin' ? 'badge-red' : user?.role === 'instructor' ? 'badge-amber' : 'badge-blue'} capitalize`}>
              {user?.role}
            </span>
            <span className="badge badge-green text-[10px]">Active</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/[0.03] rounded-2xl p-1 mb-6 w-fit">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`tab ${tab === t.id ? 'active' : ''}`}>{t.label}</button>
        ))}
      </div>

      {/* Profile Tab */}
      {tab === 'profile' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          <div className="card p-6">
            <SectionHeader title="Personal Information" className="mb-4" />
            <div className="space-y-4">
              <Input
                label="Display Name"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Your full name"
              />
              <Input
                label="Avatar URL"
                value={form.avatar}
                onChange={e => setForm(p => ({ ...p, avatar: e.target.value }))}
                placeholder="https://..."
              />
              <Textarea
                label="Bio"
                value={form.bio}
                onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                rows={3}
                placeholder="Tell us about yourself..."
              />
              <div>
                <label className="label">Email</label>
                <input className="input opacity-50 cursor-not-allowed" value={user?.email} readOnly />
                <p className="text-xs text-white/30 mt-1">Email cannot be changed</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <SectionHeader title="Account Stats" className="mb-4" />
            <div className="grid grid-cols-3 gap-4">
              {[
                ['Courses',   user?.enrolledCourses?.length || 0],
                ['Role',      user?.role || 'student'],
                ['Member',    'Since 2025'],
              ].map(([l, v]) => (
                <div key={l} className="bg-white/[0.03] rounded-xl p-4 text-center">
                  <p className="font-head font-black text-lg text-accent capitalize">{v}</p>
                  <p className="text-xs text-white/30 mt-0.5">{l}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button className="btn btn-ghost flex-1 justify-center" onClick={() => setForm({ name: user?.name || '', bio: user?.bio || '', avatar: user?.avatar || '' })}>
              Reset
            </button>
            <button
              className="btn btn-primary flex-1 justify-center"
              onClick={() => updateMut.mutate()}
              disabled={updateMut.isPending}
            >
              {updateMut.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (
                <><Save size={15} /> Save Changes</>
              )}
            </button>
          </div>
        </motion.div>
      )}

      {/* Security Tab */}
      {tab === 'security' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          <div className="card p-6">
            <SectionHeader title="Change Password" className="mb-5" />
            <div className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                placeholder="••••••••"
                value={pwForm.currentPassword}
                onChange={e => setPwForm(p => ({ ...p, currentPassword: e.target.value }))}
                error={pwErrors.currentPassword}
              />
              <Input
                label="New Password"
                type="password"
                placeholder="Min 6 characters"
                value={pwForm.newPassword}
                onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))}
                error={pwErrors.newPassword}
              />
              <Input
                label="Confirm New Password"
                type="password"
                placeholder="Repeat new password"
                value={pwForm.confirmPassword}
                onChange={e => setPwForm(p => ({ ...p, confirmPassword: e.target.value }))}
                error={pwErrors.confirmPassword}
              />
              <button
                className="btn btn-primary w-full justify-center"
                onClick={handlePwSubmit}
                disabled={pwMut.isPending}
              >
                {pwMut.isPending ? 'Updating...' : <><Lock size={15} /> Update Password</>}
              </button>
            </div>
          </div>

          <div className="card p-6">
            <SectionHeader title="Sessions" className="mb-4" />
            <div className="flex items-center gap-3 p-4 bg-white/[0.03] rounded-xl mb-3">
              <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center flex-shrink-0">
                <Shield size={18} className="text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">Current Session</p>
                <p className="text-xs text-white/40">Chrome · {navigator.platform} · Now</p>
              </div>
              <span className="badge badge-green">Active</span>
            </div>
            <button className="btn btn-danger w-full justify-center btn-sm" onClick={() => { logout(); }}>
              Sign Out All Sessions
            </button>
          </div>

          <div className="card p-6 border-red-500/20" style={{ borderColor: 'rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.03)' }}>
            <SectionHeader title="Danger Zone" className="mb-4" />
            <p className="text-sm text-white/40 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
            <button className="btn btn-danger btn-sm flex items-center gap-2">
              <Trash2 size={14} /> Delete Account
            </button>
          </div>
        </motion.div>
      )}

      {/* Notifications Tab */}
      {tab === 'notifications' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6 space-y-5">
          <SectionHeader title="Notification Preferences" className="mb-2" />
          {[
            { key: 'newLesson',      label: 'New Lesson Available',    desc: 'When a new lesson is added to enrolled courses' },
            { key: 'quizReminder',   label: 'Quiz Reminders',          desc: 'Reminders before quizzes and deadlines' },
            { key: 'communityReply', label: 'Community Replies',       desc: 'When someone replies to your posts' },
            { key: 'jobAlerts',      label: 'Job Alerts',              desc: 'New job postings matching your skills' },
            { key: 'weeklyDigest',   label: 'Weekly Digest',           desc: 'Summary of your weekly learning progress' },
            { key: 'promotions',     label: 'Promotions & Offers',     desc: 'Course deals and platform announcements' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-white/40 mt-0.5">{desc}</p>
              </div>
              <button
                onClick={() => setNotifPrefs(p => ({ ...p, [key]: !p[key] }))}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${notifPrefs[key] ? 'bg-accent' : 'bg-white/[0.12]'}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${notifPrefs[key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          ))}
          <button className="btn btn-primary w-full justify-center" onClick={() => toast.success('Preferences saved!')}>
            <CheckCircle2 size={15} /> Save Preferences
          </button>
        </motion.div>
      )}
    </div>
  );
}
