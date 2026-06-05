import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { getInventory } from '@/actions/inventory';
import { getItems, getItemTypes } from '@/actions/master';
import { InventoryClientPage } from './InventoryClientPage';

export const metadata = {
  title: 'Inventory Data - Inventory System',
};

export default async function InventoryPage() {
  const inventoryData = await getInventory();
  const items = await getItems();
  const categories = await getItemTypes();
  // Convert Prisma Decimal and Dates to plain objects for Next.js Client Components
  const serializedInventory = JSON.parse(JSON.stringify(inventoryData));

  return (
    <MainLayout>
      <InventoryClientPage initialInventory={serializedInventory} items={items} categories={categories} />
    </MainLayout>
  );
}
