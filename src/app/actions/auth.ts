'use server'

import { cookies } from 'next/headers'

export async function loginUser(prevState: any, formData: FormData): Promise<{ success: boolean; error?: string }> {
  const email = formData.get('email') as string;
  if (email) {
    const cookieStore = await cookies();
    cookieStore.set('lexvalue-auth', email, { path: '/' });
  }
  return { success: true }
}

export async function logoutUser() {
  const cookieStore = await cookies()
  cookieStore.delete('lexvalue-auth')
}

export async function getUserRole() {
  const { getSession } = await import('@/lib/auth')
  const session = await getSession()
  return session?.role || null
}

export async function getCurrentUserId() {
  const { getSession } = await import('@/lib/auth')
  const session = await getSession()
  return session?.id || null
}
