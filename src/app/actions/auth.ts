'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { verifyPassword, setAuthCookie, clearAuthCookie } from '@/lib/auth';

export type AuthState = {
  error?: string;
};

export async function login(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { error: 'Invalid email or password.' };
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    return { error: 'Invalid email or password.' };
  }

  await setAuthCookie(user.id, user.email);
  redirect('/admin');
}

export async function logout() {
  await clearAuthCookie();
  redirect('/login');
}
