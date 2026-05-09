import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Share2, TrendingUp, Send, X, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import { communityAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import { PageLoader, EmptyState, Badge, SectionHeader } from '../components/common/UI';
import { formatDistanceToNow } from '../components/common/utils';

const TOP_TAGS = ['MachineLearning','ReactJS','AWS','Python','Web3','DataScience','DevOps','Career','LeetCode','SystemDesign'];

export default function CommunityPage() {
  const { user }           = useAuthStore();
  const navigate           = useNavigate();
  const qc                 = useQueryClient();
  const [search, setSearch] = useState('');
  const [tag, setTag]       = useState('');
  const [sort, setSort]     = useState('newest');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm]     = useState({ title: '', content: '', tags: [] });
  const [tagInput, setTagInput] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['posts', { search, tag, sort }],
    queryFn:  () => communityAPI.getPosts({ search: search || undefined, tag: tag || undefined, sort }).then(r => r.data),
  });

  const createMut = useMutation({
    mutationFn: () => communityAPI.create(form),
    onSuccess:  () => { toast.success('Post created! 🎉'); setShowCreate(false); setForm({ title: '', content: '', tags: [] }); qc.invalidateQueries(['posts']); },
    onError:    (err) => toast.error(err.response?.data?.message || 'Error'),
  });

  const likeMut = useMutation({
    mutationFn: (id) => communityAPI.like(id),
    onSuccess:  () => qc.invalidateQueries(['posts']),
  });

  const posts = data?.posts || [];

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm(p => ({ ...p, tags: [...p.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const initials = user?.name?.split(' ').map(w => w[0]).join('') || 'U';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pb-8">
      {/* MAIN FEED */}
      <div className="lg:col-span-2 space-y-4">
        {/* Create post prompt */}
        <div className="card p-4 flex items-center gap-3 cursor-pointer hover:border-accent/30 transition-colors" onClick={() => setShowCreate(true)}>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-accent2 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">{initials}</div>
          <div className="flex-1 bg-white/[0.04] rounded-xl px-4 py-2.5 text-sm text-white/30 hover:text-white/50 transition-colors">
            Share something with the community...
          </div>
          <button className="btn btn-primary btn-sm">Post</button>
        </div>

        {/* Create form */}
        {showCreate && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-head font-bold text-sm">Create Post</h3>
              <button onClick={() => setShowCreate(false)} className="text-white/30 hover:text-white"><X size={16} /></button>
            </div>
            <div className="space-y-3">
              <input className="input" placeholder="Post title..." value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
              <textarea className="input resize-none" rows={4} placeholder="What's on your mind?" value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} />
              <div className="flex gap-2">
                <input className="input flex-1 text-sm" placeholder="Add tag..." value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTag()} />
                <button onClick={addTag} className="btn btn-ghost btn-sm"><Tag size={14} /></button>
              </div>
              {form.tags.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {form.tags.map(t => (
                    <span key={t} className="badge badge-blue gap-1">#{t}
                      <button onClick={() => setForm(p => ({ ...p, tags: p.tags.filter(x => x !== t) }))} className="opacity-60 hover:opacity-100">×</button>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-2 justify-end">
                <button className="btn btn-ghost btn-sm" onClick={() => setShowCreate(false)}>Cancel</button>
                <button className="btn btn-primary btn-sm" onClick={() => createMut.mutate()} disabled={!form.title || !form.content || createMut.isPending}>
                  {createMut.isPending ? 'Posting...' : <><Send size={13} /> Publish</>}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Sort + Search */}
        <div className="flex gap-3 flex-wrap">
          <input
            className="input flex-1 min-w-[180px] text-sm"
            placeholder="Search posts..."
            value={search} onChange={e => setSearch(e.target.value)}
          />
          <div className="flex gap-1 bg-white/[0.04] border border-white/[0.08] rounded-xl p-1">
            {[{ v: 'newest', l: 'New' }, { v: 'popular', l: 'Top' }].map(s => (
              <button key={s.v} onClick={() => setSort(s.v)} className={`tab ${sort === s.v ? 'active' : ''} text-xs`}>{s.l}</button>
            ))}
          </div>
        </div>

        {isLoading ? <PageLoader /> : posts.length === 0 ? (
          <EmptyState icon="💬" title="No posts yet" description="Be the first to share something!" />
        ) : (
          posts.map((post, i) => {
            const isLiked = post.likes?.includes(user?._id);
            return (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="card card-hover p-5 cursor-pointer group"
                onClick={() => navigate(`/community/${post._id}`)}
              >
                <div className="flex items-center gap-3 mb-3">
                  {post.author?.avatar ? (
                    <img src={post.author.avatar} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent2 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {post.author?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold">{post.author?.name || 'User'}</span>
                    <span className="text-white/30 text-xs ml-2">{formatDistanceToNow(new Date(post.createdAt))}</span>
                  </div>
                  {post.author?.role === 'instructor' && <Badge variant="amber">Instructor</Badge>}
                </div>
                <h3 className="font-head font-bold text-base mb-2 group-hover:text-accent transition-colors leading-snug">{post.title}</h3>
                <p className="text-sm text-white/50 line-clamp-2 mb-4 leading-relaxed">{post.content}</p>
                {post.tags?.length > 0 && (
                  <div className="flex gap-2 flex-wrap mb-3">
                    {post.tags.slice(0, 3).map(t => <span key={t} className="badge badge-blue text-[10px]">#{t}</span>)}
                  </div>
                )}
                <div className="flex items-center gap-4 pt-3 border-t border-white/[0.04]">
                  <button
                    onClick={e => { e.stopPropagation(); likeMut.mutate(post._id); }}
                    className={`flex items-center gap-1.5 text-xs transition-colors ${isLiked ? 'text-red-400' : 'text-white/40 hover:text-red-400'}`}
                  >
                    <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} /> {post.likes?.length || 0}
                  </button>
                  <span className="flex items-center gap-1.5 text-xs text-white/40">
                    <MessageCircle size={14} /> {post.comments?.length || 0}
                  </span>
                  <button onClick={e => { e.stopPropagation(); navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }} className="flex items-center gap-1.5 text-xs text-white/40 hover:text-accent ml-auto transition-colors">
                    <Share2 size={14} /> Share
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* SIDEBAR */}
      <div className="space-y-4">
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-accent" />
            <h3 className="font-head font-bold text-sm">Trending Topics</h3>
          </div>
          <div className="space-y-1">
            {/* Dynamic: show tags from actual posts, fall back to TOP_TAGS */}
            {(posts.length > 0
              ? [...new Set(posts.flatMap(p => p.tags || []))].slice(0, 10)
              : TOP_TAGS
            ).map((t, i) => (
              <button
                key={t}
                onClick={() => setTag(tag === t ? '' : t)}
                className={`w-full flex items-center justify-between py-2 px-3 rounded-xl text-sm transition-colors ${tag === t ? 'bg-accent/10 text-accent' : 'hover:bg-white/[0.04] text-white/60'}`}
              >
                <span>#{t}</span>
                <span className="text-xs text-white/30">#{i + 1}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-head font-bold text-sm mb-4">Community Stats</h3>
          <div className="grid grid-cols-2 gap-3">
            {[['Total Posts', data?.total || 0], ['Members', '50K+'], ['Online', '2,341'], ['Replies Today', '847']].map(([l, v]) => (
              <div key={l} className="bg-white/[0.03] rounded-xl p-3 text-center">
                <p className="font-head font-bold text-lg">{v}</p>
                <p className="text-[10px] text-white/30 mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
