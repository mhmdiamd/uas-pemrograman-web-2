import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { getBuildings } from '@/actions/master';
import { BuildingsClientPage } from './BuildingsClientPage';

export const metadata = {
  title: 'Master Buildings - Inventory System',
};

export default async function BuildingsPage() {
  const buildings = await getBuildings();

  return (
    <MainLayout>
      <BuildingsClientPage initialBuildings={buildings} />
    </MainLayout>
  );
}
