import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, size = 'md', children }) {
  const widths = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl', full: 'max-w-6xl' };
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }} onClick={e => e.stopPropagation()}
            className={`relative w-full ${widths[size]} bg-[#131313] border border-[rgba(212,175,55,0.15)] rounded-xl shadow-2xl max-h-[85vh] flex flex-col`}>
            <div className="flex items-center justify-between p-5 border-b border-[rgba(255,255,255,0.08)]">
              <h3 className="text-lg font-semibold text-[#F5F5F5]">{title}</h3>
              <button onClick={onClose} className="text-[#686868] hover:text-[#F5F5F5] transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 overflow-y-auto">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
