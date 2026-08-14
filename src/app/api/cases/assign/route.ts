import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getMockCases, updateMockCase, getMockUsers, createMockNotification } from '@/lib/mock-data'

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

    const validCases = getMockCases().filter(c => caseIds.includes(c.id) && c.firmId === session.firmId)
    const validCaseIds = validCases.map(c => c.id)

    const allUsers = getMockUsers()
    const assignedUsersObj = allUsers.filter(u => userIds.includes(u.id))

    validCaseIds.forEach(caseId => {
      updateMockCase(caseId, {
        assignedUsers: assignedUsersObj,
        updatedAt: new Date()
      })
    })

    try {
      const assigner = allUsers.find(u => u.id === session.id)
      const admins = allUsers.filter(u => u.firmId === session.firmId && u.role === 'ADMIN')

      const targetUserIds = new Set<string>()
      userIds.forEach((id: string) => targetUserIds.add(id))
      if (assigner?.managingPartnerId) targetUserIds.add(assigner.managingPartnerId)
      admins.forEach(admin => targetUserIds.add(admin.id))
      validCases.forEach(c => {
        if (c.createdByUserId) targetUserIds.add(c.createdByUserId)
      })
      targetUserIds.delete(session.id)

      validCaseIds.forEach(caseId => {
        Array.from(targetUserIds).forEach(userId => {
          createMockNotification({
            id: `notif-${Date.now()}-${userId}-${caseId}`,
            message: `A case assignment was updated (Case ID: ${caseId}) by ${assigner?.firstName} ${assigner?.lastName}`,
            type: 'CASE_ASSIGNED',
            userId,
            firmId: session.firmId!,
            caseId: caseId,
            isRead: false,
            createdAt: new Date()
          })
        })
      })
    } catch (e) {
      console.error('Failed to create notifications for case assignment:', e)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error assigning cases:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
