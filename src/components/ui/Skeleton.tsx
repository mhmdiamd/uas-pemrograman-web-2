import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rectangular' | 'circular' | 'text';
}

export const Skeleton = ({ className = '', variant = 'rectangular', ...props }: SkeletonProps) => {
  // We use border-2 instead of border-3 to make it look slightly distinct from real content
  const baseClasses = "animate-pulse bg-[var(--color-neo-secondary)] opacity-70 neo-border";
  
  const variantClasses = {
    rectangular: '',
    circular: 'rounded-full',
    text: 'h-4 w-full',
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
};

export const SkeletonCard = () => {
  return (
    <div className="bg-white p-6 neo-border shadow-[4px_4px_0px_0px_var(--color-neo-text)] flex flex-col gap-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full mt-2" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex justify-between items-center mt-4 pt-4 border-t-3 border-neo-text">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-8 w-8 circular" />
      </div>
    </div>
  );
};
