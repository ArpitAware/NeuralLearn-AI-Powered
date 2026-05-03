import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Lock, Play, ChevronLeft, ChevronDown, ChevronUp, MessageSquare, FileText, Settings, X, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { coursesAPI, progressAPI } from '../services/api';
import { PageLoader, ProgressBar } from '../components/common/UI';

export default function CoursePlayerPage() {
  const { slug }     = useParams();
  const navigate     = useNavigate();
  const qc           = useQueryClient();
  const [activeLesson, setActiveLesson] = useState(null);
  const [sidebarOpen, setSidebarOpen]   = useState(true);
  const [tab, setTab]                   = useState('content');
  const [note, setNote]                 = useState('');
  const [openSections, setOpenSections] = useState([0]);

  const { data: courseData, isLoading } = useQuery({
    queryKey: ['course', slug],
    queryFn:  () => coursesAPI.getOne(slug).then(r => r.data),
  });

  const { data: progressData, refetch: refetchProgress } = useQuery({
    queryKey: ['course-progress', courseData?.course?._id],
    queryFn:  () => progressAPI.getCourse(courseData.course._id).then(r => r.data),
    enabled:  !!courseData?.course?._id,
  });

  const completeMut = useMutation({
    mutationFn: ({ courseId, lessonId }) => progressAPI.markComplete(courseId, lessonId),
    onSuccess:  () => { toast.success('Lesson complete! ✅'); refetchProgress(); qc.invalidateQueries(['my-progress']); },
  });

  const noteMut = useMutation({
    mutationFn: ({ courseId, data }) => progressAPI.addNote(courseId, data),
    onSuccess:  () => { toast.success('Note saved'); setNote(''); },
  });

  useEffect(() => {
    if (courseData?.course?.sections?.[0]?.lessons?.[0]) {
      setActiveLesson(courseData.course.sections[0].lessons[0]);
    }
  }, [courseData]);

  if (isLoading) return <PageLoader />;
  const course   = courseData?.course;
  if (!course)   return null;
  const progress = progressData?.progress;
  const completed = new Set(progress?.completedLessons?.map(String) || []);

  const allLessons = course.sections?.flatMap(s => s.lessons) || [];
  const totalLessons = allLessons.length;
  const pct = totalLessons > 0 ? Math.round((completed.size / totalLessons) * 100) : 0;

  const handleLessonClick = (lesson) => setActiveLesson(lesson);

  const handleComplete = () => {
    if (activeLesson && course._id) {
      completeMut.mutate({ courseId: course._id, lessonId: activeLesson._id });
    }
  };

  const handleNote = () => {
    if (note.trim() && course._id && activeLesson) {
      noteMut.mutate({ courseId: course._id, data: { lessonId: activeLesson._id, content: note } });
    }
  };

  const nextLesson = () => {
    const idx = allLessons.findIndex(l => l._id === activeLesson?._id);
    if (idx < allLessons.length - 1) setActiveLesson(allLessons[idx + 1]);
  };

  const prevLesson = () => {
    const idx = allLessons.findIndex(l => l._id === activeLesson?._id);
    if (idx > 0) setActiveLesson(allLessons[idx - 1]);
  };

  return (
    <div className="fixed inset-0 bg-bg flex flex-col z-50">
      {/* TOP BAR */}
      <div className="flex items-center gap-4 h-14 px-4 bg-bg2 border-b border-white/[0.06] flex-shrink-0">
        <button onClick={() => navigate(`/courses/${slug}`)} className="flex items-center gap-1.5 text-white/50 hover:text-white text-sm transition-colors">
          <ChevronLeft size={16} /> Back
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{course.title}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 w-48 hidden sm:flex">
            <ProgressBar value={pct} height="h-1.5" className="flex-1" />
            <span className="text-xs text-accent font-semibold flex-shrink-0">{pct}%</span>
          </div>
          <button onClick={() => setSidebarOpen(s => !s)} className="btn btn-ghost btn-sm btn-icon">
            <Settings size={15} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* VIDEO AREA */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Video */}
          <div className="flex-1 bg-black flex items-center justify-center relative">
            {activeLesson?.videoUrl ? (
              <iframe
                key={activeLesson._id}
                src={activeLesson.videoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="flex flex-col items-center gap-4 text-white/30">
                <div className="w-20 h-20 rounded-full bg-white/[0.06] flex items-center justify-center">
                  <Play size={32} />
                </div>
                <p className="text-sm">{activeLesson?.title || 'Select a lesson'}</p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between px-6 py-3 bg-bg2 border-t border-white/[0.06] flex-shrink-0">
            <button onClick={prevLesson} className="btn btn-ghost btn-sm">← Prev</button>
            <div className="flex items-center gap-3">
              <h2 className="font-semibold text-sm hidden sm:block">{activeLesson?.title}</h2>
              <button
                onClick={handleComplete}
                disabled={completed.has(String(activeLesson?._id)) || completeMut.isPending}
                className={`btn btn-sm ${completed.has(String(activeLesson?._id)) ? 'btn-success' : 'btn-primary'}`}
              >
                {completed.has(String(activeLesson?._id)) ? <><CheckCircle2 size={13} /> Done</> : 'Mark Complete'}
              </button>
            </div>
            <button onClick={nextLesson} className="btn btn-ghost btn-sm">Next →</button>
          </div>

          {/* Tabs */}
          <div className="bg-bg2 border-t border-white/[0.06]">
            <div className="flex gap-0 px-4 pt-2">
              {[
                { id: 'content', label: 'Overview', icon: FileText },
                { id: 'notes',   label: 'Notes',    icon: MessageSquare },
              ].map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${tab === t.id ? 'border-accent text-accent' : 'border-transparent text-white/40 hover:text-white'}`}>
                  <t.icon size={13} />{t.label}
                </button>
              ))}
            </div>
            <div className="p-4 max-h-48 overflow-y-auto">
              {tab === 'content' && (
                <div>
                  <h3 className="font-head font-bold text-sm mb-2">{activeLesson?.title}</h3>
                  <p className="text-xs text-white/40 leading-relaxed">{activeLesson?.content || 'No additional content for this lesson.'}</p>
                </div>
              )}
              {tab === 'notes' && (
                <div className="flex gap-2">
                  <textarea
                    className="input flex-1 text-xs resize-none"
                    rows={3}
                    placeholder="Add a note for this lesson..."
                    value={note}
                    onChange={e => setNote(e.target.value)}
                  />
                  <button onClick={handleNote} disabled={!note.trim() || noteMut.isPending} className="btn btn-primary btn-sm btn-icon self-end">
                    <Send size={13} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ width: 0 }} animate={{ width: 320 }} exit={{ width: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-bg2 border-l border-white/[0.06] flex flex-col overflow-hidden flex-shrink-0"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                <p className="font-head font-bold text-sm">Course Content</p>
                <button onClick={() => setSidebarOpen(false)} className="text-white/30 hover:text-white"><X size={15} /></button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {course.sections?.map((section, si) => (
                  <div key={si} className="border-b border-white/[0.04]">
                    <button
                      onClick={() => setOpenSections(prev => prev.includes(si) ? prev.filter(x => x !== si) : [...prev, si])}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors text-left"
                    >
                      <div>
                        <p className="text-xs font-semibold text-white/80">{section.title}</p>
                        <p className="text-[10px] text-white/30 mt-0.5">{section.lessons.length} lessons</p>
                      </div>
                      {openSections.includes(si) ? <ChevronUp size={13} className="text-white/30 flex-shrink-0" /> : <ChevronDown size={13} className="text-white/30 flex-shrink-0" />}
                    </button>
                    {openSections.includes(si) && section.lessons.map((lesson, li) => {
                      const isDone    = completed.has(String(lesson._id));
                      const isActive  = activeLesson?._id === lesson._id;
                      return (
                        <button
                          key={li}
                          onClick={() => handleLessonClick(lesson)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left border-t border-white/[0.02] hover:bg-white/[0.04] transition-colors ${isActive ? 'bg-accent/10 border-l-2 border-l-accent' : ''}`}
                        >
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${isDone ? 'bg-emerald-500/25 text-emerald-400' : isActive ? 'bg-accent/20 text-accent' : 'bg-white/[0.06] text-white/20'}`}>
                            {isDone ? <CheckCircle2 size={11} /> : <Play size={9} />}
                          </div>
                          <p className={`text-[11px] leading-snug flex-1 truncate ${isActive ? 'text-white' : 'text-white/50'}`}>{lesson.title}</p>
                          <span className="text-[10px] text-white/20 flex-shrink-0">{lesson.duration}</span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
