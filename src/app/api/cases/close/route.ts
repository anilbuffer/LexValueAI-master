import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getMockCaseById, updateMockCase, getMockUsers, createMockAuditLog, createMockNotification } from '@/lib/mock-data'

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

    const dbCase = getMockCaseById(caseId)

    if (!dbCase) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 })
    }

    // Verify firm access
    let firmId = session.firmId
    if (!firmId) {
      const user = getMockUsers().find(u => u.id === session.id)
      firmId = user?.firmId || ''
    }
    if (dbCase.firmId !== firmId) {
      return NextResponse.json({ error: 'Unauthorized firm access' }, { status: 403 })
    }

    // Update the case status to Closed
    updateMockCase(caseId, {
      status: 'Closed',
      updatedAt: new Date()
    })

    createMockAuditLog({
      id: `log-${Date.now()}`,
      action: 'CASE_CLOSED',
      details: `Case "${dbCase.title}" was closed.`,
      userId: session.id,
      firmId: firmId,
      caseId: caseId,
      createdAt: new Date()
    })

    // Notify case team (creator + assigned users) about the case closure
    try {
      const closer = getMockUsers().find(u => u.id === session.id)
      
      const targetUserIds = new Set<string>()
      if (dbCase.createdByUserId) targetUserIds.add(dbCase.createdByUserId)
      dbCase.assignedUsers?.forEach((u: any) => targetUserIds.add(u.id))
      
      // Don't notify the person who is closing it
      targetUserIds.delete(session.id)

      if (targetUserIds.size > 0) {
        Array.from(targetUserIds).forEach(userId => {
          createMockNotification({
            id: `notif-${Date.now()}-${userId}`,
            message: `Case "${dbCase.title}" was closed by ${closer?.firstName} ${closer?.lastName}.`,
            type: 'INFO',
            userId: userId,
            firmId: firmId,
            caseId: caseId,
            isRead: false,
            createdAt: new Date()
          })
        })
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
