import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, CheckCircle, XCircle, AlertTriangle, Clock, Activity, Terminal, RefreshCw, Download, Info, ChevronDown } from 'lucide-react';
import MetricCard from '../components/common/MetricCard';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import StatusBadge from '../components/common/StatusBadge';
import { failoverEvents, systemLogs } from '../data/mockData';
import { formatINR, formatDate, truncateId, getRelativeTime } from '../utils/formatters';

const PROC_COLORS = { razorpay: '#528FF0', cashfree: '#6C5CE7', payu: '#00C853', stripe: '#635BFF' };
const failTypeStyles = { timeout: { bg: 'bg-[rgba(240,185,11,0.15)]', text: 'text-[#F0B90B]' }, server_error: { bg: 'bg-[rgba(234,57,67,0.15)]', text: 'text-[#EA3943]' }, rate_limit: { bg: 'bg-[rgba(59,130,246,0.15)]', text: 'text-[#3B82F6]' } };
const sevIcons = { info: { icon: Info, color: '#3B82F6' }, success: { icon: CheckCircle, color: '#16C784' }, warning: { icon: AlertTriangle, color: '#F0B90B' }, error: { icon: XCircle, color: '#EA3943' } };
const typeColors = { payment_received: '#3B82F6', routing_decision: '#D4AF37', processor_selected: '#D4AF37', processor_timeout: '#F0B90B', backup_selected: '#F0B90B', payment_response: '#16C784', transaction_recorded: '#3B82F6' };

export default function FailoverLogs() {
  const [sevFilter, setSevFilter] = useState('all');
  const [failTypeFilter, setFailTypeFilter] = useState('all');
  const [selectedTimeline, setSelectedTimeline] = useState(0);

  const counts = useMemo(() => ({
    total: failoverEvents.length,
    successBackup: failoverEvents.filter(e => e.retryStatus === 'success').length,
    failedBackup: failoverEvents.filter(e => e.retryStatus === 'failed').length,
    downtimeEvents: new Set(failoverEvents.filter(e => e.failureType === 'timeout').map(e => e.primaryProcessor)).size + 2,
  }), []);

  const filteredLogs = useMemo(() => {
    let d = [...systemLogs];
    if (sevFilter !== 'all') d = d.filter(l => l.severity === sevFilter);
    return d;
  }, [sevFilter]);

  const filteredFailovers = useMemo(() => {
    let d = [...failoverEvents];
    if (failTypeFilter !== 'all') d = d.filter(e => e.failureType === failTypeFilter);
    return d;
  }, [failTypeFilter]);

  const timelineSteps = [
    { step: 'Payment Request Received', detail: '₹5,000.00 UPI payment initiated', severity: 'info' },
    { step: 'Routing Decision', detail: 'Smart routing engaged, balanced strategy', severity: 'success' },
    { step: 'Processor Selected', detail: 'Razorpay selected (score: 87.2)', severity: 'success' },
    { step: 'Processor Timeout', detail: 'Razorpay timeout after 5000ms', severity: 'error' },
    { step: 'Backup Routing Triggered', detail: 'Initiating backup routing...', severity: 'warning' },
    { step: 'Backup Processor Selected', detail: 'Cashfree selected as backup', severity: 'warning' },
    { step: 'Payment Authorized', detail: 'Transaction authorized by Cashfree', severity: 'success' },
    { step: 'Transaction Recorded', detail: 'Transaction completed successfully', severity: 'success' },
  ];
  const sevColors = { info: '#3B82F6', success: '#16C784', warning: '#F0B90B', error: '#EA3943' };

  return (
    <div className="space-y-6">
      <PageHeader title="Failover & System Logs" subtitle="Monitor processor reliability, technical failures and backup routing events."
        actions={<div className="flex gap-2"><Button variant="ghost" size="sm" icon={RefreshCw}>Refresh</Button><Button variant="secondary" size="sm" icon={Download}>Export</Button></div>} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Failover Events" value={counts.total} icon={ShieldAlert} accentColor="#F0B90B" />
        <MetricCard title="Successful Backups" value={counts.successBackup} icon={CheckCircle} accentColor="#16C784" />
        <MetricCard title="Failed Backups" value={counts.failedBackup} icon={XCircle} accentColor="#EA3943" />
        <MetricCard title="Downtime Events" value={counts.downtimeEvents} icon={Clock} accentColor="#3B82F6" />
      </div>

      {/* Failover Events */}
      <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.2 }}
        className="bg-[#131313] border border-[rgba(212,175,55,0.15)] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2"><ShieldAlert size={16} className="text-[#D4AF37]" /><h3 className="text-sm font-semibold text-[#F5F5F5]">Failover Events</h3></div>
          <select value={failTypeFilter} onChange={e => setFailTypeFilter(e.target.value)} className="bg-[#101010] border border-[rgba(255,255,255,0.08)] rounded-lg text-xs text-[#A1A1A1] px-3 py-1.5 cursor-pointer focus:outline-none">
            <option value="all">All Types</option><option value="timeout">Timeout</option><option value="server_error">Server Error</option><option value="rate_limit">Rate Limit</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="text-[#686868] border-b border-[rgba(255,255,255,0.06)]">
              <th className="text-left py-2 font-medium">Transaction ID</th>
              <th className="text-left py-2 font-medium">Primary</th>
              <th className="text-left py-2 font-medium">Failure</th>
              <th className="text-left py-2 font-medium hidden sm:table-cell">Backup</th>
              <th className="text-left py-2 font-medium">Status</th>
              <th className="text-right py-2 font-medium hidden md:table-cell">Amount</th>
              <th className="text-right py-2 font-medium">Time</th>
            </tr></thead>
            <tbody>{filteredFailovers.map((e, i) => {
              const ft = failTypeStyles[e.failureType] || failTypeStyles.timeout;
              return (
                <tr key={e.id} className="border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.02)]">
                  <td className="py-2.5 font-mono text-[#D4AF37]">{truncateId(e.transactionId)}</td>
                  <td className="py-2.5"><span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full" style={{ background: PROC_COLORS[e.primaryProcessor] }} /><span className="text-[#A1A1A1] capitalize">{e.primaryProcessor}</span></span></td>
                  <td className="py-2.5"><span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${ft.bg} ${ft.text}`}>{e.failureType.replace('_', ' ')}</span></td>
                  <td className="py-2.5 hidden sm:table-cell"><span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full" style={{ background: PROC_COLORS[e.backupProcessor] }} /><span className="text-[#A1A1A1] capitalize">{e.backupProcessor}</span></span></td>
                  <td className="py-2.5"><StatusBadge status={e.retryStatus} size="sm" /></td>
                  <td className="py-2.5 text-right text-[#F5F5F5] hidden md:table-cell">{formatINR(e.originalAmount)}</td>
                  <td className="py-2.5 text-right text-[#686868]">{getRelativeTime(e.timestamp)}</td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      </motion.div>

      {/* System Event Logs */}
      <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.3 }}
        className="bg-[#131313] border border-[rgba(212,175,55,0.15)] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2"><Terminal size={16} className="text-[#D4AF37]" /><h3 className="text-sm font-semibold text-[#F5F5F5]">System Event Logs</h3></div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(212,175,55,0.1)] text-[#D4AF37] border border-[rgba(212,175,55,0.3)] animate-pulse">● Live</span>
            <div className="flex gap-1">
              {['all','info','success','warning','error'].map(s => (
                <button key={s} onClick={() => setSevFilter(s)}
                  className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-all ${sevFilter===s ? 'bg-[#D4AF37] text-[#080808] font-semibold' : 'bg-[rgba(255,255,255,0.05)] text-[#686868] hover:text-[#A1A1A1]'}`}>
                  {s==='all'?'All':s.charAt(0).toUpperCase()+s.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-[#0D0D0D] rounded-xl overflow-hidden max-h-96 overflow-y-auto">
          {filteredLogs.map((log, i) => {
            const sev = sevIcons[log.severity] || sevIcons.info;
            const SevIcon = sev.icon;
            return (
              <div key={log.id} className="flex items-start gap-3 px-4 py-2.5 border-l-2 hover:bg-[rgba(255,255,255,0.02)] transition-colors" style={{ borderLeftColor: sev.color }}>
                <span className="font-mono text-[10px] text-[#686868] whitespace-nowrap pt-0.5">{new Date(log.timestamp).toLocaleTimeString('en-IN', {hour:'2-digit',minute:'2-digit',second:'2-digit'})}</span>
                <SevIcon size={14} style={{ color: sev.color, flexShrink: 0, marginTop: 2 }} />
                <span className="px-1.5 py-0 rounded text-[9px] font-medium whitespace-nowrap" style={{ background: `${typeColors[log.type]}15`, color: typeColors[log.type] }}>{log.type.replace(/_/g, ' ')}</span>
                <span className="text-xs text-[#A1A1A1] flex-1">{log.message}</span>
                {log.processor && <span className="flex items-center gap-1 text-[10px] text-[#686868] whitespace-nowrap"><span className="w-1 h-1 rounded-full" style={{ background: PROC_COLORS[log.processor] }} />{log.processor}</span>}
                {log.transactionId && <span className="font-mono text-[10px] text-[#D4AF37] whitespace-nowrap">{truncateId(log.transactionId)}</span>}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Transaction Timeline */}
      <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.4 }}
        className="bg-[#131313] border border-[rgba(212,175,55,0.15)] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-5"><Activity size={16} className="text-[#D4AF37]" /><h3 className="text-sm font-semibold text-[#F5F5F5]">Transaction Timeline</h3></div>
        <div className="max-w-xl mx-auto">
          {timelineSteps.map((s, i) => (
            <motion.div key={i} initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.1*i }}
              className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full border-2 flex-shrink-0" style={{ borderColor: sevColors[s.severity], background: sevColors[s.severity] }} />
                {i < timelineSteps.length - 1 && <div className="w-px h-10" style={{ background: `${sevColors[s.severity]}30` }} />}
              </div>
              <div className="pb-5">
                <div className="text-sm font-medium text-[#F5F5F5]">{s.step}</div>
                <div className="text-xs text-[#A1A1A1] mt-0.5">{s.detail}</div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-3 text-[10px] text-[#686868] text-center">These are illustrative demo events. Only eligible retryable technical failures trigger backup routing.</div>
      </motion.div>
    </div>
  );
}
