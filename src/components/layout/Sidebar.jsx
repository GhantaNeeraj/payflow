import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ArrowLeftRight, Server, GitBranch,
  BarChart3, ShieldAlert, Settings, ChevronLeft, X, Sparkles,
  ShieldCheck, Circle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import PayflowLogo from '../common/PayflowLogo';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard, badge: null },
  { path: '/transactions', label: 'Transactions', icon: ArrowLeftRight, badge: '50+' },
  { path: '/processors', label: 'Payment Processors', icon: Server, badge: '4' },
  { path: '/smart-routing', label: 'Smart Routing', icon: GitBranch, badge: 'AI' },
  { path: '/analytics', label: 'Analytics', icon: BarChart3, badge: null },
  { path: '/failover-logs', label: 'Failover & Logs', icon: ShieldAlert, badge: 'Live' },
  { path: '/settings', label: 'Settings', icon: Settings, badge: null },
];

function NavItem({ item, collapsed, onClick }) {
  const location = useLocation();
  const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      className={`group relative flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 overflow-hidden cursor-pointer
        ${isActive
          ? 'text-[#F5D76E] bg-gradient-to-r from-[rgba(212,175,55,0.15)] to-[rgba(212,175,55,0.02)] border border-[rgba(212,175,55,0.3)] shadow-[0_4px_20px_rgba(212,175,55,0.1)]'
          : 'text-[#8E8E9E] hover:text-[#F5F5F5] hover:bg-[rgba(255,255,255,0.03)] border border-transparent hover:border-[rgba(255,255,255,0.06)]'
        }`}
    >
      {/* Active Gold Border Indicator Pill */}
      {isActive && (
        <motion.div
          layoutId="activeNavPill"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-gradient-to-b from-[#F5D76E] to-[#A67C00] shadow-[0_0_10px_#D4AF37]"
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        />
      )}

      {/* Hover Sheen Animation */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-[rgba(212,175,55,0.06)] to-transparent pointer-events-none" />

      {/* Icon with Hover Glow */}
      <div className={`relative flex items-center justify-center transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-[#F5D76E]' : 'text-[#626274] group-hover:text-[#D4AF37]'}`}>
        <item.icon size={17} strokeWidth={isActive ? 2.2 : 1.8} />
      </div>

      {!collapsed && (
        <div className="flex-1 flex items-center justify-between min-w-0">
          <span className="truncate tracking-wide">{item.label}</span>
          {item.badge && (
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider transition-colors ${
              isActive 
                ? 'bg-[rgba(212,175,55,0.25)] text-[#F5D76E] border border-[rgba(212,175,55,0.4)]'
                : item.badge === 'AI' || item.badge === 'Live'
                  ? 'bg-[rgba(22,199,132,0.12)] text-[#16C784] border border-[rgba(22,199,132,0.25)]'
                  : 'bg-[rgba(255,255,255,0.06)] text-[#6B6B7C]'
            }`}>
              {item.badge}
            </span>
          )}
        </div>
      )}
    </NavLink>
  );
}

function SidebarContent({ collapsed, onClose }) {
  const { setSidebarCollapsed } = useApp();

  return (
    <div className="flex flex-col h-full bg-[#07070A] border-r border-[rgba(212,175,55,0.12)] relative z-20">
      {/* Header with Professional Logo */}
      <div className={`flex items-center border-b border-[rgba(255,255,255,0.06)] ${collapsed ? 'px-3 py-5 justify-center' : 'px-5 py-4 justify-between'}`}>
        <PayflowLogo collapsed={collapsed} />
        {onClose && (
          <button onClick={onClose} className="p-1 rounded-lg text-[#686875] hover:text-[#FFF] hover:bg-white/5 transition cursor-pointer">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Main Nav Items */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {!collapsed && (
          <div className="flex items-center justify-between px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#525265]">
            <span>Platform Core</span>
            <Sparkles size={11} className="text-[#D4AF37]/60" />
          </div>
        )}
        {navItems.map(item => (
          <NavItem key={item.path} item={item} collapsed={collapsed} onClick={onClose} />
        ))}
      </nav>

      {/* Floating System Status Badge */}
      {!collapsed && (
        <div className="px-3 pb-3">
          <div className="p-3 rounded-xl bg-gradient-to-b from-[#0F0F14] to-[#0A0A0E] border border-[rgba(212,175,55,0.15)] shadow-inner">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-semibold text-[#8E8E9E]">Engine Status</span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-[#16C784]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16C784] animate-ping" />
                99.98%
              </span>
            </div>
            <div className="text-[11px] font-medium text-[#D4AF37] flex items-center gap-1.5 truncate">
              <ShieldCheck size={12} className="text-[#D4AF37] flex-shrink-0" />
              <span>Smart Routing Active</span>
            </div>
          </div>
        </div>
      )}

      {/* Account Info Footer */}
      <div className="border-t border-[rgba(255,255,255,0.06)] p-3 bg-[#050508]/60">
        {!collapsed ? (
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl hover:bg-white/5 transition cursor-pointer group">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#A67C00] via-[#D4AF37] to-[#F5D76E] flex items-center justify-center font-bold text-[11px] text-[#080808] shadow-md shadow-[#D4AF37]/20">
                  AC
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#16C784] border-2 border-[#07070A]" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#F5F5F5] truncate group-hover:text-[#F5D76E] transition-colors">
                  Acme Commerce
                </div>
                <div className="text-[9px] text-[#5A5A6D] flex items-center gap-1">
                  <span>Merchant ID: ACME_001</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSidebarCollapsed(!collapsed)}
              className="p-1 rounded-md text-[#5A5A6D] hover:text-[#D4AF37] transition cursor-pointer"
              title="Collapse menu"
            >
              <ChevronLeft size={16} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#9E7C20] flex items-center justify-center font-bold text-[11px] text-[#080808]">
              AC
            </div>
            <button
              onClick={() => setSidebarCollapsed(false)}
              className="p-1 rounded text-[#5A5A6D] hover:text-[#D4AF37] transition cursor-pointer"
            >
              <ChevronLeft size={16} className="rotate-180" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Sidebar() {
  const { sidebarCollapsed, sidebarMobileOpen, setSidebarMobileOpen } = useApp();

  return (
    <>
      <motion.aside
        animate={{ width: sidebarCollapsed ? 76 : 260 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="hidden lg:block fixed left-0 top-0 h-screen z-40 overflow-hidden flex-shrink-0 shadow-2xl shadow-black/80"
      >
        <SidebarContent collapsed={sidebarCollapsed} />
      </motion.aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {sidebarMobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden"
              onClick={() => setSidebarMobileOpen(false)}
            />
            <motion.aside
              key="drawer"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="fixed left-0 top-0 h-screen w-[270px] z-50 lg:hidden shadow-2xl"
            >
              <SidebarContent
                collapsed={false}
                onClose={() => setSidebarMobileOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
