import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { DatePicker } from './DatePicker';

interface FormDatePickerProps {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
}

export const FormDatePicker = ({ name, label, placeholder, className = '' }: FormDatePickerProps) => {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[name]?.message as string;

  return (
    <div className={`mb-4 ${className}`}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div>
            <DatePicker
              label={label}
              placeholder={placeholder}
              value={field.value ? new Date(field.value) : undefined}
              onChange={(date) => {
                if (date) {
                  // We store it as a YYYY-MM-DD string to match the form expectations
                  field.onChange(date.toISOString().split('T')[0]);
                } else {
                  field.onChange('');
                }
              }}
            />
            {error && (
              <p className="mt-1 text-sm font-bold text-[var(--color-neo-accent)]">{error}</p>
            )}
          </div>
        )}
      />
    </div>
  );
};
