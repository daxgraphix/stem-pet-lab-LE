import React from 'react';
import { cn } from '../lib/utils';

interface SidebarButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  color: string;
  theme: 'dark' | 'light';
}

export const SidebarButton: React.FC<SidebarButtonProps> = ({ icon: Icon, label, onClick, color, theme }) => (
  <button
    onClick={onClick}
    className={cn(
      'w-full flex items-center gap-4 p-4 rounded-2xl transition-all group text-left',
      theme === 'dark'
        ? 'hover:bg-slate-800 text-slate-300 hover:text-white'
        : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
    )}
    type="button"
    aria-label={label}
  >
    <div
      className={cn(
        'p-2 rounded-xl transition-transform group-hover:scale-110',
        theme === 'dark' ? 'bg-slate-950' : 'bg-white shadow-sm',
        color
      )}
    >
      <Icon className="w-5 h-5" />
    </div>
    <span className="font-bold text-sm uppercase tracking-tight">{label}</span>
  </button>
);
