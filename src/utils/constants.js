export const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
];

export const PAYMENT_METHODS = [
  { id: 'upi', name: 'UPI', icon: 'Smartphone' },
  { id: 'credit_card', name: 'Credit Card', icon: 'CreditCard' },
  { id: 'debit_card', name: 'Debit Card', icon: 'CreditCard' },
  { id: 'rupay', name: 'RuPay', icon: 'CreditCard' },
  { id: 'net_banking', name: 'Net Banking', icon: 'Building2' },
  { id: 'wallet', name: 'Wallet', icon: 'Wallet' },
];

export const PROCESSORS = [
  { id: 'razorpay', name: 'Razorpay', color: '#528FF0' },
  { id: 'cashfree', name: 'Cashfree', color: '#6C5CE7' },
  { id: 'payu', name: 'PayU', color: '#00C853' },
  { id: 'stripe', name: 'Stripe', color: '#635BFF' },
];

export const TRANSACTION_STATUSES = [
  { id: 'success', name: 'Success', color: '#16C784' },
  { id: 'failed', name: 'Failed', color: '#EA3943' },
  { id: 'pending', name: 'Pending', color: '#F0B90B' },
];

export const ROUTING_STRATEGIES = [
  { id: 'max_auth', name: 'Maximize Authorization', description: 'Prioritize processors with the best historical authorization performance for maximum payment acceptance.', icon: 'Shield' },
  { id: 'min_cost', name: 'Minimize Cost', description: 'Route to lower-cost processors while maintaining acceptable reliability thresholds.', icon: 'TrendingDown' },
  { id: 'balanced', name: 'Balanced Optimization', description: 'Optimize for both authorization rate and processing cost with intelligent weighting.', icon: 'Scale' },
];

export const DATE_RANGES = [
  { label: 'Today', value: 'today' },
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 30 Days', value: '30d' },
  { label: 'Last 90 Days', value: '90d' },
  { label: 'Custom', value: 'custom' },
];
