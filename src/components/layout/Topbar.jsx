import { useState, useRef, useEffect } from 'react';
import { Search, Bell, HelpCircle, Calendar, ChevronDown, Menu, X, CheckCircle, ShieldCheck, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DATE_RANGES, CURRENCIES } from '../../utils/constants';

export default function Topbar({ title }) {
  const { setSidebarMobileOpen, dateRange, setDateRange, notifications, currentCurrency, setCurrentCurrency } = useApp();
  const [showDate, setShowDate] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCurrency, setShowCurrency] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const dateRef = useRef(null);
  const profileRef = useRef(null);
  const currRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dateRef.current && !dateRef.current.contains(e.target)) setShowDate(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
      if (currRef.current && !currRef.current.contains(e.target)) setShowCurrency(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-[#07070A]/85 backdrop-blur-2xl border-b border-[rgba(212,175,55,0.12)] shadow-sm shadow-black/60">
      <div className="flex items-center justify-between px-4 sm:px-6 h-15 gap-3">
        {/* Left Section: Breadcrumb & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setSidebarMobileOpen(true)}
            className="lg:hidden p-1.5 rounded-lg text-[#8E8E9E] hover:text-[#F5F5F5] hover:bg-white/5 transition cursor-pointer"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2 text-xs">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[rgba(212,175,55,0.08)] border border-[rgba(212,175,55,0.2)] text-[#D4AF37] font-semibold text-[10px] tracking-widest uppercase">
              <Zap size={10} className="fill-[#D4AF37]" /> Orchestrator
            </span>
            <span className="hidden sm:inline text-[#424250]">/</span>
            <h1 className="text-sm font-bold text-[#F5F5F5] tracking-tight truncate">
              {title}
            </h1>
          </div>
        </div>

        {/* Right Section: Interactive Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Global Search Bar */}
          <div className="hidden md:flex items-center bg-[#0D0D12] border border-[rgba(255,255,255,0.08)] focus-within:border-[rgba(212,175,55,0.45)] focus-within:ring-2 focus-within:ring-[rgba(212,175,55,0.15)] rounded-xl px-3 py-1.5 w-60 lg:w-72 transition-all">
            <Search size={14} className="text-[#656578] mr-2 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search TXN, processor, cards..."
              className="bg-transparent text-xs text-[#F5F5F5] outline-none w-full placeholder:text-[#525265]"
            />
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[9px] font-mono text-[#626275] bg-[#161620] rounded border border-white/5">
              ⌘K
            </kbd>
          </div>

          {/* Currency Pill Selector */}
          <div className="relative" ref={currRef}>
            <button
              onClick={() => { setShowCurrency(!showCurrency); setShowDate(false); setShowProfile(false); }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#0D0D12] border border-[rgba(212,175,55,0.2)] hover:border-[rgba(212,175,55,0.45)] rounded-xl text-xs font-bold text-[#F5D76E] transition cursor-pointer"
            >
              <span>{currentCurrency}</span>
              <ChevronDown size={11} className={`text-[#8E8E9E] transition-transform ${showCurrency ? 'rotate-180' : ''}`} />
            </button>
            {showCurrency && (
              <div className="absolute right-0 mt-2 w-44 bg-[#111117] border border-[rgba(212,175,55,0.2)] rounded-xl shadow-2xl py-1 z-50 overflow-hidden">
                <div className="px-3 py-1.5 text-[9px] uppercase tracking-wider text-[#686875] font-semibold border-b border-white/5">
                  Select Base Currency
                </div>
                {CURRENCIES.map(c => (
                  <button
                    key={c.code}
                    onClick={() => { setCurrentCurrency(c.code); setShowCurrency(false); }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition cursor-pointer ${
                      currentCurrency === c.code
                        ? 'text-[#F5D76E] bg-[rgba(212,175,55,0.1)] font-semibold'
                        : 'text-[#9E9EB0] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{c.code} — {c.name}</span>
                    <span className="text-[#D4AF37] font-mono">{c.symbol}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date Range Selector */}
          <div className="relative hidden sm:block" ref={dateRef}>
            <button
              onClick={() => { setShowDate(!showDate); setShowProfile(false); setShowCurrency(false); }}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#0D0D12] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(212,175,55,0.35)] rounded-xl text-xs text-[#9E9EB0] hover:text-[#F5F5F5] transition cursor-pointer"
            >
              <Calendar size={13} className="text-[#D4AF37]" />
              <span>{DATE_RANGES.find(r => r.value === dateRange)?.label || 'Last 30 Days'}</span>
              <ChevronDown size={11} className={`text-[#686875] transition-transform ${showDate ? 'rotate-180' : ''}`} />
            </button>
            {showDate && (
              <div className="absolute right-0 mt-2 w-44 bg-[#111117] border border-[rgba(212,175,55,0.2)] rounded-xl shadow-2xl py-1 z-50">
                {DATE_RANGES.map(r => (
                  <button
                    key={r.value}
                    onClick={() => { setDateRange(r.value); setShowDate(false); }}
                    className={`w-full text-left px-3.5 py-2 text-xs transition cursor-pointer flex items-center justify-between ${
                      dateRange === r.value
                        ? 'text-[#F5D76E] bg-[rgba(212,175,55,0.1)] font-semibold'
                        : 'text-[#9E9EB0] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{r.label}</span>
                    {dateRange === r.value && <CheckCircle size={12} className="text-[#D4AF37]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications with Glowing Badge */}
          <div className="relative">
            <button className="relative p-2 rounded-xl bg-[#0D0D12] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(212,175,55,0.35)] text-[#9E9EB0] hover:text-[#F5F5F5] transition cursor-pointer">
              <Bell size={16} />
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D4AF37] ring-2 ring-[#07070A] animate-pulse" />
              )}
            </button>
          </div>

          {/* Gateway Status Badge */}
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[rgba(22,199,132,0.08)] border border-[rgba(22,199,132,0.2)] text-[11px] text-[#16C784] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16C784] animate-ping" />
            <span>99.99% Routing Health</span>
          </div>

          {/* User Profile Pill */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => { setShowProfile(!showProfile); setShowDate(false); setShowCurrency(false); }}
              className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1 bg-[#0D0D12] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(212,175,55,0.35)] rounded-xl transition cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#A67C00] via-[#D4AF37] to-[#F5D76E] flex items-center justify-center font-bold text-[11px] text-[#080808] shadow-md shadow-[#D4AF37]/20">
                AC
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <div className="text-xs font-bold text-[#F5F5F5]">Acme Commerce</div>
                <div className="text-[9px] text-[#D4AF37] font-semibold">Tier 1 Merchant</div>
              </div>
              <ChevronDown size={11} className={`hidden sm:block text-[#686875] transition-transform ${showProfile ? 'rotate-180' : ''}`} />
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-64 bg-[#111117] border border-[rgba(212,175,55,0.2)] rounded-2xl shadow-2xl p-4 z-50">
                <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A67C00] via-[#D4AF37] to-[#F5D76E] flex items-center justify-center font-bold text-sm text-[#080808]">
                    AC
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">Acme Commerce Ltd.</div>
                    <div className="text-[10px] text-[#8E8E9E] truncate">payments@acmecommerce.in</div>
                    <div className="text-[9px] text-[#16C784] font-semibold mt-0.5">● Verified Enterprise</div>
                  </div>
                </div>

                <div className="py-2.5 space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-[#8E8E9E]">
                    <span>Account ID</span>
                    <span className="font-mono text-[#D4AF37]">ACME_001</span>
                  </div>
                  <div className="flex justify-between text-[#8E8E9E]">
                    <span>Gateway Routing</span>
                    <span className="text-[#16C784] font-semibold">Intelligent Multi-Node</span>
                  </div>
                  <div className="flex justify-between text-[#8E8E9E]">
                    <span>Default Currency</span>
                    <span className="text-white font-semibold">{currentCurrency} (₹ INR primary)</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
                  <span className="text-[#555566]">Mode: Demo Simulator</span>
                  <span className="text-[#F5D76E] bg-[rgba(212,175,55,0.1)] px-2 py-0.5 rounded border border-[#D4AF37]/30 font-bold">
                    Sandbox
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
