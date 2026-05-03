export const formatDistanceToNow = (date) => {
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

export const formatCurrency = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export const formatNumber = (n) =>
  new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(n);

export const levelColor = (level) => ({
  Beginner:     'badge-green',
  Intermediate: 'badge-amber',
  Advanced:     'badge-red',
}[level] || 'badge-blue');

export const categoryColor = (cat) => ({
  'AI/ML':        'badge-purple',
  'Web Dev':      'badge-blue',
  'Design':       'badge-cyan',
  'Data Science': 'badge-amber',
  'Blockchain':   'badge-amber',
  'Cloud':        'badge-cyan',
  'Mobile':       'badge-green',
  'DevOps':       'badge-red',
}[cat] || 'badge-blue');

export const clsx = (...args) => args.filter(Boolean).join(' ');
