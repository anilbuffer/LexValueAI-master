'use server'

import { getMockFirm, getMockUser } from '@/lib/mock-data'
import { getSession } from '@/lib/auth'

export async function getFirmSettings() {
  const session = await getSession()
  if (!session || !session.firmId) throw new Error('Unauthorized')
  return getMockFirm()
}

export async function updateFirmSettings(data: any) {
  return { success: true }
}

export async function getUserProfile() {
  const session = await getSession()
  if (!session || !session.id) throw new Error('Unauthorized')
  return getMockUser()
}

export async function updateUserProfile(data: any) {
  return { success: true }
}

export async function changePassword(currentPassword: string, newPassword: string) {
  return { success: true }
}
