import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/* ── Spinner ── */
export function Spinner({ size = 20, className = '' }) {
  return <Loader2 size={size} className={`animate-spin text-accent ${className}`} />;
}

/* ── Page loader ── */
export function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-accent/20 border-t-accent animate-spin" />
        <p className="text-sm text-white/30">Loading...</p>
      </div>
    </div>
  );
}

/* ── Skeleton ── */
export function Skeleton({ className = '' }) {
  return <div className={`skeleton ${className}`} />;
}

/* ── CourseCard skeleton ── */
export function CourseCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <Skeleton className="h-36 w-full rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}

/* ── Progress Bar ── */
export function ProgressBar({ value = 0, height = 'h-1.5', className = '', animate = true }) {
  return (
    <div className={`bg-white/[0.08] rounded-full overflow-hidden ${height} ${className}`}>
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-accent to-accent3"
        initial={animate ? { width: 0 } : { width: `${value}%` }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
      />
    </div>
  );
}

/* ── Star Rating ── */
export function StarRating({ rating, max = 5, size = 'sm' }) {
  const sz = size === 'sm' ? 'text-xs' : 'text-sm';
  return (
    <span className={`${sz} text-amber-400`}>
      {'★'.repeat(Math.floor(rating))}{'☆'.repeat(max - Math.floor(rating))}
      <span className="text-white/40 ml-1">{rating.toFixed(1)}</span>
    </span>
  );
}

/* ── Empty State ── */
export function EmptyState({ icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="text-5xl mb-4">{icon || '📭'}</div>
      <h3 className="font-head font-bold text-lg mb-2">{title}</h3>
      {description && <p className="text-white/40 text-sm mb-6 max-w-xs">{description}</p>}
      {action}
    </motion.div>
  );
}

/* ── Stat Card ── */
export function StatCard({ label, value, icon: Icon, color = '#5b6af5', delta, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="card p-5"
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-white/40 uppercase tracking-widest">{label}</p>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center border"
          style={{ background: `${color}18`, borderColor: `${color}28`, color }}
        >
          {Icon && <Icon size={16} />}
        </div>
      </div>
      <p className="font-head font-extrabold text-2xl text-white">{value}</p>
      {delta !== undefined && (
        <p className={`text-xs mt-1 ${delta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {delta >= 0 ? '↑' : '↓'} {Math.abs(delta)}% vs last month
        </p>
      )}
    </motion.div>
  );
}

/* ── Section Header ── */
export function SectionHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`flex items-center justify-between mb-5 ${className}`}>
      <div>
        <h2 className="font-head font-bold text-xl tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-white/40 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/* ── Badge ── */
export function Badge({ children, variant = 'blue', className = '' }) {
  return (
    <span className={`badge badge-${variant} ${className}`}>{children}</span>
  );
}

/* ── Tabs ── */
export function Tabs({ tabs, active, onChange, className = '' }) {
  return (
    <div className={`flex gap-1 bg-white/[0.04] rounded-xl p-1 w-fit ${className}`}>
      {tabs.map(t => (
        <button
          key={t.value || t}
          onClick={() => onChange(t.value || t)}
          className={`tab ${active === (t.value || t) ? 'active' : ''}`}
        >
          {t.label || t}
        </button>
      ))}
    </div>
  );
}

/* ── Modal ── */
export function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) {
  if (!isOpen) return null;
  return (
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={`bg-bg3 border border-white/[0.12] rounded-3xl w-full ${maxWidth} max-h-[90vh] overflow-y-auto shadow-2xl`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
          <h3 className="font-head font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/[0.06] text-white/40 hover:text-white transition-colors">
            ✕
          </button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </motion.div>
  );
}

/* ── Input ── */
export function Input({ label, error, className = '', ...props }) {
  return (
    <div>
      {label && <label className="label">{label}</label>}
      <input className={`input ${error ? 'border-red-500/50 focus:border-red-500' : ''} ${className}`} {...props} />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

/* ── Textarea ── */
export function Textarea({ label, error, className = '', ...props }) {
  return (
    <div>
      {label && <label className="label">{label}</label>}
      <textarea className={`input resize-none ${error ? 'border-red-500/50' : ''} ${className}`} {...props} />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

/* ── Confirm dialog ── */
export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, danger = false }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-sm">
      <p className="text-white/60 text-sm mb-6">{message}</p>
      <div className="flex gap-3">
        <button className="btn btn-ghost flex-1 justify-center" onClick={onClose}>Cancel</button>
        <button
          className={`btn flex-1 justify-center ${danger ? 'btn-danger' : 'btn-primary'}`}
          onClick={() => { onConfirm(); onClose(); }}
        >
          Confirm
        </button>
      </div>
    </Modal>
  );
}
