import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { getItems, getItemTypes } from '@/actions/master';
import { ItemsClientPage } from './ItemsClientPage';

export const metadata = {
  title: 'Master Items - Inventory System',
};

export default async function ItemsPage() {
  // Fetch data directly from Server Actions using Prisma
  const items = await getItems();
  const itemTypes = await getItemTypes();

  return (
    <MainLayout>
      <ItemsClientPage initialItems={items} initialItemTypes={itemTypes} />
    </MainLayout>
  );
}
