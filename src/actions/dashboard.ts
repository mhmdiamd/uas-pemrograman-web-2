'use server';

import prisma from '@/lib/prisma';

export async function getDashboardMetrics() {
  // 1. Total Assets (Quantity)
  const totalAssetsAggr = await prisma.inventory.aggregate({
    _sum: {
      quantity: true
    }
  });
  const totalAssets = totalAssetsAggr._sum.quantity || 0;

  // 2. Total Value (Quantity * Price)
  const inventories = await prisma.inventory.findMany({
    select: { quantity: true, price: true }
  });
  const totalValue = inventories.reduce((sum: number, inv) => {
    return sum + (inv.quantity * Number(inv.price));
  }, 0);

  // 3. Active Locations
  // A room is considered active if it has at least one inventory room assignment
  const activeLocationsAggr = await prisma.inventoryRoom.groupBy({
    by: ['roomId'],
  });
  const activeLocations = activeLocationsAggr.length;

  // 4. Total Transactions Volume (Sum of totalBudget)
  const transactionsAggr = await prisma.inventoryTransaction.aggregate({
    _sum: {
      totalBudget: true,
      budgetRealization: true,
    }
  });
  const totalBudgetVolume = Number(transactionsAggr._sum.totalBudget || 0);
  const totalRealizationVolume = Number(transactionsAggr._sum.budgetRealization || 0);

  return {
    totalAssets,
    totalValue,
    activeLocations,
    totalBudgetVolume,
    totalRealizationVolume,
  };
}

export async function getRecentTransactions() {
  const transactions = await prisma.inventoryTransaction.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      transactionType: true
    }
  });

  return transactions.map(t => ({
    ...t,
    totalBudget: t.totalBudget ? Number(t.totalBudget) : null,
    budgetRealization: t.budgetRealization ? Number(t.budgetRealization) : null,
  }));
}

export async function getAssetStatusDistribution() {
  const distribution = await prisma.inventory.groupBy({
    by: ['status'],
    _sum: {
      quantity: true
    }
  });

  return distribution.map(d => ({
    status: d.status,
    count: d._sum.quantity || 0
  }));
}
