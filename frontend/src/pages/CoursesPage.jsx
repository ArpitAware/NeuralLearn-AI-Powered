import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Grid, List, X, Clock, Users, Star, Heart, ShoppingCart, CheckCircle2, Play, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { coursesAPI, progressAPI } from '../services/api';
import { PageLoader, CourseCardSkeleton, Badge, EmptyState, ProgressBar } from '../components/common/UI';
import { levelColor, categoryColor, formatNumber } from '../components/common/utils';
import useCartStore from '../store/cartStore';

const CATEGORIES = ['All', 'AI/ML', 'Web Dev', 'Design', 'Data Science', 'Blockchain', 'Cloud', 'Mobile', 'DevOps'];
const LEVELS     = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const SORTS      = [
  { value: 'newest',     label: 'Newest'           },
  { value: 'rating',     label: 'Top Rated'        },
  { value: 'popular',    label: 'Most Popular'     },
  { value: 'price-asc',  label: 'Price: Low → High'},
  { value: 'price-desc', label: 'Price: High → Low'},
];

/* ── Course card with cart + wishlist actions ─────────────── */
function CourseCard({ course, progress, index = 0, onOpen }) {
  const { addToCart, removeFromCart, isInCart, toggleWishlist, isInWishlist } = useCartStore();
  const navigate  = useNavigate();
  const inCart    = isInCart(course._id);
  const inWish    = isInWishlist(course._id);
  const pct       = progress?.progressPercent || 0;
  const enrolled  = !!progress;

  const handleCart = (e) => {
    e.stopPropagation();
    if (inCart) {
      removeFromCart(course._id);
      toast('Removed from cart', { icon: '🗑️' });
    } else {
      addToCart(course);
      toast.success('Added to cart!');
    }
  };

  const handleWish = (e) => {
    e.stopPropagation();
    toggleWishlist(course);
    toast(inWish ? 'Removed from wishlist' : 'Added to wishlist ❤️', { icon: inWish ? '💔' : '❤️' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.055, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="card overflow-hidden cursor-pointer group"
      style={{ transition: 'all 0.3s ease' }}
      onClick={() => onOpen(course)}
    >
      {/* Thumbnail */}
      <div className="relative h-44 overflow-hidden">
        {course.thumbnail
          ? <img src={course.thumbnail} alt={course.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          : <div className="w-full h-full bg-gradient-to-br from-accent/20 to-accent2/10 flex items-center justify-center">
              <BookOpen size={32} className="text-accent/40" />
            </div>
        }
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <Badge variant={categoryColor(course.category).replace('badge-', '')}>{course.category}</Badge>
        </div>
        <Badge variant={levelColor(course.level).replace('badge-', '')}
          className="absolute top-3 right-3 text-[9px]">{course.level}</Badge>

        {/* Progress bar */}
        {pct > 0 && (
          <div className="absolute bottom-0 left-0 right-0">
            <ProgressBar value={pct} height="h-1" animate={false} />
          </div>
        )}

        {/* Hover play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-accent/90 backdrop-blur-sm flex items-center justify-center shadow-[0_0_30px_rgba(91,106,245,0.5)]">
            <Play size={18} className="text-white ml-0.5" />
          </div>
        </div>

        {/* Wishlist heart — always visible top-right when in wishlist */}
        <button
          onClick={handleWish}
          className={`absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
            inWish
              ? 'bg-red-500/90 text-white'
              : 'bg-black/50 text-white/60 hover:bg-red-500/80 hover:text-white opacity-0 group-hover:opacity-100'
          }`}
        >
          <Heart size={14} fill={inWish ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="font-head font-bold text-sm leading-snug mb-1 line-clamp-2 group-hover:text-accent transition-colors">
          {course.title}
        </h3>
        <p className="text-xs text-white/40 mb-2">{course.instructor?.name || 'Instructor'}</p>

        <div className="flex items-center gap-3 text-xs text-white/30 mb-3">
          <span className="flex items-center gap-1"><Clock size={11} />{course.duration || '—'}</span>
          <span className="flex items-center gap-1"><Users size={11} />{formatNumber(course.totalStudents || 0)}</span>
          <span className="flex items-center gap-1 text-amber-400"><Star size={11} fill="currentColor" />{course.rating?.toFixed(1) || '0.0'}</span>
        </div>

        {/* Progress or Price + Actions */}
        {enrolled ? (
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-white/40">Progress</span>
              <span className="font-semibold text-accent">{pct}%</span>
            </div>
            <ProgressBar value={pct} height="h-1.5" />
            <button
              onClick={e => { e.stopPropagation(); navigate(`/courses/${course.slug}/learn`); }}
              className="btn btn-primary btn-sm w-full justify-center mt-3"
            >
              <Play size={13} /> {pct > 0 ? 'Continue' : 'Start'} Learning
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="font-head font-black text-lg text-accent flex-1">${course.price}</span>
            {/* Wishlist */}
            <button
              onClick={handleWish}
              className={`btn btn-icon btn-sm rounded-xl transition-all ${
                inWish ? 'bg-red-500/15 border border-red-500/30 text-red-400' : 'btn-ghost'
              }`}
              title={inWish ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart size={14} fill={inWish ? 'currentColor' : 'none'} />
            </button>
            {/* Cart */}
            <button
              onClick={handleCart}
              className={`btn btn-sm rounded-xl flex-1 justify-center transition-all ${
                inCart ? 'btn-success' : 'btn-primary'
              }`}
              title={inCart ? 'Remove from cart' : 'Add to cart'}
            >
              {inCart
                ? <><CheckCircle2 size={13} /> In Cart</>
                : <><ShoppingCart size={13} /> Add</>
              }
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ── Course Detail Modal ─────────────────────────────────────── */
function CourseModal({ course, progress, onClose }) {
  const { addToCart, removeFromCart, isInCart, toggleWishlist, isInWishlist } = useCartStore();
  const navigate = useNavigate();
  const inCart   = isInCart(course._id);
  const inWish   = isInWishlist(course._id);
  const enrolled = !!progress;
  const pct      = progress?.progressPercent || 0;
  const totalLessons = course.sections?.reduce((s, sec) => s + sec.lessons.length, 0) || 0;

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-bg3 border border-white/[0.12] rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Thumbnail */}
        <div className="relative h-52 overflow-hidden rounded-t-3xl">
          {course.thumbnail
            ? <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-gradient-to-br from-accent/20 to-accent2/10 flex items-center justify-center"><BookOpen size={48} className="text-accent/30" /></div>
          }
          <div className="absolute inset-0 bg-gradient-to-t from-bg3 via-transparent to-transparent" />
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white/70 hover:text-white">✕</button>
          <div className="absolute bottom-4 left-6 flex gap-2">
            <Badge variant={categoryColor(course.category).replace('badge-', '')}>{course.category}</Badge>
            <Badge variant={levelColor(course.level).replace('badge-', '')}>{course.level}</Badge>
          </div>
        </div>

        <div className="p-6">
          <h2 className="font-head font-black text-xl mb-1 leading-tight">{course.title}</h2>
          <p className="text-white/40 text-sm mb-4">{course.instructor?.name}</p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-4 text-xs text-white/40 mb-4">
            <span className="flex items-center gap-1"><Clock size={12} />{course.duration}</span>
            <span className="flex items-center gap-1"><BookOpen size={12} />{totalLessons} lessons</span>
            <span className="flex items-center gap-1"><Users size={12} />{formatNumber(course.totalStudents)} students</span>
            <span className="flex items-center gap-1 text-amber-400"><Star size={12} fill="currentColor" />{course.rating?.toFixed(1)}</span>
          </div>

          <p className="text-white/60 text-sm leading-relaxed mb-5">{course.description}</p>

          {/* Tags */}
          {course.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {course.tags.map(t => <Badge key={t} variant="blue">{t}</Badge>)}
            </div>
          )}

          {/* Enrolled progress */}
          {enrolled && (
            <div className="mb-5 p-4 rounded-2xl" style={{ background: 'rgba(91,106,245,0.08)', border: '1px solid rgba(91,106,245,0.2)' }}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/60">Your Progress</span>
                <span className="font-bold text-accent">{pct}%</span>
              </div>
              <ProgressBar value={pct} height="h-2" />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 items-center">
            <span className="font-head font-black text-3xl text-accent">${course.price}</span>
            {enrolled ? (
              <button onClick={() => { onClose(); navigate(`/courses/${course.slug}/learn`); }}
                className="btn btn-primary flex-1 justify-center py-3">
                <Play size={16} /> {pct > 0 ? 'Continue Learning' : 'Start Course'}
              </button>
            ) : (
              <>
                <button
                  onClick={() => { toggleWishlist(course); toast(inWish ? 'Removed from wishlist' : 'Added to wishlist ❤️'); }}
                  className={`btn btn-sm px-4 py-3 rounded-xl ${inWish ? 'bg-red-500/15 border border-red-500/30 text-red-400' : 'btn-ghost'}`}
                >
                  <Heart size={16} fill={inWish ? 'currentColor' : 'none'} />
                </button>
                <button
                  onClick={() => {
                    if (inCart) { removeFromCart(course._id); toast('Removed from cart', { icon: '🗑️' }); }
                    else { addToCart(course); toast.success('Added to cart!'); }
                  }}
                  className={`btn flex-1 justify-center py-3 rounded-xl ${inCart ? 'btn-success' : 'btn-primary'}`}
                >
                  {inCart ? <><CheckCircle2 size={15} /> In Cart</> : <><ShoppingCart size={15} /> Add to Cart</>}
                </button>
              </>
            )}
          </div>
          <p className="text-xs text-white/30 text-center mt-3">30-day money-back guarantee · Lifetime access</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══ MAIN PAGE ══════════════════════════════════════════════ */
export default function CoursesPage() {
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('All');
  const [level,    setLevel]    = useState('All');
  const [sort,     setSort]     = useState('newest');
  const [view,     setView]     = useState('grid');
  const [page,     setPage]     = useState(1);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();
  const { cartCount } = useCartStore();

  const { data, isLoading } = useQuery({
    queryKey: ['courses', { search, category, level, sort, page }],
    queryFn:  () => coursesAPI.getAll({
      search:   search   || undefined,
      category: category !== 'All' ? category : undefined,
      level:    level    !== 'All' ? level    : undefined,
      sort, page, limit: 12,
    }).then(r => r.data),
    keepPreviousData: true,
  });

  const { data: progressData } = useQuery({
    queryKey: ['my-progress'],
    queryFn:  () => progressAPI.getAll().then(r => r.data),
  });

  const courses  = data?.courses  || [];
  const total    = data?.total    || 0;
  const pages    = data?.pages    || 1;
  const progMap  = Object.fromEntries((progressData?.progress || []).map(p => [String(p.course?._id), p]));

  const clearFilters = () => { setSearch(''); setCategory('All'); setLevel('All'); setSort('newest'); setPage(1); };
  const hasFilters   = search || category !== 'All' || level !== 'All';

  return (
    <div className="pb-8">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h2 className="font-head font-bold text-2xl">All Courses</h2>
          <p className="text-white/40 text-sm mt-0.5">{total > 0 ? `${total} courses available` : 'Explore our catalog'}</p>
        </div>
        <button onClick={() => navigate('/cart')} className="btn btn-ghost relative">
          <ShoppingCart size={16} />
          Cart
          {cartCount() > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {cartCount()}
            </span>
          )}
        </button>
      </div>

      {/* Search + Controls */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] bg-white/[0.04] border border-white/[0.12] rounded-xl px-4">
          <Search size={15} className="text-white/30 flex-shrink-0" />
          <input
            className="bg-transparent outline-none text-sm text-white placeholder-white/20 py-2.5 w-full"
            placeholder="Search courses, instructors, topics..."
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
          {search && <button onClick={() => setSearch('')} className="text-white/30 hover:text-white"><X size={14} /></button>}
        </div>
        <select
          className="input w-auto text-sm"
          value={sort} onChange={e => setSort(e.target.value)}
          style={{ appearance: 'none', paddingRight: 36 }}
        >
          {SORTS.map(s => <option key={s.value} value={s.value} style={{ background: '#0c0c18' }}>{s.label}</option>)}
        </select>
        <div className="flex gap-1 bg-white/[0.04] border border-white/[0.08] rounded-xl p-1">
          <button onClick={() => setView('grid')} className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'bg-accent text-white' : 'text-white/40 hover:text-white'}`}><Grid size={15} /></button>
          <button onClick={() => setView('list')} className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-accent text-white' : 'text-white/40 hover:text-white'}`}><List size={15} /></button>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-2 scrollbar-hide">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => { setCategory(c); setPage(1); }}
            className={`btn btn-sm flex-shrink-0 ${category === c ? 'btn-primary' : 'btn-ghost'}`}>{c}</button>
        ))}
        <div className="w-px bg-white/[0.08] flex-shrink-0 mx-1" />
        {LEVELS.filter(l => l !== 'All').map(l => (
          <button key={l} onClick={() => { setLevel(level === l ? 'All' : l); setPage(1); }}
            className={`btn btn-sm flex-shrink-0 ${level === l ? 'btn-primary' : 'btn-ghost'}`}>{l}</button>
        ))}
      </div>

      {hasFilters && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-white/40">{total} result{total !== 1 ? 's' : ''}</span>
          <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300"><X size={11} /> Clear filters</button>
        </div>
      )}

      {/* Wishlist banner */}
      {useCartStore.getState().wishlist.length > 0 && (
        <div className="mb-5 p-4 rounded-2xl border flex items-center gap-3 flex-wrap"
          style={{ background: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.15)' }}>
          <Heart size={16} className="text-red-400 flex-shrink-0" fill="currentColor" />
          <span className="text-sm text-white/70 flex-1">
            You have <strong className="text-white">{useCartStore.getState().wishlist.length}</strong> course{useCartStore.getState().wishlist.length > 1 ? 's' : ''} in your wishlist
          </span>
          <button className="btn btn-sm btn-ghost text-red-400 border-red-400/30"
            onClick={() => useCartStore.getState().wishlist.forEach(c => useCartStore.getState().addToCart(c))}>
            Add all to cart
          </button>
        </div>
      )}

      {/* Course Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array(6).fill(null).map((_, i) => <CourseCardSkeleton key={i} />)}
        </div>
      ) : courses.length === 0 ? (
        <EmptyState icon="🔍" title="No courses found" description="Try different keywords or clear the filters."
          action={<button onClick={clearFilters} className="btn btn-primary btn-sm">Clear Filters</button>} />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course, i) => (
            <CourseCard
              key={course._id}
              course={course}
              progress={progMap[String(course._id)]}
              index={i}
              onOpen={setSelected}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {courses.map((course, i) => {
            const prog   = progMap[String(course._id)];
            const inCart = useCartStore.getState().isInCart(course._id);
            const inWish = useCartStore.getState().isInWishlist(course._id);
            return (
              <motion.div key={course._id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="card p-4 flex gap-4 items-center cursor-pointer group"
                onClick={() => setSelected(course)}
              >
                {course.thumbnail
                  ? <img src={course.thumbnail} alt="" className="w-20 h-14 object-cover rounded-xl flex-shrink-0 group-hover:scale-105 transition-transform" />
                  : <div className="w-20 h-14 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0"><BookOpen size={20} className="text-accent/50" /></div>
                }
                <div className="flex-1 min-w-0">
                  <p className="font-head font-bold text-sm truncate group-hover:text-accent transition-colors">{course.title}</p>
                  <p className="text-xs text-white/40 mt-0.5 mb-1">{course.instructor?.name}</p>
                  <div className="flex items-center gap-3 text-xs text-white/30">
                    <span className="flex items-center gap-1"><Clock size={10} />{course.duration}</span>
                    <span className="flex items-center gap-1 text-amber-400"><Star size={10} fill="currentColor" />{course.rating?.toFixed(1)}</span>
                    <Badge variant={levelColor(course.level).replace('badge-', '')}>{course.level}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
                  <span className="font-head font-black text-lg text-accent">${course.price}</span>
                  <button onClick={() => { useCartStore.getState().toggleWishlist(course); toast(inWish ? 'Removed' : 'Added to wishlist ❤️'); }}
                    className={`btn btn-icon btn-sm ${inWish ? 'text-red-400' : 'btn-ghost'}`}>
                    <Heart size={14} fill={inWish ? 'currentColor' : 'none'} />
                  </button>
                  <button onClick={() => {
                    if (inCart) { useCartStore.getState().removeFromCart(course._id); toast('Removed from cart', { icon: '🗑️' }); }
                    else { useCartStore.getState().addToCart(course); toast.success('Added to cart!'); }
                  }} className={`btn btn-sm ${inCart ? 'btn-success' : 'btn-primary'}`}>
                    {inCart ? <><CheckCircle2 size={13} /> In Cart</> : <><ShoppingCart size={13} /> Add</>}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn btn-ghost btn-sm">← Prev</button>
          {Array.from({ length: Math.min(pages, 7) }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-ghost'}`}>{p}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="btn btn-ghost btn-sm">Next →</button>
        </div>
      )}

      {/* Course detail modal */}
      <AnimatePresence>
        {selected && (
          <CourseModal
            course={selected}
            progress={progMap[String(selected._id)]}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
