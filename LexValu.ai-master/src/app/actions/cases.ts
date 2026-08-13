'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function closeCase(caseId: string) {
  const session = await getSession()
  
  if (!session || !session.id || !session.firmId) {
    throw new Error('Unauthorized')
  }

  try {
    const targetCase = await prisma.case.findUnique({
      where: { id: caseId },
      include: {
        createdByUser: {
          include: {
            attorney: true
          }
        }
      }
    })

    if (!targetCase) {
      throw new Error('Case not found')
    }

    if (targetCase.firmId !== session.firmId) {
      throw new Error('Unauthorized access to firm data')
    }

    if (targetCase.status === 'Closed') {
      return { success: true }
    }

    const creator = targetCase.createdByUser
    let hasPermission = false

    if (session.role === 'MANAGING_PARTNER') {
      if (
        creator?.id === session.id ||
        creator?.managingPartnerId === session.id ||
        creator?.attorney?.managingPartnerId === session.id
      ) {
        hasPermission = true
      }
    } else if (session.role === 'ATTORNEY') {
      if (
        creator?.id === session.id ||
        creator?.attorneyId === session.id
      ) {
        hasPermission = true
      }
    }

    if (!hasPermission) {
      throw new Error('Forbidden: You do not have permission to close this case')
    }

    await prisma.case.update({
      where: { id: caseId },
      data: {
        status: 'Closed'
      }
    })

    revalidatePath('/cases')
    return { success: true }
  } catch (error: any) {
    console.error('Error closing case:', error)
    throw new Error(error.message || 'Could not close the case')
  }
}
