'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
}

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ options, value, onChange, placeholder = "Select an option", className = '', error }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [rect, setRect] = useState<DOMRect | null>(null);
    const selectRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      const handleScroll = () => {
        setIsOpen(false);
      };
      
      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('scroll', handleScroll, true);
        window.addEventListener('resize', handleScroll);
      }
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', handleScroll);
      };
    }, [isOpen]);

    const toggleOpen = () => {
      if (!isOpen && selectRef.current) {
        setRect(selectRef.current.getBoundingClientRect());
      }
      setIsOpen(!isOpen);
    };

    return (
      <div className={`relative ${className}`} ref={selectRef}>
        <div
          ref={ref}
          onClick={toggleOpen}
          className={`w-full bg-white px-4 py-2.5 text-neo-text neo-border neo-shadow-sm cursor-pointer flex justify-between items-center transition-shadow hover:shadow-[4px_4px_0px_0px_var(--color-neo-primary)] ${
            error ? 'border-[var(--color-neo-accent)] shadow-[4px_4px_0px_0px_var(--color-neo-accent)]' : ''
          }`}
        >
          <span className={selectedOption ? 'font-bold' : 'text-gray-500 font-medium'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <motion.svg
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </motion.svg>
        </div>

        <AnimatePresence>
          {isOpen && rect && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: 'spring', bounce: 0.4, duration: 0.4 }}
              style={{
                position: 'fixed',
                top: rect.bottom + 8,
                left: rect.left,
                width: rect.width,
                zIndex: 99999
              }}
              className="bg-white neo-border shadow-[4px_4px_0px_0px_var(--color-neo-text)] max-h-60 overflow-y-auto origin-top"
            >
              {options.map((option) => (
                <div
                  key={option.value}
                  onClick={() => {
                    onChange?.(option.value);
                    setIsOpen(false);
                  }}
                  className={`px-4 py-2 cursor-pointer font-bold border-b-2 border-dashed border-gray-200 last:border-b-0 hover:bg-[var(--color-neo-secondary)] transition-colors ${
                    value === option.value ? 'bg-[var(--color-neo-primary)]' : ''
                  }`}
                >
                  {option.label}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Select.displayName = 'Select';
