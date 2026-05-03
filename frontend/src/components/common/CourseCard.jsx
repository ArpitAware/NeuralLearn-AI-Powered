import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Users, Star, Play } from 'lucide-react';
import { ProgressBar, Badge } from './UI';
import { levelColor, categoryColor, formatNumber } from './utils';

export default function CourseCard({ course, progress, index = 0, onClick }) {
  const pct = progress?.progressPercent || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="card card-hover card-glow overflow-hidden cursor-pointer group"
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant={categoryColor(course.category).replace('badge-', '')}>
            {course.category}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge variant={levelColor(course.level).replace('badge-', '')}>
            {course.level}
          </Badge>
        </div>
        {pct > 0 && (
          <div className="absolute bottom-0 left-0 right-0">
            <ProgressBar value={pct} height="h-1" animate={false} />
          </div>
        )}
        <motion.div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          initial={false}
        >
          <div className="w-12 h-12 rounded-full bg-accent/90 backdrop-blur-sm flex items-center justify-center shadow-[0_0_30px_rgba(91,106,245,0.5)]">
            <Play size={18} className="text-white ml-0.5" />
          </div>
        </motion.div>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="font-head font-bold text-sm leading-snug mb-1 line-clamp-2 group-hover:text-accent transition-colors">
          {course.title}
        </h3>
        <p className="text-xs text-white/40 mb-3">
          {course.instructor?.name || course.instructor}
        </p>

        <div className="flex items-center gap-3 text-xs text-white/40 mb-3">
          <span className="flex items-center gap-1"><Clock size={11} />{course.duration}</span>
          <span className="flex items-center gap-1"><Users size={11} />{formatNumber(course.totalStudents)}</span>
          <span className="flex items-center gap-1 text-amber-400"><Star size={11} fill="currentColor" />{course.rating?.toFixed(1)}</span>
        </div>

        {pct > 0 ? (
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-white/40">Progress</span>
              <span className="font-semibold text-accent">{pct}%</span>
            </div>
            <ProgressBar value={pct} height="h-1.5" />
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="font-head font-extrabold text-lg text-accent">${course.price}</span>
            {course.discountPrice && (
              <span className="text-xs text-white/30 line-through">${course.discountPrice}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
