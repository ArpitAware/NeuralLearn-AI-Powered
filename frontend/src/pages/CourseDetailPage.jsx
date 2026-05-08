import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Play, Clock, Users, Star, BookOpen, Award, ChevronDown, ChevronUp, CheckCircle2, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { coursesAPI, progressAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import { PageLoader, ProgressBar, Badge } from '../components/common/UI';
import { levelColor, categoryColor, formatNumber } from '../components/common/utils';

export default function CourseDetailPage() {
  const { slug }       = useParams();
  const navigate       = useNavigate();
  const { user }       = useAuthStore();
  const qc             = useQueryClient();
  const [openSections, setOpenSections] = useState([0]);
  const [reviewForm, setReviewForm]     = useState({ rating: 5, comment: '' });
  const [showReview, setShowReview]     = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['course', slug],
    queryFn:  () => coursesAPI.getOne(slug).then(r => r.data),
  });

  const { data: progressData } = useQuery({
    queryKey: ['course-progress', data?.course?._id],
    queryFn:  () => progressAPI.getCourse(data.course._id).then(r => r.data),
    enabled:  !!data?.course?._id,
  });

  const enrollMut = useMutation({
    mutationFn: () => coursesAPI.enroll(data.course._id),
    onSuccess:  () => { toast.success('Enrolled! 🎉'); qc.invalidateQueries(['my-progress']); qc.invalidateQueries(['course', slug]); },
    onError:    (err) => toast.error(err.response?.data?.message || 'Error'),
  });

  const reviewMut = useMutation({
    mutationFn: () => coursesAPI.addReview(data.course._id, reviewForm),
    onSuccess:  () => { toast.success('Review submitted!'); setShowReview(false); qc.invalidateQueries(['course', slug]); },
    onError:    (err) => toast.error(err.response?.data?.message || 'Error'),
  });

  if (isLoading) return <PageLoader />;
  const course   = data?.course;
  if (!course)   return <div className="text-white/40 text-center py-20">Course not found</div>;

  const progress   = progressData?.progress;
  const enrolled   = user?.enrolledCourses?.map(String)?.includes(String(course._id)) || !!progress;
  const totalLessons = course.sections?.reduce((s, sec) => s + sec.lessons.length, 0) || 0;

  const toggleSection = (i) =>
    setOpenSections(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);

  return (
    <div className="pb-10">
      {/* HERO */}
      <div className="relative -mx-6 -mt-6 mb-8 overflow-hidden" style={{ height: 300 }}>
        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-transparent to-transparent" />
        <div className="absolute bottom-8 left-8 right-8 max-w-2xl">
          <div className="flex gap-2 mb-3">
            <Badge variant={categoryColor(course.category).replace('badge-', '')}>{course.category}</Badge>
            <Badge variant={levelColor(course.level).replace('badge-', '')}>{course.level}</Badge>
          </div>
          <h1 className="font-head font-black text-3xl md:text-4xl leading-tight mb-2">{course.title}</h1>
          <p className="text-white/60 text-sm mb-4 max-w-xl line-clamp-2">{course.description}</p>
          <div className="flex items-center gap-5 text-sm text-white/50">
            <span className="flex items-center gap-1.5"><Clock size={14} />{course.duration}</span>
            <span className="flex items-center gap-1.5"><BookOpen size={14} />{totalLessons} lessons</span>
            <span className="flex items-center gap-1.5"><Users size={14} />{formatNumber(course.totalStudents)} students</span>
            <span className="flex items-center gap-1.5 text-amber-400"><Star size={14} fill="currentColor" />{course.rating?.toFixed(1)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT CONTENT */}
        <div className="lg:col-span-2 space-y-7">
          {/* About */}
          <div className="card p-6">
            <h2 className="font-head font-bold text-lg mb-3">About This Course</h2>
            <p className="text-white/60 text-sm leading-relaxed">{course.description}</p>
            {course.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {course.tags.map(t => <Badge key={t} variant="blue">{t}</Badge>)}
              </div>
            )}
          </div>

          {/* Progress (if enrolled) */}
          {enrolled && progress && (
            <div className="card p-6" style={{ background: 'linear-gradient(135deg, rgba(91,106,245,0.08), rgba(6,182,212,0.05))', borderColor: 'rgba(91,106,245,0.2)' }}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-head font-bold text-lg">Your Progress</h2>
                <span className="font-head font-black text-2xl text-accent">{progress.progressPercent}%</span>
              </div>
              <ProgressBar value={progress.progressPercent} height="h-2.5" />
              <p className="text-xs text-white/40 mt-2">
                {progress.completedLessons?.length || 0} of {totalLessons} lessons completed
                {progress.completed && ' · ✅ Course complete!'}
              </p>
              <button onClick={() => navigate(`/courses/${slug}/learn`)} className="btn btn-primary mt-4">
                <Play size={14} /> {progress.progressPercent > 0 ? 'Continue Learning' : 'Start Course'}
              </button>
            </div>
          )}

          {/* Curriculum */}
          <div className="card overflow-hidden">
            <div className="p-6 border-b border-white/[0.06]">
              <h2 className="font-head font-bold text-lg">Curriculum</h2>
              <p className="text-sm text-white/40 mt-1">{course.sections?.length} sections · {totalLessons} lessons · {course.duration} total</p>
            </div>
            {course.sections?.map((section, si) => (
              <div key={si} className="border-b border-white/[0.04] last:border-0">
                <button
                  onClick={() => toggleSection(si)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors text-left"
                >
                  <div>
                    <p className="font-semibold text-sm">{section.title}</p>
                    <p className="text-xs text-white/30 mt-0.5">{section.lessons.length} lessons</p>
                  </div>
                  {openSections.includes(si) ? <ChevronUp size={16} className="text-white/40" /> : <ChevronDown size={16} className="text-white/40" />}
                </button>
                {openSections.includes(si) && (
                  <motion.div
                    initial={{ height: 0 }} animate={{ height: 'auto' }}
                    className="overflow-hidden"
                  >
                    {section.lessons.map((lesson, li) => {
                      const isComplete = progress?.completedLessons?.includes(lesson._id);
                      const canAccess  = enrolled || lesson.isPreview;
                      return (
                        <div
                          key={li}
                          className={`flex items-center gap-3 px-6 py-3 border-t border-white/[0.03] ${canAccess ? 'cursor-pointer hover:bg-white/[0.02]' : 'opacity-50'}`}
                          onClick={() => canAccess && enrolled && navigate(`/courses/${slug}/learn`)}
                        >
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${isComplete ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/[0.06] text-white/30'}`}>
                            {isComplete ? <CheckCircle2 size={14} /> : canAccess ? <Play size={12} /> : <Lock size={12} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate">{lesson.title}</p>
                            {lesson.isPreview && !enrolled && <span className="text-xs text-accent">Free preview</span>}
                          </div>
                          <span className="text-xs text-white/30 flex-shrink-0">{lesson.duration}</span>
                          <Badge variant={lesson.type === 'quiz' ? 'amber' : 'blue'}>{lesson.type}</Badge>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          {/* Reviews */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-head font-bold text-lg">Reviews ({course.reviews?.length || 0})</h2>
              {enrolled && !showReview && (
                <button onClick={() => setShowReview(true)} className="btn btn-ghost btn-sm">Write a review</button>
              )}
            </div>
            {showReview && (
              <div className="bg-white/[0.03] rounded-2xl p-4 mb-5 border border-white/[0.08]">
                <p className="text-sm font-medium mb-3">Your rating:</p>
                <div className="flex gap-1 mb-3">
                  {[1,2,3,4,5].map(n => (
                    <button key={n} onClick={() => setReviewForm(p => ({ ...p, rating: n }))} className={`text-2xl transition-transform hover:scale-110 ${n <= reviewForm.rating ? 'text-amber-400' : 'text-white/20'}`}>★</button>
                  ))}
                </div>
                <textarea className="input mb-3 resize-none" rows={3} placeholder="Share your experience..." value={reviewForm.comment} onChange={e => setReviewForm(p => ({ ...p, comment: e.target.value }))} />
                <div className="flex gap-2">
                  <button className="btn btn-primary btn-sm" onClick={() => reviewMut.mutate()} disabled={reviewMut.isPending}>Submit</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setShowReview(false)}>Cancel</button>
                </div>
              </div>
            )}
            {course.reviews?.length === 0 ? (
              <p className="text-white/30 text-sm text-center py-6">No reviews yet. Be the first!</p>
            ) : (
              <div className="space-y-4">
                {course.reviews.slice(0, 5).map((r, i) => (
                  <div key={i} className="flex gap-3 py-3 border-b border-white/[0.04] last:border-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-accent2 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {r.user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold">{r.user?.name || 'User'}</span>
                        <span className="text-amber-400 text-xs">{'★'.repeat(r.rating)}</span>
                      </div>
                      <p className="text-sm text-white/50">{r.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="space-y-4">
          <div className="card p-6 sticky top-20">
            {enrolled ? (
              <>
                <div className="text-center mb-5">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/15 border-2 border-emerald-500/30 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 size={28} className="text-emerald-400" />
                  </div>
                  <p className="font-semibold text-emerald-400">Enrolled</p>
                </div>
                <button onClick={() => navigate(`/courses/${slug}/learn`)} className="btn btn-primary w-full justify-center py-3">
                  <Play size={16} /> {progress?.progressPercent > 0 ? 'Continue' : 'Start Learning'}
                </button>
              </>
            ) : (
              <>
                <div className="text-center mb-5">
                  <p className="font-head font-black text-4xl text-accent">₹{course.price}</p>
                  {course.discountPrice && <p className="text-white/30 text-sm line-through">₹{course.discountPrice}</p>}
                </div>
                <button onClick={() => enrollMut.mutate()} disabled={enrollMut.isPending} className="btn btn-primary w-full justify-center py-3 mb-3 animate-glow-pulse">
                  {enrollMut.isPending ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Enrolling...</span> : 'Enroll Now →'}
                </button>
                <p className="text-xs text-white/30 text-center">30-day money-back guarantee</p>
              </>
            )}
            <div className="border-t border-white/[0.06] mt-5 pt-5 space-y-3">
              {[
                [Clock,    `${course.duration} of content`],
                [BookOpen, `${totalLessons} lessons`],
                [Users,    `${formatNumber(course.totalStudents)} students`],
                [Award,    'Certificate of completion'],
              ].map(([Icon, text]) => (
                <div key={text} className="flex items-center gap-3 text-sm text-white/50">
                  <Icon size={15} className="text-accent flex-shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Instructor */}
          {course.instructor && (
            <div className="card p-5">
              <h3 className="font-head font-bold text-sm mb-3">Instructor</h3>
              <div className="flex items-center gap-3 mb-3">
                {course.instructor.avatar ? (
                  <img src={course.instructor.avatar} alt="" className="w-11 h-11 rounded-full object-cover" />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent to-accent2 flex items-center justify-center font-bold text-sm">
                    {course.instructor.name?.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-sm">{course.instructor.name}</p>
                  <p className="text-xs text-white/40">Instructor</p>
                </div>
              </div>
              {course.instructor.bio && <p className="text-xs text-white/40 leading-relaxed">{course.instructor.bio}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
