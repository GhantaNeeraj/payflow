const methods = ['upi','credit_card','debit_card','rupay','net_banking','wallet'];
const processors = ['razorpay','cashfree','payu','stripe'];
const statuses = ['success','success','success','success','success','success','success','success','failed','pending'];
const failReasons = ['Insufficient funds','Bank server timeout','Card expired','UPI timeout','Authentication failed','Processor error'];
const strategies = ['max_auth','min_cost','balanced'];
const customerNames = ['Rahul S.','Priya M.','Amit K.','Sneha R.','Vikram J.','Anjali P.','Deepak T.','Meera N.','Suresh B.','Kavita G.'];

function rid(prefix, i) { return `${prefix}${String(i).padStart(5,'0')}`; }
function rdate(dayOffset) {
  const d = new Date(2026, 10, 19);
  d.setDate(d.getDate() - dayOffset);
  d.setHours(Math.floor(Math.random()*14)+8, Math.floor(Math.random()*60), Math.floor(Math.random()*60));
  return d.toISOString();
}

const amounts = [150,299,499,750,1200,1500,2000,2499,3200,4500,5000,7500,8999,12000,15000,18500,22000,25000,35000,42000,55000,67500,85000,99999,125000,150000];

export const processorData = [
  { id:'razorpay', name:'Razorpay', status:'active', authRate:95.2, totalTransactions:8450, processingFee:1.8, avgResponseTime:320, availability:99.95, supportedCurrencies:['INR','USD'], supportedMethods:['upi','credit_card','debit_card','rupay','net_banking','wallet'], monthlyVolume:24000000, lastDowntime:'2026-10-15T03:20:00Z' },
  { id:'cashfree', name:'Cashfree', status:'active', authRate:93.8, totalTransactions:7200, processingFee:1.9, avgResponseTime:280, availability:99.90, supportedCurrencies:['INR','USD','EUR'], supportedMethods:['upi','credit_card','debit_card','net_banking','wallet'], monthlyVolume:18500000, lastDowntime:'2026-10-28T14:10:00Z' },
  { id:'payu', name:'PayU', status:'active', authRate:91.5, totalTransactions:5800, processingFee:2.0, avgResponseTime:350, availability:99.85, supportedCurrencies:['INR'], supportedMethods:['upi','credit_card','debit_card','rupay','net_banking'], monthlyVolume:14200000, lastDowntime:'2026-11-02T09:45:00Z' },
  { id:'stripe', name:'Stripe', status:'active', authRate:96.1, totalTransactions:3400, processingFee:2.9, avgResponseTime:250, availability:99.99, supportedCurrencies:['USD','EUR','GBP','AED'], supportedMethods:['credit_card','debit_card'], monthlyVolume:8500000, lastDowntime:'2026-08-20T01:00:00Z' },
];

// Range-aware KPI statistics
export const rangeStats = {
  today: {
    totalTransactions: 842,
    successfulPayments: 788,
    authorizationRate: 93.58,
    failedTransactions: 54,
    totalProcessingFees: 6420,
    estimatedSavings: 1520,
    changes: { totalTransactions: 8.4, successfulPayments: 9.1, authorizationRate: 0.6, failedTransactions: -4.2, totalProcessingFees: 3.1, estimatedSavings: 14.8 }
  },
  '7d': {
    totalTransactions: 5940,
    successfulPayments: 5530,
    authorizationRate: 93.10,
    failedTransactions: 410,
    totalProcessingFees: 44200,
    estimatedSavings: 10450,
    changes: { totalTransactions: 10.2, successfulPayments: 11.5, authorizationRate: 1.2, failedTransactions: -6.5, totalProcessingFees: 5.2, estimatedSavings: 18.2 }
  },
  '30d': {
    totalTransactions: 24850,
    successfulPayments: 23120,
    authorizationRate: 93.04,
    failedTransactions: 1730,
    totalProcessingFees: 182450,
    estimatedSavings: 42800,
    changes: { totalTransactions: 12.5, successfulPayments: 14.2, authorizationRate: 1.8, failedTransactions: -8.3, totalProcessingFees: 6.1, estimatedSavings: 22.4 }
  },
  '90d': {
    totalTransactions: 74620,
    successfulPayments: 69280,
    authorizationRate: 92.84,
    failedTransactions: 5340,
    totalProcessingFees: 548200,
    estimatedSavings: 128900,
    changes: { totalTransactions: 16.8, successfulPayments: 17.9, authorizationRate: 2.1, failedTransactions: -11.4, totalProcessingFees: 8.7, estimatedSavings: 28.5 }
  },
  custom: {
    totalTransactions: 36200,
    successfulPayments: 33710,
    authorizationRate: 93.12,
    failedTransactions: 2490,
    totalProcessingFees: 265000,
    estimatedSavings: 62400,
    changes: { totalTransactions: 13.1, successfulPayments: 14.5, authorizationRate: 1.9, failedTransactions: -7.8, totalProcessingFees: 6.4, estimatedSavings: 23.1 }
  }
};

export const dashboardStats = rangeStats['30d'];

export const transactions = Array.from({ length: 50 }, (_, i) => {
  const st = statuses[i % statuses.length];
  const proc = processors[i % 4];
  const method = methods[i % 6];
  const curr = i < 40 ? 'INR' : ['USD','EUR','GBP','AED'][i % 4];
  const amt = amounts[i % amounts.length] * (curr === 'INR' ? 1 : curr === 'USD' ? 0.012 : 0.011);
  const fee = +(amt * [0.018,0.019,0.02,0.029][i%4]).toFixed(2);
  const daysOffset = i < 10 ? 0 : i < 25 ? (i % 7) : (i % 30);
  return {
    id: rid('TXN_', 50000 + i),
    customerRef: `CUST_${customerNames[i%10].replace(/[^A-Z]/gi,'').slice(0,4).toUpperCase()}_${1000+i}`,
    amount: +amt.toFixed(2),
    currency: curr,
    paymentMethod: method,
    processor: proc,
    status: st,
    processingFee: fee,
    routingStrategy: strategies[i%3],
    routingReason: st==='success' ? 'Optimal processor selected via balanced routing strategy' : 'Primary processor failed — backup routing attempted',
    failureReason: st==='failed' ? failReasons[i % failReasons.length] : null,
    merchantId: 'ACME_001',
    timestamp: rdate(daysOffset),
  };
});

// Dynamic Volume Series per Range
export const volumeDataByRange = {
  today: [
    { date: '02:00', total: 42, successful: 39, failed: 3, authRate: 92.8 },
    { date: '04:00', total: 28, successful: 27, failed: 1, authRate: 96.4 },
    { date: '06:00', total: 35, successful: 33, failed: 2, authRate: 94.2 },
    { date: '08:00', total: 68, successful: 64, failed: 4, authRate: 94.1 },
    { date: '10:00', total: 110, successful: 104, failed: 6, authRate: 94.5 },
    { date: '12:00', total: 145, successful: 136, failed: 9, authRate: 93.7 },
    { date: '14:00', total: 132, successful: 124, failed: 8, authRate: 93.9 },
    { date: '16:00', total: 118, successful: 110, failed: 8, authRate: 93.2 },
    { date: '18:00', total: 95, successful: 89, failed: 6, authRate: 93.6 },
    { date: '20:00', total: 69, successful: 62, failed: 7, authRate: 89.8 },
  ],
  '7d': [
    { date: '13 Nov', total: 780, successful: 728, failed: 52, authRate: 93.3 },
    { date: '14 Nov', total: 840, successful: 785, failed: 55, authRate: 93.4 },
    { date: '15 Nov', total: 810, successful: 755, failed: 55, authRate: 93.2 },
    { date: '16 Nov', total: 890, successful: 832, failed: 58, authRate: 93.4 },
    { date: '17 Nov', total: 860, successful: 804, failed: 56, authRate: 93.4 },
    { date: '18 Nov', total: 910, successful: 852, failed: 58, authRate: 93.6 },
    { date: '19 Nov', total: 850, successful: 774, failed: 76, authRate: 91.0 },
  ],
  '30d': Array.from({ length: 30 }, (_, i) => {
    const d = new Date(2026, 10, 19);
    d.setDate(d.getDate() - (29 - i));
    const total = 750 + Math.floor(Math.sin(i * 0.5) * 120) + Math.floor(i * 5);
    const failed = 45 + Math.floor(Math.cos(i * 0.4) * 15);
    return {
      date: d.toLocaleDateString('en-IN', { day:'2-digit', month:'short' }),
      total,
      successful: total - failed,
      failed,
      authRate: +(((total - failed) / total) * 100).toFixed(2),
    };
  }),
  '90d': Array.from({ length: 12 }, (_, i) => {
    const total = 5800 + (i * 180);
    const failed = 410 + (i * 10);
    return {
      date: `Wk ${i + 1}`,
      total,
      successful: total - failed,
      failed,
      authRate: +(((total - failed) / total) * 100).toFixed(2),
    };
  }),
  custom: Array.from({ length: 14 }, (_, i) => {
    const total = 820 + (i * 15);
    const failed = 58;
    return {
      date: `D ${i + 1}`,
      total,
      successful: total - failed,
      failed,
      authRate: +(((total - failed) / total) * 100).toFixed(2),
    };
  })
};

export const dailyVolumeData = volumeDataByRange['30d'];

export const paymentMethodDistribution = [
  { method: 'UPI', value: 42, amount: 10500000, transactions: 10437 },
  { method: 'Credit Cards', value: 28, amount: 15200000, transactions: 6958 },
  { method: 'Debit Cards', value: 15, amount: 5800000, transactions: 3728 },
  { method: 'Net Banking', value: 10, amount: 4200000, transactions: 2485 },
  { method: 'Wallets', value: 5, amount: 1300000, transactions: 1243 },
];

export const failoverEvents = Array.from({ length: 15 }, (_, i) => ({
  id: rid('FO_', 1000 + i),
  transactionId: rid('TXN_', 50010 + i * 3),
  primaryProcessor: processors[i % 3],
  failureType: ['timeout','server_error','rate_limit'][i % 3],
  backupProcessor: processors[(i + 1) % 4],
  retryStatus: i % 4 === 3 ? 'failed' : 'success',
  originalAmount: amounts[i % amounts.length],
  currency: 'INR',
  timestamp: rdate(i * 2),
}));

export const systemLogs = Array.from({ length: 25 }, (_, i) => {
  const types = ['payment_received','routing_decision','processor_selected','processor_timeout','backup_selected','payment_response','transaction_recorded'];
  const t = types[i % 7];
  const sev = t === 'processor_timeout' ? 'error' : t === 'backup_selected' ? 'warning' : t === 'routing_decision' || t === 'processor_selected' ? 'success' : 'info';
  const msgs = {
    payment_received: 'Payment request received for ₹5,000.00 via UPI',
    routing_decision: 'Routing engine engaged — balanced optimization strategy',
    processor_selected: `Processor ${processors[i%4]} selected with score 87.${i}`,
    processor_timeout: `${processors[i%4]} timeout after ${3000+i*500}ms`,
    backup_selected: `Backup processor ${processors[(i+1)%4]} selected`,
    payment_response: 'Payment authorization response received',
    transaction_recorded: 'Transaction recorded and confirmed',
  };
  return { id: rid('LOG_', 2000+i), type: t, message: msgs[t], severity: sev, processor: processors[i%4], transactionId: rid('TXN_',50000+i*2), timestamp: rdate(i) };
});

export const routingHistory = Array.from({ length: 20 }, (_, i) => ({
  id: rid('RH_', 3000+i),
  transactionRef: rid('TXN_', 50000+i*2),
  selectedProcessor: processors[i%4],
  strategy: strategies[i%3],
  currency: i < 16 ? 'INR' : ['USD','EUR','GBP','AED'][i%4],
  paymentMethod: methods[i%6],
  routingScore: +(82 + Math.random()*15).toFixed(1),
  decisionReason: `Selected based on ${strategies[i%3]==='max_auth'?'maximum authorization':'balanced optimization'} strategy with highest routing score among eligible processors.`,
  alternativeProcessors: [
    { name: processors[(i+1)%4], score: +(75+Math.random()*10).toFixed(1), reason: 'Lower routing score' },
    { name: processors[(i+2)%4], score: +(65+Math.random()*10).toFixed(1), reason: 'Higher processing fee' },
  ],
  timestamp: rdate(i),
}));

export const analyticsData = {
  authRateOverTime: dailyVolumeData.map(d => ({ date: d.date, rate: d.authRate })),
  processorSuccessRates: dailyVolumeData.map(d => ({
    date: d.date,
    Razorpay: +(93+Math.random()*5).toFixed(1),
    Cashfree: +(91+Math.random()*5).toFixed(1),
    PayU: +(89+Math.random()*5).toFixed(1),
    Stripe: +(94+Math.random()*4).toFixed(1),
  })),
  costComparison: { current: 182450, alternative: 225250, savings: 42800, savingsPercent: 19.0 },
  currencyDistribution: [
    { currency: 'INR', transactions: 21200, volume: 95000000 },
    { currency: 'USD', transactions: 2100, volume: 4500000 },
    { currency: 'EUR', transactions: 850, volume: 1800000 },
    { currency: 'GBP', transactions: 450, volume: 950000 },
    { currency: 'AED', transactions: 250, volume: 600000 },
  ],
  failedPaymentReasons: [
    { reason: 'Insufficient Funds', count: 450 },
    { reason: 'Bank Timeout', count: 380 },
    { reason: 'Card Expired', count: 290 },
    { reason: 'UPI Timeout', count: 250 },
    { reason: 'Auth Failed', count: 180 },
    { reason: 'Processor Error', count: 110 },
    { reason: 'Other', count: 70 },
  ],
  paymentMethodStats: [
    { method:'UPI', transactions:10437, volume:10500000, authRate:94.2, avgFee:1.5, topProcessor:'Razorpay' },
    { method:'Credit Cards', transactions:6958, volume:15200000, authRate:92.8, avgFee:2.1, topProcessor:'Stripe' },
    { method:'Debit Cards', transactions:3728, volume:5800000, authRate:91.5, avgFee:1.8, topProcessor:'Razorpay' },
    { method:'Net Banking', transactions:2485, volume:4200000, authRate:89.3, avgFee:1.9, topProcessor:'Cashfree' },
    { method:'Wallets', transactions:1243, volume:1300000, authRate:95.1, avgFee:1.4, topProcessor:'Cashfree' },
  ],
};
