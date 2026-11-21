import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const icons = { success: CheckCircle, error: XCircle, warning: AlertTriangle, info: Info };
const colors = { success: '#16C784', error: '#EA3943', warning: '#F0B90B', info: '#3B82F6' };

export default function ToastContainer() {
  const { notifications, removeNotification } = useApp();
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {notifications.map(n => {
          const Icon = icons[n.type] || Info;
          const color = colors[n.type] || colors.info;
          return (
            <motion.div key={n.id} initial={{ opacity:0, x:100 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:100 }}
              className="bg-[#191919] border border-[rgba(255,255,255,0.08)] rounded-lg p-4 shadow-xl flex items-start gap-3"
              style={{ borderLeftWidth: 3, borderLeftColor: color }}>
              <Icon size={18} style={{ color, flexShrink:0, marginTop:1 }} />
              <div className="flex-1 min-w-0">
                {n.title && <div className="text-sm font-semibold text-[#F5F5F5]">{n.title}</div>}
                <div className="text-xs text-[#A1A1A1]">{n.message}</div>
              </div>
              <button onClick={() => removeNotification(n.id)} className="text-[#686868] hover:text-[#F5F5F5] cursor-pointer"><X size={14} /></button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
