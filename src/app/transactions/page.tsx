import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { getTransactions } from '@/actions/transaction';
import { getTransactionTypes } from '@/actions/master';
import { TransactionsClientPage } from './TransactionsClientPage';

export const metadata = {
  title: 'Transactions Data - Inventory System',
};

export default async function TransactionsPage() {
  const transactionsData = await getTransactions();
  const types = await getTransactionTypes();

  const serializedTransactions = JSON.parse(JSON.stringify(transactionsData));

  return (
    <MainLayout>
      <TransactionsClientPage initialTransactions={serializedTransactions} transactionTypes={types} />
    </MainLayout>
  );
}
