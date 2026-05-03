import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Grid, List, Filter, X, Clock, Users, BookOpen, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { coursesAPI, progressAPI } from '../services/api';
import { PageLoader, CourseCardSkeleton, Badge, EmptyState, ProgressBar } from '../components/common/UI';
import CourseCard from '../components/common/CourseCard';
import { levelColor, categoryColor, formatNumber } from '../components/common/utils';

const CATEGORIES = ['All', 'AI/ML', 'Web Dev', 'Design', 'Data Science', 'Blockchain', 'Cloud', 'Mobile', 'DevOps'];
const LEVELS     = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const SORTS      = [
  { value: 'newest',     label: 'Newest' },
  { value: 'rating',     label: 'Top Rated' },
  { value: 'popular',    label: 'Most Popular' },
  { value: 'price-asc',  label: 'Price: Low→High' },
  { value: 'price-desc', label: 'Price: High→Low' },
];

export default function CoursesPage() {
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel]       = useState('All');
  const [sort, setSort]         = useState('newest');
  const [view, setView]         = useState('grid');
  const [page, setPage]         = useState(1);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['courses', { search, category, level, sort, page }],
    queryFn: () => coursesAPI.getAll({
      search: search || undefined,
      category: category !== 'All' ? category : undefined,
      level:    level !== 'All'    ? level    : undefined,
      sort, page, limit: 12,
    }).then(r => r.data),
    keepPreviousData: true,
  });

  const { data: progressData } = useQuery({
    queryKey: ['my-progress'],
    queryFn:  () => progressAPI.getAll().then(r => r.data),
  });

  const enrollMut = useMutation({
    mutationFn: (id) => coursesAPI.enroll(id),
    onSuccess: () => {
      toast.success('Enrolled successfully! 🎉');
      qc.invalidateQueries(['courses']);
      qc.invalidateQueries(['my-progress']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Enroll failed'),
  });

  const courses   = data?.courses   || [];
  const total     = data?.total     || 0;
  const pages     = data?.pages     || 1;
  const progMap   = Object.fromEntries((progressData?.progress || []).map(p => [p.course?._id, p]));

  const handleCourseClick = (course) => navigate(`/courses/${course.slug}`);

  const clearFilters = () => { setSearch(''); setCategory('All'); setLevel('All'); setSort('newest'); setPage(1); };
  const hasFilters = search || category !== 'All' || level !== 'All';

  return (
    <div className="pb-8">
      {/* SEARCH + FILTERS */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 flex-1 min-w-[220px] bg-white/[0.04] border border-white/[0.12] rounded-xl px-4 py-2.5">
            <Search size={16} className="text-white/30 flex-shrink-0" />
            <input
              className="bg-transparent outline-none text-sm text-white placeholder-white/20 w-full"
              placeholder="Search courses, instructors..."
              value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
            {search && <button onClick={() => setSearch('')} className="text-white/30 hover:text-white"><X size={14} /></button>}
          </div>

          {/* Sort */}
          <select
            className="input w-auto pr-8"
            value={sort} onChange={e => setSort(e.target.value)}
            style={{ appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'%23ffffff40\'%3E%3Cpath d=\'M7 10l5 5 5-5z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
          >
            {SORTS.map(s => <option key={s.value} value={s.value} style={{ background: '#0c0c18' }}>{s.label}</option>)}
          </select>

          {/* View toggle */}
          <div className="flex gap-1 bg-white/[0.04] border border-white/[0.08] rounded-xl p-1">
            <button onClick={() => setView('grid')} className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'bg-accent text-white' : 'text-white/40 hover:text-white'}`}><Grid size={15} /></button>
            <button onClick={() => setView('list')} className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-accent text-white' : 'text-white/40 hover:text-white'}`}><List size={15} /></button>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => { setCategory(c); setPage(1); }}
              className={`btn btn-sm flex-shrink-0 ${category === c ? 'btn-primary' : 'btn-ghost'}`}
            >{c}</button>
          ))}
          <div className="w-px bg-white/[0.08] flex-shrink-0 mx-1" />
          {LEVELS.filter(l => l !== 'All').map(l => (
            <button
              key={l}
              onClick={() => { setLevel(l === level ? 'All' : l); setPage(1); }}
              className={`btn btn-sm flex-shrink-0 ${level === l ? 'btn-primary' : 'btn-ghost'}`}
            >{l}</button>
          ))}
        </div>

        {/* Filter indicators */}
        {hasFilters && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/40">{total} results</span>
            <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300">
              <X size={12} /> Clear filters
            </button>
          </div>
        )}
      </div>

      {/* GRID */}
      {isLoading ? (
        <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5' : 'flex flex-col gap-4'}>
          {Array(6).fill(null).map((_, i) => <CourseCardSkeleton key={i} />)}
        </div>
      ) : courses.length === 0 ? (
        <EmptyState icon="🔍" title="No courses found" description="Try different keywords or clear the filters." action={<button onClick={clearFilters} className="btn btn-primary btn-sm">Clear Filters</button>} />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course, i) => (
            <CourseCard
              key={course._id}
              course={course}
              progress={progMap[course._id]}
              index={i}
              onClick={() => handleCourseClick(course)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {courses.map((course, i) => {
            const prog = progMap[course._id];
            return (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="card card-hover p-4 flex gap-4 cursor-pointer group"
                onClick={() => handleCourseClick(course)}
              >
                <img src={course.thumbnail} alt="" className="w-24 h-16 object-cover rounded-xl flex-shrink-0 group-hover:scale-105 transition-transform" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-head font-bold text-sm mb-0.5 group-hover:text-accent transition-colors">{course.title}</h3>
                      <p className="text-xs text-white/40 mb-2">{course.instructor?.name}</p>
                    </div>
                    <span className="font-head font-black text-lg text-accent flex-shrink-0">${course.price}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-white/30">
                    <span className="flex items-center gap-1"><Clock size={11} />{course.duration}</span>
                    <span className="flex items-center gap-1"><Users size={11} />{formatNumber(course.totalStudents)}</span>
                    <span className="flex items-center gap-1 text-amber-400"><Star size={11} fill="currentColor" />{course.rating?.toFixed(1)}</span>
                    <Badge variant={levelColor(course.level).replace('badge-', '')}>{course.level}</Badge>
                  </div>
                  {prog && prog.progressPercent > 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <ProgressBar value={prog.progressPercent} height="h-1" className="flex-1" />
                      <span className="text-xs text-accent font-semibold">{prog.progressPercent}%</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* PAGINATION */}
      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn btn-ghost btn-sm">← Prev</button>
          {Array.from({ length: Math.min(pages, 7) }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-ghost'}`}>{p}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="btn btn-ghost btn-sm">Next →</button>
        </div>
      )}
    </div>
  );
}
