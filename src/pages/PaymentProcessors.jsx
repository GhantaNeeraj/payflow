import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Server, Plus, Settings, Eye, Power, Shield, Clock,
  Percent, Globe, CreditCard, Activity, ArrowUpDown,
  CheckCircle, XCircle, Zap, Sparkles, Check
} from 'lucide-react';
import MetricCard from '../components/common/MetricCard';
import StatusBadge from '../components/common/StatusBadge';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { processorData as initialProcessors } from '../data/mockData';
import { formatINR, formatNumber, formatPercent } from '../utils/formatters';
import { CURRENCIES, PAYMENT_METHODS } from '../utils/constants';
import { useApp } from '../context/AppContext';

const PROC_COLORS = { razorpay: '#528FF0', cashfree: '#6C5CE7', payu: '#00C853', stripe: '#635BFF' };

export default function PaymentProcessors() {
  const { addNotification } = useApp();
  const [processors, setProcessors] = useState(initialProcessors.map(p => ({ ...p })));
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [detailModal, setDetailModal] = useState(null);
  const [newProcessor, setNewProcessor] = useState({
    name: '', displayName: '', supportedCurrencies: ['INR'],
    supportedMethods: ['upi', 'credit_card'], processingFee: 2.0,
    connectionMode: 'test', enabled: true
  });

  const toggleProcessor = (id) => {
    setProcessors(prev => prev.map(p => {
      if (p.id === id) {
        const nextStatus = p.status === 'active' ? 'inactive' : 'active';
        addNotification({
          type: nextStatus === 'active' ? 'success' : 'warning',
          title: `Processor ${p.name}`,
          message: `${p.name} gateway has been ${nextStatus === 'active' ? 'activated' : 'disabled'}.`
        });
        return { ...p, status: nextStatus };
      }
      return p;
    }));
  };

  const handleAddProcessor = () => {
    if (!newProcessor.name) return;
    addNotification({
      type: 'success',
      title: 'Gateway Configured',
      message: `${newProcessor.displayName || newProcessor.name} integration registered successfully.`
    });
    setAddModalOpen(false);
    setNewProcessor({
      name: '', displayName: '', supportedCurrencies: ['INR'],
      supportedMethods: ['upi', 'credit_card'], processingFee: 2.0,
      connectionMode: 'test', enabled: true
    });
  };

  const bestValues = {
    authRate: Math.max(...processors.map(p => p.authRate)),
    fee: Math.min(...processors.map(p => p.processingFee)),
    response: Math.min(...processors.map(p => p.avgResponseTime)),
    availability: Math.max(...processors.map(p => p.availability)),
  };

  return (
    <div className="space-y-6 pb-6">
      <PageHeader
        title="Payment Gateway Nodes"
        subtitle="Manage connected payment aggregators, track latency benchmarks and routing eligibility."
        actions={
          <Button variant="primary" icon={Plus} onClick={() => setAddModalOpen(true)}>
            Connect Processor
          </Button>
        }
      />

      {/* Gateway Cards 2x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {processors.map((p, i) => {
          const isActive = p.status === 'active';
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`relative rounded-3xl bg-gradient-to-b from-[#111117] via-[#0D0D12] to-[#08080C] border transition-all duration-300 overflow-hidden group shadow-xl ${
                isActive
                  ? 'border-[rgba(212,175,55,0.18)] hover:border-[rgba(212,175,55,0.45)] hover:shadow-[0_12px_40px_rgba(212,175,55,0.1)]'
                  : 'border-white/5 opacity-70'
              }`}
            >
              {/* Brand Top Highlight Ribbon */}
              <div className="h-1.5 w-full" style={{ background: PROC_COLORS[p.id] }} />

              <div className="p-5 sm:p-6 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3.5">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black text-white shadow-lg transition-transform duration-300 group-hover:scale-105"
                      style={{ background: `linear-gradient(135deg, ${PROC_COLORS[p.id]}, #08080C)` }}
                    >
                      {p.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-white tracking-tight">{p.name}</h2>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#8E8E9E]">
                          Production
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <StatusBadge status={p.status} size="sm" />
                        <span className="text-[10px] text-[#5A5A6D]">Uptime: {p.availability}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    onClick={() => toggleProcessor(p.id)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 cursor-pointer ${
                      isActive ? 'bg-[#D4AF37]' : 'bg-[#22222E]'
                    }`}
                    title={isActive ? 'Disable processor' : 'Enable processor'}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-[#08080C] shadow-md transition-transform duration-300 ${
                        isActive ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* 4-KPI Metric Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl bg-[#08080C] border border-white/5">
                    <div className="text-[10px] font-semibold text-[#6E6E80] flex items-center gap-1">
                      <Shield size={11} className="text-[#D4AF37]" /> Auth Rate
                    </div>
                    <div className="text-base font-bold text-white font-['Manrope'] mt-0.5">
                      {p.authRate}%
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#08080C] border border-white/5">
                    <div className="text-[10px] font-semibold text-[#6E6E80] flex items-center gap-1">
                      <Percent size={11} className="text-[#3B82F6]" /> Processing Fee
                    </div>
                    <div className="text-base font-bold text-white font-['Manrope'] mt-0.5">
                      {p.processingFee}%
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#08080C] border border-white/5">
                    <div className="text-[10px] font-semibold text-[#6E6E80] flex items-center gap-1">
                      <Clock size={11} className="text-[#16C784]" /> Avg Latency
                    </div>
                    <div className="text-base font-bold text-[#16C784] font-['Manrope'] mt-0.5">
                      {p.avgResponseTime}ms
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#08080C] border border-white/5">
                    <div className="text-[10px] font-semibold text-[#6E6E80] flex items-center gap-1">
                      <Activity size={11} className="text-[#F0B90B]" /> Monthly Txns
                    </div>
                    <div className="text-base font-bold text-white font-['Manrope'] mt-0.5">
                      {formatNumber(p.totalTransactions)}
                    </div>
                  </div>
                </div>

                {/* Capabilities Tags */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-[10px] text-[#6E6E80]">
                    <span>Currencies:</span>
                    <div className="flex gap-1">
                      {p.supportedCurrencies.map(c => (
                        <span key={c} className="px-1.5 py-0.5 rounded bg-[rgba(212,175,55,0.08)] border border-[rgba(212,175,55,0.2)] text-[#F5D76E] font-mono text-[9px] font-bold">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#6E6E80]">
                    <span>Payment Methods:</span>
                    <div className="flex flex-wrap gap-1 justify-end max-w-[240px]">
                      {p.supportedMethods.map(m => (
                        <span key={m} className="px-1.5 py-0.5 rounded bg-white/5 text-[#A1A1B0] text-[9px] capitalize">
                          {m.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <span className="text-[10px] text-[#555566]">Mode: Full Orchestration</span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" icon={Eye} onClick={() => setDetailModal(p)}>
                      Inspect
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={Settings}
                      onClick={() => addNotification({
                        type: 'info',
                        title: 'Gateway Config',
                        message: `Node settings for ${p.name} updated.`
                      })}
                    >
                      Config
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Comparison Benchmark Table */}
      <div className="rounded-2xl bg-gradient-to-b from-[#101016] to-[#0A0A0E] border border-[rgba(212,175,55,0.15)] p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <ArrowUpDown size={16} className="text-[#D4AF37]" />
            <h2 className="text-sm font-bold text-white">Aggregator Benchmark Comparison</h2>
          </div>
          <span className="text-[10px] text-[#6E6E80] uppercase tracking-wider font-semibold">Real-Time Telemetry</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-white/5 text-[#5A5A6D] uppercase text-[9px] tracking-wider font-bold">
                <th className="py-2.5">Gateway Node</th>
                <th className="py-2.5 text-right">Auth Rate</th>
                <th className="py-2.5 text-right">MDR / Cost</th>
                <th className="py-2.5 text-center hidden md:table-cell">Method Scope</th>
                <th className="py-2.5 text-center hidden md:table-cell">Currencies</th>
                <th className="py-2.5 text-right">Avg Response</th>
                <th className="py-2.5 text-right">SLA Reliability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {processors.map(p => (
                <tr key={p.id} className="hover:bg-[rgba(212,175,55,0.03)] transition-colors">
                  <td className="py-3.5 font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: PROC_COLORS[p.id] }} />
                    <span>{p.name}</span>
                  </td>
                  <td className={`py-3.5 text-right font-extrabold font-['Manrope'] ${p.authRate === bestValues.authRate ? 'text-[#F5D76E]' : 'text-[#F5F5F5]'}`}>
                    {p.authRate}% {p.authRate === bestValues.authRate && '★'}
                  </td>
                  <td className={`py-3.5 text-right font-bold font-['Manrope'] ${p.processingFee === bestValues.fee ? 'text-[#16C784]' : 'text-[#A1A1B0]'}`}>
                    {p.processingFee}%
                  </td>
                  <td className="py-3.5 text-center hidden md:table-cell text-[#8E8E9E]">
                    {p.supportedMethods.length} payment channels
                  </td>
                  <td className="py-3.5 text-center hidden md:table-cell">
                    <div className="flex justify-center gap-1">
                      {p.supportedCurrencies.map(c => (
                        <span key={c} className="text-[9px] px-1 py-0.5 rounded bg-white/5 text-[#8E8E9E] font-mono">
                          {c}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className={`py-3.5 text-right font-mono ${p.avgResponseTime === bestValues.response ? 'text-[#16C784] font-bold' : 'text-[#A1A1B0]'}`}>
                    {p.avgResponseTime}ms
                  </td>
                  <td className="py-3.5 text-right font-mono font-bold text-[#16C784]">
                    {p.availability}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Processor Modal */}
      <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} title="Connect Payment Aggregator" size="md">
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-[rgba(212,175,55,0.08)] border border-[rgba(212,175,55,0.25)] text-xs text-[#F5D76E]">
            💡 Gateway credentials will be stored securely server-side. No API keys are persisted on client browsers.
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8E8E9E] mb-1">Gateway Provider</label>
            <select
              value={newProcessor.name}
              onChange={e => setNewProcessor({ ...newProcessor, name: e.target.value })}
              className="w-full bg-[#0D0D12] border border-white/10 rounded-xl text-xs text-white p-3 focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="">Select Gateway</option>
              <option value="razorpay">Razorpay (India)</option>
              <option value="cashfree">Cashfree Payments</option>
              <option value="payu">PayU Payments</option>
              <option value="stripe">Stripe Global</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8E8E9E] mb-1">Display Alias</label>
            <input
              type="text"
              placeholder="e.g. Razorpay Primary Gateway"
              value={newProcessor.displayName}
              onChange={e => setNewProcessor({ ...newProcessor, displayName: e.target.value })}
              className="w-full bg-[#0D0D12] border border-white/10 rounded-xl text-xs text-white p-3 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-white/5">
            <Button variant="ghost" onClick={() => setAddModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleAddProcessor}>Save & Register</Button>
          </div>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={!!detailModal} onClose={() => setDetailModal(null)} title={`${detailModal?.name} Gateway Details`} size="lg">
        {detailModal && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-[#08080C] border border-white/5">
                <div className="text-[10px] text-[#6E6E80]">Authorization Rate</div>
                <div className="text-base font-bold text-[#F5D76E]">{detailModal.authRate}%</div>
              </div>
              <div className="p-3 rounded-xl bg-[#08080C] border border-white/5">
                <div className="text-[10px] text-[#6E6E80]">Base Processing MDR</div>
                <div className="text-base font-bold text-white">{detailModal.processingFee}%</div>
              </div>
              <div className="p-3 rounded-xl bg-[#08080C] border border-white/5">
                <div className="text-[10px] text-[#6E6E80]">Median Latency</div>
                <div className="text-base font-bold text-[#16C784]">{detailModal.avgResponseTime}ms</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#08080C] border border-white/5 space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">Active Capabilities</div>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded bg-[rgba(22,199,132,0.1)] text-[#16C784] border border-[rgba(22,199,132,0.25)] font-medium">UPI 2.0 & Autopay</span>
                <span className="px-2 py-0.5 rounded bg-[rgba(22,199,132,0.1)] text-[#16C784] border border-[rgba(22,199,132,0.25)] font-medium">RuPay Debit & Credit</span>
                <span className="px-2 py-0.5 rounded bg-[rgba(22,199,132,0.1)] text-[#16C784] border border-[rgba(22,199,132,0.25)] font-medium">Instant Refunds API</span>
                <span className="px-2 py-0.5 rounded bg-[rgba(22,199,132,0.1)] text-[#16C784] border border-[rgba(22,199,132,0.25)] font-medium">3D Secure 2.0</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
