import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import AppLayout from './components/layout/AppLayout';

import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import PaymentProcessors from './pages/PaymentProcessors';
import SmartRouting from './pages/SmartRouting';
import Analytics from './pages/Analytics';
import FailoverLogs from './pages/FailoverLogs';
import Settings from './pages/Settings';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="processors" element={<PaymentProcessors />} />
            <Route path="smart-routing" element={<SmartRouting />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="failover-logs" element={<FailoverLogs />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}
