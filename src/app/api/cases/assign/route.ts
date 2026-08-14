import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { caseIds, userIds } = body

    if (!caseIds || !userIds || !Array.isArray(caseIds) || !Array.isArray(userIds)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    if (caseIds.length === 0 || userIds.length !== 2) {
      return NextResponse.json({ error: 'Must provide at least one case and exactly two users (Attorney and Paralegal)' }, { status: 400 })
    }

    // Role-based permission check
    if (!['ADMIN', 'MANAGING_PARTNER', 'ATTORNEY'].includes(session.role || '')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const connectArr = userIds.map(id => ({ id }))

    // First, verify that all cases belong to the current firm and get creators
    const validCases = await prisma.case.findMany({
      where: { id: { in: caseIds }, firmId: session.firmId },
      select: { id: true, createdByUserId: true, title: true }
    })
    const validCaseIds = validCases.map((c: any) => c.id)

    const transactions = validCaseIds.map((caseId: any) => {
      return prisma.case.update({
        where: { id: caseId },
        data: {
          assignedUsers: {
            connect: connectArr
          }
        }
      })
    })

    await prisma.$transaction(transactions)

    try {
      const assigner = await prisma.user.findUnique({ where: { id: session.id } })
      const admins = await prisma.user.findMany({ where: { firmId: session.firmId, role: 'ADMIN' } })

      const targetUserIds = new Set<string>()
      userIds.forEach((id: string) => targetUserIds.add(id))
      if (assigner?.managingPartnerId) targetUserIds.add(assigner.managingPartnerId)
      admins.forEach((admin: any) => targetUserIds.add(admin.id))
      validCases.forEach((c: any) => {
        if (c.createdByUserId) targetUserIds.add(c.createdByUserId)
      })
      targetUserIds.delete(session.id)

      const notifications: { message: string; type: string; userId: string; firmId: string; caseId?: string }[] = []
      validCaseIds.forEach((caseId: any) => {
        Array.from(targetUserIds).forEach((userId: any) => {
          notifications.push({
            message: `A case assignment was updated (Case ID: ${caseId}) by ${assigner?.firstName} ${assigner?.lastName}`,
            type: 'CASE_ASSIGNED',
            userId,
            firmId: session.firmId!,
            caseId: caseId
          })
        })
      })

      if (notifications.length > 0) {
        await prisma.notification.createMany({ data: notifications })
      }
    } catch (e) {
      console.error('Failed to create notifications for case assignment:', e)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error assigning cases:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
// Force Next.js HMR (v2)
