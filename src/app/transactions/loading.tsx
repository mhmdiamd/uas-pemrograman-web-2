import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

export default function Loading() {
  return (
    <MainLayout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Breadcrumb 
            items={[
              { label: 'Dashboard', href: '/' },
              { label: 'Transactions' }
            ]} 
            className="mb-2"
          />
          <Skeleton className="h-10 w-64 mt-1" />
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Skeleton className="h-12 w-40" />
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 neo-border shadow-[4px_4px_0px_0px_var(--color-neo-text)]">
          <div className="flex justify-between mb-6">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-64" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
