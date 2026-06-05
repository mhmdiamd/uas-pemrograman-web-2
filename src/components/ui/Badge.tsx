import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  className?: string;
}

export const Badge = ({ children, variant = 'default', className = '' }: BadgeProps) => {
  const variants = {
    default: 'bg-white text-neo-text',
    success: 'bg-[var(--color-neo-primary)] text-neo-text',
    warning: 'bg-[var(--color-neo-secondary)] text-neo-text',
    danger: 'bg-[var(--color-neo-accent)] text-neo-text',
    info: 'bg-blue-300 text-neo-text',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-bold neo-border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
