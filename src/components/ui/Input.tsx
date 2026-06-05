import React from 'react';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full bg-white px-4 py-2.5 text-neo-text neo-border neo-shadow-sm focus:outline-none focus:ring-0 focus:shadow-[4px_4px_0px_0px_var(--color-neo-primary)] transition-shadow ${className}`}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
