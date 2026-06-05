'use server';

import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { createSession, destroySession } from '@/lib/session';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return { error: 'Invalid login credentials' };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return { error: 'Invalid login credentials' };
  }

  await createSession(user.id, user.role, user.name, user.email);
  redirect('/');
}

export async function logout() {
  await destroySession();
  redirect('/login');
}
