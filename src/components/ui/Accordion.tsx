'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const AccordionItem = ({ title, children, defaultOpen = false }: AccordionItemProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b-3 border-neo-text last:border-b-0 bg-white overflow-hidden">
      <button
        type="button"
        className="w-full text-left p-4 font-bold flex justify-between items-center cursor-pointer hover:bg-[var(--color-neo-bg)] transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg">{title}</span>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, type: "spring", bounce: 0.4 }}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </motion.svg>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
          >
            <div className="p-4 pt-0 text-neo-text/80 font-medium">
              <div className="border-t-2 border-dashed border-neo-text/20 pt-4 mt-2">
                {children}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Accordion = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={`neo-border neo-shadow flex flex-col bg-white ${className}`}>
      {children}
    </div>
  );
};
