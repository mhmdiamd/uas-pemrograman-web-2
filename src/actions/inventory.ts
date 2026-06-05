'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

export async function getInventory() {
  return await prisma.inventory.findMany({
    include: {
      item: {
        include: {
          itemType: true
        }
      },
      inventoryRooms: {
        include: {
          room: {
            include: {
              building: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function createInventory(data: {
  itemId: string;
  quantity: number;
  price: number;
  salvageValue?: number;
  specification?: string;
  status?: string;
  photo?: string;
  description?: string;
  merk?: string;
  barcode?: string;
  expiredDate?: Date;
  purchaseDate?: Date;
}) {
  const result = await prisma.inventory.create({
    data: {
      ...data,
      // Ensure decimal conversion
      price: new Prisma.Decimal(data.price),
      salvageValue: new Prisma.Decimal(data.salvageValue || 0),
    }
  });
  revalidatePath('/inventory');
  return result;
}

export async function updateInventory(id: string, data: {
  itemId?: string;
  quantity?: number;
  price?: number;
  salvageValue?: number;
  specification?: string;
  status?: string;
  photo?: string;
  description?: string;
  merk?: string;
  barcode?: string;
  expiredDate?: Date;
  purchaseDate?: Date;
}) {
  const result = await prisma.inventory.update({
    where: { id },
    data: {
      ...data,
      price: data.price !== undefined ? new Prisma.Decimal(data.price) : undefined,
      salvageValue: data.salvageValue !== undefined ? new Prisma.Decimal(data.salvageValue) : undefined,
    }
  });
  revalidatePath('/inventory');
  return result;
}

export async function deleteInventory(id: string) {
  await prisma.inventory.delete({
    where: { id }
  });
  revalidatePath('/inventory');
}

export async function deleteInventories(ids: string[]) {
  await prisma.inventory.deleteMany({
    where: { id: { in: ids } }
  });
  revalidatePath('/inventory');
}
