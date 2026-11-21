import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitBranch, Shield, TrendingDown, Scale, Play, CheckCircle,
  XCircle, ArrowRight, Zap, Clock, AlertTriangle, ChevronUp,
  ChevronDown, Info, Sparkles, Cpu, Check, Layers
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import StatusBadge from '../components/common/StatusBadge';
import { processorData, routingHistory } from '../data/mockData';
import { formatCurrency, formatPercent, truncateId, getRelativeTime } from '../utils/formatters';
import { CURRENCIES, PAYMENT_METHODS } from '../utils/constants';
import { useApp } from '../context/AppContext';

const PROC_COLORS = { razorpay: '#528FF0', cashfree: '#6C5CE7', payu: '#00C853', stripe: '#635BFF' };

const strategyCards = [
  {
    id: 'max_auth',
    name: 'Maximize Authorization',
    tag: 'Highest Reliability',
    desc: 'Prioritizes gateways with highest authorization rate. Best for premium ticket sizes and high-conversion checkouts.',
    icon: Shield,
    accent: '#16C784'
  },
  {
    id: 'min_cost',
    name: 'Minimize Cost (MDR)',
    tag: 'Max Margin',
    desc: 'Prioritizes lower processing fees and MDR rate while enforcing acceptable SLA and availability baselines.',
    icon: TrendingDown,
    accent: '#3B82F6'
  },
  {
    id: 'balanced',
    name: 'Balanced Dynamic',
    tag: 'Recommended',
    desc: 'Intelligently weighs both authorization probability and interchange fees to maximize net merchant revenue.',
    icon: Scale,
    accent: '#D4AF37'
  },
];

export default function SmartRouting() {
  const { addNotification } = useApp();
  const [strategy, setStrategy] = useState('balanced');
  const [authWeight, setAuthWeight] = useState(70);
  const [costWeight, setCostWeight] = useState(30);
  const [minAuthRate, setMinAuthRate] = useState(90);
  const [maxResponseTime, setMaxResponseTime] = useState(500);
  const [availabilityReq, setAvailabilityReq] = useState(99.5);
  const [backupEnabled, setBackupEnabled] = useState(true);
  const [priority, setPriority] = useState(['razorpay', 'cashfree', 'payu', 'stripe']);

  // Simulator state
  const [simAmount, setSimAmount] = useState(5000);
  const [simCurrency, setSimCurrency] = useState('INR');
  const [simMethod, setSimMethod] = useState('upi');
  const [simMerchant, setSimMerchant] = useState('ACME_001');
  const [simRunning, setSimRunning] = useState(false);
  const [simStep, setSimStep] = useState(-1);
  const [simResult, setSimResult] = useState(null);

  const handleAuthWeight = (v) => {
    const val = Number(v);
    setAuthWeight(val);
    setCostWeight(100 - val);
  };

  const movePriority = (idx, dir) => {
    const arr = [...priority];
    const swap = idx + dir;
    if (swap < 0 || swap >= arr.length) return;
    [arr[idx], arr[swap]] = [arr[swap], arr[idx]];
    setPriority(arr);
  };

  const runSimulation = useCallback(() => {
    setSimRunning(true);
    setSimResult(null);
    setSimStep(0);

    const steps = [
      { label: 'Ingesting Inbound Transaction', detail: `${formatCurrency(simAmount, simCurrency)} via ${simMethod.replace(/_/g, ' ')}` },
      { label: 'Currency Filter Pass', detail: `Checking multi-currency support for ${simCurrency}` },
      { label: 'Payment Method Compatibility', detail: `Verifying route for ${simMethod.replace(/_/g, ' ')}` },
      { label: 'Merchant Risk & Limits Validation', detail: `Validating Merchant: ${simMerchant}` },
      { label: 'Health & Latency Check', detail: 'Telemetry analysis across connected gateways' },
      { label: 'Heuristic Scoring Execution', detail: `${authWeight}% Auth / ${costWeight}% MDR optimization weights` },
      { label: 'Backup Failover Route Mapped', detail: 'Standby processor assigned for retry mitigation' },
      { label: 'Optimal Route Selected', detail: 'Routing decision finalized' },
    ];

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setSimStep(step);
      if (step >= steps.length - 1) {
        clearInterval(interval);
        // Calculate deterministic routing result
        const eligible = [];
        const ineligible = [];
        processorData.forEach(p => {
          if (!p.supportedCurrencies.includes(simCurrency)) {
            ineligible.push({ ...p, reason: `Does not support ${simCurrency} currency settlements` });
            return;
          }
          if (!p.supportedMethods.includes(simMethod)) {
            ineligible.push({ ...p, reason: `Does not support ${simMethod.replace(/_/g, ' ')} method` });
            return;
          }
          const score = +((p.authRate * authWeight / 100) + ((100 - p.processingFee) * costWeight / 100)).toFixed(1);
          eligible.push({ ...p, score, estimatedFee: +(simAmount * p.processingFee / 100).toFixed(2) });
        });
        eligible.sort((a, b) => b.score - a.score);
        setSimResult({ selected: eligible[0] || null, alternatives: eligible.slice(1), ineligible, steps });
        setSimRunning(false);
      }
    }, 450);
  }, [simAmount, simCurrency, simMethod, simMerchant, authWeight, costWeight]);

  const simSteps = [
    { label: 'Ingesting Inbound Transaction', detail: `${formatCurrency(simAmount, simCurrency)} via ${simMethod.replace(/_/g, ' ')}` },
    { label: 'Currency Filter Pass', detail: `Checking currency support for ${simCurrency}` },
    { label: 'Method Compatibility Matrix', detail: `Verifying route for ${simMethod.replace(/_/g, ' ')}` },
    { label: 'Merchant Limits Validation', detail: `Merchant ${simMerchant} check` },
    { label: 'Health & Latency Telemetry', detail: 'Evaluating processor health and response SLAs' },
    { label: 'Heuristic Weighted Scoring', detail: `${authWeight}% Auth vs ${costWeight}% Cost applied` },
    { label: 'Backup Failover Route Mapped', detail: 'Standby aggregator mapped' },
    { label: 'Optimal Route Decision Finalized ✓', detail: 'Routing complete' },
  ];

  return (
    <div className="space-y-6 pb-6">
      <PageHeader
        title="Smart Routing Engine"
        subtitle="AI-driven payment orchestration layer routing transactions dynamically to maximize authorization and minimize fees."
        actions={
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-[rgba(212,175,55,0.12)] border border-[rgba(212,175,55,0.3)] text-[#F5D76E] flex items-center gap-1.5">
              <Cpu size={12} className="text-[#D4AF37]" />
              Active Strategy: {strategyCards.find(s => s.id === strategy)?.name}
            </span>
          </div>
        }
      />

      {/* SECTION A: Strategy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {strategyCards.map((s, i) => {
          const isActive = strategy === s.id;
          const Icon = s.icon;
          return (
            <motion.div
              key={s.id}
              onClick={() => {
                setStrategy(s.id);
                addNotification({
                  type: 'success',
                  title: 'Strategy Updated',
                  message: `Switched routing strategy to ${s.name}.`
                });
              }}
              whileHover={{ y: -3 }}
              className={`relative rounded-2xl p-5 border cursor-pointer transition-all duration-300 overflow-hidden flex flex-col justify-between ${
                isActive
                  ? 'bg-gradient-to-b from-[#191710] to-[#0D0C08] border-[#D4AF37] shadow-[0_10px_35px_rgba(212,175,55,0.15)] ring-1 ring-[#D4AF37]/50'
                  : 'bg-[#0E0E14] border-white/5 hover:border-[rgba(212,175,55,0.25)] hover:bg-[#12121A]'
              }`}
            >
              {/* Top Accent Ribbon */}
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#A67C00] via-[#D4AF37] to-[#F5D76E]" />
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isActive ? 'bg-[rgba(212,175,55,0.2)] text-[#F5D76E]' : 'bg-white/5 text-[#6E6E80]'}`}>
                    <Icon size={18} />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${isActive ? 'bg-[rgba(212,175,55,0.15)] border-[rgba(212,175,55,0.3)] text-[#F5D76E]' : 'bg-white/5 border-white/10 text-[#626274]'}`}>
                    {s.tag}
                  </span>
                </div>

                <h2 className={`text-sm font-bold tracking-tight mb-1 ${isActive ? 'text-white' : 'text-[#C5C5D2]'}`}>
                  {s.name}
                </h2>
                <p className="text-xs text-[#7E7E92] leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-[#626275]">
                  {isActive ? '● Currently Active' : 'Select Strategy'}
                </span>
                {isActive && <Check size={14} className="text-[#D4AF37]" />}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* SECTION B: Routing Configuration Sliders */}
      <div className="rounded-2xl bg-gradient-to-b from-[#101016] to-[#0A0A0E] border border-[rgba(212,175,55,0.15)] p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.2)] flex items-center justify-center text-[#D4AF37]">
              <Zap size={14} />
            </div>
            <h2 className="text-sm font-bold text-white">Heuristic Weight Multipliers (Total: 100%)</h2>
          </div>
          <span className="text-xs text-[#8E8E9E]">Dynamic Balancing</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
          {/* Slider 1: Auth Weight */}
          <div className="space-y-2 p-4 rounded-xl bg-[#08080C] border border-white/5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-[#8E8E9E]">Authorization Weight Multiplier</span>
              <span className="text-[#D4AF37] font-bold font-mono text-sm">{authWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={authWeight}
              onChange={e => handleAuthWeight(e.target.value)}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-[#555566]">
              <span>Cost Priority</span>
              <span>Approval Priority</span>
            </div>
          </div>

          {/* Slider 2: Cost Weight */}
          <div className="space-y-2 p-4 rounded-xl bg-[#08080C] border border-white/5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-[#8E8E9E]">Processing Cost Reduction (MDR)</span>
              <span className="text-[#3B82F6] font-bold font-mono text-sm">{costWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={costWeight}
              onChange={e => {
                const c = Number(e.target.value);
                setCostWeight(c);
                setAuthWeight(100 - c);
              }}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-[#555566]">
              <span>Auth Priority</span>
              <span>Margin Priority</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/5">
          <div className="flex items-center gap-4 text-xs text-[#8E8E9E]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={backupEnabled}
                onChange={e => setBackupEnabled(e.target.checked)}
                className="accent-[#D4AF37] rounded"
              />
              <span>Auto-failover to backup gateway on timeout</span>
            </label>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setAuthWeight(70);
                setCostWeight(30);
                addNotification({ type: 'info', message: 'Weights reset to standard 70/30 baseline.' });
              }}
            >
              Reset 70/30
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => addNotification({ type: 'success', message: 'Heuristic weights persisted to routing engine.' })}
            >
              Save Configuration
            </Button>
          </div>
        </div>
      </div>

      {/* SECTION D: Professional Interactive Payment Routing Simulator */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#14120C] via-[#0E0E14] to-[#08080C] border-2 border-[rgba(212,175,55,0.35)] p-6 sm:p-7 shadow-2xl overflow-hidden">
        {/* Glow Halo */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle,rgba(212,175,55,0.1)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F5D76E] mb-1">
              <Sparkles size={14} className="text-[#D4AF37]" />
              <span>Interactive Telemetry Sandbox</span>
            </div>
            <h2 className="text-xl font-black text-white font-['Manrope'] tracking-tight">
              Payment Routing Decision Simulator
            </h2>
            <p className="text-xs text-[#8E8E9E] mt-0.5">
              Simulate an inbound checkout request and observe how PAYFLOW scores and selects optimal gateway candidates.
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-[rgba(212,175,55,0.12)] border border-[rgba(212,175,55,0.3)] text-[#F5D76E] self-start md:self-auto">
            Deterministic Demo Mode
          </span>
        </div>

        {/* Simulator Form Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mb-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#6E6E80]">Ticket Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#D4AF37]">₹</span>
              <input
                type="number"
                value={simAmount}
                onChange={e => setSimAmount(Number(e.target.value))}
                className="w-full bg-[#08080C] border border-white/10 rounded-xl text-xs text-white pl-7 pr-3 py-2.5 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#6E6E80]">Currency</label>
            <select
              value={simCurrency}
              onChange={e => setSimCurrency(e.target.value)}
              className="w-full bg-[#08080C] border border-white/10 rounded-xl text-xs text-white px-3 py-2.5 focus:outline-none focus:border-[#D4AF37] cursor-pointer"
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#6E6E80]">Payment Method</label>
            <select
              value={simMethod}
              onChange={e => setSimMethod(e.target.value)}
              className="w-full bg-[#08080C] border border-white/10 rounded-xl text-xs text-white px-3 py-2.5 focus:outline-none focus:border-[#D4AF37] cursor-pointer"
            >
              {PAYMENT_METHODS.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#6E6E80]">Merchant ID</label>
            <input
              type="text"
              value={simMerchant}
              onChange={e => setSimMerchant(e.target.value)}
              className="w-full bg-[#08080C] border border-white/10 rounded-xl text-xs text-white font-mono px-3 py-2.5 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="flex items-end">
            <Button
              variant="primary"
              size="md"
              icon={Play}
              onClick={runSimulation}
              loading={simRunning}
              fullWidth
              className="h-[42px]"
            >
              {simRunning ? 'Executing...' : 'Run Simulation'}
            </Button>
          </div>
        </div>

        {/* 8-Stage Dynamic Stepper Pipeline */}
        <AnimatePresence>
          {(simRunning || simResult) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-5 rounded-2xl bg-[#08080C] border border-[rgba(212,175,55,0.2)]"
            >
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] mb-3 flex items-center gap-1.5">
                <Cpu size={12} /> Live Execution Pipeline Telemetry
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {simSteps.map((step, idx) => {
                  const isDone = idx <= simStep;
                  const isCurrent = idx === simStep && simRunning;
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border transition-all duration-300 ${
                        isCurrent
                          ? 'bg-[rgba(212,175,55,0.1)] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.2)] scale-[1.02]'
                          : isDone
                            ? 'bg-[#0E0E14] border-white/10'
                            : 'bg-transparent border-white/5 opacity-40'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isDone ? 'bg-[#16C784] text-[#080808]' : 'bg-white/10 text-[#626274]'
                        }`}>
                          {isDone ? '✓' : idx + 1}
                        </div>
                        <span className={`text-[11px] font-bold truncate ${isDone ? 'text-white' : 'text-[#626274]'}`}>
                          {step.label}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#7E7E92] truncate pl-7">
                        {step.detail}
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Simulation Decision Card Result */}
        <AnimatePresence>
          {simResult && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {simResult.selected ? (
                <div className="p-6 rounded-2xl bg-gradient-to-r from-[#17150C] via-[#0F0E14] to-[#0A0A0E] border-2 border-[#D4AF37] shadow-2xl relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3.5">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-xl"
                        style={{ background: PROC_COLORS[simResult.selected.id] }}
                      >
                        {simResult.selected.name[0]}
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">
                          ★ Selected Gateway Winner
                        </div>
                        <h3 className="text-xl font-black text-white font-['Manrope']">
                          {simResult.selected.name}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-[#08080C] px-4 py-2 rounded-xl border border-white/10">
                      <div>
                        <div className="text-[9px] uppercase tracking-wider text-[#6E6E80] font-bold">Composite Score</div>
                        <div className="text-xl font-black text-[#F5D76E] font-['Manrope']">{simResult.selected.score} / 100</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-3">
                    <div className="p-3 rounded-xl bg-[#08080C]/80 border border-white/5">
                      <span className="text-[#6E6E80] text-[10px]">Auth Success Probability</span>
                      <div className="text-sm font-bold text-[#16C784] font-['Manrope'] mt-0.5">{simResult.selected.authRate}%</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#08080C]/80 border border-white/5">
                      <span className="text-[#6E6E80] text-[10px]">Estimated MDR Fee</span>
                      <div className="text-sm font-bold text-white font-['Manrope'] mt-0.5">{formatCurrency(simResult.selected.estimatedFee, simCurrency)}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#08080C]/80 border border-white/5">
                      <span className="text-[#6E6E80] text-[10px]">Median API Latency</span>
                      <div className="text-sm font-bold text-[#F5D76E] font-['Manrope'] mt-0.5">{simResult.selected.avgResponseTime}ms</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#08080C]/80 border border-white/5">
                      <span className="text-[#6E6E80] text-[10px]">Availability SLA</span>
                      <div className="text-sm font-bold text-white font-['Manrope'] mt-0.5">{simResult.selected.availability}%</div>
                    </div>
                  </div>

                  <div className="text-xs text-[#9E9EB0] bg-[#08080C]/60 p-3 rounded-xl border border-white/5">
                    <span className="text-[#D4AF37] font-semibold">Decision Engine Rationale: </span>
                    Routed via {strategy.replace(/_/g, ' ')} strategy. {simResult.selected.name} achieved the highest composite weighted index ({simResult.selected.score}) given {authWeight}% authorization rate weight and {costWeight}% processing fee weight.
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-[rgba(234,57,67,0.1)] border border-[rgba(234,57,67,0.3)] text-center text-xs text-[#EA3943]">
                  No gateway candidates met both currency and payment method constraints.
                </div>
              )}

              {/* Ineligible Processors */}
              {simResult.ineligible.length > 0 && (
                <div className="p-4 rounded-xl bg-[#09090D] border border-white/5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#EA3943] mb-2">
                    Ineligible Gateways Excluded
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {simResult.ineligible.map(p => (
                      <div key={p.id} className="p-2.5 rounded-lg bg-[#111117] border border-white/5 flex items-center justify-between">
                        <span className="font-bold text-white">{p.name}</span>
                        <span className="text-[11px] text-[#EA3943]">{p.reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SECTION E: Routing Decision History Ledger */}
      <div className="rounded-2xl bg-gradient-to-b from-[#101016] to-[#0A0A0E] border border-[rgba(212,175,55,0.15)] p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <Clock size={16} className="text-[#D4AF37]" />
            <h2 className="text-sm font-bold text-white">Recent Real-Time Routing Decisions</h2>
          </div>
          <span className="text-[10px] text-[#6E6E80] uppercase tracking-wider font-semibold">Live Audit Trail</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-white/5 text-[#5A5A6D] uppercase text-[9px] tracking-wider font-bold">
                <th className="py-2.5">TXN Hash</th>
                <th className="py-2.5">Selected Route</th>
                <th className="py-2.5 hidden sm:table-cell">Strategy</th>
                <th className="py-2.5 text-center hidden md:table-cell">Currency</th>
                <th className="py-2.5 hidden md:table-cell">Method</th>
                <th className="py-2.5 text-right">Score</th>
                <th className="py-2.5 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {routingHistory.slice(0, 8).map(r => (
                <tr key={r.id} className="hover:bg-[rgba(212,175,55,0.03)] transition-colors">
                  <td className="py-3 font-mono text-[#D4AF37] font-semibold">{truncateId(r.transactionRef)}</td>
                  <td className="py-3">
                    <span className="flex items-center gap-1.5 font-bold text-white">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: PROC_COLORS[r.selectedProcessor] }} />
                      <span className="capitalize">{r.selectedProcessor}</span>
                    </span>
                  </td>
                  <td className="py-3 text-[#8E8E9E] capitalize hidden sm:table-cell">{r.strategy.replace(/_/g, ' ')}</td>
                  <td className="py-3 text-center hidden md:table-cell">
                    <span className="px-1.5 py-0.5 rounded bg-white/5 text-[#D4AF37] text-[10px] font-mono">{r.currency}</span>
                  </td>
                  <td className="py-3 text-[#8E8E9E] capitalize hidden md:table-cell">{r.paymentMethod.replace(/_/g, ' ')}</td>
                  <td className="py-3 text-right font-bold text-[#F5D76E] font-mono">{r.routingScore}</td>
                  <td className="py-3 text-right text-[#5A5A6D] font-mono text-[10px]">{getRelativeTime(r.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
