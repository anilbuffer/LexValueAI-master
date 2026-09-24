'use server'

import { cookies } from 'next/headers'

export async function loginUser(prevState: any, formData: FormData): Promise<{ success: boolean; role?: string; error?: string }> {
  const email = formData.get('email') as string;
  if (email) {
    const cookieStore = await cookies();
    cookieStore.set('lexvalue-auth', email, { path: '/' });
    
    // determine role for initial redirect
    const { getMockUsers } = await import('@/lib/mock-data');
    const user = getMockUsers().find(u => u.email === email);
    if (user) {
      return { success: true, role: user.role };
    }
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
