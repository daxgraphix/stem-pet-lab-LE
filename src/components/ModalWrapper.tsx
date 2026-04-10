import React from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';

interface ModalWrapperProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  onClose: () => void;
  theme: 'dark' | 'light';
}

export const ModalWrapper: React.FC<ModalWrapperProps> = ({ title, icon: Icon, children, onClose, theme }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
      onClick={onClose}
      aria-label="Close modal overlay"
      type="button"
    />

    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className={cn(
        'relative w-full max-w-5xl max-h-[90vh] rounded-[3rem] shadow-2xl border flex flex-col overflow-hidden transition-colors duration-500',
        theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      )}
    >
      <div className={cn(
        'flex items-center justify-between p-8 border-b transition-colors',
        theme === 'dark' ? 'border-slate-800 bg-slate-800/30' : 'border-slate-200 bg-slate-50'
      )}>
        <div className="flex items-center gap-4">
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center text-emerald-400',
            theme === 'dark' ? 'bg-slate-800' : 'bg-white shadow-sm'
          )}>
            <Icon className="w-6 h-6" />
          </div>
          <h2 id="modal-title" className={cn('text-2xl font-black tracking-tight uppercase', theme === 'dark' ? 'text-white' : 'text-slate-900')}>
            {title}
          </h2>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors" type="button" aria-label="Close modal">
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="flex-grow overflow-y-auto p-10 custom-scrollbar">{children}</div>
    </motion.div>
  </div>
);
