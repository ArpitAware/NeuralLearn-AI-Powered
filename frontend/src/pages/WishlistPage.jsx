import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, X, ArrowRight, Star, Clock, Users, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useCartStore from '../store/cartStore';
import { formatNumber } from '../components/common/utils';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart, removeFromCart, isInCart } = useCartStore();
  const navigate = useNavigate();

  const addAllToCart = () => {
    let added = 0;
    wishlist.forEach(course => {
      if (!isInCart(course._id)) {
        addToCart(course);
        added++;
      }
    });
    if (added > 0) toast.success(`Added ${added} course${added > 1 ? 's' : ''} to cart!`);
    else toast('All courses already in cart', { icon: 'ℹ️' });
  };

  if (wishlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <div className="text-7xl mb-4">💔</div>
        </motion.div>
        <h3 className="font-head font-bold text-xl mb-2">Your wishlist is empty</h3>
        <p className="text-white/40 text-sm mb-6 max-w-xs">
          Browse courses and tap the ❤️ button to save them here for later.
        </p>
        <Link to="/courses" className="btn btn-primary btn-sm">
          Browse Courses <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="font-head font-bold text-2xl flex items-center gap-2">
            <Heart size={22} className="text-red-400" fill="currentColor" />
            Wishlist
          </h2>
          <p className="text-white/40 text-sm mt-0.5">
            {wishlist.length} saved course{wishlist.length > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={addAllToCart} className="btn btn-primary btn-sm">
            <ShoppingCart size={14} /> Add All to Cart
          </button>
          <Link to="/courses" className="btn btn-ghost btn-sm">
            Browse More
          </Link>
        </div>
      </div>

      {/* Course grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence>
          {wishlist.map((course, i) => {
            const inCart = isInCart(course._id);
            return (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.06 }}
                className="card overflow-hidden group"
                whileHover={{ y: -4 }}
              >
                {/* Thumbnail */}
                <div
                  className="relative h-40 overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/courses/${course.slug}`)}
                >
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-accent/20 to-accent2/10 flex items-center justify-center">
                      <span className="text-4xl opacity-20">📚</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />

                  {/* Category badge */}
                  {course.category && (
                    <span className="badge badge-blue absolute top-3 left-3 text-[10px]">
                      {course.category}
                    </span>
                  )}

                  {/* Remove from wishlist */}
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      toggleWishlist(course);
                      toast('Removed from wishlist', { icon: '💔' });
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500/80 text-white flex items-center justify-center hover:bg-red-500 transition-colors"
                    title="Remove from wishlist"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Body */}
                <div className="p-4">
                  <h3
                    className="font-head font-bold text-sm leading-snug mb-1 line-clamp-2 cursor-pointer hover:text-accent transition-colors"
                    onClick={() => navigate(`/courses/${course.slug}`)}
                  >
                    {course.title}
                  </h3>
                  <p className="text-xs text-white/40 mb-2">{course.instructor?.name || 'Instructor'}</p>

                  <div className="flex items-center gap-3 text-xs text-white/30 mb-3">
                    {course.duration && (
                      <span className="flex items-center gap-1"><Clock size={10} />{course.duration}</span>
                    )}
                    {course.totalStudents > 0 && (
                      <span className="flex items-center gap-1"><Users size={10} />{formatNumber(course.totalStudents)}</span>
                    )}
                    {course.rating > 0 && (
                      <span className="flex items-center gap-1 text-amber-400">
                        <Star size={10} fill="currentColor" />{course.rating?.toFixed(1)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-head font-black text-xl text-accent flex-1">
                      ₹{course.price?.toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => {
                        if (inCart) {
                          removeFromCart(course._id);
                          toast('Removed from cart', { icon: '🗑️' });
                        } else {
                          addToCart(course);
                          toast.success('Added to cart!');
                        }
                      }}
                      className={`btn btn-sm rounded-xl flex-1 justify-center ${inCart ? 'btn-success' : 'btn-primary'}`}
                    >
                      {inCart
                        ? <><CheckCircle2 size={13} /> In Cart</>
                        : <><ShoppingCart size={13} /> Add to Cart</>
                      }
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Summary footer */}
      {wishlist.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="mt-8 card p-5 flex flex-wrap items-center justify-between gap-4"
          style={{ background: 'linear-gradient(135deg,rgba(239,68,68,0.06),rgba(91,106,245,0.04))', borderColor: 'rgba(239,68,68,0.15)' }}
        >
          <div className="flex items-center gap-3">
            <Heart size={20} className="text-red-400" fill="currentColor" />
            <div>
              <p className="font-semibold text-sm">{wishlist.length} course{wishlist.length > 1 ? 's' : ''} saved</p>
              <p className="text-white/40 text-xs">
                Total value: ₹{wishlist.reduce((s, c) => s + (c.price || 0), 0).toLocaleString('en-IN')}
              </p>
            </div>
          </div>
          <button onClick={addAllToCart} className="btn btn-primary btn-sm">
            <ShoppingCart size={14} /> Add All to Cart
          </button>
        </motion.div>
      )}
    </div>
  );
}
