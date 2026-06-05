'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// --- ITEM TYPES ---

export async function getItemTypes() {
  return await prisma.itemType.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function createItemType(data: { name: string; description?: string }) {
  const result = await prisma.itemType.create({
    data
  });
  revalidatePath('/master/items');
  return result;
}

export async function deleteItemType(id: string) {
  await prisma.itemType.delete({
    where: { id }
  });
  revalidatePath('/master/categories');
}

export async function updateItemType(id: string, data: { name: string; description?: string }) {
  const result = await prisma.itemType.update({
    where: { id },
    data
  });
  revalidatePath('/master/categories');
  return result;
}

// --- ITEMS ---

export async function getItems() {
  return await prisma.item.findMany({
    include: {
      itemType: true
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function createItem(data: { 
  name: string; 
  unit?: string; 
  itemTypeId?: string; 
  usefulLifeMonths: number; 
}) {
  const result = await prisma.item.create({
    data
  });
  revalidatePath('/master/items');
  return result;
}

export async function updateItem(id: string, data: { 
  name: string; 
  unit?: string; 
  itemTypeId?: string; 
  usefulLifeMonths: number; 
}) {
  const result = await prisma.item.update({
    where: { id },
    data
  });
  revalidatePath('/master/items');
  return result;
}

export async function deleteItem(id: string) {
  await prisma.item.delete({
    where: { id }
  });
  revalidatePath('/master/items');
}

// --- BUILDINGS ---

export async function getBuildings() {
  return await prisma.building.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function createBuilding(data: { name: string; foundationId?: string }) {
  const result = await prisma.building.create({
    data
  });
  revalidatePath('/master/buildings');
  return result;
}

export async function updateBuilding(id: string, data: { name: string; foundationId?: string }) {
  const result = await prisma.building.update({
    where: { id },
    data
  });
  revalidatePath('/master/buildings');
  return result;
}

export async function deleteBuilding(id: string) {
  await prisma.building.delete({
    where: { id }
  });
  revalidatePath('/master/buildings');
}

// --- ROOMS ---

export async function getRooms() {
  return await prisma.room.findMany({
    include: {
      building: true
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function createRoom(data: { name: string; floor?: string; buildingId: string }) {
  const result = await prisma.room.create({
    data
  });
  revalidatePath('/master/rooms');
  return result;
}

export async function updateRoom(id: string, data: { name: string; floor?: string; buildingId?: string }) {
  const result = await prisma.room.update({
    where: { id },
    data
  });
  revalidatePath('/master/rooms');
  return result;
}

export async function deleteRoom(id: string) {
  await prisma.room.delete({
    where: { id }
  });
  revalidatePath('/master/rooms');
}

// --- TRANSACTION TYPES ---

export async function getTransactionTypes() {
  return await prisma.transactionType.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function createTransactionType(data: { name: string; foundationId?: string }) {
  const result = await prisma.transactionType.create({
    data
  });
  revalidatePath('/master/transaction-types');
  return result;
}

export async function updateTransactionType(id: string, data: { name: string; foundationId?: string }) {
  const result = await prisma.transactionType.update({
    where: { id },
    data
  });
  revalidatePath('/master/transaction-types');
  return result;
}

export async function deleteTransactionType(id: string) {
  await prisma.transactionType.delete({
    where: { id }
  });
  revalidatePath('/master/transaction-types');
}
