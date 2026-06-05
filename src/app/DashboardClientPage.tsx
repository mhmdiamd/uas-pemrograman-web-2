'use client';

import React, { useMemo } from 'react';
import { MetricCard, Card } from '@/components/ui/Card';
import { DataTable } from '@/components/ui/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { formatRupiah } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface DashboardProps {
  metrics: {
    totalAssets: number;
    totalValue: number;
    activeLocations: number;
    totalBudgetVolume: number;
    totalRealizationVolume: number;
  };
  recentTransactions: any[];
  statusDistribution: { status: string; count: number }[];
}

export const DashboardClientPage = ({ metrics, recentTransactions, statusDistribution }: DashboardProps) => {
  
  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      { accessorKey: 'transactionNumber', header: 'Trx Number' },
      { 
        accessorKey: 'transactionDate', 
        header: 'Date',
        cell: ({ row }) => new Date(row.original.transactionDate).toLocaleDateString()
      },
      { accessorKey: 'transactionType.name', header: 'Type' },
      { 
        accessorKey: 'totalBudget', 
        header: 'Budget',
        cell: ({ row }) => formatRupiah(row.original.totalBudget || 0)
      },
      { 
        accessorKey: 'status', 
        header: 'Status',
        cell: ({ row }) => {
          const status = row.original.status;
          let color = 'bg-blue-100 text-blue-800';
          if (status === 'COMPLETED') color = 'bg-green-100 text-green-800';
          if (status === 'PENDING') color = 'bg-yellow-100 text-yellow-800';
          if (status === 'CANCELLED') color = 'bg-red-100 text-red-800';
          return (
            <span className={`px-2 py-1 text-xs font-bold neo-border ${color}`}>
              {status}
            </span>
          );
        }
      }
    ],
    []
  );

  const totalAssetsFromStatus = statusDistribution.reduce((sum: number, item: any) => sum + item.count, 0);

  return (
    <>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-area, #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print-hide {
            display: none !important;
          }
        }
      `}</style>
      
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-black tracking-tighter uppercase">Overview</h1>
          <p className="text-lg font-bold bg-white inline-block px-3 py-1 neo-border neo-shadow-sm mt-2">
            Asset Inventory Dashboard
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0 print-hide">
          <Button variant="secondary" onClick={() => window.print()}>
            Print Report
          </Button>
        </div>
      </div>

      <div id="print-area" className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard 
            title="Total Assets" 
            value={metrics.totalAssets.toString()} 
            className="bg-[var(--color-neo-primary)]" 
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            }
          />
          <MetricCard 
            title="Total Value" 
            value={formatRupiah(metrics.totalValue)} 
            className="bg-[var(--color-neo-secondary)]" 
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>
            }
          />
          <MetricCard 
            title="Active Locations" 
            value={metrics.activeLocations.toString()} 
            className="bg-[var(--color-neo-accent)] text-neo-text" 
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            }
          />
          <MetricCard 
            title="Budget Realized" 
            value={formatRupiah(metrics.totalRealizationVolume)} 
            className="bg-white" 
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            }
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <h2 className="text-2xl font-bold mb-6 border-b-3 border-neo-text pb-2">Asset Status Distribution</h2>
            <div className="space-y-4">
              {statusDistribution.map(stat => {
                const percentage = totalAssetsFromStatus > 0 ? (stat.count / totalAssetsFromStatus) * 100 : 0;
                let colorClass = 'bg-[var(--color-neo-primary)]';
                if (stat.status === 'BROKEN') colorClass = 'bg-red-500';
                if (stat.status === 'MAINTENANCE') colorClass = 'bg-[var(--color-neo-accent)]';

                return (
                  <div key={stat.status} className="relative">
                    <div className="flex justify-between font-bold text-sm mb-1">
                      <span>{stat.status}</span>
                      <span>{stat.count} items ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full h-6 border-3 border-neo-text bg-white">
                      <div 
                        className={`h-full ${colorClass} border-r-3 border-neo-text`} 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <h2 className="text-2xl font-bold mb-6 border-b-3 border-neo-text pb-2">Budget Overview</h2>
            <div className="space-y-6">
              <div>
                <p className="text-sm font-bold opacity-70">Total Allocated Budget</p>
                <p className="text-3xl font-black">{formatRupiah(metrics.totalBudgetVolume)}</p>
              </div>
              <div>
                <p className="text-sm font-bold opacity-70">Total Realized Budget</p>
                <p className="text-3xl font-black">{formatRupiah(metrics.totalRealizationVolume)}</p>
              </div>
              <div className="relative pt-4 border-t-3 border-dashed border-gray-300">
                <div className="flex justify-between font-bold text-sm mb-1">
                  <span>Realization Rate</span>
                  <span>
                    {metrics.totalBudgetVolume > 0 
                      ? ((metrics.totalRealizationVolume / metrics.totalBudgetVolume) * 100).toFixed(1) 
                      : 0}%
                  </span>
                </div>
                <div className="w-full h-8 border-3 border-neo-text bg-white">
                  <div 
                    className="h-full bg-[var(--color-neo-secondary)] border-r-3 border-neo-text" 
                    style={{ 
                      width: `${metrics.totalBudgetVolume > 0 ? (metrics.totalRealizationVolume / metrics.totalBudgetVolume) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6 bg-white inline-block px-4 py-2 neo-border neo-shadow">Recent Transactions</h2>
          <DataTable 
            columns={columns} 
            data={recentTransactions} 
          />
        </div>
      </div>
    </>
  );
};
