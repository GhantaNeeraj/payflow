import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, CreditCard, GitBranch, Bell, Code, Shield, 
  Save, RotateCw, Copy, Check, ExternalLink, AlertCircle
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import { CURRENCIES, PAYMENT_METHODS, PROCESSORS } from '../utils/constants';
import { useApp } from '../context/AppContext';

export default function Settings() {
  const { addNotification } = useApp();
  const [activeTab, setActiveTab] = useState('profile');
  const [copied, setCopied] = useState(false);

  // Profile Form
  const [profile, setProfile] = useState({
    businessName: 'Acme Commerce',
    merchantId: 'ACME_001',
    businessEmail: 'payments@acmecommerce.in',
    country: 'India',
    defaultCurrency: 'INR',
    timeZone: 'Asia/Kolkata (IST)',
    category: 'E-Commerce',
    monthlyVolume: '₹1-5 Crores'
  });

  // Payment Preferences
  const [paymentPrefs, setPaymentPrefs] = useState({
    defaultCurrency: 'INR',
    supportedCurrencies: ['INR', 'USD', 'EUR'],
    enabledMethods: ['upi', 'credit_card', 'debit_card', 'rupay', 'net_banking', 'wallet'],
    preferredProcessor: 'razorpay',
    autoAcceptPartial: false,
    timeoutSeconds: 30
  });

  // Routing Preferences
  const [routingPrefs, setRoutingPrefs] = useState({
    defaultStrategy: 'balanced',
    authWeight: 70,
    costWeight: 30,
    backupRouting: true,
    maxRetries: 2,
    retryDelayMs: 1000
  });

  // Notification Preferences
  const [notifications, setNotifications] = useState({
    paymentSuccess: true,
    paymentFailed: true,
    largeTransaction: true,
    processorDowntime: true,
    failoverEvents: true,
    dailySummary: true,
    weeklyAnalytics: false,
    systemAlerts: true,
    securityAlerts: true,
    emailChannel: true,
    inAppChannel: true,
    webhookChannel: false
  });

  // API Config
  const [apiConfig, setApiConfig] = useState({
    apiUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    environment: 'development',
    timeout: 30000,
    demoMode: true
  });

  const copyMerchantId = () => {
    navigator.clipboard.writeText(profile.merchantId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    addNotification({
      type: 'success',
      title: 'Settings Saved',
      message: 'All configuration changes have been updated successfully.'
    });
  };

  const handleReset = () => {
    addNotification({
      type: 'info',
      title: 'Settings Reset',
      message: 'Reverted configuration back to default values.'
    });
  };

  const handleAuthWeight = (v) => {
    const val = Number(v);
    setRoutingPrefs(prev => ({
      ...prev,
      authWeight: val,
      costWeight: 100 - val
    }));
  };

  const tabs = [
    { id: 'profile', label: 'Merchant Profile', icon: Building2 },
    { id: 'payment', label: 'Payment Preferences', icon: CreditCard },
    { id: 'routing', label: 'Routing Engine', icon: GitBranch },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'api', label: 'API & Environment', icon: Code },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Manage your merchant account, platform configuration and preferences."
        actions={
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" icon={RotateCw} onClick={handleReset}>
              Reset
            </Button>
            <Button variant="primary" size="sm" icon={Save} onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-[rgba(255,255,255,0.08)] pb-1">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[rgba(212,175,55,0.1)] text-[#D4AF37] border-b-2 border-[#D4AF37]'
                  : 'text-[#A1A1A1] hover:text-[#F5F5F5] hover:bg-[rgba(255,255,255,0.03)]'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-[#131313] border border-[rgba(212,175,55,0.15)] rounded-xl p-6"
      >
        {/* Profile */}
        {activeTab === 'profile' && (
          <div className="space-y-6 max-w-4xl">
            <div className="border-b border-[rgba(255,255,255,0.06)] pb-4">
              <h3 className="text-base font-semibold text-[#F5F5F5]">Business Profile</h3>
              <p className="text-xs text-[#A1A1A1] mt-1">General enterprise merchant details and localization parameters.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-[#A1A1A1] mb-1.5">Business Name</label>
                <input
                  type="text"
                  value={profile.businessName}
                  onChange={e => setProfile({ ...profile, businessName: e.target.value })}
                  className="w-full bg-[#101010] border border-[rgba(255,255,255,0.08)] rounded-lg text-sm text-[#F5F5F5] px-3.5 py-2.5 focus:outline-none focus:border-[#D4AF37]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A1A1A1] mb-1.5">Merchant ID</label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={profile.merchantId}
                    className="w-full bg-[#0D0D0D] border border-[rgba(255,255,255,0.06)] rounded-lg text-sm font-mono text-[#D4AF37] px-3.5 py-2.5 focus:outline-none cursor-default pr-10"
                  />
                  <button
                    onClick={copyMerchantId}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#686868] hover:text-[#F5F5F5] cursor-pointer"
                  >
                    {copied ? <Check size={16} className="text-[#16C784]" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A1A1A1] mb-1.5">Business Email</label>
                <input
                  type="email"
                  value={profile.businessEmail}
                  onChange={e => setProfile({ ...profile, businessEmail: e.target.value })}
                  className="w-full bg-[#101010] border border-[rgba(255,255,255,0.08)] rounded-lg text-sm text-[#F5F5F5] px-3.5 py-2.5 focus:outline-none focus:border-[#D4AF37]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A1A1A1] mb-1.5">Country / Jurisdiction</label>
                <select
                  value={profile.country}
                  onChange={e => setProfile({ ...profile, country: e.target.value })}
                  className="w-full bg-[#101010] border border-[rgba(255,255,255,0.08)] rounded-lg text-sm text-[#F5F5F5] px-3.5 py-2.5 focus:outline-none focus:border-[#D4AF37]/50 cursor-pointer"
                >
                  <option value="India">India (Primary Market)</option>
                  <option value="Singapore">Singapore</option>
                  <option value="United Arab Emirates">United Arab Emirates</option>
                  <option value="United States">United States</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A1A1A1] mb-1.5">Default Operational Currency</label>
                <select
                  value={profile.defaultCurrency}
                  onChange={e => setProfile({ ...profile, defaultCurrency: e.target.value })}
                  className="w-full bg-[#101010] border border-[rgba(255,255,255,0.08)] rounded-lg text-sm text-[#F5F5F5] px-3.5 py-2.5 focus:outline-none focus:border-[#D4AF37]/50 cursor-pointer"
                >
                  {CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>{c.code} — {c.name} ({c.symbol})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A1A1A1] mb-1.5">Time Zone</label>
                <select
                  value={profile.timeZone}
                  onChange={e => setProfile({ ...profile, timeZone: e.target.value })}
                  className="w-full bg-[#101010] border border-[rgba(255,255,255,0.08)] rounded-lg text-sm text-[#F5F5F5] px-3.5 py-2.5 focus:outline-none focus:border-[#D4AF37]/50 cursor-pointer"
                >
                  <option value="Asia/Kolkata (IST)">Asia/Kolkata (IST +05:30)</option>
                  <option value="UTC">UTC (Coordinated Universal Time)</option>
                  <option value="America/New_York (EST)">America/New_York (EST)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Payment Preferences */}
        {activeTab === 'payment' && (
          <div className="space-y-6 max-w-4xl">
            <div className="border-b border-[rgba(255,255,255,0.06)] pb-4">
              <h3 className="text-base font-semibold text-[#F5F5F5]">Payment Gateway Preferences</h3>
              <p className="text-xs text-[#A1A1A1] mt-1">Configure supported payment methods, currencies, and processor restrictions.</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#A1A1A1] mb-2.5">Enabled Payment Methods</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PAYMENT_METHODS.map(m => {
                  const isChecked = paymentPrefs.enabledMethods.includes(m.id);
                  return (
                    <label
                      key={m.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        isChecked 
                          ? 'bg-[rgba(212,175,55,0.05)] border-[rgba(212,175,55,0.3)] text-[#F5F5F5]' 
                          : 'bg-[#101010] border-[rgba(255,255,255,0.06)] text-[#686868]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={e => {
                          const updated = e.target.checked
                            ? [...paymentPrefs.enabledMethods, m.id]
                            : paymentPrefs.enabledMethods.filter(x => x !== m.id);
                          setPaymentPrefs({ ...paymentPrefs, enabledMethods: updated });
                        }}
                        className="accent-[#D4AF37]"
                      />
                      <span className="text-xs font-medium">{m.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#A1A1A1] mb-2.5">Active Currencies Accepted</label>
              <div className="flex flex-wrap gap-2.5">
                {CURRENCIES.map(c => {
                  const isChecked = paymentPrefs.supportedCurrencies.includes(c.code);
                  return (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => {
                        const updated = isChecked
                          ? paymentPrefs.supportedCurrencies.filter(x => x !== c.code)
                          : [...paymentPrefs.supportedCurrencies, c.code];
                        setPaymentPrefs({ ...paymentPrefs, supportedCurrencies: updated });
                      }}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        isChecked
                          ? 'bg-[rgba(212,175,55,0.1)] border-[#D4AF37] text-[#D4AF37]'
                          : 'bg-[#101010] border-[rgba(255,255,255,0.06)] text-[#686868]'
                      }`}
                    >
                      {c.code} ({c.symbol})
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div>
                <label className="block text-xs font-medium text-[#A1A1A1] mb-1.5">Default Fallback Processor</label>
                <select
                  value={paymentPrefs.preferredProcessor}
                  onChange={e => setPaymentPrefs({ ...paymentPrefs, preferredProcessor: e.target.value })}
                  className="w-full bg-[#101010] border border-[rgba(255,255,255,0.08)] rounded-lg text-sm text-[#F5F5F5] px-3.5 py-2.5 focus:outline-none focus:border-[#D4AF37]/50 cursor-pointer"
                >
                  {PROCESSORS.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A1A1A1] mb-1.5">Payment Expiration Timeout (seconds)</label>
                <input
                  type="number"
                  value={paymentPrefs.timeoutSeconds}
                  onChange={e => setPaymentPrefs({ ...paymentPrefs, timeoutSeconds: Number(e.target.value) })}
                  className="w-full bg-[#101010] border border-[rgba(255,255,255,0.08)] rounded-lg text-sm text-[#F5F5F5] px-3.5 py-2.5 focus:outline-none focus:border-[#D4AF37]/50"
                />
              </div>
            </div>
          </div>
        )}

        {/* Routing Preferences */}
        {activeTab === 'routing' && (
          <div className="space-y-6 max-w-4xl">
            <div className="border-b border-[rgba(255,255,255,0.06)] pb-4">
              <h3 className="text-base font-semibold text-[#F5F5F5]">Routing Engine Defaults</h3>
              <p className="text-xs text-[#A1A1A1] mt-1">Configure global heuristics, weights, and failover safeguards.</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#A1A1A1] mb-1.5">Default Strategy</label>
              <select
                value={routingPrefs.defaultStrategy}
                onChange={e => setRoutingPrefs({ ...routingPrefs, defaultStrategy: e.target.value })}
                className="w-full bg-[#101010] border border-[rgba(255,255,255,0.08)] rounded-lg text-sm text-[#F5F5F5] px-3.5 py-2.5 focus:outline-none focus:border-[#D4AF37]/50 cursor-pointer"
              >
                <option value="balanced">Balanced Optimization (Success Rate + Fee minimization)</option>
                <option value="max_auth">Maximize Authorization (Pure reliability priority)</option>
                <option value="min_cost">Minimize Processing Cost (Fee reduction priority)</option>
              </select>
            </div>

            <div className="bg-[#0D0D0D] rounded-xl p-4 border border-[rgba(255,255,255,0.06)] space-y-4">
              <div className="flex justify-between text-xs">
                <span className="text-[#A1A1A1]">Authorization Weight:</span>
                <span className="text-[#D4AF37] font-bold">{routingPrefs.authWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={routingPrefs.authWeight}
                onChange={e => handleAuthWeight(e.target.value)}
                className="w-full cursor-pointer"
              />
              <div className="flex justify-between text-xs pt-1">
                <span className="text-[#A1A1A1]">Cost Reduction Weight:</span>
                <span className="text-[#D4AF37] font-bold">{routingPrefs.costWeight}%</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex items-center justify-between p-4 bg-[#0D0D0D] rounded-xl border border-[rgba(255,255,255,0.06)]">
                <div>
                  <div className="text-sm font-medium text-[#F5F5F5]">Automated Failover</div>
                  <div className="text-xs text-[#686868] mt-0.5">Attempt secondary processor on retryable network error</div>
                </div>
                <div
                  onClick={() => setRoutingPrefs({ ...routingPrefs, backupRouting: !routingPrefs.backupRouting })}
                  className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${
                    routingPrefs.backupRouting ? 'bg-[#D4AF37]' : 'bg-[#333]'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-[#080808] transition-transform ${
                      routingPrefs.backupRouting ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A1A1A1] mb-1.5">Max Retry Attempts</label>
                <select
                  value={routingPrefs.maxRetries}
                  onChange={e => setRoutingPrefs({ ...routingPrefs, maxRetries: Number(e.target.value) })}
                  className="w-full bg-[#101010] border border-[rgba(255,255,255,0.08)] rounded-lg text-sm text-[#F5F5F5] px-3.5 py-2.5 focus:outline-none focus:border-[#D4AF37]/50 cursor-pointer"
                >
                  <option value={1}>1 Retry</option>
                  <option value={2}>2 Retries (Recommended)</option>
                  <option value={3}>3 Retries</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Notifications */}
        {activeTab === 'notifications' && (
          <div className="space-y-6 max-w-4xl">
            <div className="border-b border-[rgba(255,255,255,0.06)] pb-4">
              <h3 className="text-base font-semibold text-[#F5F5F5]">Alerts & Real-time Notifications</h3>
              <p className="text-xs text-[#A1A1A1] mt-1">Receive proactive alerts regarding gateway outages, spikes in failure rates and settlements.</p>
            </div>

            <div className="space-y-3">
              {[
                { id: 'paymentSuccess', label: 'Payment Success Events', desc: 'Notify on high-volume transaction clearance' },
                { id: 'paymentFailed', label: 'Payment Failures & Declines', desc: 'Notify immediately when customer payments are rejected' },
                { id: 'processorDowntime', label: 'Gateway Outages & Degradation', desc: 'Alert when a connected provider response time exceeds 2000ms' },
                { id: 'failoverEvents', label: 'Automatic Failover Triggers', desc: 'Send notification when traffic is rerouted to secondary gateway' },
                { id: 'dailySummary', label: 'Daily Settlement & Performance Digest', desc: 'Morning summary of daily volume, approval rate, and fees' },
                { id: 'securityAlerts', label: 'Security & Anomalous Velocity Alerts', desc: 'Notify when suspicious fraud flags are generated' }
              ].map(item => {
                const isEnabled = notifications[item.id];
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3.5 bg-[#0D0D0D] rounded-xl border border-[rgba(255,255,255,0.04)]"
                  >
                    <div>
                      <div className="text-sm font-medium text-[#F5F5F5]">{item.label}</div>
                      <div className="text-xs text-[#686868] mt-0.5">{item.desc}</div>
                    </div>
                    <div
                      onClick={() => setNotifications({ ...notifications, [item.id]: !isEnabled })}
                      className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${
                        isEnabled ? 'bg-[#D4AF37]' : 'bg-[#333]'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-5 h-5 rounded-full bg-[#080808] transition-transform ${
                          isEnabled ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* API & Environment */}
        {activeTab === 'api' && (
          <div className="space-y-6 max-w-4xl">
            <div className="border-b border-[rgba(255,255,255,0.06)] pb-4">
              <h3 className="text-base font-semibold text-[#F5F5F5]">Backend Architecture & Integration</h3>
              <p className="text-xs text-[#A1A1A1] mt-1">Connect your frontend client to the Node.js/Express orchestration service on Render.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#A1A1A1] mb-1.5">Backend API Endpoint (Render / Local)</label>
                <input
                  type="text"
                  value={apiConfig.apiUrl}
                  onChange={e => setApiConfig({ ...apiConfig, apiUrl: e.target.value })}
                  placeholder="https://payflow-api.onrender.com/api"
                  className="w-full bg-[#101010] border border-[rgba(255,255,255,0.08)] rounded-lg text-sm font-mono text-[#F5F5F5] px-3.5 py-2.5 focus:outline-none focus:border-[#D4AF37]/50"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#A1A1A1] mb-1.5">Environment Mode</label>
                  <select
                    value={apiConfig.environment}
                    onChange={e => setApiConfig({ ...apiConfig, environment: e.target.value })}
                    className="w-full bg-[#101010] border border-[rgba(255,255,255,0.08)] rounded-lg text-sm text-[#F5F5F5] px-3.5 py-2.5 focus:outline-none focus:border-[#D4AF37]/50 cursor-pointer"
                  >
                    <option value="development">Development (Demo Sandbox)</option>
                    <option value="staging">Staging (Integration Testing)</option>
                    <option value="production">Production (Render Cloud)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#A1A1A1] mb-1.5">API Request Timeout (ms)</label>
                  <input
                    type="number"
                    value={apiConfig.timeout}
                    onChange={e => setApiConfig({ ...apiConfig, timeout: Number(e.target.value) })}
                    className="w-full bg-[#101010] border border-[rgba(255,255,255,0.08)] rounded-lg text-sm text-[#F5F5F5] px-3.5 py-2.5 focus:outline-none focus:border-[#D4AF37]/50"
                  />
                </div>
              </div>

              {/* Security Shield Banner */}
              <div className="p-4 rounded-xl bg-[rgba(212,175,55,0.05)] border border-[rgba(212,175,55,0.2)] flex items-start gap-3 mt-4">
                <Shield size={20} className="text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <div className="text-xs text-[#A1A1A1] leading-relaxed">
                  <span className="font-semibold text-[#F5F5F5] block mb-0.5">Fintech Enterprise Security Guarantee</span>
                  API keys and gateway client secrets are securely encapsulated in the Node.js backend. 
                  The frontend client never holds or transmits raw credentials, tokens, or PCI-DSS cardholder secrets.
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => addNotification({
                    type: 'info',
                    title: 'API Status Probe',
                    message: `Connected to simulated demo gateway service (${apiConfig.environment}).`
                  })}
                >
                  Test Backend Connection
                </Button>
                <span className="text-xs text-[#16C784] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#16C784] animate-pulse" />
                  Mock Data Service Online
                </span>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
