import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { getItemTypes } from '@/actions/master';
import { CategoriesClientPage } from './CategoriesClientPage';

export const metadata = {
  title: 'Master Categories - Inventory System',
};

export default async function CategoriesPage() {
  const categories = await getItemTypes();

  return (
    <MainLayout>
      <CategoriesClientPage initialCategories={categories} />
    </MainLayout>
  );
}
