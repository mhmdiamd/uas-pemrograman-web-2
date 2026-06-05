'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

export async function getTransactions() {
  return await prisma.inventoryTransaction.findMany({
    include: {
      transactionType: true,
      inventories: {
        include: {
          item: true
        }
      }
    },
    orderBy: { transactionDate: 'desc' }
  });
}

export async function createTransaction(data: {
  transactionNumber: string;
  transactionDate: Date;
  status: string;
  sourceOfFunds?: string;
  totalBudget?: number;
  budgetRealization?: number;
  transactionTypeId: string;
  evidenceFile?: string;
}) {
  const result = await prisma.inventoryTransaction.create({
    data: {
      transactionNumber: data.transactionNumber,
      transactionDate: data.transactionDate,
      status: data.status,
      sourceOfFunds: data.sourceOfFunds,
      totalBudget: data.totalBudget ? new Prisma.Decimal(data.totalBudget) : undefined,
      budgetRealization: data.budgetRealization ? new Prisma.Decimal(data.budgetRealization) : undefined,
      transactionTypeId: data.transactionTypeId,
      evidenceFile: data.evidenceFile,
    }
  });
  revalidatePath('/transactions');
}

export async function updateTransaction(id: string, data: {
  status?: string;
  evidenceFile?: string;
  budgetRealization?: number;
}) {
  const result = await prisma.inventoryTransaction.update({
    where: { id },
    data: {
      status: data.status,
      evidenceFile: data.evidenceFile,
      budgetRealization: data.budgetRealization ? new Prisma.Decimal(data.budgetRealization) : undefined,
    }
  });
  revalidatePath('/transactions');
}

export async function deleteTransaction(id: string) {
  await prisma.inventoryTransaction.delete({
    where: { id }
  });
  revalidatePath('/transactions');
}

export async function deleteTransactions(ids: string[]) {
  await prisma.inventoryTransaction.deleteMany({
    where: { id: { in: ids } }
  });
  revalidatePath('/transactions');
}
