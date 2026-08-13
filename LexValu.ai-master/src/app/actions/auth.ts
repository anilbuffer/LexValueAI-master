'use server'

import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { encrypt } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function loginUser(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const remember = formData.get('remember') === 'on'

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: 'Invalid email format.' }
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return { error: 'Invalid credentials.' }
    }

    if (!user.isActive) {
      return { error: 'Your account is inactive. Please contact your administrator.' }
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash)
    if (!isMatch) {
      return { error: 'Invalid credentials.' }
    }

    // Create session payload
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      firmId: user.firmId,
    }

    // Set expiration based on remember me
    const maxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24; // 30 days or 24 hours
    const expiresIn = remember ? '30d' : '24h';

    // Sign JWT
    const token = await encrypt(payload, expiresIn)

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set('lexvalue-auth', token, {
      httpOnly: true,
      // Temporarily set secure to false so login works on HTTP ALB URL
      // Change to process.env.NODE_ENV === 'production' once you add HTTPS/SSL
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: maxAge,
    })

    try {
      await prisma.auditLog.create({
        data: {
          action: 'USER_LOGIN',
          details: `User ${user.email} logged in successfully`,
          userId: user.id,
          firmId: user.firmId,
        }
      })
    } catch (e) {
      console.error('Failed to create audit log for login:', e)
    }

    return { success: true }
  } catch (error) {
    console.error('Login error:', error)
    return { error: 'An unexpected error occurred.' }
  }
}

export async function logoutUser() {
  const { getSession } = await import('@/lib/auth')
  const session = await getSession()
  
  if (session && session.id && session.firmId) {
    try {
      await prisma.auditLog.create({
        data: {
          action: 'USER_LOGOUT',
          details: `User ${session.email} logged out successfully.`,
          userId: session.id,
          firmId: session.firmId,
        }
      })
    } catch (e) {
      console.error('Failed to create audit log for logout:', e)
    }
  }

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
