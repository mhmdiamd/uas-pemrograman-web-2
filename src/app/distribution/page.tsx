import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { getDistributions } from '@/actions/distribution';
import { getInventory } from '@/actions/inventory';
import { getRooms } from '@/actions/master';
import { DistributionClientPage } from './DistributionClientPage';

export const metadata = {
  title: 'Asset Distribution - Inventory System',
};

export default async function DistributionPage() {
  const distributionsData = await getDistributions();
  const inventoryData = await getInventory();
  const roomsData = await getRooms();

  const serializedInventory = JSON.parse(JSON.stringify(inventoryData));
  const serializedDistributions = JSON.parse(JSON.stringify(distributionsData));

  return (
    <MainLayout>
      <DistributionClientPage 
        initialDistributions={serializedDistributions} 
        inventory={serializedInventory} 
        rooms={roomsData} 
      />
    </MainLayout>
  );
}
