import axios from 'axios';
import { processorData, dashboardStats, transactions, dailyVolumeData, paymentMethodDistribution, failoverEvents, systemLogs, routingHistory, analyticsData } from '../data/mockData';

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || '/api' });
const isDemo = () => import.meta.env.VITE_APP_MODE === 'demo';
const delay = (ms = 400) => new Promise(r => setTimeout(r, ms));

export async function getDashboardStats() {
  if (isDemo()) { await delay(); return dashboardStats; }
  return (await api.get('/dashboard/stats')).data;
}
export async function getTransactions(filters) {
  if (isDemo()) { await delay(); let d = [...transactions]; if (filters?.status && filters.status!=='all') d=d.filter(t=>t.status===filters.status); if (filters?.processor && filters.processor!=='all') d=d.filter(t=>t.processor===filters.processor); if (filters?.currency && filters.currency!=='all') d=d.filter(t=>t.currency===filters.currency); if (filters?.method && filters.method!=='all') d=d.filter(t=>t.paymentMethod===filters.method); if (filters?.search) { const s=filters.search.toLowerCase(); d=d.filter(t=>t.id.toLowerCase().includes(s)||t.customerRef.toLowerCase().includes(s)); } return d; }
  return (await api.get('/transactions', { params: filters })).data;
}
export async function getProcessors() {
  if (isDemo()) { await delay(); return processorData; }
  return (await api.get('/processors')).data;
}
export async function simulateRouting(params) {
  if (isDemo()) {
    await delay(600);
    const { currency, paymentMethod, amount, authWeight = 70, costWeight = 30 } = params;
    const eligible = []; const ineligible = [];
    processorData.forEach(p => {
      if (!p.supportedCurrencies.includes(currency)) { ineligible.push({ ...p, reason: `Does not support ${currency} currency` }); return; }
      if (!p.supportedMethods.includes(paymentMethod)) { ineligible.push({ ...p, reason: `Does not support ${paymentMethod.replace('_',' ')} payments` }); return; }
      const score = +((p.authRate * authWeight / 100) + ((100 - p.processingFee) * costWeight / 100)).toFixed(1);
      eligible.push({ ...p, score, estimatedFee: +(amount * p.processingFee / 100).toFixed(2) });
    });
    eligible.sort((a, b) => b.score - a.score);
    return { selected: eligible[0] || null, alternatives: eligible.slice(1), ineligible };
  }
  return (await api.post('/routing/simulate', params)).data;
}
export async function getAnalytics() { if (isDemo()) { await delay(); return analyticsData; } return (await api.get('/analytics')).data; }
export async function getFailoverLogs() { if (isDemo()) { await delay(); return { failoverEvents, systemLogs }; } return (await api.get('/failover/logs')).data; }
export async function getRoutingLogs() { if (isDemo()) { await delay(); return routingHistory; } return (await api.get('/routing/logs')).data; }
export async function getMerchantProfile() { if (isDemo()) { await delay(); return { businessName:'Acme Commerce', merchantId:'ACME_001', email:'payments@acmecommerce.in', country:'India', currency:'INR', timezone:'Asia/Kolkata' }; } return (await api.get('/merchant/profile')).data; }
export async function updateMerchantProfile(d) { if (isDemo()) { await delay(); return d; } return (await api.put('/merchant/profile',d)).data; }
export { dailyVolumeData, paymentMethodDistribution, processorData, transactions, routingHistory, failoverEvents, systemLogs };
