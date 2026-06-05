'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getDistributions() {
  return await prisma.inventoryRoom.findMany({
    include: {
      inventory: {
        include: {
          item: true
        }
      },
      room: {
        include: {
          building: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function createDistribution(data: {
  inventoryId: string;
  roomId: string;
  quantity: number;
  status?: string;
  inventoryDate?: Date;
}) {
  const result = await prisma.inventoryRoom.create({
    data: {
      inventoryId: data.inventoryId,
      roomId: data.roomId,
      quantity: data.quantity,
      status: data.status || 'ACTIVE',
      inventoryDate: data.inventoryDate || new Date(),
    }
  });
  revalidatePath('/distribution');
  return result;
}

export async function updateDistribution(id: string, data: {
  quantity?: number;
  status?: string;
  inventoryDate?: Date;
}) {
  const result = await prisma.inventoryRoom.update({
    where: { id },
    data
  });
  revalidatePath('/distribution');
  return result;
}

export async function deleteDistribution(id: string) {
  await prisma.inventoryRoom.delete({
    where: { id }
  });
  revalidatePath('/distribution');
}

export async function deleteDistributions(ids: string[]) {
  await prisma.inventoryRoom.deleteMany({
    where: { id: { in: ids } }
  });
  revalidatePath('/distribution');
}
