'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'

// Ensure we don't leak any sensitive firm data to unauthenticated users
export async function getFirmSettings() {
  const session = await getSession()

  if (!session || !session.firmId) {
    throw new Error('Unauthorized')
  }

  try {
    const firm = await prisma.firm.findUnique({
      where: {
        id: session.firmId,
      },
      select: {
        name: true,
        taxId: true,
        email: true,
        phone: true,
        address: true,
        require2fa: true,
        sessionTimeout: true,
        dataRetention: true,
      }
    })

    if (!firm) {
      throw new Error('Firm not found')
    }

    return firm
  } catch (error) {
    console.error('Error fetching firm settings:', error)
    throw new Error('Could not fetch firm settings')
  }
}

export async function updateFirmSettings(data: {
  name: string
  taxId?: string
  email?: string
  phone?: string
  address?: string
  require2fa: boolean
  sessionTimeout: number
  dataRetention: string
}) {
  const session = await getSession()

  if (!session || !session.firmId) {
    throw new Error('Unauthorized')
  }

  // Basic authorization: Only Admins should update firm settings
  if (session.role !== 'ADMIN') {
    throw new Error('Forbidden: Only Admins can update firm settings')
  }

  try {
    const updatedFirm = await prisma.firm.update({
      where: {
        id: session.firmId, // CRITICAL: strictly update by firmId from session to prevent cross-tenant modification
      },
      data: {
        name: data.name,
        taxId: data.taxId,
        email: data.email,
        phone: data.phone,
        address: data.address,
        require2fa: data.require2fa,
        sessionTimeout: data.sessionTimeout,
        dataRetention: data.dataRetention,
      }
    })

    return { success: true }
  } catch (error) {
    console.error('Error updating firm settings:', error)
    throw new Error('Could not update firm settings')
  }
}

export async function getUserProfile() {
  const session = await getSession()

  if (!session || !session.id) {
    throw new Error('Unauthorized')
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
      }
    })

    if (!user) {
      throw new Error('User not found')
    }

    return user
  } catch (error) {
    console.error('Error fetching user profile:', error)
    throw new Error('Could not fetch user profile')
  }
}

export async function updateUserProfile(data: {
  firstName: string
  lastName: string
  phone?: string
}) {
  const session = await getSession()

  if (!session || !session.id) {
    throw new Error('Unauthorized')
  }

  try {
    await prisma.user.update({
      where: {
        id: session.id,
      },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      }
    })

    return { success: true }
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw new Error('Could not update user profile')
  }
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const session = await getSession()

  if (!session || !session.id) {
    return { error: 'Unauthorized' }
  }

  if (newPassword.length < 8) {
    return { error: 'New password must be at least 8 characters long.' }
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { passwordHash: true }
    })

    if (!user) {
      return { error: 'User not found' }
    }

    const isMatch = bcrypt.compareSync(currentPassword, user.passwordHash)
    if (!isMatch) {
      return { error: 'Current password is incorrect.' }
    }

    const newHash = bcrypt.hashSync(newPassword, 10)

    await prisma.user.update({
      where: { id: session.id },
      data: { passwordHash: newHash }
    })

    return { success: true }
  } catch (error: any) {
    console.error('Error changing password:', error)
    return { error: 'Could not change password' }
  }
}
