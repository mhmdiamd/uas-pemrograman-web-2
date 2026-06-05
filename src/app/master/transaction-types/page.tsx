import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { getTransactionTypes } from '@/actions/master';
import { TransactionTypesClientPage } from './TransactionTypesClientPage';

export const metadata = {
  title: 'Master Transaction Types - Inventory System',
};

export default async function TransactionTypesPage() {
  const transactionTypes = await getTransactionTypes();

  return (
    <MainLayout>
      <TransactionTypesClientPage initialTransactionTypes={transactionTypes} />
    </MainLayout>
  );
}
