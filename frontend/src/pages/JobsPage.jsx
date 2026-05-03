import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, MapPin, DollarSign, Briefcase, ExternalLink, CheckCircle2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { jobsAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import { PageLoader, EmptyState, Badge } from '../components/common/UI';

const LOGO_MAP = {
  Anthropic: '🤖', Vercel: '▲', OpenAI: '🧠', Stripe: '💳', Figma: '✦',
  Google: '🔍', Meta: '🌐', Apple: '🍎', Amazon: '📦', Microsoft: '🪟',
};

export default function JobsPage() {
  const { user }           = useAuthStore();
  const qc                 = useQueryClient();
  const [search, setSearch] = useState('');
  const [type, setType]     = useState('All');
  const [selected, setSelected] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['jobs', { search, type }],
    queryFn:  () => jobsAPI.getAll({ search: search || undefined, type: type !== 'All' ? type : undefined }).then(r => r.data),
  });

  const applyMut = useMutation({
    mutationFn: (id) => jobsAPI.apply(id),
    onSuccess:  () => { toast.success('Application submitted! 🚀'); qc.invalidateQueries(['jobs']); },
    onError:    (err) => toast.error(err.response?.data?.message || 'Already applied'),
  });

  const jobs = data?.jobs || [];

  const typeColors = { 'Full-time': 'badge-green', 'Part-time': 'badge-blue', 'Contract': 'badge-amber', 'Internship': 'badge-cyan' };

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-head font-bold text-2xl mb-1 grad-text">Job Portal</h2>
        <p className="text-white/40 text-sm">Opportunities matched to your NeuralLearn skills</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] bg-white/[0.04] border border-white/[0.12] rounded-xl px-4">
          <Search size={15} className="text-white/30 flex-shrink-0" />
          <input
            className="bg-transparent outline-none text-sm text-white placeholder-white/20 py-2.5 flex-1"
            placeholder="Search jobs or companies..."
            value={search} onChange={e => setSearch(e.target.value)}
          />
        </div>
        {['All', 'Full-time', 'Part-time', 'Contract', 'Internship'].map(t => (
          <button key={t} onClick={() => setType(t)} className={`btn btn-sm ${type === t ? 'btn-primary' : 'btn-ghost'}`}>{t}</button>
        ))}
      </div>

      {isLoading ? <PageLoader /> : jobs.length === 0 ? (
        <EmptyState icon="💼" title="No jobs found" description="Try different search terms." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {jobs.map((job, i) => {
            const applied = job.applicants?.includes(user?._id);
            return (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`card card-hover p-5 cursor-pointer transition-all ${selected === job._id ? 'border-accent/40 bg-accent/5' : ''}`}
                onClick={() => setSelected(selected === job._id ? null : job._id)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.08] flex items-center justify-center text-2xl flex-shrink-0">
                    {LOGO_MAP[job.company] || '🏢'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-head font-bold text-base leading-tight">{job.title}</h3>
                        <p className="text-white/50 text-sm">{job.company}</p>
                      </div>
                      <Badge variant={typeColors[job.type]?.replace('badge-', '') || 'blue'}>{job.type}</Badge>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-xs text-white/40">
                      <span className="flex items-center gap-1"><MapPin size={11} />{job.location}</span>
                      {job.salary && <span className="flex items-center gap-1 text-emerald-400"><DollarSign size={11} />{job.salary}</span>}
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {job.tags?.slice(0, 4).map(t => <Badge key={t} variant="blue">{t}</Badge>)}
                    </div>
                  </div>
                </div>

                {/* Expanded */}
                {selected === job._id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t border-white/[0.06]"
                  >
                    <p className="text-sm text-white/60 leading-relaxed mb-4">{job.description}</p>
                    {job.requirements?.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-2">Requirements</p>
                        <ul className="space-y-1">
                          {job.requirements.map((r, j) => (
                            <li key={j} className="flex items-start gap-2 text-xs text-white/50">
                              <span className="text-accent mt-0.5">•</span>{r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="flex gap-3">
                      <button
                        onClick={e => { e.stopPropagation(); applyMut.mutate(job._id); }}
                        disabled={applied || applyMut.isPending}
                        className={`btn btn-sm flex-1 justify-center ${applied ? 'btn-success' : 'btn-primary'}`}
                      >
                        {applied ? <><CheckCircle2 size={13} /> Applied</> : applyMut.isPending ? 'Submitting...' : '🚀 Apply Now'}
                      </button>
                      {job.applyUrl && (
                        <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="btn btn-ghost btn-sm btn-icon">
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Applied badge */}
                {applied && selected !== job._id && (
                  <div className="mt-3 flex items-center gap-1.5 text-emerald-400 text-xs">
                    <CheckCircle2 size={12} /> Applied
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-8">
        {[['Active Jobs', jobs.length], ['Companies', new Set(jobs.map(j => j.company)).size], ['Applied', jobs.filter(j => j.applicants?.includes(user?._id)).length]].map(([l, v]) => (
          <div key={l} className="card p-4 text-center">
            <p className="font-head font-black text-2xl text-accent">{v}</p>
            <p className="text-xs text-white/40 mt-1">{l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
