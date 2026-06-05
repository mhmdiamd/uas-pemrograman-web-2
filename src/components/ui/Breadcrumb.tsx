import React from 'react';
import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb = ({ items, className = '' }: BreadcrumbProps) => {
  return (
    <nav className={`flex flex-wrap items-center gap-2 text-sm font-bold ${className}`}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <div key={index} className="flex items-center gap-2">
            {item.href && !isLast ? (
              <Link 
                href={item.href}
                className="hover:bg-[var(--color-neo-secondary)] px-2 py-1 border-2 border-transparent hover:border-neo-text hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_0px_var(--color-neo-text)] transition-all text-neo-text"
              >
                {item.label}
              </Link>
            ) : (
              <span className={`px-2 py-1 border-2 ${isLast ? 'bg-[var(--color-neo-primary)] border-neo-text shadow-[2px_2px_0px_0px_var(--color-neo-text)]' : 'border-transparent'} text-neo-text`}>
                {item.label}
              </span>
            )}
            
            {!isLast && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            )}
          </div>
        );
      })}
    </nav>
  );
};
