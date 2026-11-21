export function formatINR(amount) {
  if (amount == null) return '₹0.00';
  const num = Number(amount);
  const formatted = num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `₹${formatted}`;
}

export function formatCurrency(amount, currency = 'INR') {
  const symbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£', AED: 'د.إ' };
  const sym = symbols[currency] || currency + ' ';
  if (currency === 'INR') return formatINR(amount);
  return `${sym}${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatNumber(num) {
  if (num == null) return '0';
  return Number(num).toLocaleString('en-IN');
}

export function formatPercent(value) {
  if (value == null) return '0%';
  return `${Number(value).toFixed(2)}%`;
}

export function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
}

export function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
}

export function getRelativeTime(dateStr) {
  const now = new Date(); const d = new Date(dateStr);
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(dateStr);
}

export function truncateId(id) {
  if (!id) return '';
  return id.length > 12 ? id.slice(0, 10) + '...' : id;
}
