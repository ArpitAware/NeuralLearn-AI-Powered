import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart, Send, ArrowLeft, MessageCircle, Eye, Share2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { communityAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import { PageLoader, Badge } from '../components/common/UI';
import { formatDistanceToNow } from '../components/common/utils';

export default function PostDetailPage() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const { user }     = useAuthStore();
  const qc           = useQueryClient();
  const [comment, setComment] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['post', id],
    queryFn:  () => communityAPI.getPost(id).then(r => r.data),
  });

  const likeMut = useMutation({
    mutationFn: () => communityAPI.like(id),
    onSuccess:  () => qc.invalidateQueries(['post', id]),
  });

  const commentMut = useMutation({
    mutationFn: () => communityAPI.comment(id, { content: comment }),
    onSuccess:  () => { setComment(''); qc.invalidateQueries(['post', id]); toast.success('Comment added!'); },
    onError:    (err) => toast.error(err.response?.data?.message || 'Error'),
  });

  const deleteMut = useMutation({
    mutationFn: () => communityAPI.delete(id),
    onSuccess:  () => { navigate('/community'); toast.success('Post deleted'); },
  });

  if (isLoading) return <PageLoader />;
  const post = data?.post;
  if (!post) return <div className="text-white/40 text-center py-20">Post not found</div>;

  const isLiked  = post.likes?.includes(user?._id);
  const isAuthor = post.author?._id === user?._id || user?.role === 'admin';
  const initials = user?.name?.split(' ').map(w => w[0]).join('') || 'U';

  return (
    <div className="max-w-2xl mx-auto pb-10">
      {/* Back */}
      <button onClick={() => navigate('/community')} className="flex items-center gap-2 text-white/40 hover:text-white text-sm mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Community
      </button>

      {/* Post */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card p-7 mb-5">
        {/* Author */}
        <div className="flex items-center gap-3 mb-5">
          {post.author?.avatar ? (
            <img src={post.author.avatar} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent2 flex items-center justify-center text-sm font-bold flex-shrink-0">
              {post.author?.name?.charAt(0) || 'U'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm">{post.author?.name}</span>
              {post.author?.role === 'instructor' && <Badge variant="amber">Instructor</Badge>}
              {post.author?.role === 'admin'      && <Badge variant="red">Admin</Badge>}
            </div>
            <p className="text-xs text-white/40">{formatDistanceToNow(new Date(post.createdAt))}</p>
          </div>
          {isAuthor && (
            <button
              onClick={() => { if (window.confirm('Delete this post?')) deleteMut.mutate(); }}
              className="btn btn-danger btn-sm btn-icon"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>

        {/* Content */}
        <h1 className="font-head font-black text-2xl leading-tight mb-4">{post.title}</h1>
        <p className="text-white/70 leading-relaxed mb-5 whitespace-pre-wrap">{post.content}</p>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map(t => <Badge key={t} variant="blue">#{t}</Badge>)}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 pt-4 border-t border-white/[0.06]">
          <button
            onClick={() => likeMut.mutate()}
            className={`flex items-center gap-2 text-sm transition-colors ${isLiked ? 'text-red-400' : 'text-white/40 hover:text-red-400'}`}
          >
            <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
            {post.likes?.length || 0} likes
          </button>
          <span className="flex items-center gap-2 text-sm text-white/40">
            <MessageCircle size={16} />
            {post.comments?.length || 0} comments
          </span>
          <span className="flex items-center gap-2 text-sm text-white/40">
            <Eye size={16} />
            {post.views || 0} views
          </span>
          <button
            onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }}
            className="flex items-center gap-2 text-sm text-white/40 hover:text-accent ml-auto transition-colors"
          >
            <Share2 size={16} /> Share
          </button>
        </div>
      </motion.div>

      {/* Add comment */}
      <div className="card p-5 mb-4">
        <h3 className="font-head font-bold text-sm mb-4">Leave a Comment</h3>
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent2 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">
            {initials}
          </div>
          <div className="flex-1">
            <textarea
              className="input resize-none mb-2"
              rows={3}
              placeholder="Share your thoughts..."
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
            <div className="flex justify-end">
              <button
                className="btn btn-primary btn-sm"
                onClick={() => commentMut.mutate()}
                disabled={!comment.trim() || commentMut.isPending}
              >
                {commentMut.isPending ? 'Posting...' : <><Send size={13} /> Post Comment</>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className="space-y-3">
        <h3 className="font-head font-bold text-sm text-white/60">{post.comments?.length || 0} Comments</h3>
        {(post.comments || []).length === 0 ? (
          <div className="card p-8 text-center">
            <MessageCircle size={28} className="text-white/20 mx-auto mb-2" />
            <p className="text-white/30 text-sm">No comments yet. Be the first!</p>
          </div>
        ) : (
          post.comments.map((c, i) => (
            <motion.div
              key={c._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card p-4 flex gap-3"
            >
              {c.user?.avatar ? (
                <img src={c.user.avatar} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-accent2 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {c.user?.name?.charAt(0) || 'U'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-semibold text-sm">{c.user?.name || 'User'}</span>
                  <span className="text-xs text-white/30">{formatDistanceToNow(new Date(c.createdAt))}</span>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">{c.content}</p>
                <div className="flex items-center gap-3 mt-2">
                  <button className="flex items-center gap-1 text-xs text-white/30 hover:text-red-400 transition-colors">
                    <Heart size={12} /> {c.likes?.length || 0}
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
