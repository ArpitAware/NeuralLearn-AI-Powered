import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { Plus, X, Download, Eye, Save, Briefcase, GraduationCap, Code, User, Link } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import { usersAPI } from '../services/api';
import { Input, Textarea } from '../components/common/UI';

const TABS = [
  { id: 'personal',    label: 'Personal',   icon: User },
  { id: 'experience',  label: 'Experience', icon: Briefcase },
  { id: 'education',   label: 'Education',  icon: GraduationCap },
  { id: 'skills',      label: 'Skills',     icon: Code },
  { id: 'links',       label: 'Links',      icon: Link },
  { id: 'preview',     label: 'Preview',    icon: Eye },
];

const DEFAULT_RESUME = {
  title: 'Machine Learning Engineer',
  summary: 'Passionate ML engineer with expertise in deep learning and NLP. Built production systems serving 1M+ users.',
  skills: ['Python', 'TensorFlow', 'PyTorch', 'React', 'Node.js', 'AWS', 'Docker'],
  experience: [
    { company: 'TechCorp', role: 'ML Engineer', period: '2023–Present', description: 'Led development of recommendation engine improving CTR by 34%. Deployed models serving 2M daily requests.' },
    { company: 'StartupXYZ', role: 'Software Engineer', period: '2021–2023', description: 'Built full-stack web application using React and Node.js. Reduced load time by 60% through optimization.' },
  ],
  education: [
    { school: 'Stanford University', degree: 'M.S. Computer Science', period: '2021–2023' },
    { school: 'UC Berkeley', degree: 'B.S. Electrical Engineering', period: '2017–2021' },
  ],
  links: { github: 'github.com/alexmorgan', linkedin: 'linkedin.com/in/alexmorgan', portfolio: 'alexmorgan.dev' },
};

export default function ResumePage() {
  const { user, updateUser } = useAuthStore();
  const [tab, setTab]         = useState('personal');
  const [resume, setResume]   = useState(user?.resume?.title ? user.resume : DEFAULT_RESUME);
  const [newSkill, setNewSkill] = useState('');

  const saveMut = useMutation({
    mutationFn: () => usersAPI.updateResume(resume),
    onSuccess:  (res) => { toast.success('Resume saved!'); updateUser({ resume: res.data.resume }); },
    onError:    () => toast.error('Save failed'),
  });

  const addSkill = () => {
    if (newSkill.trim() && !resume.skills.includes(newSkill.trim())) {
      setResume(p => ({ ...p, skills: [...p.skills, newSkill.trim()] }));
      setNewSkill('');
    }
  };

  const addExp = () => setResume(p => ({ ...p, experience: [...p.experience, { company: '', role: '', period: '', description: '' }] }));
  const addEdu = () => setResume(p => ({ ...p, education: [...p.education, { school: '', degree: '', period: '' }] }));

  const updateExp = (i, field, val) => setResume(p => ({ ...p, experience: p.experience.map((e, j) => j === i ? { ...e, [field]: val } : e) }));
  const updateEdu = (i, field, val) => setResume(p => ({ ...p, education: p.education.map((e, j) => j === i ? { ...e, [field]: val } : e) }));

  return (
    <div className="pb-8">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="font-head font-bold text-2xl">Resume Builder</h2>
          <p className="text-white/40 text-sm mt-0.5">Build a professional resume — export as PDF</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setTab('preview')} className="btn btn-ghost btn-sm"><Eye size={14} /> Preview</button>
          <button onClick={() => saveMut.mutate()} disabled={saveMut.isPending} className="btn btn-ghost btn-sm"><Save size={14} /> {saveMut.isPending ? 'Saving...' : 'Save'}</button>
          <button onClick={() => { toast.success('PDF export coming soon!'); }} className="btn btn-primary btn-sm"><Download size={14} /> Export PDF</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/[0.03] rounded-2xl p-1 mb-6 overflow-x-auto">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`tab flex items-center gap-1.5 flex-shrink-0 ${tab === t.id ? 'active' : ''}`}>
            <t.icon size={13} />{t.label}
          </button>
        ))}
      </div>

      {/* Personal */}
      {tab === 'personal' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6 space-y-4">
          <h3 className="font-head font-bold text-base mb-2">Personal Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Full Name" value={user?.name || ''} readOnly placeholder="Your name" />
            <Input label="Email" value={user?.email || ''} readOnly placeholder="Email" />
            <Input label="Job Title" value={resume.title} onChange={e => setResume(p => ({ ...p, title: e.target.value }))} placeholder="e.g. ML Engineer" />
          </div>
          <Textarea label="Professional Summary" value={resume.summary} onChange={e => setResume(p => ({ ...p, summary: e.target.value }))} rows={4} placeholder="Brief professional summary..." />
        </motion.div>
      )}

      {/* Experience */}
      {tab === 'experience' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {resume.experience.map((exp, i) => (
            <div key={i} className="card p-5 relative">
              <button onClick={() => setResume(p => ({ ...p, experience: p.experience.filter((_, j) => j !== i) }))} className="absolute top-4 right-4 text-white/30 hover:text-red-400 transition-colors"><X size={14} /></button>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                <Input label="Company" value={exp.company} onChange={e => updateExp(i, 'company', e.target.value)} placeholder="Company name" />
                <Input label="Role" value={exp.role} onChange={e => updateExp(i, 'role', e.target.value)} placeholder="Job title" />
                <Input label="Period" value={exp.period} onChange={e => updateExp(i, 'period', e.target.value)} placeholder="2021–Present" />
              </div>
              <Textarea label="Description" value={exp.description} onChange={e => updateExp(i, 'description', e.target.value)} rows={3} placeholder="Describe your achievements..." />
            </div>
          ))}
          <button onClick={addExp} className="btn btn-ghost w-full justify-center border-dashed"><Plus size={16} /> Add Experience</button>
        </motion.div>
      )}

      {/* Education */}
      {tab === 'education' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {resume.education.map((edu, i) => (
            <div key={i} className="card p-5 relative">
              <button onClick={() => setResume(p => ({ ...p, education: p.education.filter((_, j) => j !== i) }))} className="absolute top-4 right-4 text-white/30 hover:text-red-400 transition-colors"><X size={14} /></button>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input label="School" value={edu.school} onChange={e => updateEdu(i, 'school', e.target.value)} placeholder="University name" />
                <Input label="Degree" value={edu.degree} onChange={e => updateEdu(i, 'degree', e.target.value)} placeholder="B.S. Computer Science" />
                <Input label="Period" value={edu.period} onChange={e => updateEdu(i, 'period', e.target.value)} placeholder="2017–2021" />
              </div>
            </div>
          ))}
          <button onClick={addEdu} className="btn btn-ghost w-full justify-center border-dashed"><Plus size={16} /> Add Education</button>
        </motion.div>
      )}

      {/* Skills */}
      {tab === 'skills' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6">
          <h3 className="font-head font-bold text-base mb-4">Skills</h3>
          <div className="flex gap-2 mb-5">
            <input className="input flex-1" placeholder="Add a skill (press Enter)..." value={newSkill}
              onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkill()} />
            <button onClick={addSkill} className="btn btn-primary btn-sm"><Plus size={14} /> Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((s, i) => (
              <span key={i} className="badge badge-blue text-sm py-1.5 px-3 gap-2">
                {s}
                <button onClick={() => setResume(p => ({ ...p, skills: p.skills.filter((_, j) => j !== i) }))} className="opacity-50 hover:opacity-100 hover:text-red-400 transition-colors">×</button>
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Links */}
      {tab === 'links' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6 space-y-4">
          <h3 className="font-head font-bold text-base mb-2">Social Links</h3>
          {[['github', 'GitHub URL', 'github.com/username'], ['linkedin', 'LinkedIn URL', 'linkedin.com/in/username'], ['portfolio', 'Portfolio URL', 'yoursite.com']].map(([k, l, p]) => (
            <Input key={k} label={l} value={resume.links?.[k] || ''} onChange={e => setResume(prev => ({ ...prev, links: { ...prev.links, [k]: e.target.value } }))} placeholder={p} />
          ))}
        </motion.div>
      )}

      {/* Preview */}
      {tab === 'preview' && (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="bg-white text-gray-900 rounded-3xl p-10 max-w-3xl mx-auto shadow-2xl font-body">
            {/* Header */}
            <div className="border-b-2 border-indigo-500 pb-5 mb-5">
              <h1 className="text-3xl font-black font-head text-gray-900 mb-1">{user?.name || 'Your Name'}</h1>
              <p className="text-indigo-600 font-semibold text-lg mb-2">{resume.title}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span>{user?.email}</span>
                {resume.links?.github && <span>{resume.links.github}</span>}
                {resume.links?.linkedin && <span>{resume.links.linkedin}</span>}
                {resume.links?.portfolio && <span>{resume.links.portfolio}</span>}
              </div>
            </div>
            {/* Summary */}
            <p className="text-gray-600 text-sm leading-relaxed mb-5">{resume.summary}</p>
            {/* Skills */}
            <div className="mb-5">
              <h2 className="font-head font-black text-sm uppercase tracking-widest text-gray-400 mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {resume.skills.map(s => <span key={s} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full font-semibold">{s}</span>)}
              </div>
            </div>
            {/* Experience */}
            <div className="mb-5">
              <h2 className="font-head font-black text-sm uppercase tracking-widest text-gray-400 mb-3">Experience</h2>
              {resume.experience.map((e, i) => (
                <div key={i} className="mb-4">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className="font-bold text-sm text-gray-800">{e.role}</span>
                    <span className="text-xs text-gray-400">{e.period}</span>
                  </div>
                  <p className="text-xs text-indigo-600 font-medium mb-1">{e.company}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{e.description}</p>
                </div>
              ))}
            </div>
            {/* Education */}
            <div>
              <h2 className="font-head font-black text-sm uppercase tracking-widest text-gray-400 mb-3">Education</h2>
              {resume.education.map((e, i) => (
                <div key={i} className="flex justify-between mb-2">
                  <div>
                    <p className="font-bold text-sm text-gray-800">{e.degree}</p>
                    <p className="text-xs text-gray-500">{e.school}</p>
                  </div>
                  <span className="text-xs text-gray-400">{e.period}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
