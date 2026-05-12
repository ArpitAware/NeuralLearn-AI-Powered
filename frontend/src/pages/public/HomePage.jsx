/**
 * pages/public/HomePage.jsx - PREMIUM v6
 * Added: 3D iPhone section, MacBook responsiveness section, premium feature showcase
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import { expenseAPI } from '../../services/api';
import PublicNavbar from '../../components/home/PublicNavbar';
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  FiTrendingUp, FiShield, FiZap, FiPieChart, FiBell,
  FiDownload, FiStar, FiArrowRight, FiCheck, FiGrid,
  FiSmartphone, FiMonitor, FiLock, FiRefreshCw,
} from 'react-icons/fi';

function useScrollReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll('.reveal,.reveal-left').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function use3DTilt(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(600px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) scale(1.02)`;
    };
    const onLeave = () => { el.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) scale(1)'; };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
  }, [ref]);
}

const DEMO_MONTHS = [
  {name:'J',total:8200},{name:'F',total:12400},{name:'M',total:9800},
  {name:'A',total:15600},{name:'M',total:11200},{name:'J',total:18900},
  {name:'J',total:14300},{name:'A',total:22100},{name:'S',total:16800},
  {name:'O',total:25400},{name:'N',total:19200},{name:'D',total:28700},
];
const DEMO_CATS = [
  {category:'Food & Dining',total:28400},
  {category:'Transport',total:15200},
  {category:'Shopping',total:22800},
  {category:'Bills',total:18600},
  {category:'Entertainment',total:9400},
];
const COLORS = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981'];
const MONTHS_FULL = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const FEATURES = [
  { icon: FiPieChart,   color:'from-indigo-500 to-indigo-700',  title:'Smart Dashboard',    desc:'Real-time charts update as you add expenses. Area charts, pie charts, and bar charts give you complete clarity.' },
  { icon: FiShield,     color:'from-purple-500 to-purple-700',  title:'Budget Alerts',       desc:'Set monthly limits per category. Get alerted at your chosen threshold — 70%, 80%, or 90%. You decide.' },
  { icon: FiTrendingUp, color:'from-pink-500 to-rose-600',      title:'Expense Tracking',    desc:'10 categories, UPI/card/cash tracking, notes, tags, full-text search and powerful date-range filters.' },
  { icon: FiZap,        color:'from-amber-500 to-orange-600',   title:'Instant Insights',    desc:'MongoDB aggregation pipelines compute your year-over-year trends and category breakdowns in milliseconds.' },
  { icon: FiDownload,   color:'from-emerald-500 to-teal-600',   title:'CSV Export',          desc:'Download your complete expense history as CSV. Filter by date range before exporting for custom reports.' },
  { icon: FiBell,       color:'from-cyan-500 to-sky-600',       title:'Live Budget Status',  desc:'Animated progress bars show spending vs limit in real time. Red when over, amber when warning, green when safe.' },
];

const TESTIMONIALS = [
  { name:'Arjun Mehta', role:'Software Engineer, Bangalore', text:'The dashboard is stunning. Charts update live and INR support just works. I use it every single day.', rating:5 },
  { name:'Priya Sharma', role:'Freelance Designer, Mumbai', text:'Budget alerts literally saved me ₹8,000 last month. The UI is so clean, feels like a premium app.', rating:5 },
  { name:'Rohit Verma', role:'MBA Student, Delhi', text:'Best MERN project I\'ve seen. Clean code, real features. The animated landing page is portfolio-worthy.', rating:5 },
];

const TICKER = ['₹ Track Every Rupee','📊 Live Charts','🔒 JWT Auth','📱 Mobile First','💰 Budget Alerts','📤 CSV Export','🌙 Dark Mode','⚡ Real-time','🏷️ 10 Categories','🔍 Smart Search','🎯 Budget Goals','💳 UPI Support'];

// Mobile feature screens for iPhone mockup
const MOBILE_SCREENS = [
  {
    label: 'Add Expense',
    icon: '➕',
    color: 'from-indigo-600 to-purple-700',
    content: (
      <div className="p-3 space-y-2">
        <div className="bg-white/10 rounded-xl p-2.5">
          <div className="text-white/50 text-[9px] mb-1">Title</div>
          <div className="text-white text-xs font-medium">Lunch at Cafe</div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/10 rounded-xl p-2.5">
            <div className="text-white/50 text-[9px] mb-1">Amount</div>
            <div className="text-white text-xs font-bold">₹340</div>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5">
            <div className="text-white/50 text-[9px] mb-1">Category</div>
            <div className="text-white text-xs font-medium">🍔 Food</div>
          </div>
        </div>
        <div className="bg-white/10 rounded-xl p-2.5">
          <div className="text-white/50 text-[9px] mb-1">Payment</div>
          <div className="text-white text-xs font-medium">💳 UPI</div>
        </div>
        <div className="w-full py-2 bg-white rounded-xl text-indigo-700 text-xs font-bold text-center mt-2">
          Add Expense ✓
        </div>
      </div>
    ),
  },
  {
    label: 'Dashboard',
    icon: '📊',
    color: 'from-purple-600 to-pink-700',
    content: (
      <div className="p-3 space-y-2">
        <div className="grid grid-cols-2 gap-1.5">
          <div className="bg-indigo-500/40 rounded-xl p-2 text-center">
            <div className="text-white text-xs font-black">₹12,450</div>
            <div className="text-white/60 text-[8px]">This Month</div>
          </div>
          <div className="bg-purple-500/40 rounded-xl p-2 text-center">
            <div className="text-white text-xs font-black">₹84,320</div>
            <div className="text-white/60 text-[8px]">Total Spent</div>
          </div>
        </div>
        <div className="bg-white/10 rounded-xl p-2">
          <div className="text-white/60 text-[8px] mb-1">Monthly</div>
          <div className="flex items-end gap-0.5 h-8">
            {[30,55,40,70,45,90,60,80,50,75,40,65].map((h,i) => (
              <div key={i} className="flex-1 rounded-t" style={{height:`${h}%`, background: i===9 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.25)'}} />
            ))}
          </div>
        </div>
        <div className="space-y-1">
          {[['Food','₹4,200','68%'],['Transport','₹1,800','29%']].map(([cat,amt,pct]) => (
            <div key={cat} className="flex items-center gap-2">
              <span className="text-white/60 text-[8px] w-12">{cat}</span>
              <div className="flex-1 h-1 bg-white/15 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-400 rounded-full" style={{width:pct}} />
              </div>
              <span className="text-white text-[8px] font-medium">{amt}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    label: 'Budget',
    icon: '🎯',
    color: 'from-emerald-600 to-teal-700',
    content: (
      <div className="p-3 space-y-2">
        <div className="text-white text-xs font-bold mb-1">May 2026 Budgets</div>
        {[
          {cat:'Food & Dining', spent:4200, limit:5000, pct:84, color:'text-amber-400'},
          {cat:'Shopping', spent:2100, limit:3000, pct:70, color:'text-emerald-400'},
          {cat:'Transport', spent:800, limit:2000, pct:40, color:'text-emerald-400'},
        ].map(b => (
          <div key={b.cat} className="bg-white/10 rounded-xl p-2">
            <div className="flex justify-between text-[8px] mb-1">
              <span className="text-white/80">{b.cat}</span>
              <span className={b.color}>{b.pct}%</span>
            </div>
            <div className="h-1.5 bg-white/15 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{width:`${b.pct}%`, background: b.pct >= 80 ? '#f59e0b' : '#10b981'}} />
            </div>
            <div className="flex justify-between text-[7px] mt-0.5 text-white/50">
              <span>₹{b.spent.toLocaleString()}</span>
              <span>₹{b.limit.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    ),
  },
];

function AnimatedNumber({ target, prefix='', suffix='' }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = target / 60;
        const t = setInterval(() => {
          start += step;
          if (start >= target) { setVal(target); clearInterval(t); }
          else setVal(Math.floor(start));
        }, 16);
        io.disconnect();
      }
    }, { threshold: 0.5 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [target]);
  return <span ref={ref}>{prefix}{val.toLocaleString('en-IN')}{suffix}</span>;
}

function LiveDashboard({ stats, formatAmount }) {
  const totalSpent = stats?.totals?.totalSpent || 0;
  const thisMonth = stats?.monthly?.find(m => m.month === new Date().getMonth() + 1)?.total || 0;
  const totalCount = stats?.totals?.totalExpenses || 0;
  const monthlyData = MONTHS_FULL.map((name, i) => {
    const found = stats?.monthly?.find(m => m.month === i + 1);
    return { name, total: found?.total || 0 };
  });
  const byCategory = stats?.byCategory || [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {[
          { label:'Total Spent', val: formatAmount(totalSpent), color:'from-indigo-600 to-indigo-800' },
          { label:'This Month',  val: formatAmount(thisMonth),  color:'from-purple-600 to-purple-800' },
        ].map((c) => (
          <div key={c.label} className={`p-5 rounded-2xl bg-gradient-to-br ${c.color} shadow-lg animate-float delay-${c.label==='Total Spent'?'100':'200'}`}>
            <div className="text-2xl mb-1">{c.label==='Total Spent'?'💸':'📅'}</div>
            <div className="text-xl font-black text-white">{c.val}</div>
            <div className="text-white/60 text-xs mt-0.5">{c.label}</div>
          </div>
        ))}
      </div>
      {totalCount > 0 ? (
        <>
          <div className="bg-gray-800/60 rounded-2xl p-4">
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-3">Monthly Spending {new Date().getFullYear()}</p>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tick={{ fontSize:10, fill:'#6b7280' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => [formatAmount(v),'Spent']} contentStyle={{ background:'#1f2937', border:'none', borderRadius:12, fontSize:12 }} />
                <Area type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={2} fill="url(#lg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {byCategory.length > 0 && (
            <div className="bg-gray-800/60 rounded-2xl p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-3">By Category</p>
              <div className="space-y-2">
                {byCategory.slice(0,2).map((c,i) => (
                  <div key={c.category} className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{background:COLORS[i]}} />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-700 dark:text-gray-300 truncate">{c.category}</span>
                        <span className="text-gray-900 dark:text-white font-semibold ml-2">{formatAmount(c.total)}</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width:`${Math.min(100,(c.total/byCategory[0].total)*100)}%`, background:COLORS[i] }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <Link to="/dashboard" className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-sm font-semibold transition group">
            <FiGrid className="w-4 h-4" />
            Open Full Dashboard
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </>
      ) : (
        <div className="bg-gray-100 dark:bg-gray-800/60 rounded-2xl p-6 text-center">
          <span className="text-3xl block mb-2">💸</span>
          <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">No expenses yet</p>
          <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">Add your first expense to see live charts here</p>
          <Link to="/expenses" className="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-500 transition">
            Add Expense →
          </Link>
        </div>
      )}
    </div>
  );
}

function DemoPreview() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive(i => (i+1)%12), 1200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {[
          { label:'Total Spent', val:'₹84,320', color:'from-indigo-600 to-indigo-800', emoji:'💸' },
          { label:'This Month',  val:'₹12,450', color:'from-purple-600 to-purple-800', emoji:'📅' },
        ].map((c,i) => (
          <div key={c.label} className={`p-5 rounded-2xl bg-gradient-to-br ${c.color} shadow-lg animate-float delay-${(i+1)*100}`}>
            <div className="text-2xl mb-1">{c.emoji}</div>
            <div className="text-xl font-black text-white">{c.val}</div>
            <div className="text-white/60 text-xs mt-0.5">{c.label}</div>
          </div>
        ))}
      </div>
      <div className="bg-gray-100 dark:bg-gray-800/60 dark:backdrop-blur rounded-2xl p-4">
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-3">
          <span className="font-medium">Monthly Spending — {new Date().getFullYear()}</span>
          <span className="text-indigo-600 dark:text-indigo-400">This Year</span>
        </div>
        <div className="flex items-end gap-1.5 h-20">
          {DEMO_MONTHS.map((m,i) => (
            <div key={m.name} className="flex-1 flex flex-col items-center gap-1">
              <div className={`w-full rounded-t-md transition-all duration-500 ${
                i === active ? 'bg-indigo-500 shadow-lg shadow-indigo-500/40' : 'bg-gray-300 dark:bg-gray-700'
              }`} style={{ height:`${(m.total/28700)*100}%`, minHeight:4 }} />
            </div>
          ))}
        </div>
        <div className="flex mt-2">
          {DEMO_MONTHS.map((m,i) => (
            <span key={m.name} className={`flex-1 text-center text-[10px] transition-colors ${i === active ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-gray-400 dark:text-gray-600'}`}>{m.name}</span>
          ))}
        </div>
      </div>
      <Link to="/register" className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl text-sm font-bold hover:shadow-xl hover:shadow-indigo-500/30 transition-all group">
        Get Your Own Dashboard Free
        <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}

// ── iPhone screen content component ──────────────────────────────────────────
// FIX: Previously rendered a full phone shell (body, buttons, frame) which was placed
// INSIDE the iphone-frame in the section below — causing a "phone inside a phone" bug.
// Now it only renders screen contents that fill the iphone-screen container.
function IPhoneMockup() {
  const [activeScreen, setActiveScreen] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActiveScreen(i => (i+1) % MOBILE_SCREENS.length), 3000);
    return () => clearInterval(t);
  }, []);

  const screen = MOBILE_SCREENS[activeScreen];

  return (
    <div className="w-full h-full flex flex-col" style={{background:'linear-gradient(135deg, #0f0c29, #302b63, #24243e)'}}>
      {/* Dynamic Island */}
      <div className="relative flex justify-center pt-3 pb-1 flex-shrink-0">
        <div className="w-24 h-6 bg-black rounded-full flex items-center justify-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-gray-800" />
          <div className="w-1.5 h-1.5 rounded-full bg-gray-700" />
        </div>
      </div>

      {/* Status bar */}
      <div className="flex justify-between items-center px-5 pb-2 flex-shrink-0">
        <span className="text-white text-[8px] font-semibold">9:41</span>
        <div className="flex gap-1 items-center">
          <div className="flex gap-0.5 items-end">
            {[3,5,7,9].map((h,i) => <div key={i} className="w-0.5 rounded-sm bg-white" style={{height:`${h}px`}} />)}
          </div>
          <span className="text-white text-[7px] ml-1">100%</span>
        </div>
      </div>

      {/* App header */}
      <div className={`mx-3 mb-2 p-2.5 rounded-2xl bg-gradient-to-r ${screen.color} flex items-center justify-between flex-shrink-0`}>
        <div>
          <div className="text-white/60 text-[7px]">SpendWise</div>
          <div className="text-white text-[10px] font-bold">{screen.label}</div>
        </div>
        <span className="text-xl">{screen.icon}</span>
      </div>

      {/* Screen content */}
      <div className="flex-1 overflow-hidden transition-all duration-500">
        {screen.content}
      </div>

      {/* Screen selector dots */}
      <div className="flex justify-center gap-2 pb-3 pt-2 flex-shrink-0">
        {MOBILE_SCREENS.map((s, i) => (
          <button key={i} onClick={() => setActiveScreen(i)}
            className={`h-1.5 rounded-full transition-all ${i === activeScreen ? 'bg-indigo-400 w-5' : 'bg-white/30 w-1.5'}`} />
        ))}
      </div>

      {/* Home indicator */}
      <div className="flex justify-center pb-3 flex-shrink-0">
        <div className="w-20 h-1 bg-white/30 rounded-full" />
      </div>
    </div>
  );
}

// ── MacBook mockup component ─────────────────────────────────────────────────
function MacBookMockup() {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Glow */}
      <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full" />

      {/* MacBook lid */}
      <div className="relative rounded-t-2xl overflow-hidden shadow-2xl"
        style={{
          background: 'linear-gradient(145deg, #2a2a2a, #1a1a1a)',
          boxShadow: '0 0 0 1.5px rgba(255,255,255,0.08), 0 -2px 0 rgba(255,255,255,0.05)',
          paddingBottom: '62%',
        }}
      >
        {/* Camera notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gray-700 z-10" />

        {/* Screen bezel */}
        <div className="absolute inset-0 p-3">
          <div className="w-full h-full rounded-xl overflow-hidden bg-gray-950 flex flex-col">
            {/* macOS menu bar */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-900/80 border-b border-white/5 flex-shrink-0">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
              <div className="flex-1 mx-2 h-4 bg-white/5 rounded flex items-center px-2">
                <span className="text-gray-500 text-[8px]">spendwise.app/dashboard</span>
              </div>
              <div className="flex gap-1">
                {['←','→','↻'].map(c => <span key={c} className="text-gray-500 text-[9px]">{c}</span>)}
              </div>
            </div>

            {/* App UI inside MacBook */}
            <div className="flex flex-1 min-h-0 overflow-hidden">
              {/* Sidebar */}
              <div className="w-28 bg-gray-900 border-r border-white/5 flex-shrink-0 p-2">
                <div className="flex items-center gap-1.5 mb-3">
                  <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-[8px] font-black">₹</span>
                  </div>
                  <span className="text-white text-[9px] font-black">SpendWise</span>
                </div>
                {[
                  {icon:'▦', label:'Dashboard', active:true},
                  {icon:'≡', label:'Expenses',  active:false},
                  {icon:'◎', label:'Budget',    active:false},
                  {icon:'⊙', label:'Profile',   active:false},
                ].map(item => (
                  <div key={item.label} className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg mb-0.5 ${item.active ? 'bg-indigo-600' : ''}`}>
                    <span className={`text-[9px] ${item.active ? 'text-white' : 'text-gray-500'}`}>{item.icon}</span>
                    <span className={`text-[8px] font-medium ${item.active ? 'text-white' : 'text-gray-500'}`}>{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Main content */}
              <div className="flex-1 p-2 overflow-hidden">
                <div className="text-white text-[9px] font-bold mb-2">Dashboard</div>
                {/* Stat cards */}
                <div className="grid grid-cols-4 gap-1 mb-2">
                  {[
                    {l:'Total Spent',v:'₹84,320',c:'from-indigo-600 to-indigo-800'},
                    {l:'This Month',v:'₹12,450',c:'from-purple-600 to-purple-800'},
                    {l:'Expenses',v:'247',c:'from-amber-500 to-orange-600'},
                    {l:'Avg',v:'₹341',c:'from-rose-500 to-rose-700'},
                  ].map(s => (
                    <div key={s.l} className={`rounded-lg p-1.5 bg-gradient-to-br ${s.c}`}>
                      <div className="text-white text-[8px] font-black">{s.v}</div>
                      <div className="text-white/60 text-[6px]">{s.l}</div>
                    </div>
                  ))}
                </div>
                {/* Mini chart */}
                <div className="bg-gray-800/60 rounded-lg p-1.5 mb-1.5">
                  <div className="text-gray-400 text-[7px] mb-1">Monthly Spending</div>
                  <div className="flex items-end gap-0.5 h-8">
                    {[35,55,40,70,45,90,60,80,50,75,40,65].map((h,i) => (
                      <div key={i} className="flex-1 rounded-t-sm" style={{height:`${h}%`, background: i===9 ? '#6366f1' : 'rgba(99,102,241,0.25)'}} />
                    ))}
                  </div>
                </div>
                {/* Category bars */}
                <div className="bg-gray-800/60 rounded-lg p-1.5">
                  <div className="text-gray-400 text-[7px] mb-1">By Category</div>
                  {[['Food',68,'#6366f1'],['Transport',45,'#8b5cf6'],['Shopping',30,'#ec4899']].map(([cat,pct,color]) => (
                    <div key={cat} className="flex items-center gap-1 mb-0.5">
                      <span className="text-gray-500 text-[6px] w-10">{cat}</span>
                      <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{width:`${pct}%`, background:color}} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MacBook base/hinge */}
      <div className="relative h-2 rounded-b-sm mx-1"
        style={{background:'linear-gradient(145deg, #323232, #1f1f1f)', boxShadow:'0 2px 0 rgba(255,255,255,0.05)'}} />

      {/* MacBook bottom */}
      <div className="relative h-4 rounded-b-2xl mx-0"
        style={{background:'linear-gradient(145deg, #2a2a2a, #1a1a1a)', boxShadow:'0 4px 20px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)'}}>
        {/* Trackpad hint */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-16 h-2 bg-white/5 rounded" />
      </div>
    </div>
  );
}

export default function HomePage() {
  const { user } = useAuth();
  const { formatAmount } = useCurrency();
  const [stats, setStats] = useState(null);
  const card3dRef = useRef(null);
  useScrollReveal();
  use3DTilt(card3dRef);

  useEffect(() => {
    if (user) {
      expenseAPI.getStats({ year: new Date().getFullYear() })
        .then(({ data }) => setStats(data.data))
        .catch(() => {});
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-950">
      <PublicNavbar />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-clip pt-20">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0" style={{ background:'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.25) 0%, transparent 70%)' }} />
          <div className="animate-blob absolute top-40 left-20 w-96 h-96 bg-indigo-400/15 dark:bg-indigo-600/10 rounded-full blur-3xl" />
          <div className="animate-blob delay-3000 absolute top-60 right-20 w-80 h-80 bg-purple-400/15 dark:bg-purple-600/10 rounded-full blur-3xl" />
          <div className="animate-blob delay-2000 absolute bottom-20 left-1/2 w-72 h-72 bg-pink-400/10 dark:bg-pink-600/8 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage:'linear-gradient(rgba(99,102,241,1) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,1) 1px,transparent 1px)', backgroundSize:'60px 60px' }} />
          <div className="absolute inset-0" style={{ background:'radial-gradient(ellipse at center,transparent 40%,var(--bg-vignette,#030712) 100%)' }} className="dark:[--bg-vignette:#030712] [--bg-vignette:#f9fafb]" />
        </div>

        {/* Floating 3D icons */}
        <div className="absolute top-32 right-[10%] animate-float delay-100 opacity-20">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl shadow-2xl" style={{ transform:'perspective(400px) rotateY(-20deg) rotateX(10deg)' }}>💸</div>
        </div>
        <div className="absolute top-60 left-[8%] animate-float-slow delay-300 opacity-20">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xl shadow-2xl" style={{ transform:'perspective(400px) rotateY(15deg) rotateX(-8deg)' }}>📊</div>
        </div>
        <div className="absolute bottom-40 right-[15%] animate-float delay-500 opacity-15">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-xl shadow-2xl" style={{ transform:'perspective(400px) rotateY(20deg) rotateX(12deg)' }}>🎯</div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="mb-6 animate-fade-in">
              {user ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-sm font-medium">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  Welcome back, {user.name?.split(' ')[0]}! 👋
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-indigo-400 text-sm font-medium">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                  Free & Open Source — MERN Stack
                </div>
              )}
            </div>

            <h1 className="animate-slide-up delay-100 text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white leading-[1.05] mb-6">
              Track money.<br />
              <span className="shimmer-text">Live smarter.</span>
            </h1>

            <p className="animate-slide-up delay-200 text-lg text-gray-600 dark:text-gray-400 max-w-xl mb-10 leading-relaxed">
              {user
                ? `Your financial dashboard is ready. ${stats?.totals?.totalExpenses || 0} expenses tracked, ${stats?.byCategory?.length || 0} categories active.`
                : 'A beautiful expense tracker with live charts, budget alerts, INR support, and CSV export — built on the MERN stack. 100% free.'
              }
            </p>

            <div className="animate-slide-up delay-300 flex flex-col sm:flex-row gap-4 mb-12">
              {user ? (
                <>
                  <Link to="/dashboard" className="group flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl text-lg font-bold shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all hover:-translate-y-1">
                    <FiGrid className="w-5 h-5" />Open Dashboard<FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/expenses" className="flex items-center justify-center gap-2 px-8 py-4 glass text-white rounded-2xl text-lg font-semibold hover:bg-white/10 transition-all hover:-translate-y-1 border border-white/10">
                    + Add Expense
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="group flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl text-lg font-bold shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all hover:-translate-y-1">
                    Start for Free<FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/pricing" className="flex items-center justify-center gap-2 px-8 py-4 glass text-white rounded-2xl text-lg font-semibold hover:bg-white/10 transition-all hover:-translate-y-1 border border-white/10">
                    View Pricing
                  </Link>
                </>
              )}
            </div>

            <div className="animate-slide-up delay-400 flex flex-wrap gap-4">
              {['₹0 forever','JWT secured','INR + 8 currencies','Mobile-first'].map((b) => (
                <div key={b} className="flex items-center gap-1.5 text-gray-600 dark:text-gray-500 text-sm">
                  <FiCheck className="w-3.5 h-3.5 text-emerald-500" /> {b}
                </div>
              ))}
            </div>
          </div>

          {/* 3D Dashboard Card */}
          <div className="animate-slide-up delay-300">
            <div ref={card3dRef} className="relative transition-transform duration-150" style={{ transformStyle:'preserve-3d' }}>
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 rounded-3xl blur-2xl" />
              <div className="relative glass-dark rounded-3xl p-6 shadow-2xl border border-indigo-500/20" style={{ transform:'translateZ(0)' }}>
                <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/5">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/70" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                  </div>
                  <div className="flex-1 mx-3 h-6 bg-white/5 rounded-lg flex items-center px-3">
                    <span className="text-gray-500 dark:text-gray-600 text-xs">spendwise.app/dashboard</span>
                  </div>
                </div>
                {user ? <LiveDashboard stats={stats} formatAmount={formatAmount} /> : <DemoPreview />}
              </div>
              <div className="absolute -top-4 -right-4 animate-float delay-200">
                <div className="glass-dark rounded-xl p-3 shadow-xl border border-emerald-500/20">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <span className="text-emerald-400 text-xs font-semibold">Budget on track</span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 animate-float-slow delay-400">
                <div className="glass-dark rounded-xl p-3 shadow-xl border border-indigo-500/20">
                  <div className="text-indigo-400 text-xs font-semibold">+₹2,400 saved this month 🎉</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER ──────────────────────────────────────────────────────── */}
      <div className="relative py-4 overflow-clip border-y border-gray-100 dark:border-white/5 bg-indigo-50 dark:bg-indigo-950/40">
        <div className="flex animate-ticker whitespace-nowrap">
          {[...TICKER,...TICKER].map((item,i) => (
            <span key={i} className="inline-flex items-center text-indigo-600 dark:text-gray-400 text-sm font-medium px-8">
              {item} <span className="ml-8 text-indigo-600">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── FEATURES — 3D Interactive Cards ────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" >
        <div className="text-center mb-16 reveal">
          <span className="text-indigo-600 dark:text-indigo-400 text-sm font-bold uppercase tracking-widest">Everything You Need</span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mt-3 mb-4">Built for real financial clarity</h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">One plan. No feature tiers. No hidden costs. Every feature from day one.</p>
        </div>

        {/* Feature showcase — alternating layout with phone mockups */}
        <div className="space-y-8">
          {/* Row 1: Dashboard — full width hero card */}
          <div className="reveal">
            <div className="feature-3d relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gray-900 p-8 md:p-12"
              style={{background:'linear-gradient(135deg,#0f0c29 0%,#1a1060 50%,#0f0c29 100%)'}}>
              <div className="absolute inset-0 opacity-[0.04]"
                style={{backgroundImage:'linear-gradient(rgba(99,102,241,1) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,1) 1px,transparent 1px)',backgroundSize:'40px 40px'}} />
              <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
              <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/15 border border-indigo-500/30 rounded-full text-indigo-400 text-xs font-bold mb-5">
                    <FiPieChart className="w-3.5 h-3.5" /> Feature 01
                  </div>
                  <h3 className="text-3xl font-black text-white mb-4">Smart Dashboard with Live Charts</h3>
                  <p className="text-gray-400 leading-relaxed mb-6">Your spending data visualized in 3 chart types — area chart for monthly trends, pie chart for category breakdown, and bar chart for top spenders. All update in real-time as you add expenses.</p>
                  <div className="flex flex-wrap gap-3">
                    {['Area Chart','Pie Chart','Bar Chart','Real-time','YTD Stats'].map(t => (
                      <span key={t} className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-300 text-xs font-medium">{t}</span>
                    ))}
                  </div>
                </div>
                {/* Mini dashboard preview */}
                <div className="bg-gray-900/80 rounded-2xl p-4 border border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white text-xs font-bold">Dashboard</span>
                    <span className="text-indigo-400 text-xs">Live</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[{l:'Total',v:'₹84,320',c:'from-indigo-600 to-indigo-800'},{l:'Month',v:'₹12,450',c:'from-purple-600 to-purple-800'},{l:'Avg',v:'₹341',c:'from-rose-500 to-rose-700'}].map(s => (
                      <div key={s.l} className={`p-2 rounded-xl bg-gradient-to-br ${s.c}`}>
                        <div className="text-white text-xs font-black">{s.v}</div>
                        <div className="text-white/60 text-[9px]">{s.l}</div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-800/80 rounded-xl p-3 mb-2">
                    <div className="text-gray-400 text-[9px] mb-2">Monthly Spending</div>
                    <div className="flex items-end gap-1 h-12">
                      {[35,55,40,70,45,90,60,80,50,88,40,65].map((h,i) => (
                        <div key={i} className="flex-1 rounded-t-sm transition-all"
                          style={{height:`${h}%`,background: i===9 ? '#6366f1' : 'rgba(99,102,241,0.3)'}} />
                      ))}
                    </div>
                    <div className="flex mt-1">
                      {['J','F','M','A','M','J','J','A','S','O','N','D'].map((m,i) => (
                        <span key={m} className={`flex-1 text-center text-[7px] ${i===9?'text-indigo-400 font-bold':'text-gray-600'}`}>{m}</span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {[['Food & Dining','68%','#6366f1'],['Transport','45%','#8b5cf6'],['Shopping','32%','#ec4899']].map(([cat,pct,color]) => (
                      <div key={cat} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{background:color}} />
                        <span className="text-gray-400 text-[9px] flex-1">{cat}</span>
                        <div className="w-20 h-1 bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{width:pct,background:color}} />
                        </div>
                        <span className="text-gray-400 text-[9px] w-7">{pct}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: 3 feature cards in a row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: FiShield, color:'from-purple-500 to-purple-700', num:'02',
                title:'Budget Alerts', badge:'bg-purple-500/10 border-purple-500/20 text-purple-400',
                desc:'Set monthly limits per category. Animated progress bars turn amber at 80%, red when over. Get alerted before you overspend.',
                preview: (
                  <div className="space-y-2 mt-3">
                    {[{cat:'Food',pct:84,color:'#f59e0b'},{cat:'Shopping',pct:52,color:'#10b981'},{cat:'Bills',pct:100,color:'#ef4444'}].map(b => (
                      <div key={b.cat} className="bg-gray-800/60 rounded-xl p-2.5">
                        <div className="flex justify-between text-[9px] mb-1.5">
                          <span className="text-gray-300">{b.cat}</span>
                          <span style={{color:b.color}} className="font-bold">{b.pct}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-700" style={{width:`${b.pct}%`,background:b.color}} />
                        </div>
                      </div>
                    ))}
                  </div>
                )
              },
              {
                icon: FiTrendingUp, color:'from-pink-500 to-rose-600', num:'03',
                title:'Expense Tracking', badge:'bg-pink-500/10 border-pink-500/20 text-pink-400',
                desc:'Add expenses in seconds. 10 categories, UPI/card/cash, full-text search, date filters, tags and notes.',
                preview: (
                  <div className="space-y-1.5 mt-3">
                    {[{t:'Lunch',c:'Food',a:'₹340',m:'UPI'},{t:'Uber',c:'Transport',a:'₹180',m:'Card'},{t:'Netflix',c:'Bills',a:'₹649',m:'Card'}].map(e => (
                      <div key={e.t} className="bg-gray-800/60 rounded-xl p-2.5 flex items-center justify-between">
                        <div>
                          <div className="text-white text-[10px] font-medium">{e.t}</div>
                          <div className="text-gray-500 text-[8px]">{e.c} · {e.m}</div>
                        </div>
                        <span className="text-white text-[10px] font-bold">{e.a}</span>
                      </div>
                    ))}
                  </div>
                )
              },
              {
                icon: FiDownload, color:'from-emerald-500 to-teal-600', num:'04',
                title:'CSV Export', badge:'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
                desc:'One click downloads all your expenses as a CSV. Filter by date range before exporting for custom reports.',
                preview: (
                  <div className="mt-3 bg-gray-800/60 rounded-xl p-3">
                    <div className="text-gray-400 text-[8px] mb-2 font-mono">expenses-2026.csv</div>
                    <div className="space-y-1">
                      {['title,amount,category,date','Lunch,340,Food,2026-05-09','Uber,180,Transport,2026-05-08','Netflix,649,Bills,2026-05-07'].map((row,i) => (
                        <div key={i} className={`font-mono text-[7px] ${i===0?'text-indigo-400':'text-gray-400'}`}>{row}</div>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center justify-center gap-1.5 py-1.5 bg-emerald-500/15 border border-emerald-500/20 rounded-lg">
                      <FiDownload className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 text-[9px] font-bold">Download CSV</span>
                    </div>
                  </div>
                )
              },
            ].map((f) => (
              <div key={f.title} className="feature-3d reveal group relative p-6 bg-gray-900 rounded-2xl border border-white/5 hover:border-indigo-500/30 overflow-hidden">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{background:'radial-gradient(circle at 50% 0%,rgba(99,102,241,0.1),transparent 70%)'}} />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <f.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${f.badge}`}>{f.num}</span>
                  </div>
                  <h3 className="font-bold text-white text-lg mb-2">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                  {f.preview}
                </div>
              </div>
            ))}
          </div>

          {/* Row 3: Security + Search side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="feature-3d reveal group relative p-7 bg-gray-900 rounded-2xl border border-white/5 hover:border-purple-500/30 overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 rounded-full blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                    <FiZap className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md border bg-amber-500/10 border-amber-500/20 text-amber-400">05</span>
                </div>
                <h3 className="font-bold text-white text-xl mb-3">Instant Insights</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-5">MongoDB aggregation pipelines compute year-over-year trends, category breakdowns, and spending averages in milliseconds.</p>
                <div className="grid grid-cols-3 gap-2">
                  {[{l:'YTD Spent',v:'₹84,320'},{l:'This Month',v:'₹12,450'},{l:'Avg/day',v:'₹412'}].map(s => (
                    <div key={s.l} className="bg-gray-800/80 rounded-xl p-3 text-center">
                      <div className="text-white font-black text-sm">{s.v}</div>
                      <div className="text-gray-500 text-[9px] mt-0.5">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="feature-3d reveal group relative p-7 bg-gray-900 rounded-2xl border border-white/5 hover:border-cyan-500/30 overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500 to-sky-600 flex items-center justify-center shadow-lg">
                    <FiBell className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md border bg-cyan-500/10 border-cyan-500/20 text-cyan-400">06</span>
                </div>
                <h3 className="font-bold text-white text-xl mb-3">Smart Budget Alerts</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-5">Configurable alert thresholds from 1% to 100%. Get warned when you're close — not when it's already too late.</p>
                <div className="bg-gray-800/80 rounded-xl p-3 border border-amber-500/20">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1">
                    <span>⚠️</span> Budget Alert
                  </div>
                  <p className="text-gray-400 text-xs">Food & Dining is at 84% of your ₹5,000 limit. ₹800 remaining.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── IPHONE SECTION — Big, proper iPhone 17 Pro Max shape ──────────── */}
      <section className="px-4 sm:px-6 overflow-clip relative" style={{background:'linear-gradient(180deg,#030712 0%,#070520 30%,#0a0a1a 70%,#030712 100%)'}}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-3xl" />
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center py-24">
          {/* Left: text */}
          <div className="reveal-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-semibold mb-6">
              <FiSmartphone className="w-3.5 h-3.5" />
              Mobile First Design
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Your finances,<br />
              <span className="shimmer-text">in your pocket.</span>
            </h2>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed">
              SpendWise is fully responsive — every feature works perfectly on your phone. Add expenses on the go, check your budget while shopping, and get alerts before you overspend.
            </p>
            <div className="space-y-5">
              {[
                { icon: FiZap,       title:'Add expense in 5 seconds',  desc:'Tap the amount, pick a category, done. No friction at all.' },
                { icon: FiShield,    title:'Live budget bars',           desc:"See instantly if you're close to your limit for any category." },
                { icon: FiPieChart,  title:'Charts on mobile',           desc:'Full dashboard charts optimized for small screens.' },
                { icon: FiRefreshCw, title:'Real-time sync',             desc:'Every expense syncs instantly across all your devices.' },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 items-start group">
                  <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/40 transition-all">
                    <item.icon className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm mb-0.5">{item.title}</p>
                    <p className="text-gray-500 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Big iPhone 17 Pro Max */}
          <div className="reveal order-1 lg:order-2 flex justify-center items-center">
            <div className="relative">
              {/* Glow rings */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-72 h-[580px] rounded-[54px] bg-indigo-500/8 animate-glow-pulse blur-2xl" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-80 h-[620px] rounded-[60px] bg-purple-500/5 animate-glow-pulse delay-1000 blur-3xl" />
              </div>

              {/* Phone wrapper with 3D float */}
              <div className="relative animate-phone-float">
                {/* Side buttons — left */}
                <div className="absolute -left-[3px] top-[110px] w-[3px] h-8 bg-gradient-to-b from-gray-600 to-gray-700 rounded-l-sm" />
                <div className="absolute -left-[3px] top-[155px] w-[3px] h-12 bg-gradient-to-b from-gray-600 to-gray-700 rounded-l-sm" />
                <div className="absolute -left-[3px] top-[175px] w-[3px] h-12 bg-gradient-to-b from-gray-600 to-gray-700 rounded-l-sm" />
                {/* Power button — right */}
                <div className="absolute -right-[3px] top-[150px] w-[3px] h-16 bg-gradient-to-b from-gray-600 to-gray-700 rounded-r-sm" />

                {/* iPhone body */}
                <div className="iphone-frame w-[280px] h-[590px] relative">
                  {/* Camera bump top-center */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[110px] h-[34px] bg-black rounded-b-3xl z-20 flex items-center justify-center gap-3 px-3">
                    {/* Camera array */}
                    <div className="w-3 h-3 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                    </div>
                    <div className="w-2 h-2 rounded-full bg-gray-800 border border-gray-700" />
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-700" />
                  </div>

                  {/* Screen */}
                  <div className="iphone-screen absolute inset-[3px]">
                    <IPhoneMockup />
                  </div>
                </div>

                {/* Reflection below */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[200px] h-12 mt-2"
                  style={{background:'linear-gradient(to bottom,rgba(99,102,241,0.15),transparent)',filter:'blur(8px)',borderRadius:'50%',transform:'translateX(-50%) scaleY(0.3) translateY(-10px)'}} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MACBOOK SECTION — Desktop responsiveness ─────────────────────── */}
      <section className="py-24 px-4 sm:px-6 overflow-clip relative bg-gray-950">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
          <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-xs font-semibold mb-6">
              <FiMonitor className="w-3.5 h-3.5" />
              Beautiful on Every Screen
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Stunning on desktop.<br />
              <span className="shimmer-text">Perfect on mobile.</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Whether you're reviewing your annual spending on a 27" monitor or adding a quick expense on your phone, SpendWise adapts flawlessly to every screen size.
            </p>
          </div>

          {/* MacBook */}
          <div className="reveal mb-16">
            <MacBookMockup />
          </div>

          {/* Responsive features grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 reveal">
            {[
              { icon:'📱', label:'Mobile',  desc:'375px+',  color:'bg-indigo-500/10 border-indigo-500/20'  },
              { icon:'📟', label:'Tablet',  desc:'768px+',  color:'bg-purple-500/10 border-purple-500/20'  },
              { icon:'💻', label:'Laptop',  desc:'1024px+', color:'bg-pink-500/10 border-pink-500/20'      },
              { icon:'🖥️', label:'Desktop', desc:'1280px+', color:'bg-emerald-500/10 border-emerald-500/20'},
            ].map((s) => (
              <div key={s.label} className={`p-4 rounded-2xl border ${s.color} text-center`}>
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="text-white font-bold text-sm">{s.label}</div>
                <div className="text-gray-500 text-xs">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────────────────── */}
      <section className="py-20 px-4" style={{ background:'linear-gradient(135deg,#312e81 0%,#4c1d95 50%,#1e1b4b 100%)' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 reveal">
          {[
            { target:10000, suffix:'+', label:'Expenses Tracked' },
            { target:200,   suffix:'Cr+', prefix:'₹', label:'Money Managed' },
            { target:500,   suffix:'+', label:'Active Users' },
            { target:100,   suffix:'%', label:'Free Forever' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-4xl md:text-5xl font-black text-white mb-1">
                <AnimatedNumber target={s.target} prefix={s.prefix} suffix={s.suffix} />
              </div>
              <div className="text-indigo-300 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────────── */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12 reveal">
          <span className="text-indigo-600 dark:text-indigo-400 text-sm font-bold uppercase tracking-widest">Loved By Users</span>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white mt-3">What people say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t,i) => (
            <div key={t.name} className={`reveal delay-${(i+1)*100} p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-indigo-300 dark:hover:border-indigo-500/20 transition-all card-hover`}>
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_,j) => <FiStar key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-5">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{t.name}</p>
                  <p className="text-gray-600 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto reveal">
          <div className="relative rounded-3xl overflow-hidden p-12 text-center" style={{ background:'linear-gradient(135deg,#1e1b4b 0%,#312e81 40%,#4c1d95 100%)' }}>
            <div className="absolute inset-0 opacity-[0.04]"
              style={{ backgroundImage:'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize:'40px 40px' }} />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-indigo-500/20 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="text-4xl font-black text-white mb-4">
                {user ? 'Your dashboard awaits.' : 'Start tracking for free.'}
              </h2>
              <p className="text-indigo-300 mb-8 text-lg">
                {user ? `${stats?.totals?.totalExpenses || 0} expenses logged. Keep going!` : 'No credit card. No subscription. 100% free forever.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {user ? (
                  <>
                    <Link to="/dashboard" className="group flex items-center justify-center gap-2 px-8 py-4 bg-white text-indigo-700 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all hover:-translate-y-1">
                      <FiGrid className="w-5 h-5" />Open Dashboard<FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link to="/expenses" className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white rounded-2xl font-semibold text-lg hover:bg-white/15 transition-all border border-white/10">
                      + Add Expense
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/register" className="group flex items-center justify-center gap-2 px-8 py-4 bg-white text-indigo-700 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all hover:-translate-y-1">
                      Create Free Account<FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link to="/about" className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white rounded-2xl font-semibold text-lg hover:bg-white/15 transition-all border border-white/10">
                      Meet the Builder
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-200 dark:border-white/5 py-8 px-4 bg-white dark:bg-transparent">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-black text-sm">₹</span>
            </div>
            <span className="font-black text-gray-900 dark:text-white">SpendWise</span>
          </Link>
          <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-600">
            {[['/', 'Home'], ['/about', 'About'], ['/pricing', 'Pricing'], ['/login', 'Login']].map(([to, label]) => (
              <Link key={to} to={to} className="hover:text-indigo-400 transition">{label}</Link>
            ))}
          </div>
          <p className="text-gray-400 dark:text-gray-700 text-sm">© 2025 SpendWise — MIT License 🇮🇳</p>
        </div>
      </footer>
    </div>
  );
}
