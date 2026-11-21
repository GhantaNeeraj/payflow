import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeftRight, CheckCircle2, XCircle, Clock, Search,
  Download, RefreshCw, X, ChevronLeft, ChevronRight,
  ArrowUpDown, Copy, Check, Filter, Layers, CreditCard
} from 'lucide-react';
import MetricCard from '../components/common/MetricCard';
import StatusBadge from '../components/common/StatusBadge';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { transactions } from '../data/mockData';
import { formatCurrency, formatDate, formatTime, truncateId, formatNumber, getRelativeTime } from '../utils/formatters';
import { useApp } from '../context/AppContext';
import { useDebounce } from '../hooks/useDebounce';

const PROC_COLORS = { razorpay: '#528FF0', cashfree: '#6C5CE7', payu: '#00C853', stripe: '#635BFF' };

export default function Transactions() {
  const { addNotification, dateRange } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [processorFilter, setProcessorFilter] = useState('all');
  const [currencyFilter, setCurrencyFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [sortField, setSortField] = useState('timestamp');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [copied, setCopied] = useState(false);
  const pageSize = 10;
  const debouncedSearch = useDebounce(search, 250);

  const filtered = useMemo(() => {
    let d = [...transactions];

    // Filter by date range (today, 7d, 30d, 90d)
    const now = new Date('2026-11-19T23:59:59Z').getTime();
    if (dateRange === 'today') {
      d = d.filter(t => (now - new Date(t.timestamp).getTime()) <= 24 * 60 * 60 * 1000);
    } else if (dateRange === '7d') {
      d = d.filter(t => (now - new Date(t.timestamp).getTime()) <= 7 * 24 * 60 * 60 * 1000);
    } else if (dateRange === '30d') {
      d = d.filter(t => (now - new Date(t.timestamp).getTime()) <= 30 * 24 * 60 * 60 * 1000);
    }

    if (debouncedSearch) {
      const s = debouncedSearch.toLowerCase();
      d = d.filter(t => t.id.toLowerCase().includes(s) || t.customerRef.toLowerCase().includes(s));
    }
    if (statusFilter !== 'all') d = d.filter(t => t.status === statusFilter);
    if (processorFilter !== 'all') d = d.filter(t => t.processor === processorFilter);
    if (currencyFilter !== 'all') d = d.filter(t => t.currency === currencyFilter);
    if (methodFilter !== 'all') d = d.filter(t => t.paymentMethod === methodFilter);
    d.sort((a, b) => {
      let va = a[sortField], vb = b[sortField];
      if (sortField === 'timestamp') { va = new Date(va); vb = new Date(vb); }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return d;
  }, [dateRange, debouncedSearch, statusFilter, processorFilter, currencyFilter, methodFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const counts = useMemo(() => ({
    total: filtered.length,
    success: filtered.filter(t => t.status === 'success').length,
    failed: filtered.filter(t => t.status === 'failed').length,
    pending: filtered.filter(t => t.status === 'pending').length,
  }), [filtered]);

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const handleExport = () => {
    const headers = ['Transaction ID', 'Customer Ref', 'Amount', 'Currency', 'Payment Method', 'Processor', 'Status', 'Processing Fee', 'Date'];
    const rows = filtered.map(t => [t.id, t.customerRef, t.amount, t.currency, t.paymentMethod, t.processor, t.status, t.processingFee, t.timestamp]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payflow_transactions_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addNotification({ type: 'success', title: 'Export Complete', message: `${filtered.length} transactions exported to CSV.` });
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setProcessorFilter('all');
    setCurrencyFilter('all');
    setMethodFilter('all');
    setPage(1);
  };

  const copyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-6">
      <PageHeader
        title="Transactions Ledger"
        subtitle="Real-time multi-gateway transaction flow, route attribution, and settlement reconciliation."
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" icon={Download} onClick={handleExport}>
              Export CSV
            </Button>
            <Button
              variant="ghost"
              icon={RefreshCw}
              onClick={() => addNotification({ type: 'info', message: 'Transactions ledger refreshed from memory.' })}
            >
              Refresh
            </Button>
          </div>
        }
      />

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <MetricCard title="All Ingested" value={formatNumber(counts.total)} icon={ArrowLeftRight} />
        <MetricCard title="Settled / Success" value={formatNumber(counts.success)} icon={CheckCircle2} accentColor="#16C784" />
        <MetricCard title="Failed / Declined" value={formatNumber(counts.failed)} icon={XCircle} accentColor="#EA3943" />
        <MetricCard title="Pending Auth" value={formatNumber(counts.pending)} icon={Clock} accentColor="#F0B90B" />
      </div>

      {/* High-Performance Filter Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-b from-[#101016] to-[#0A0A0E] border border-[rgba(212,175,55,0.15)] shadow-xl">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6E6E80]" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Filter by TXN ID or Customer Ref..."
              className="w-full bg-[#08080C] border border-white/10 rounded-xl text-xs text-white pl-9 pr-4 py-2.5 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="bg-[#08080C] border border-white/10 rounded-xl text-xs text-[#9E9EB0] px-3 py-2.5 focus:outline-none focus:border-[#D4AF37] cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
          </select>

          {/* Processor Dropdown */}
          <select
            value={processorFilter}
            onChange={e => { setProcessorFilter(e.target.value); setPage(1); }}
            className="bg-[#08080C] border border-white/10 rounded-xl text-xs text-[#9E9EB0] px-3 py-2.5 focus:outline-none focus:border-[#D4AF37] cursor-pointer"
          >
            <option value="all">All Gateways</option>
            <option value="razorpay">Razorpay</option>
            <option value="cashfree">Cashfree</option>
            <option value="payu">PayU</option>
            <option value="stripe">Stripe</option>
          </select>

          {/* Payment Method Dropdown */}
          <select
            value={methodFilter}
            onChange={e => { setMethodFilter(e.target.value); setPage(1); }}
            className="bg-[#08080C] border border-white/10 rounded-xl text-xs text-[#9E9EB0] px-3 py-2.5 focus:outline-none focus:border-[#D4AF37] cursor-pointer"
          >
            <option value="all">All Methods</option>
            <option value="upi">UPI</option>
            <option value="credit_card">Credit Card</option>
            <option value="debit_card">Debit Card</option>
            <option value="rupay">RuPay</option>
            <option value="net_banking">Net Banking</option>
            <option value="wallet">Wallet</option>
          </select>

          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="rounded-2xl bg-gradient-to-b from-[#101016] to-[#0A0A0E] border border-[rgba(212,175,55,0.15)] shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-white/5 bg-[#08080C] text-[#5A5A6D] uppercase text-[9px] tracking-wider font-bold">
                <th className="py-3 px-4">TXN ID</th>
                <th className="py-3 px-4 hidden lg:table-cell">Customer Ref</th>
                <th className="py-3 px-4 text-right cursor-pointer" onClick={() => handleSort('amount')}>
                  Amount ↕
                </th>
                <th className="py-3 px-4 text-center hidden sm:table-cell">Currency</th>
                <th className="py-3 px-4 hidden md:table-cell">Method</th>
                <th className="py-3 px-4 hidden md:table-cell">Routed Gateway</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right hidden lg:table-cell">MDR Fee</th>
                <th className="py-3 px-4 text-right cursor-pointer" onClick={() => handleSort('timestamp')}>
                  Timestamp ↕
                </th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {paged.map(t => (
                <tr
                  key={t.id}
                  onClick={() => setSelectedTxn(t)}
                  className="hover:bg-[rgba(212,175,55,0.03)] transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-[#D4AF37] group-hover:text-[#F5D76E]">
                    {truncateId(t.id)}
                  </td>
                  <td className="py-3.5 px-4 text-[#8E8E9E] hidden lg:table-cell font-mono text-[11px]">
                    {truncateId(t.customerRef)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-extrabold text-white font-['Manrope']">
                    {formatCurrency(t.amount, t.currency)}
                  </td>
                  <td className="py-3.5 px-4 text-center hidden sm:table-cell">
                    <span className="px-1.5 py-0.5 rounded bg-white/5 text-[#8E8E9E] text-[10px] font-mono">
                      {t.currency}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#8E8E9E] capitalize hidden md:table-cell">
                    {t.paymentMethod.replace(/_/g, ' ')}
                  </td>
                  <td className="py-3.5 px-4 hidden md:table-cell font-medium">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: PROC_COLORS[t.processor] }} />
                      <span className="text-[#A1A1B0] capitalize">{t.processor}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <StatusBadge status={t.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-right text-[#6E6E80] hidden lg:table-cell font-mono">
                    {formatCurrency(t.processingFee, t.currency)}
                  </td>
                  <td className="py-3.5 px-4 text-right text-[#5A5A6D] font-mono text-[10px]">
                    {getRelativeTime(t.timestamp)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedTxn(t); }}
                      className="text-xs font-bold text-[#D4AF37] hover:text-white transition-colors cursor-pointer"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-white/5 bg-[#08080C] flex items-center justify-between text-xs text-[#8E8E9E]">
          <div>
            Showing <span className="text-white font-bold">{(page - 1) * pageSize + 1}</span> to{' '}
            <span className="text-white font-bold">{Math.min(page * pageSize, filtered.length)}</span> of{' '}
            <span className="text-white font-bold">{filtered.length}</span> records
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 py-1 font-bold text-[#F5D76E] bg-[rgba(212,175,55,0.1)] rounded-lg">
              {page} / {totalPages || 1}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Transaction Detail Inspector Modal */}
      <Modal isOpen={!!selectedTxn} onClose={() => setSelectedTxn(null)} title="Transaction Audit Inspector" size="lg">
        {selectedTxn && (
          <div className="space-y-5 text-xs">
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#08080C] border border-white/5">
              <div>
                <span className="text-[10px] text-[#6E6E80] uppercase tracking-wider font-semibold">Transaction ID</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-mono font-bold text-[#D4AF37]">{selectedTxn.id}</span>
                  <button onClick={() => copyId(selectedTxn.id)} className="text-[#6E6E80] hover:text-white transition cursor-pointer">
                    {copied ? <Check size={14} className="text-[#16C784]" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
              <StatusBadge status={selectedTxn.status} size="md" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-[#08080C] border border-white/5">
                <span className="text-[10px] text-[#6E6E80]">Net Amount</span>
                <div className="text-base font-bold text-white font-['Manrope'] mt-0.5">{formatCurrency(selectedTxn.amount, selectedTxn.currency)}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#08080C] border border-white/5">
                <span className="text-[10px] text-[#6E6E80]">Payment Method</span>
                <div className="text-sm font-bold text-white mt-0.5 capitalize">{selectedTxn.paymentMethod.replace(/_/g, ' ')}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#08080C] border border-white/5">
                <span className="text-[10px] text-[#6E6E80]">Routed Aggregator</span>
                <div className="text-sm font-bold text-[#F5D76E] mt-0.5 capitalize">{selectedTxn.processor}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#08080C] border border-white/5">
                <span className="text-[10px] text-[#6E6E80]">MDR Fee Incurred</span>
                <div className="text-sm font-bold text-white font-['Manrope'] mt-0.5">{formatCurrency(selectedTxn.processingFee, selectedTxn.currency)}</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#08080C] border border-white/5 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">Routing Logic Attribution</span>
              <p className="text-xs text-[#9E9EB0] leading-relaxed">
                {selectedTxn.routingReason}
              </p>
            </div>

            {selectedTxn.failureReason && (
              <div className="p-3 rounded-xl bg-[rgba(234,57,67,0.1)] border border-[rgba(234,57,67,0.25)] text-[#EA3943]">
                <span className="font-bold">Decline Classification: </span>
                <span>{selectedTxn.failureReason}</span>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
