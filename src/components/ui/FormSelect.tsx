'use client';

import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Select, SelectOption } from './Select';
import { motion, AnimatePresence } from 'framer-motion';

interface FormSelectProps {
  name: string;
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}

export const FormSelect = ({ name, label, options, placeholder, className = '' }: FormSelectProps) => {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[name]?.message as string | undefined;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label htmlFor={name} className="font-bold">{label}</label>}
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value, ref } }) => (
          <Select
            ref={ref}
            options={options}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            error={!!error}
          />
        )}
      />
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10, x: 0 }}
            animate={{ opacity: 1, y: 0, x: [0, -5, 5, -5, 5, 0] }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="text-[var(--color-neo-accent)] font-bold text-sm mt-1 flex items-center gap-1"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};
