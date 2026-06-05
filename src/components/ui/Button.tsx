import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'warning';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles = 'cursor-pointer inline-flex items-center justify-center font-bold neo-border neo-shadow neo-shadow-hover transition-colors';
    
    const variants = {
      primary: 'bg-[var(--color-neo-primary)] text-neo-text hover:bg-[#72977A]',
      secondary: 'bg-white text-neo-text hover:bg-gray-100',
      danger: 'bg-[var(--color-neo-accent)] text-neo-text hover:bg-[#C68B73]',
      warning: 'bg-[var(--color-neo-secondary)] text-neo-text hover:bg-[#D6C4AD]',
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-5 py-2.5 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
