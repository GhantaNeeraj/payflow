export default function StatusBadge({ status, size = 'md' }) {
  const styles = {
    success: { bg: 'bg-[rgba(22,199,132,0.15)]', text: 'text-[#16C784]', dot: 'bg-[#16C784]' },
    failed: { bg: 'bg-[rgba(234,57,67,0.15)]', text: 'text-[#EA3943]', dot: 'bg-[#EA3943]' },
    pending: { bg: 'bg-[rgba(240,185,11,0.15)]', text: 'text-[#F0B90B]', dot: 'bg-[#F0B90B]' },
    active: { bg: 'bg-[rgba(22,199,132,0.15)]', text: 'text-[#16C784]', dot: 'bg-[#16C784]' },
    inactive: { bg: 'bg-[rgba(104,104,104,0.15)]', text: 'text-[#686868]', dot: 'bg-[#686868]' },
  };
  const s = styles[status] || styles.pending;
  const sz = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${s.bg} ${s.text} ${sz}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
