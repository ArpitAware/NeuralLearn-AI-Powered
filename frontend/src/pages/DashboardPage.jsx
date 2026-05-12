/**
 * pages/DashboardPage.jsx
 * Fixed: pie chart label overlap removed → custom legend instead
 * Added: Live Indian Stock Market widget (NSE top stocks via Yahoo Finance proxy)
 */

import { useEffect, useState, useCallback } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { expenseAPI, stocksAPI } from '../services/api';
import { useCurrency } from '../context/CurrencyContext';
import {
  FiTrendingUp, FiTrendingDown, FiDollarSign, FiActivity,
  FiRefreshCw, FiArrowUp, FiArrowDown,
} from 'react-icons/fi';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const COLORS = ['#6366f1','#22d3ee','#f59e0b','#10b981','#f43f5e','#8b5cf6','#ec4899','#14b8a6','#f97316','#84cc16'];

// ── Indian stock display meta ─────────────────────────────────────────────
const STOCK_META = {
  'RELIANCE.NS': { short: 'RELIANCE', name: 'Reliance Industries' },
  'TCS.NS':      { short: 'TCS',      name: 'Tata Consultancy'    },
  'HDFCBANK.NS': { short: 'HDFC',     name: 'HDFC Bank'           },
  'INFY.NS':     { short: 'INFY',     name: 'Infosys'             },
  'ICICIBANK.NS':{ short: 'ICICI',    name: 'ICICI Bank'          },
  'SBIN.NS':     { short: 'SBI',      name: 'State Bank of India' },
};

// ── Stat Card ──────────────────────────────────────────────────────────────
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
    <div className="flex items-center justify-between mb-4">
      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</span>
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
    <div className="text-2xl font-bold text-gray-900 dark:text-white truncate">{value}</div>
  </div>
);

// ── Custom Pie Legend (replaces overlapping labels) ─────────────────────────
const CustomPieLegend = ({ data, formatAmount }) => (
  <div className="mt-4 space-y-2">
    {data.map((item, i) => (
      <div key={item.category} className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
          <span className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[140px]">{item.category}</span>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-xs text-gray-400">
            {((item.total / data.reduce((a,b) => a + b.total, 0)) * 100).toFixed(0)}%
          </span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {formatAmount(item.total)}
          </span>
        </div>
      </div>
    ))}
  </div>
);

// ── Stock Card ──────────────────────────────────────────────────────────────
const StockCard = ({ name, short, data, loading }) => {
  const up = data?.changePct >= 0;
  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-600/50 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold text-gray-900 dark:text-white text-sm">{short}</p>
          <p className="text-xs text-gray-400">{name}</p>
        </div>
        {loading ? (
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
        ) : data ? (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${
            up ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
               : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
          }`}>
            {up ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />}
            {Math.abs(data.changePct).toFixed(2)}%
          </div>
        ) : (
          <span className="text-xs text-gray-400">—</span>
        )}
      </div>
      {data && (
        <>
          <p className="text-xl font-black text-gray-900 dark:text-white">
            ₹{data.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="flex justify-between text-xs text-gray-400">
            <span>H: ₹{data.high.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            <span>L: ₹{data.low.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            <span className={up ? 'text-emerald-500' : 'text-red-500'}>
              {up ? '+' : ''}{data.change.toFixed(2)}
            </span>
          </div>
        </>
      )}
      {!loading && !data && (
        <p className="text-xs text-gray-400">Market closed / unavailable</p>
      )}
    </div>
  );
};

export default function DashboardPage() {
  const [stats, setStats]         = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [stocks, setStocks]       = useState({});
  const [stocksLoading, setStocksLoading] = useState(true);
  const [lastUpdated, setLastUpdated]     = useState(null);
  const { formatAmount } = useCurrency();
  const year = new Date().getFullYear();

  // ── Load expense stats ─────────────────────────────────────────────────
  const loadStats = useCallback(() => {
    setLoading(true);
    setError(null);
    expenseAPI
      .getStats({ year })
      .then(({ data }) => setStats(data.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load stats'))
      .finally(() => setLoading(false));
  }, [year]);

  // ── Load stock prices from backend proxy ──────────────────────────────
  const loadStocks = useCallback(async () => {
    setStocksLoading(true);
    try {
      const { data } = await stocksAPI.getAll();
      const map = {};
      data.data.forEach(s => { map[s.symbol] = s; });
      setStocks(map);
      setLastUpdated(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
    } catch {
      // Silently fail — stocks are a bonus feature, not critical
    } finally {
      setStocksLoading(false);
    }
  }, []);

  useEffect(() => { loadStats(); }, [loadStats]);

  // Load stocks on mount, refresh every 60 seconds
  useEffect(() => {
    loadStocks();
    const interval = setInterval(loadStocks, 60000);
    return () => clearInterval(interval);
  }, [loadStocks]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
        <p className="text-sm text-gray-400">Loading your stats...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-5xl">⚠️</div>
        <p className="text-gray-500 dark:text-gray-400">{error}</p>
        <button onClick={loadStats} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition">
          <FiRefreshCw className="w-4 h-4" /> Try Again
        </button>
      </div>
    );
  }

  const monthlyData = MONTHS.map((name, i) => {
    const found = stats?.monthly?.find((m) => m.month === i + 1);
    return { name, total: found?.total || 0, count: found?.count || 0 };
  });

  const totalSpent = stats?.totals?.totalSpent   || 0;
  const totalCount = stats?.totals?.totalExpenses || 0;
  const avgExpense = stats?.totals?.avgExpense    || 0;
  const thisMonth  = monthlyData[new Date().getMonth()].total;
  const byCategory = stats?.byCategory || [];

  const CurrencyTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-3 shadow-lg">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="font-bold text-gray-900 dark:text-white">{formatAmount(payload[0].value)}</p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Overview for {year}</p>
        </div>
        <button onClick={loadStats}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl transition">
          <FiRefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Spent"     value={formatAmount(totalSpent)} icon={FiDollarSign}   color="bg-indigo-500" />
        <StatCard title="This Month"      value={formatAmount(thisMonth)}  icon={FiActivity}     color="bg-emerald-500" />
        <StatCard title="Total Expenses"  value={totalCount}               icon={FiTrendingUp}   color="bg-amber-500" />
        <StatCard title="Avg per Expense" value={formatAmount(avgExpense)} icon={FiTrendingDown} color="bg-rose-500" />
      </div>

      {/* Monthly Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Spending — {year}</h2>
        {totalCount === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <span className="text-4xl mb-3">📊</span>
            <p className="text-sm">Add some expenses to see your spending chart</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => formatAmount(v).split('.')[0]} />
              <Tooltip content={<CurrencyTooltip />} />
              <Area type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={2} fill="url(#colorTotal)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Pie + Bar charts */}
      {byCategory.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* ── Pie — NO inline labels, custom legend below ─────────────── */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Spending by Category</h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={byCategory}
                  dataKey="total"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={2}
                  label={false}
                  labelLine={false}
                >
                  {byCategory.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v, name) => [formatAmount(v), name]}
                  contentStyle={{
                    background: 'rgba(17,24,39,0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12,
                    color: '#fff',
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Clean legend instead of overlapping labels */}
            <CustomPieLegend data={byCategory} formatAmount={formatAmount} />
          </div>

          {/* Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Categories</h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={byCategory.slice(0, 5)} layout="vertical" margin={{ left: 0, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#374151" />
                <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => formatAmount(v).split('.')[0]} />
                <YAxis type="category" dataKey="category" width={105} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [formatAmount(v), 'Spent']}
                  contentStyle={{ background:'rgba(17,24,39,0.95)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, color:'#fff', fontSize:12 }} />
                <Bar dataKey="total" radius={[0, 6, 6, 0]}>
                  {byCategory.slice(0, 5).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── INDIAN STOCK MARKET WIDGET ───────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              📈 Indian Stock Market
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-semibold">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Live NSE
              </span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {lastUpdated ? `Updated at ${lastUpdated} · refreshes every 60s` : 'Loading prices...'}
            </p>
          </div>
          <button
            onClick={loadStocks}
            disabled={stocksLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-600 border border-gray-200 dark:border-gray-600 rounded-xl transition disabled:opacity-50"
          >
            <FiRefreshCw className={`w-3.5 h-3.5 ${stocksLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(STOCK_META).map(([symbol, meta]) => (
            <StockCard
              key={symbol}
              name={meta.name}
              short={meta.short}
              data={stocks[symbol]}
              loading={stocksLoading}
            />
          ))}
        </div>

        <p className="text-xs text-gray-400 mt-4 text-center">
          Data from Yahoo Finance · 15–20 min delayed · For reference only, not financial advice
        </p>
      </div>

      {/* Empty state */}
      {totalCount === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <span className="text-5xl block mb-4">💸</span>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No expenses yet</h3>
          <p className="text-gray-400 text-sm">Head to the Expenses page and add your first expense to see your dashboard come alive.</p>
        </div>
      )}
    </div>
  );
}
