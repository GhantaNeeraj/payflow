import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState('INR');
  const [dateRange, setDateRange] = useState('30d');
  const [notifications, setNotifications] = useState([]);
  const [demoMode] = useState(true);

  const addNotification = useCallback((notif) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, ...notif }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 5000);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <AppContext.Provider value={{
      sidebarCollapsed, setSidebarCollapsed,
      sidebarMobileOpen, setSidebarMobileOpen,
      currentCurrency, setCurrentCurrency,
      dateRange, setDateRange,
      notifications, addNotification, removeNotification,
      demoMode,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
