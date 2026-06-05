import React from 'react';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = '', label, ...props }, ref) => {
    return (
      <label className={`flex items-center gap-3 cursor-pointer group w-max ${className}`}>
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            className="peer appearance-none w-6 h-6 border-3 border-neo-text bg-white checked:bg-[var(--color-neo-accent)] shadow-[2px_2px_0px_0px_var(--color-neo-text)] checked:shadow-[0px_0px_0px_0px_var(--color-neo-text)] checked:translate-x-[2px] checked:translate-y-[2px] transition-all cursor-pointer"
            ref={ref}
            {...props}
          />
          <svg 
            className="absolute pointer-events-none opacity-0 peer-checked:opacity-100 peer-checked:translate-x-[1px] peer-checked:translate-y-[1px] transition-all w-4 h-4 text-neo-text" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="4" 
            strokeLinecap="square" 
            strokeLinejoin="miter"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        {label && <span className="font-bold text-lg select-none text-neo-text">{label}</span>}
      </label>
    );
  }
);
Checkbox.displayName = 'Checkbox';
