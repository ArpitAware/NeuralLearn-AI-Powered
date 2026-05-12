/**
 * pages/public/PricingPage.jsx - Updated with monetizable feature tiers
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../../components/home/PublicNavbar';
import { FiCheck, FiArrowRight, FiX, FiZap, FiShield, FiPieChart, FiUsers, FiStar, FiDownload, FiBell, FiRepeat, FiFileText } from 'react-icons/fi';

function useScrollReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const PLANS = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    desc: 'Everything you need to start tracking your money.',
    badge: null,
    color: 'border-gray-800',
    btnClass: 'bg-white/10 text-white hover:bg-white/15 border border-white/20',
    btnTo: '/register',
    btnLabel: 'Get Started Free',
    features: [
      { label: 'Unlimited expenses', included: true },
      { label: '10 expense categories', included: true },
      { label: 'Dashboard with 3 chart types', included: true },
      { label: 'Monthly budget limits', included: true },
      { label: 'Budget alert thresholds', included: true },
      { label: 'CSV export', included: true },
      { label: 'Full-text search & filters', included: true },
      { label: '8 currency support incl. ₹ INR', included: true },
      { label: 'Dark / light mode', included: true },
      { label: 'PDF financial reports', included: false },
      { label: 'Bill reminders (email)', included: false },
      { label: 'Recurring expense detection', included: false },
      { label: 'Family shared budget', included: false },
      { label: 'Savings goals tracker', included: false },
    ],
  },
  {
    name: 'Pro',
    price: '₹149',
    period: '/month',
    desc: 'For serious budgeters who want deeper insights.',
    badge: 'Most Popular',
    color: 'border-indigo-500',
    btnClass: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-xl hover:shadow-indigo-500/30',
    btnTo: '/register',
    btnLabel: 'Start Pro Free →',
    features: [
      { label: 'Everything in Free', included: true },
      { label: 'PDF monthly/yearly reports', included: true },
      { label: 'Bill reminders via email', included: true },
      { label: 'Recurring expense detection', included: true },
      { label: 'Savings goals tracker', included: true },
      { label: 'Financial health score', included: true },
      { label: 'Excel (.xlsx) export', included: true },
      { label: 'Unlimited budget categories', included: true },
      { label: 'Priority support', included: true },
      { label: 'Family shared budget', included: false },
      { label: 'Split expenses', included: false },
      { label: 'Multi-member access', included: false },
    ],
  },
  {
    name: 'Family',
    price: '₹299',
    period: '/month',
    desc: 'Share finances across up to 5 family members.',
    badge: 'Best Value',
    color: 'border-emerald-500/60',
    btnClass: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-xl hover:shadow-emerald-500/30',
    btnTo: '/register',
    btnLabel: 'Start Family Plan →',
    features: [
      { label: 'Everything in Pro', included: true },
      { label: 'Up to 5 family members', included: true },
      { label: 'Shared family budget pool', included: true },
      { label: 'Split expenses between members', included: true },
      { label: 'Per-member admin controls', included: true },
      { label: 'Family financial health score', included: true },
      { label: 'Combined spending reports', included: true },
      { label: 'Member expense approval', included: true },
    ],
  },
];

const COMING_FEATURES = [
  { icon: FiRepeat,    title: 'Recurring Detection',    desc: 'Automatically spots subscriptions from your expense patterns. Know exactly what you\'re paying every month.', badge: 'Pro', color: 'from-amber-500 to-orange-600' },
  { icon: FiFileText,  title: 'PDF Reports',             desc: 'Beautiful monthly and yearly financial report with charts, category breakdown, and savings rate. Perfect for CA filing.', badge: 'Pro', color: 'from-indigo-500 to-indigo-700' },
  { icon: FiBell,      title: 'Bill Reminders',          desc: 'Set due dates for EMIs, utilities, subscriptions. Get reminded 3 days before via email so you never miss a payment.', badge: 'Pro', color: 'from-rose-500 to-pink-600' },
  { icon: FiStar,      title: 'Financial Health Score',  desc: 'A score out of 100 based on savings rate, budget adherence, and spending trends. Gamify responsible spending.', badge: 'Pro', color: 'from-purple-500 to-violet-700' },
  { icon: FiUsers,     title: 'Family Shared Budget',    desc: 'Multiple members in one household, one shared budget. Each person adds expenses, everyone sees the combined view.', badge: 'Family', color: 'from-emerald-500 to-teal-600' },
  { icon: FiZap,       title: 'UPI SMS Auto-Import',     desc: 'Forward bank SMS messages and the app auto-creates expenses. Zero friction — the killer feature for India.', badge: 'Coming Soon', color: 'from-cyan-500 to-sky-600' },
];

const FEATURE_GROUPS = [
  {
    icon: FiPieChart, gradient:'from-emerald-500 to-teal-600',
    bg:'bg-emerald-500/5 border-emerald-500/15',
    title:'Expense Tracking',
    features:['Add, edit & delete expenses','Full-text search','Date & category filters','Payment method tracking','Notes & tags','Pagination support'],
  },
  {
    icon: FiZap, gradient:'from-indigo-500 to-blue-600',
    bg:'bg-indigo-500/5 border-indigo-500/15',
    title:'Dashboard & Analytics',
    features:['Monthly area chart','Category pie chart','Top categories bar chart','YTD totals & averages','Real-time aggregation','Refresh on demand'],
  },
  {
    icon: FiShield, gradient:'from-purple-500 to-violet-600',
    bg:'bg-purple-500/5 border-purple-500/15',
    title:'Budgeting',
    features:['Monthly budget limits','Per-category budgets','Animated progress bars','Threshold alerts (0–100%)','Spending vs limit live','Budget reset each month'],
  },
  {
    icon: FiUsers, gradient:'from-rose-500 to-pink-600',
    bg:'bg-rose-500/5 border-rose-500/15',
    title:'Account & Security',
    features:['JWT + refresh rotation','Bcrypt passwords','Profile customization','8 currency support','Dark/light/system theme','Rate limiting + Helmet'],
  },
  {
    icon: FiDownload, gradient:'from-amber-500 to-orange-600',
    bg:'bg-amber-500/5 border-amber-500/15',
    title:'Data & Export',
    features:['One-click CSV export','Full expense history','Sort by any field','No data limits','Date-range export','All fields included'],
  },
  {
    icon: FiStar, gradient:'from-cyan-500 to-sky-600',
    bg:'bg-cyan-500/5 border-cyan-500/15',
    title:'Developer Quality',
    features:['MVC architecture','express-validator inputs','Compound MongoDB indexes','Axios refresh interceptor','Lazy-loaded pages','Winston structured logs'],
  },
];

export default function PricingPage() {
  const [billing, setBilling] = useState('monthly');
  useScrollReveal();

  const yearlyPrice = (monthly) => {
    if (monthly === '₹0') return '₹0';
    const num = parseInt(monthly.replace('₹',''));
    return `₹${Math.round(num * 0.67)}`;
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <PublicNavbar />

      {/* Hero */}
      <section className="pt-28 pb-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background:'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(99,102,241,0.15) 0%, transparent 70%)' }} />
          <div className="animate-blob absolute top-20 left-1/4 w-72 h-72 bg-indigo-600/8 rounded-full blur-3xl" />
          <div className="animate-blob delay-2000 absolute top-20 right-1/4 w-64 h-64 bg-purple-600/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto">
          <div className="animate-slide-up inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2 text-indigo-400 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
            Simple, Transparent Pricing
          </div>
          <h1 className="animate-slide-up delay-100 text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
            Start free,<br />
            <span className="shimmer-text">upgrade when ready.</span>
          </h1>
          <p className="animate-slide-up delay-200 text-xl text-gray-500 max-w-2xl mx-auto">
            Every plan includes full expense tracking. Pro and Family unlock powerful tools for serious budgeters.
          </p>
        </div>
      </section>

      {/* Billing toggle */}
      <div className="flex justify-center mb-10 px-4">
        <div className="inline-flex bg-gray-900 border border-white/8 rounded-2xl p-1 gap-1">
          {['monthly','yearly'].map((b) => (
            <button key={b} onClick={() => setBilling(b)}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all capitalize ${
                billing === b ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'
              }`}>
              {b}
              {b === 'yearly' && <span className="ml-1.5 text-xs bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">Save 33%</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Pricing cards */}
      <section className="pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 reveal">
          {PLANS.map((plan) => (
            <div key={plan.name} className={`relative rounded-3xl border-2 ${plan.color} bg-gray-900 overflow-hidden ${plan.badge === 'Most Popular' ? 'shadow-2xl shadow-indigo-500/20 md:-mt-4 md:mb-4' : ''}`}>
              {plan.badge && (
                <div className={`flex justify-center py-2 ${plan.badge === 'Most Popular' ? 'bg-indigo-600' : 'bg-emerald-600'}`}>
                  <span className="text-white text-xs font-bold">{plan.badge}</span>
                </div>
              )}
              <div className="p-7">
                <h3 className="text-lg font-black text-white mb-1">{plan.name}</h3>
                <p className="text-gray-500 text-sm mb-5">{plan.desc}</p>

                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-5xl font-black text-white">
                    {billing === 'yearly' ? yearlyPrice(plan.price) : plan.price}
                  </span>
                  <span className="text-gray-500 text-sm">{billing === 'yearly' && plan.price !== '₹0' ? '/month · billed yearly' : plan.period}</span>
                </div>

                <Link to={plan.btnTo} className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-bold text-sm mb-6 transition-all hover:-translate-y-0.5 ${plan.btnClass}`}>
                  {plan.btnLabel}
                </Link>

                <hr className="border-white/5 mb-5" />

                <ul className="space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f.label} className="flex items-center gap-3 text-sm">
                      {f.included
                        ? <FiCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        : <FiX className="w-4 h-4 text-gray-700 flex-shrink-0" />
                      }
                      <span className={f.included ? 'text-gray-300' : 'text-gray-600'}>{f.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Coming features showcase */}
      <section className="py-20 px-4 sm:px-6" style={{background:'linear-gradient(180deg,rgba(99,102,241,0.04) 0%,transparent 100%)'}}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 reveal">
            <span className="text-indigo-400 text-sm font-bold uppercase tracking-widest">Premium Features</span>
            <h2 className="text-4xl font-black text-white mt-3 mb-3">What Pro unlocks</h2>
            <p className="text-gray-500">Features that make SpendWise worth paying for</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {COMING_FEATURES.map((f, i) => (
              <div key={f.title} className={`reveal delay-${(i%3+1)*100} group p-6 bg-gray-900 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all card-hover relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{background:'radial-gradient(circle at 50% 0%, rgba(99,102,241,0.08), transparent 70%)'}} />
                <div className="relative flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                    <f.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-white text-sm">{f.title}</h3>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                        f.badge === 'Pro' ? 'bg-indigo-500/20 text-indigo-400' :
                        f.badge === 'Family' ? 'bg-emerald-500/20 text-emerald-400' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>{f.badge}</span>
                    </div>
                    <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Everything in Free - feature grid */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 reveal">
            <h2 className="text-4xl font-black text-white mb-3">Everything in the Free plan</h2>
            <p className="text-gray-500">You get all of this without paying a single rupee</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURE_GROUPS.map((g, i) => (
              <div key={g.title} className={`reveal delay-${(i%3+1)*100} p-6 rounded-2xl border ${g.bg} card-hover`}>
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${g.gradient} flex items-center justify-center flex-shrink-0`}>
                    <g.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-white">{g.title}</h3>
                </div>
                <ul className="space-y-2">
                  {g.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-gray-400">
                      <FiCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />{f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 sm:px-6 max-w-3xl mx-auto">
        <div className="text-center mb-12 reveal">
          <h2 className="text-4xl font-black text-white">Frequently asked</h2>
        </div>
        <div className="space-y-3 reveal">
          {[
            { q:'Is the Free plan really free?', a:'Yes — completely free forever. No credit card, no feature limits, no upsells. The free plan includes unlimited expenses, all 3 chart types, budget tracking, and CSV export.' },
            { q:'When will Pro and Family plans launch?', a:'Pro and Family features (PDF reports, bill reminders, recurring detection, shared budgets) are in development. Sign up free now and you\'ll be notified when they launch.' },
            { q:'What payment methods will you accept?', a:'We plan to support UPI, credit/debit cards, and netbanking via Razorpay — the most convenient options for Indian users.' },
            { q:'Can I cancel anytime?', a:'Yes. No contracts, no cancellation fees. Cancel from your profile settings and you keep access until the end of your billing period.' },
            { q:'Is my data secure?', a:'Passwords are bcrypt-hashed, JWT uses refresh token rotation, the API has rate limiting, Helmet headers, and NoSQL injection protection.' },
          ].map(({ q, a }) => (
            <details key={q} className="group bg-gray-900 border border-white/5 rounded-2xl p-5 hover:border-indigo-500/20 transition-all">
              <summary className="font-semibold text-white cursor-pointer flex items-center justify-between list-none">
                {q}
                <span className="text-indigo-400 group-open:rotate-45 transition-transform text-2xl leading-none ml-4 flex-shrink-0">+</span>
              </summary>
              <p className="text-gray-500 text-sm mt-3 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center reveal">
        <div className="max-w-2xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden p-12" style={{background:'linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#4c1d95 100%)'}}>
            <div className="absolute inset-0 opacity-[0.05]"
              style={{ backgroundImage:'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize:'30px 30px' }} />
            <div className="relative">
              <h2 className="text-3xl font-black text-white mb-4">Start free today</h2>
              <p className="text-indigo-300 mb-8">Join 500+ users already tracking smarter. No credit card needed.</p>
              <Link to="/register" className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all hover:-translate-y-1">
                Create Free Account
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-8 px-4 text-center text-sm text-gray-700">
        <p>© 2025 SpendWise — Made with ❤️ in India 🇮🇳</p>
      </footer>
    </div>
  );
}
