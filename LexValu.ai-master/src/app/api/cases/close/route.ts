import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.role !== 'MANAGING_PARTNER') {
      return NextResponse.json({ error: 'Only Managing Partners can close cases' }, { status: 403 })
    }

    const body = await request.json()
    const { caseId } = body

    if (!caseId) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const dbCase = await prisma.case.findUnique({
      where: { id: caseId },
      include: { createdByUser: true, assignedUsers: true }
    })

    if (!dbCase) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 })
    }

    // Verify firm access
    let firmId = session.firmId
    if (!firmId) {
      const user = await prisma.user.findUnique({ where: { id: session.id } })
      firmId = user?.firmId || ''
    }
    if (dbCase.firmId !== firmId) {
      return NextResponse.json({ error: 'Unauthorized firm access' }, { status: 403 })
    }

    // Update the case status to Closed
    await prisma.case.update({
      where: { id: caseId },
      data: {
        status: 'Closed'
      }
    })

    try {
      await prisma.auditLog.create({
        data: {
          action: 'CASE_CLOSED',
          details: `Case "${dbCase.title}" was closed.`,
          userId: session.id,
          firmId: firmId,
          caseId: caseId,
        }
      })
    } catch (e) {
      console.error('Failed to create audit log for case close:', e)
    }

    // Notify case team (creator + assigned users) about the case closure
    try {
      const closer = await prisma.user.findUnique({ where: { id: session.id } })
      
      const targetUserIds = new Set<string>()
      if (dbCase.createdByUserId) targetUserIds.add(dbCase.createdByUserId)
      dbCase.assignedUsers.forEach(u => targetUserIds.add(u.id))
      
      // Don't notify the person who is closing it
      targetUserIds.delete(session.id)

      if (targetUserIds.size > 0) {
        const notifications = Array.from(targetUserIds).map(userId => ({
          message: `Case "${dbCase.title}" was closed by ${closer?.firstName} ${closer?.lastName}.`,
          type: 'INFO',
          userId: userId,
          firmId: firmId,
          caseId: caseId
        }))
        
        await prisma.notification.createMany({ data: notifications })
      }
    } catch (e) {
      console.error('Failed to create notifications for case close:', e)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in case close:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
