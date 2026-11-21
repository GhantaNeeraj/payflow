import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import ToastContainer from '../common/Toast';
import { useApp } from '../../context/AppContext';

const titles = {
  '/': 'Executive Dashboard',
  '/transactions': 'Transactions Ledger',
  '/processors': 'Payment Processors',
  '/smart-routing': 'Smart Routing Engine',
  '/analytics': 'Performance Analytics',
  '/failover-logs': 'Failover & System Logs',
  '/settings': 'Platform Settings',
};

export default function AppLayout() {
  const { sidebarCollapsed } = useApp();
  const location = useLocation();
  const title = titles[location.pathname] || 'PAYFLOW';

  return (
    <div className="min-h-screen bg-[#060608] flex relative overflow-x-hidden text-[#F0F0F5]">
      {/* Ambient Radial Mesh Background Lights */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[20%] w-[550px] h-[550px] bg-[radial-gradient(circle,rgba(212,175,55,0.045)_0%,transparent_70%)] blur-3xl animate-pulse" />
        <div className="absolute top-[40%] right-[-5%] w-[450px] h-[450px] bg-[radial-gradient(circle,rgba(110,90,30,0.035)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute bottom-[-10%] left-[10%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(22,199,132,0.025)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Modern Sidebar */}
      <Sidebar />

      {/* Dynamic Content Pane with Smooth Viewport Margin Adjust */}
      <motion.div
        className="flex-1 flex flex-col min-h-screen min-w-0 z-10"
        animate={{
          marginLeft: typeof window !== 'undefined' && window.innerWidth >= 1024
            ? (sidebarCollapsed ? 76 : 260)
            : 0,
        }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
      >
        <Topbar title={title} />
        <main className="flex-1 p-4 sm:p-6 lg:p-7 overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="max-w-[1600px] mx-auto w-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </motion.div>

      <ToastContainer />
    </div>
  );
}
