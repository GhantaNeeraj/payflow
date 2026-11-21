import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeftRight, CheckCircle2, ShieldCheck, XCircle,
  Receipt, PiggyBank, TrendingUp, Activity,
  Clock, Zap, ChevronRight, Sparkles, ArrowUpRight,
  TrendingDown, RefreshCw, Layers
} from 'lucide-react';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';

import MetricCard from '../components/common/MetricCard';
import StatusBadge from '../components/common/StatusBadge';
import Button from '../components/common/Button';
import {
  dashboardStats, dailyVolumeData, paymentMethodDistribution,
  processorData, transactions, rangeStats, volumeDataByRange
} from '../data/mockData';
import { useApp } from '../context/AppContext';
import { DATE_RANGES } from '../utils/constants';
import {
  formatINR, formatNumber, formatPercent,
  getRelativeTime, truncateId, formatCurrency
} from '../utils/formatters';

const PROC_COLORS = { razorpay: '#528FF0', cashfree: '#6C5CE7', payu: '#00C853', stripe: '#635BFF' };
const PIE_COLORS = ['#D4AF37', '#528FF0', '#6C5CE7', '#16C784', '#635BFF'];

function DarkTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#111117] border border-[rgba(212,175,55,0.3)] rounded-xl px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.8)] text-xs backdrop-blur-md">
      <div className="text-[#8E8E9E] mb-2 font-bold tracking-wide uppercase text-[10px]">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-4 py-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
            <span className="text-[#A1A1B0] text-xs font-medium">{p.name}:</span>
          </div>
          <span className="text-[#F5F5F5] font-bold font-['Manrope']">
            {typeof p.value === 'number' && p.value > 100
              ? formatNumber(p.value)
              : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function SectionCard({ title, children, action, icon: Icon, goldBorder = false }) {
  return (
    <div className={`relative rounded-2xl bg-gradient-to-b from-[#101016] to-[#0A0A0E] p-5 transition-all duration-300 hover:border-[rgba(212,175,55,0.3)] group ${
      goldBorder ? 'border-2 border-[rgba(212,175,55,0.3)]' : 'border border-[rgba(212,175,55,0.12)]'
    } shadow-lg shadow-black/50`}>
      {/* Top subtle highlight line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[rgba(212,175,55,0.35)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          {Icon ? (
            <div className="w-7 h-7 rounded-lg bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.2)] flex items-center justify-center text-[#D4AF37]">
              <Icon size={14} />
            </div>
          ) : (
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />
          )}
          <h2 className="text-sm font-bold text-[#F5F5F5] tracking-tight">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

export default function Dashboard() {
  const { dateRange, setDateRange } = useApp();

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  }, []);

  const [activeTab, setActiveTab] = useState('all');
  const recentTxns = useMemo(() => transactions.slice(0, 10), []);

  // Dynamically compute stats based on selected date range (Today, 7d, 30d, 90d)
  const stats = useMemo(() => rangeStats[dateRange] || rangeStats['30d'], [dateRange]);
  const ch = stats.changes;

  const currentRangeLabel = useMemo(() => {
    return DATE_RANGES.find(r => r.value === dateRange)?.label || 'Last 30 Days';
  }, [dateRange]);

  const procPerf = processorData.map(p => ({
    name: p.name,
    'Auth Rate': p.authRate,
    Fee: p.processingFee,
    color: PROC_COLORS[p.id]
  })).sort((a, b) => b['Auth Rate'] - a['Auth Rate']);

  const volumeChartData = useMemo(() => {
    return volumeDataByRange[dateRange] || volumeDataByRange['30d'];
  }, [dateRange]);

  return (
    <div className="space-y-6 pb-6">
      {/* Executive Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#14120C] via-[#100F15] to-[#0A0A0E] border border-[rgba(212,175,55,0.22)] p-6 sm:p-7 overflow-hidden shadow-2xl shadow-black/80">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.12)_0%,transparent_60%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.3)] text-[#F5D76E] text-xs font-bold tracking-wider uppercase">
              <Sparkles size={12} className="animate-spin text-[#F5D76E]" />
              Smart Routing Engine Online
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-['Manrope'] tracking-tight">
              {greeting}, Acme Commerce
            </h1>
            <p className="text-xs sm:text-sm text-[#8E8E9E] max-w-xl leading-relaxed">
              Real-time payment orchestration layer routing transactions across <span className="text-[#F5D76E] font-semibold">4 gateways</span> with an authorization rate of <span className="text-[#16C784] font-bold">93.04%</span>.
            </p>
          </div>

          {/* Quick Metrics Capsule & Date Range Switcher */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-1 p-1 bg-[#07070A]/90 border border-[rgba(212,175,55,0.25)] rounded-2xl">
              {[
                { label: 'Today', val: 'today' },
                { label: '7D', val: '7d' },
                { label: '30D', val: '30d' },
                { label: '90D', val: '90d' },
              ].map(r => (
                <button
                  key={r.val}
                  onClick={() => setDateRange(r.val)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    dateRange === r.val
                      ? 'bg-gradient-to-r from-[#A67C00] via-[#D4AF37] to-[#F5D76E] text-[#080808] shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                      : 'text-[#8E8E9E] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 bg-[#07070A]/80 border border-[rgba(212,175,55,0.2)] p-2.5 rounded-2xl backdrop-blur-xl">
              <div className="px-3 py-0.5 border-r border-white/5">
                <div className="text-[9px] text-[#6E6E80] uppercase tracking-wider font-semibold">Scope</div>
                <div className="text-xs font-bold text-white font-['Manrope']">{currentRangeLabel}</div>
              </div>
              <div className="px-3 py-0.5 border-r border-white/5">
                <div className="text-[9px] text-[#6E6E80] uppercase tracking-wider font-semibold">Latency</div>
                <div className="text-xs font-bold text-[#16C784] font-['Manrope']">284ms</div>
              </div>
              <div className="px-3 py-0.5">
                <div className="text-[9px] text-[#6E6E80] uppercase tracking-wider font-semibold">Savings Yield</div>
                <div className="text-xs font-bold text-[#F5D76E] font-['Manrope']">19.2%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
        <MetricCard
          title="Total Transactions"
          value={formatNumber(stats.totalTransactions)}
          icon={ArrowLeftRight}
          change={ch.totalTransactions}
          changeType="positive"
          sparklineData={dailyVolumeData.slice(-7).map(d => d.total)}
        />
        <MetricCard
          title="Successful Volume"
          value={formatNumber(stats.successfulPayments)}
          icon={CheckCircle2}
          change={ch.successfulPayments}
          changeType="positive"
          sparklineData={dailyVolumeData.slice(-7).map(d => d.successful)}
        />
        <MetricCard
          title="Authorization Rate"
          value={formatPercent(stats.authorizationRate)}
          icon={ShieldCheck}
          change={ch.authorizationRate}
          changeType="positive"
          sparklineData={dailyVolumeData.slice(-7).map(d => d.authRate)}
        />
        <MetricCard
          title="Failed Payments"
          value={formatNumber(stats.failedTransactions)}
          icon={XCircle}
          change={Math.abs(ch.failedTransactions)}
          changeType="positive"
          sparklineData={dailyVolumeData.slice(-7).map(d => d.failed)}
        />
        <MetricCard
          title="Processing Fees"
          value={formatINR(stats.totalProcessingFees)}
          icon={Receipt}
          change={ch.totalProcessingFees}
          changeType="negative"
        />
        <MetricCard
          title="Cost Savings"
          value={formatINR(stats.estimatedSavings)}
          icon={PiggyBank}
          change={ch.estimatedSavings}
          changeType="positive"
          accentColor="#16C784"
        />
      </div>

      {/* Charts Section: Volume Performance & Method Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <SectionCard
            title="Payment Volume & Clearance Trend"
            icon={TrendingUp}
            action={
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#D4AF37] uppercase tracking-wider font-bold bg-[rgba(212,175,55,0.1)] px-2 py-0.5 rounded-md border border-[rgba(212,175,55,0.25)]">
                  {currentRangeLabel}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-[#16C784] font-bold bg-[rgba(22,199,132,0.1)] px-2 py-0.5 rounded-full border border-[rgba(22,199,132,0.25)]">
                  +{ch.successfulPayments}% vs prior
                </span>
              </div>
            }
          >
            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={volumeChartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="goldArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.4} />
                      <stop offset="90%" stopColor="#D4AF37" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="failedArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EA3943" stopOpacity={0.3} />
                      <stop offset="90%" stopColor="#EA3943" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#181822" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#626274' }} axisLine={false} tickLine={false} dy={6} />
                  <YAxis tick={{ fontSize: 10, fill: '#626274' }} axisLine={false} tickLine={false} dx={-6} />
                  <Tooltip content={<DarkTooltip />} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', color: '#9898A8', paddingTop: 12 }} />
                  <Area
                    type="monotone"
                    dataKey="successful"
                    name="Authorized Txns"
                    stroke="#D4AF37"
                    fill="url(#goldArea)"
                    strokeWidth={2.5}
                    activeDot={{ r: 5, fill: '#F5D76E', stroke: '#07070A', strokeWidth: 2 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="failed"
                    name="Declined / Failed"
                    stroke="#EA3943"
                    fill="url(#failedArea)"
                    strokeWidth={1.8}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        </div>

        <div className="lg:col-span-2">
          <SectionCard title="Payment Method Share" icon={Layers}>
            <div className="h-64 sm:h-72 w-full flex flex-col justify-center">
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie
                    data={paymentMethodDistribution}
                    cx="50%" cy="50%"
                    innerRadius={56} outerRadius={84}
                    dataKey="value" nameKey="method"
                    stroke="#0A0A0E"
                    strokeWidth={2}
                    paddingAngle={3}
                  >
                    {paymentMethodDistribution.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} className="hover:opacity-85 transition-opacity" />
                    ))}
                  </Pie>
                  <Tooltip content={<DarkTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {/* Custom High-Density Legend */}
              <div className="grid grid-cols-3 gap-1 px-2 pt-2 border-t border-white/5 text-[10px]">
                {paymentMethodDistribution.map((m, i) => (
                  <div key={m.method} className="flex items-center gap-1.5 truncate">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i] }} />
                    <span className="text-[#8E8E9E] truncate">{m.method}</span>
                    <span className="text-white font-bold font-mono ml-auto">{m.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Row 2: Gateway Success Rate Benchmark & Dynamic Performance Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Real-Time Authorization Benchmark" icon={Activity}>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyVolumeData.slice(-14)} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#181822" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#626274' }} axisLine={false} tickLine={false} />
                <YAxis domain={[88, 100]} tick={{ fontSize: 10, fill: '#626274' }} axisLine={false} tickLine={false} />
                <Tooltip content={<DarkTooltip />} />
                <Line
                  type="monotone"
                  dataKey="authRate"
                  name="System Auth Rate %"
                  stroke="#F5D76E"
                  strokeWidth={2.8}
                  dot={{ r: 3, fill: '#D4AF37' }}
                  activeDot={{ r: 6, fill: '#FFF', stroke: '#D4AF37', strokeWidth: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Processor Performance Benchmark" icon={Zap}>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={procPerf} layout="vertical" margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#181822" horizontal={false} />
                <XAxis type="number" domain={[85, 100]} tick={{ fontSize: 10, fill: '#626274' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#8E8E9E' }} axisLine={false} tickLine={false} width={80} />
                <Tooltip content={<DarkTooltip />} />
                <Bar dataKey="Auth Rate" name="Authorization %" radius={[0, 6, 6, 0]} barSize={20}>
                  {procPerf.map((p, i) => (
                    <Cell key={i} fill={p.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* Row 3: Live Transactions Stream & Processor Health Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Recent Transactions Table */}
        <div className="lg:col-span-3">
          <SectionCard
            title="Live Transactions Ledger"
            icon={ArrowLeftRight}
            action={
              <Link to="/transactions" className="flex items-center gap-1 text-xs font-bold text-[#F5D76E] hover:text-[#FFF] transition-colors">
                <span>View Full Ledger</span>
                <ChevronRight size={13} />
              </Link>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-white/5 text-[#5A5A6D] uppercase text-[9px] tracking-wider font-bold">
                    <th className="py-2.5">TXN Hash</th>
                    <th className="py-2.5 text-right">Amount</th>
                    <th className="py-2.5 hidden sm:table-cell">Method</th>
                    <th className="py-2.5 hidden sm:table-cell">Gateway</th>
                    <th className="py-2.5 text-center">Status</th>
                    <th className="py-2.5 text-right hidden md:table-cell">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {recentTxns.map(t => (
                    <tr
                      key={t.id}
                      className="hover:bg-[rgba(212,175,55,0.03)] transition-colors group cursor-pointer"
                    >
                      <td className="py-3 font-mono text-[#D4AF37] font-semibold group-hover:text-[#F5D76E]">
                        {truncateId(t.id)}
                      </td>
                      <td className="py-3 text-right font-bold text-[#F5F5F5] font-['Manrope']">
                        {formatCurrency(t.amount, t.currency)}
                      </td>
                      <td className="py-3 text-[#8E8E9E] hidden sm:table-cell capitalize">
                        {t.paymentMethod.replace(/_/g, ' ')}
                      </td>
                      <td className="py-3 hidden sm:table-cell">
                        <span className="flex items-center gap-1.5 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: PROC_COLORS[t.processor] }} />
                          <span className="text-[#A1A1B0] capitalize">{t.processor}</span>
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <StatusBadge status={t.status} size="sm" />
                      </td>
                      <td className="py-3 text-right text-[#5A5A6D] hidden md:table-cell font-mono text-[10px]">
                        {getRelativeTime(t.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>

        {/* Live Processor Health Nodes */}
        <div className="lg:col-span-2">
          <SectionCard title="Connected Processor Health" icon={ShieldCheck}>
            <div className="space-y-3">
              {processorData.map(p => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-xl bg-[#09090D] border border-[rgba(255,255,255,0.05)] hover:border-[rgba(212,175,55,0.35)] transition-all duration-300 hover:shadow-lg group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white shadow-md"
                        style={{ background: PROC_COLORS[p.id] }}
                      >
                        {p.name[0]}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-[#F5D76E] transition-colors">
                          {p.name}
                        </div>
                        <div className="text-[10px] text-[#6E6E80] flex items-center gap-1.5">
                          <span>Fee: {p.processingFee}%</span>
                          <span>•</span>
                          <span className="text-[#16C784] font-medium">{p.avgResponseTime}ms</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-extrabold text-[#F5F5F5] font-['Manrope']">
                        {p.authRate}%
                      </div>
                      <div className="text-[9px] text-[#16C784] font-bold flex items-center justify-end gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#16C784] animate-ping" />
                        Online
                      </div>
                    </div>
                  </div>

                  {/* Latency / SLA Progress Bar */}
                  <div className="w-full h-1.5 bg-[#161622] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${p.availability}%`,
                        background: `linear-gradient(90deg, ${PROC_COLORS[p.id]}, #D4AF37)`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-[#8E8E9E]">
              <span className="flex items-center gap-1">
                <Clock size={12} className="text-[#D4AF37]" />
                Auto-failover sensitivity: 500ms
              </span>
              <Link to="/processors" className="text-[#D4AF37] hover:underline font-bold text-[10px]">
                Manage Nodes →
              </Link>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
