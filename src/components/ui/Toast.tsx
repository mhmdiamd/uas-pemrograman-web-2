'use client';

import React from 'react';
import { ToastType } from '@/contexts/ToastContext';

interface ToastProps {
  toast: { id: string; message: string; type: ToastType };
  onClose: () => void;
}

export const Toast = ({ toast, onClose }: ToastProps) => {
  const bgColors = {
    success: 'bg-[var(--color-neo-primary)] text-neo-text',
    error: 'bg-[var(--color-neo-accent)] text-neo-text',
    warning: 'bg-[var(--color-neo-secondary)] text-neo-text',
    info: 'bg-white text-neo-text',
  };

  return (
    <div className={`flex items-center justify-between p-4 min-w-[300px] max-w-sm neo-border shadow-[6px_6px_0px_0px_var(--color-neo-text)] ${bgColors[toast.type]}`}>
      <span className="font-bold text-lg">{toast.message}</span>
      <button onClick={onClose} className="ml-4 hover:bg-black/10 rounded-full p-1 cursor-pointer border-2 border-transparent hover:border-neo-text transition-colors">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  );
};
