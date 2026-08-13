'use server'

import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function closeCase(caseId: string) {
  const session = await getSession()
  
  if (!session || !session.id || !session.firmId) {
    throw new Error('Unauthorized')
  }

  try {
    revalidatePath('/cases')
    return { success: true }
  } catch (error: any) {
    console.error('Error closing case:', error)
    throw new Error(error.message || 'Could not close the case')
  }
}
