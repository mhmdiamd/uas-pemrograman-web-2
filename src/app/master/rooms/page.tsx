import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { getRooms, getBuildings } from '@/actions/master';
import { RoomsClientPage } from './RoomsClientPage';

export const metadata = {
  title: 'Master Rooms - Inventory System',
};

export default async function RoomsPage() {
  const rooms = await getRooms();
  const buildings = await getBuildings();

  return (
    <MainLayout>
      <RoomsClientPage initialRooms={rooms} initialBuildings={buildings} />
    </MainLayout>
  );
}
