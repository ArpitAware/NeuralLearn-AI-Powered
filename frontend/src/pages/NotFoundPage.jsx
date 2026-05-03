import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-96 h-96 rounded-full bg-accent/8 blur-3xl top-0 right-0 animate-blob" />
        <div className="absolute w-80 h-80 rounded-full bg-accent2/8 blur-3xl bottom-10 left-0 animate-blob" style={{ animationDelay: '-3s' }} />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(91,106,245,1) 1px, transparent 1px), linear-gradient(90deg, rgba(91,106,245,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center relative z-10"
      >
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="text-[120px] leading-none mb-6 select-none"
        >
          🌌
        </motion.div>
        <h1 className="font-head font-black text-8xl grad-text mb-4">404</h1>
        <h2 className="font-head font-bold text-2xl mb-3">Page Not Found</h2>
        <p className="text-white/40 text-base mb-10 max-w-sm mx-auto">
          Looks like this page drifted into the void. Let's get you back on track.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/" className="btn btn-primary btn-lg">
            <Home size={18} /> Go Home
          </Link>
          <button onClick={() => window.history.back()} className="btn btn-ghost btn-lg">
            <ArrowLeft size={18} /> Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}
