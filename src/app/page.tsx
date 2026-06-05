import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { getDashboardMetrics, getRecentTransactions, getAssetStatusDistribution } from '@/actions/dashboard';
import { DashboardClientPage } from './DashboardClientPage';

export const metadata = {
  title: 'Dashboard - Asset Inventory System',
};

export default async function HomePage() {
  const metrics = await getDashboardMetrics();
  const recentTransactionsData = await getRecentTransactions();
  const statusDistribution = await getAssetStatusDistribution();

  const serializedRecentTransactions = JSON.parse(JSON.stringify(recentTransactionsData));

  return (
    <MainLayout>
      <DashboardClientPage 
        metrics={metrics} 
        recentTransactions={serializedRecentTransactions} 
        statusDistribution={statusDistribution} 
      />
    </MainLayout>
  );
}
