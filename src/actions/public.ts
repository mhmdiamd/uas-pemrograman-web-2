'use server';

import prisma from '@/lib/prisma';

export async function getPublicAssetDetails(id: string) {
  try {
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
  } catch (error) {
    console.error('Error fetching public asset details:', error);
    return null;
  }
}
