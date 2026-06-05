'use client';

import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from './Input';
import { motion, AnimatePresence } from 'framer-motion';

interface FormCurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  name: string;
  label?: string;
}

export const FormCurrencyInput = ({ name, label, className = '', ...props }: FormCurrencyInputProps) => {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[name]?.message as string | undefined;

  const formatDisplay = (val: number | string) => {
    if (val === undefined || val === null || val === '') return '';
    const numericValue = typeof val === 'string' ? parseFloat(val) : Number(val);
    if (isNaN(numericValue)) return '';
    return new Intl.NumberFormat('id-ID').format(numericValue);
  };

  const parseCurrency = (val: string) => {
    const numericString = val.replace(/[^0-9]/g, '');
    return numericString === '' ? 0 : Number(numericString);
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label htmlFor={name} className="font-bold">{label}</label>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-500">Rp</span>
            <Input
              {...props}
              id={name}
              value={formatDisplay(field.value)}
              onChange={(e) => {
                const parsed = parseCurrency(e.target.value);
                field.onChange(parsed);
              }}
              onBlur={field.onBlur}
              className={`pl-10 ${error ? 'border-[var(--color-neo-accent)] focus:shadow-[4px_4px_0px_0px_var(--color-neo-accent)]' : ''}`}
            />
          </div>
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
