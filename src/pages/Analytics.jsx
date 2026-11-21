import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, DollarSign, PiggyBank, Percent, Download, Star } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import MetricCard from '../components/common/MetricCard';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import { analyticsData, dailyVolumeData, paymentMethodDistribution, processorData, rangeStats, volumeDataByRange } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { formatINR, formatNumber, formatPercent } from '../utils/formatters';

const PROC_COLORS = { razorpay: '#528FF0', cashfree: '#6C5CE7', payu: '#00C853', stripe: '#635BFF' };
const PIE_COLORS = ['#D4AF37', '#528FF0', '#6C5CE7', '#00C853', '#635BFF'];
const FAIL_COLORS = ['#EA3943','#E84855','#F06449','#F4845F','#F7B267','#F7D08A','#FAE3B4'];

function Tip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#191919] border border-[rgba(212,175,55,0.2)] rounded-lg p-3 shadow-xl text-xs">
      <div className="text-[#A1A1A1] mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background: p.color }} /><span className="text-[#F5F5F5]">{p.name}: {p.value}</span></div>
      ))}
    </div>
  );
}

export default function Analytics() {
  const { dateRange, setDateRange } = useApp();
  const [processorFilter, setProcessorFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [methodTab, setMethodTab] = useState('UPI');

  // Dynamic range-reactive statistics
  const currentStats = useMemo(() => rangeStats[dateRange] || rangeStats['30d'], [dateRange]);
  const currentVolumeData = useMemo(() => volumeDataByRange[dateRange] || volumeDataByRange['30d'], [dateRange]);

  const data = analyticsData;
  const procRates = processorData.map(p => ({ name: p.name, rate: p.authRate, color: PROC_COLORS[p.id] })).sort((a,b) => b.rate - a.rate);
  const procVolume = currentVolumeData.map((d, i) => ({
    date: d.date,
    Razorpay: Math.round(d.total * 0.38),
    Cashfree: Math.round(d.total * 0.30),
    PayU: Math.round(d.total * 0.20),
    Stripe: Math.round(d.total * 0.12)
  }));
  const selectedMethodStats = data.paymentMethodStats.find(m => m.method === methodTab);
  const failedTrend = currentVolumeData.map(d => ({ date: d.date, failed: d.failed }));

  const FilterPill = ({ label, value, active, onClick }) => (
    <button onClick={onClick} className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${active ? 'bg-[#D4AF37] text-[#080808]' : 'bg-[rgba(255,255,255,0.05)] text-[#A1A1A1] hover:bg-[rgba(255,255,255,0.1)]'}`}>{label}</button>
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Payment Analytics" subtitle="Understand your payment performance and discover opportunities to optimize costs."
        actions={<div className="flex gap-2">
          <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="bg-[#101010] border border-[rgba(255,255,255,0.08)] rounded-lg text-xs text-[#A1A1A1] px-3 py-1.5 cursor-pointer focus:outline-none">
            <option value="today">Today (24h)</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <Button variant="secondary" size="sm" icon={Download}>Export</Button>
        </div>} />

      {/* Filters */}
      <div className="bg-[#131313] border border-[rgba(212,175,55,0.15)] rounded-xl p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#686868] uppercase tracking-wider">Processor:</span>
            {['all','razorpay','cashfree','payu','stripe'].map(p => <FilterPill key={p} label={p==='all'?'All':p.charAt(0).toUpperCase()+p.slice(1)} active={processorFilter===p} onClick={() => setProcessorFilter(p)} />)}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#686868] uppercase tracking-wider">Method:</span>
            {['all','UPI','Cards','Net Banking','Wallets'].map(m => <FilterPill key={m} label={m==='all'?'All':m} active={methodFilter===m} onClick={() => setMethodFilter(m)} />)}
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Authorization Rate" value={formatPercent(currentStats.authorizationRate)} icon={TrendingUp} change={currentStats.changes.authorizationRate} changeType="positive" sparklineData={currentVolumeData.map(d => d.authRate)} />
        <MetricCard title="Processing Costs" value={formatINR(currentStats.totalProcessingFees)} icon={DollarSign} change={currentStats.changes.totalProcessingFees} changeType="negative" />
        <MetricCard title="Avg Processing Fee" value="1.98%" icon={BarChart3} change={-0.3} changeType="positive" />
        <MetricCard title="Estimated Savings" value={formatINR(currentStats.estimatedSavings)} icon={PiggyBank} change={currentStats.changes.estimatedSavings} changeType="positive" />
      </div>

      {/* Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.2 }} className="lg:col-span-3 bg-[#131313] border border-[rgba(212,175,55,0.15)] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4"><span className="w-2 h-2 rounded-full bg-[#D4AF37]" /><h3 className="text-sm font-semibold text-[#F5F5F5]">Authorization Rate Over Time ({dateRange.toUpperCase()})</h3></div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={currentVolumeData.map(d => ({ date: d.date, rate: d.authRate }))}>
              <defs><linearGradient id="authG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#D4AF37" stopOpacity={0.2}/><stop offset="100%" stopColor="#D4AF37" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
              <XAxis dataKey="date" tick={{ fontSize:10, fill:'#686868' }} axisLine={false} tickLine={false} />
              <YAxis domain={[85,100]} tick={{ fontSize:10, fill:'#686868' }} axisLine={false} tickLine={false} />
              <Tooltip content={<Tip />} />
              <ReferenceLine y={90} stroke="#EA3943" strokeDasharray="5 5" strokeOpacity={0.5} />
              <Area type="monotone" dataKey="rate" stroke="none" fill="url(#authG)" />
              <Line type="monotone" dataKey="rate" name="Auth Rate %" stroke="#D4AF37" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.3 }} className="lg:col-span-2 bg-[#131313] border border-[rgba(212,175,55,0.15)] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4"><span className="w-2 h-2 rounded-full bg-[#D4AF37]" /><h3 className="text-sm font-semibold text-[#F5F5F5]">Processor Success Rate</h3></div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={procRates} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" horizontal={false} />
              <XAxis type="number" domain={[85,100]} tick={{ fontSize:10, fill:'#686868' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize:11, fill:'#A1A1A1' }} axisLine={false} tickLine={false} width={80} />
              <Tooltip content={<Tip />} />
              <Bar dataKey="rate" name="Success %" radius={[0,4,4,0]} barSize={22}>{procRates.map((p,i) => <Cell key={i} fill={p.color} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.4 }} className="bg-[#131313] border border-[rgba(212,175,55,0.15)] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4"><span className="w-2 h-2 rounded-full bg-[#D4AF37]" /><h3 className="text-sm font-semibold text-[#F5F5F5]">Volume by Processor</h3></div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={procVolume}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
              <XAxis dataKey="date" tick={{ fontSize:10, fill:'#686868' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:10, fill:'#686868' }} axisLine={false} tickLine={false} />
              <Tooltip content={<Tip />} />
              <Area type="monotone" dataKey="Razorpay" stackId="1" stroke="#528FF0" fill="#528FF0" fillOpacity={0.4} />
              <Area type="monotone" dataKey="Cashfree" stackId="1" stroke="#6C5CE7" fill="#6C5CE7" fillOpacity={0.4} />
              <Area type="monotone" dataKey="PayU" stackId="1" stroke="#00C853" fill="#00C853" fillOpacity={0.4} />
              <Area type="monotone" dataKey="Stripe" stackId="1" stroke="#635BFF" fill="#635BFF" fillOpacity={0.4} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.5 }} className="bg-[#131313] border border-[rgba(212,175,55,0.15)] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4"><span className="w-2 h-2 rounded-full bg-[#D4AF37]" /><h3 className="text-sm font-semibold text-[#F5F5F5]">Payment Method Distribution</h3></div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart><Pie data={paymentMethodDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" nameKey="method" stroke="none">
              {paymentMethodDistribution.map((_,i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
            </Pie><Tooltip content={<Tip />} /><Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:'11px', color:'#A1A1A1' }} /></PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Row 3: Currency + Cost */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.6 }} className="bg-[#131313] border border-[rgba(212,175,55,0.15)] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4"><span className="w-2 h-2 rounded-full bg-[#D4AF37]" /><h3 className="text-sm font-semibold text-[#F5F5F5]">Currency Distribution</h3></div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.currencyDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
              <XAxis dataKey="currency" tick={{ fontSize:11, fill:'#A1A1A1' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:10, fill:'#686868' }} axisLine={false} tickLine={false} />
              <Tooltip content={<Tip />} />
              <Bar dataKey="transactions" name="Transactions" fill="#D4AF37" radius={[4,4,0,0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.7 }} className="bg-[#131313] border border-[rgba(212,175,55,0.15)] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4"><span className="w-2 h-2 rounded-full bg-[#D4AF37]" /><h3 className="text-sm font-semibold text-[#F5F5F5]">Processing Cost by Processor</h3></div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={processorData.map(p => ({ name: p.name, fee: p.processingFee, color: PROC_COLORS[p.id] }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
              <XAxis dataKey="name" tick={{ fontSize:11, fill:'#A1A1A1' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:10, fill:'#686868' }} axisLine={false} tickLine={false} domain={[0,4]} />
              <Tooltip content={<Tip />} />
              <Bar dataKey="fee" name="Fee %" radius={[4,4,0,0]} barSize={32}>{processorData.map((p,i) => <Cell key={i} fill={PROC_COLORS[p.id]} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Failed Payment Analysis */}
      <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.8 }} className="bg-[#131313] border border-[rgba(212,175,55,0.15)] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4"><span className="w-2 h-2 rounded-full bg-[#EA3943]" /><h3 className="text-sm font-semibold text-[#F5F5F5]">Failed Payment Analysis</h3></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.failedPaymentReasons} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" horizontal={false} />
              <XAxis type="number" tick={{ fontSize:10, fill:'#686868' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="reason" tick={{ fontSize:10, fill:'#A1A1A1' }} axisLine={false} tickLine={false} width={110} />
              <Tooltip content={<Tip />} />
              <Bar dataKey="count" name="Count" radius={[0,4,4,0]} barSize={16}>{data.failedPaymentReasons.map((_,i) => <Cell key={i} fill={FAIL_COLORS[i]} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={failedTrend}>
              <defs><linearGradient id="failG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#EA3943" stopOpacity={0.2}/><stop offset="100%" stopColor="#EA3943" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
              <XAxis dataKey="date" tick={{ fontSize:10, fill:'#686868' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:10, fill:'#686868' }} axisLine={false} tickLine={false} />
              <Tooltip content={<Tip />} />
              <Area type="monotone" dataKey="failed" name="Failed" stroke="#EA3943" fill="url(#failG)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Cost Optimization */}
      <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.9 }} className="bg-[#131313] border-2 border-[rgba(212,175,55,0.3)] rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#A67C00] via-[#D4AF37] to-[#F5D76E]" />
        <div className="flex items-center gap-2 mb-5"><PiggyBank size={18} className="text-[#D4AF37]" /><h3 className="text-base font-bold text-[#F5F5F5]">Cost Optimization Analysis</h3></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <div className="text-center p-4 bg-[#0D0D0D] rounded-xl">
            <div className="text-[10px] text-[#686868] uppercase tracking-wider mb-2">Current Routing Cost</div>
            <div className="text-2xl font-bold text-[#F5F5F5]">{formatINR(data.costComparison.current)}</div>
            <div className="text-xs text-[#A1A1A1] mt-1">With smart routing enabled</div>
          </div>
          <div className="text-center p-4 bg-[#0D0D0D] rounded-xl">
            <div className="text-[10px] text-[#686868] uppercase tracking-wider mb-2">Without Smart Routing</div>
            <div className="text-2xl font-bold text-[#686868] line-through">{formatINR(data.costComparison.alternative)}</div>
            <div className="text-xs text-[#A1A1A1] mt-1">Default single-processor routing</div>
          </div>
          <div className="text-center p-4 bg-[rgba(212,175,55,0.05)] rounded-xl border border-[rgba(212,175,55,0.2)]">
            <div className="text-[10px] text-[#D4AF37] uppercase tracking-wider mb-2 flex items-center justify-center gap-1"><Star size={10} /> Estimated Savings</div>
            <div className="text-2xl font-bold gold-gradient-text">{formatINR(data.costComparison.savings)}</div>
            <div className="text-xs text-[#D4AF37] mt-1">{data.costComparison.savingsPercent}% reduction</div>
          </div>
        </div>
        <div className="w-full bg-[#1a1a1a] rounded-full h-3 overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${data.costComparison.savingsPercent}%` }} transition={{ duration: 1.5, delay: 1 }}
            className="h-full rounded-full bg-gradient-to-r from-[#A67C00] via-[#D4AF37] to-[#F5D76E]" />
        </div>
        <div className="text-[10px] text-[#686868] mt-3">* Savings estimates are based on simulated routing analysis and historical demo data. Actual results may vary.</div>
      </motion.div>

      {/* Payment Method Analysis */}
      <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:1.0 }} className="bg-[#131313] border border-[rgba(212,175,55,0.15)] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4"><span className="w-2 h-2 rounded-full bg-[#D4AF37]" /><h3 className="text-sm font-semibold text-[#F5F5F5]">Payment Method Analysis</h3></div>
        <div className="flex gap-1 mb-4 border-b border-[rgba(255,255,255,0.06)]">
          {data.paymentMethodStats.map(m => (
            <button key={m.method} onClick={() => setMethodTab(m.method)}
              className={`px-4 py-2 text-xs font-medium border-b-2 transition-all cursor-pointer ${methodTab === m.method ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-transparent text-[#686868] hover:text-[#A1A1A1]'}`}>{m.method}</button>
          ))}
        </div>
        {selectedMethodStats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[['Transactions', formatNumber(selectedMethodStats.transactions)], ['Volume', formatINR(selectedMethodStats.volume)], ['Auth Rate', selectedMethodStats.authRate + '%'], ['Avg Fee', selectedMethodStats.avgFee + '%'], ['Top Processor', selectedMethodStats.topProcessor]].map(([l,v]) => (
              <div key={l} className="bg-[#0D0D0D] rounded-lg p-3">
                <div className="text-[10px] text-[#686868]">{l}</div>
                <div className="text-sm font-semibold text-[#F5F5F5] mt-0.5">{v}</div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
