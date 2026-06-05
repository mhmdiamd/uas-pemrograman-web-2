'use server';

import prisma from '@/lib/prisma';

export async function getPublicAssetDetails(id: string) {
  console.log('[DEBUG] getPublicAssetDetails called with ID:', id);
  const inventory = await prisma.inventory.findUnique({
    where: { id },
    include: {
      item: {
        include: {
          itemType: true
        }
      },
      inventoryRooms: {
        where: { status: 'ACTIVE' },
        include: {
          room: {
            include: {
              building: true
            }
          }
        }
      },
      transaction: {
        include: {
          transactionType: true
        }
      }
    }
  });

  console.log('[DEBUG] getPublicAssetDetails result:', inventory ? 'FOUND' : 'NOT FOUND');

  if (!inventory) {
    return null;
  }

  // Convert Decimals to numbers for client component consumption
  return {
    ...inventory,
    price: Number(inventory.price),
    salvageValue: Number(inventory.salvageValue),
    transaction: inventory.transaction ? {
      ...inventory.transaction,
      totalBudget: inventory.transaction.totalBudget ? Number(inventory.transaction.totalBudget) : null,
      budgetRealization: inventory.transaction.budgetRealization ? Number(inventory.transaction.budgetRealization) : null,
    } : null,
  };
}
