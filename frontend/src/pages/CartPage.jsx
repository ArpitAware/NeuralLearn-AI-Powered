import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2, ShoppingCart, ArrowRight, Tag, CheckCircle2,
  Lock, CreditCard, Loader2, BookOpen, Clock, Users
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import { coursesAPI } from '../services/api';

const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script       = document.createElement('script');
    script.src         = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload      = () => resolve(true);
    script.onerror     = () => resolve(false);
    document.body.appendChild(script);
  });

export default function CartPage() {
  const { cartItems, removeFromCart, clearCart, cartTotal } = useCartStore();
  const { user }   = useAuthStore();
  const navigate   = useNavigate();
  const qc         = useQueryClient();
  const [coupon,    setCoupon]    = useState('');
  const [discount,  setDiscount]  = useState(0);
  const [couponMsg, setCouponMsg] = useState('');
  const [paying,    setPaying]    = useState(false);

  const total    = cartTotal();
  const finalAmt = Math.max(0, total - discount);

  const enrollAll = async () => {
    const results = await Promise.allSettled(
      cartItems.map(c => coursesAPI.enroll(c._id))
    );
    return {
      enrolled: results.filter(r => r.status === 'fulfilled').length,
      already:  results.filter(r => r.status === 'rejected').length,
    };
  };

  const applyCoupon = () => {
    const COUPONS = { NEURAL10: 10, LEARN20: 20, ARPIT50: 50 };
    const code    = coupon.trim().toUpperCase();
    if (COUPONS[code]) {
      const off = Math.round(total * COUPONS[code] / 100);
      setDiscount(off);
      setCouponMsg(`"${code}" applied — ${COUPONS[code]}% off ($${off} saved)`);
    } else {
      setDiscount(0);
      setCouponMsg('Invalid coupon code');
    }
  };

  const handlePayment = async () => {
    if (cartItems.length === 0) return;

    if (finalAmt === 0) {
      setPaying(true);
      try {
        const { enrolled } = await enrollAll();
        clearCart();
        qc.invalidateQueries(['my-progress']);
        qc.invalidateQueries(['student-analytics']);
        toast.success(`Enrolled in ${enrolled} course${enrolled > 1 ? 's' : ''}! 🎉`);
        navigate('/dashboard');
      } catch { toast.error('Enrollment failed'); }
      finally  { setPaying(false); }
      return;
    }

    setPaying(true);
    const loaded = await loadRazorpay();
    if (!loaded) {
      toast.error('Payment gateway failed to load.');
      setPaying(false);
      return;
    }

    // ⚠️  Replace with your Razorpay test key from dashboard.razorpay.com
    const RAZORPAY_KEY_ID = 'rzp_test_Si5CiDLRkRsDyW';

    const options = {
      key:         RAZORPAY_KEY_ID,
      amount:      Math.round(finalAmt * 100),
      currency:    'INR',
      name:        'NeuralLearn',
      description: `${cartItems.length} Course${cartItems.length > 1 ? 's' : ''}`,
      image:       'https://ui-avatars.com/api/?name=N&background=5b6af5&color=fff&bold=true',
      prefill: {
        name:  user?.name  || '',
        email: user?.email || '',
      },
      theme: { color: '#5b6af5' },
      handler: async (response) => {
        try {
          const { enrolled } = await enrollAll();
          clearCart();
          qc.invalidateQueries(['my-progress']);
          qc.invalidateQueries(['student-analytics']);
          toast.success(`Payment successful! Enrolled in ${enrolled} course${enrolled > 1 ? 's' : ''}! 🎉`);
          navigate('/dashboard');
        } catch {
          toast.error('Payment done but enrollment failed. Contact support.');
        } finally {
          setPaying(false);
        }
      },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => {
        setPaying(false);
        toast.error('Payment failed. Please try again.');
      });
      rzp.open();
      rzp.on('modal.ondismiss', () => {
        setPaying(false);
      });
    } catch {
      setPaying(false);
      toast.error('Could not open payment window.');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h3 className="font-head font-bold text-xl mb-2">Your cart is empty</h3>
        <p className="text-white/40 text-sm mb-6">Browse courses and add them to get started.</p>
        <Link to="/courses" className="btn btn-primary btn-sm">
          Browse Courses <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="font-head font-bold text-2xl">Shopping Cart</h2>
          <p className="text-white/40 text-sm mt-0.5">
            {cartItems.length} course{cartItems.length > 1 ? 's' : ''} in your cart
          </p>
        </div>
        <button onClick={() => { clearCart(); toast('Cart cleared', { icon: '🗑️' }); }}
          className="btn btn-ghost btn-sm text-red-400 hover:text-red-300">
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          <AnimatePresence>
            {cartItems.map((course, i) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.05 }}
                className="card p-3 sm:p-4 flex gap-3 sm:gap-4 items-start"
              >
                {course.thumbnail
                  ? <img src={course.thumbnail} alt={course.title}
                      className="w-24 h-16 object-cover rounded-xl flex-shrink-0" />
                  : <div className="w-24 h-16 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <BookOpen size={20} className="text-accent/50" />
                    </div>
                }
                <div className="flex-1 min-w-0">
                  <h4 className="font-head font-bold text-sm line-clamp-2 mb-1">{course.title}</h4>
                  <p className="text-white/40 text-xs mb-2">{course.instructor?.name || 'Instructor'}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {course.category && <span className="badge badge-blue text-[9px]">{course.category}</span>}
                    {course.level    && <span className="badge badge-purple text-[9px]">{course.level}</span>}
                    {course.duration && (
                      <span className="flex items-center gap-1 text-[10px] text-white/30">
                        <Clock size={9} />{course.duration}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className="font-head font-black text-xl text-accent">₹{course.price}</span>
                  <button
                    onClick={() => { removeFromCart(course._id); toast('Removed from cart', { icon: '🗑️' }); }}
                    className="btn btn-ghost btn-sm btn-icon text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <div className="card p-6">
            <h3 className="font-head font-bold text-base mb-5">Order Summary</h3>

            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Subtotal ({cartItems.length} courses)</span>
                <span className="font-semibold">₹{total.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-400">Coupon Discount</span>
                  <span className="text-emerald-400 font-semibold">-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-white/[0.08] pt-3 flex justify-between">
                <span className="font-head font-bold">Total</span>
                <span className="font-head font-black text-2xl text-accent">₹{finalAmt.toFixed(2)}</span>
              </div>
            </div>

            {/* Coupon */}
            <div className="mb-5">
              <label className="label">Coupon Code</label>
              <div className="flex gap-2">
                <input
                  className="input flex-1 text-sm"
                  placeholder="e.g. NEURAL10"
                  value={coupon}
                  onChange={e => setCoupon(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                />
                <button onClick={applyCoupon} className="btn btn-ghost btn-sm flex-shrink-0">
                  <Tag size={14} /> Apply
                </button>
              </div>
              {couponMsg && (
                <p className={`text-xs mt-1.5 ${!couponMsg.includes('Invalid') ? 'text-emerald-400' : 'text-red-400'}`}>
                  {!couponMsg.includes('Invalid') ? '✓ ' : '✕ '}{couponMsg}
                </p>
              )}
              <p className="text-[10px] text-white/20 mt-1.5">Try: NEURAL10, LEARN20, ARPIT50</p>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePayment}
              disabled={paying}
              className="btn btn-primary w-full justify-center py-3 text-base"
              style={{ animation: 'glowPulse 2s ease infinite' }}
            >
              {paying
                ? <span className="flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> Processing...</span>
                : <><CreditCard size={16} /> {finalAmt === 0 ? 'Enroll Free' : `Pay ₹${finalAmt.toFixed(2)}`}</>
              }
            </button>

            <div className="flex items-center justify-center gap-4 mt-4">
              <span className="flex items-center gap-1.5 text-white/30 text-xs"><Lock size={10} /> Secure</span>
              <span className="text-white/10">|</span>
              <span className="flex items-center gap-1.5 text-white/30 text-xs"><CheckCircle2 size={10} /> 30-day refund</span>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-amber-500/[0.08] border border-amber-500/20">
              <p className="text-amber-400 text-xs font-semibold mb-1">🧪 Test Mode</p>
              <p className="text-white/40 text-xs leading-relaxed">
                Card: <span className="font-mono">4111 1111 1111 1111</span><br />
                Expiry: any future date · CVV: any 3 digits
              </p>
            </div>
          </div>

          <div className="card p-5">
            <h4 className="font-head font-bold text-sm mb-3">What you get</h4>
            <div className="space-y-2">
              {['Lifetime course access','Certificate of completion','Downloadable resources','AI assistant support','Community access'].map(item => (
                <div key={item} className="flex items-center gap-2 text-xs text-white/50">
                  <CheckCircle2 size={12} className="text-emerald-400 flex-shrink-0" />{item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
