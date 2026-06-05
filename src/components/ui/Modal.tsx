'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export const Modal = ({ isOpen, onClose, title, children, footer, className = "bg-white", headerClassName = "bg-[var(--color-neo-secondary)]" }: ModalProps) => {
  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 backdrop-blur-sm bg-black/40"
          />
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: -5 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.8, opacity: 0, rotate: 5 }}
            transition={{ type: "spring", bounce: 0.6, duration: 0.5 }}
            className={`${className} neo-border neo-shadow flex flex-col w-full max-w-lg text-neo-text relative z-10 origin-center text-left max-h-[90vh]`}
          >
            <div className={`p-4 border-b-3 border-neo-text flex justify-between items-center shrink-0 ${headerClassName}`}>
              <h2 className="text-xl font-bold">{title}</h2>
              <button type="button" onClick={onClose} className="cursor-pointer hover:bg-black/10 rounded-full p-1 border-2 border-transparent hover:border-neo-text transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 min-h-0">
              {children}
            </div>
            {footer && (
              <div className="p-4 border-t-3 border-neo-text bg-black/5 flex justify-end gap-3 shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
