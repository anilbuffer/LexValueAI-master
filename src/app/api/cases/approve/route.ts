import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getMockCaseById, updateMockCase, createMockAuditLog, createMockNotification, getMockUsers } from '@/lib/mock-data'

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only Attorneys can approve cases
    if (session.role !== 'ATTORNEY') {
      return NextResponse.json({ error: 'Only Attorneys can approve or reject cases' }, { status: 403 })
    }

    const body = await request.json()
    const { caseId, action, rejectionReason } = body

    if (!caseId || !action || !['APPROVE', 'REJECT'].includes(action)) {
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

    const createdByUser = getMockUsers().find(u => u.id === dbCase.createdByUserId)

    // Role-based hierarchy check for Attorney
    const isCreatorSubordinate = dbCase.createdByUserId === session.id || createdByUser?.attorneyId === session.id;
    const isAssignedSubordinate = dbCase.assignedUsers?.some((u: any) => u.id === session.id || u.attorneyId === session.id);
    if (!isCreatorSubordinate && !isAssignedSubordinate) {
      return NextResponse.json({ error: 'Forbidden. You do not have access to approve this case.' }, { status: 403 })
    }

    // Update the case
    updateMockCase(caseId, {
      approvalStatus: action === 'APPROVE' ? 'APPROVED' : 'REJECTED',
      rejectionReason: action === 'REJECT' ? rejectionReason : null,
      updatedAt: new Date()
    })

    createMockAuditLog({
      id: `log-${Date.now()}`,
      action: action === 'APPROVE' ? 'CASE_APPROVED' : 'CASE_REJECTED',
      details: `Case "${dbCase.title}" was ${action === 'APPROVE' ? 'approved' : 'rejected'}.`,
      userId: session.id,
      firmId: firmId,
      caseId: caseId,
      createdAt: new Date()
    })

    const approver = getMockUsers().find(u => u.id === session.id)
    const admins = getMockUsers().filter(u => u.firmId === firmId && u.role === 'ADMIN')
    
    const targetUserIds = new Set<string>()
    if (dbCase.createdByUserId) targetUserIds.add(dbCase.createdByUserId)
    if (approver?.managingPartnerId) targetUserIds.add(approver.managingPartnerId)
    admins.forEach((admin: any) => targetUserIds.add(admin.id))
    targetUserIds.delete(session.id)

    Array.from(targetUserIds).forEach(userId => {
      createMockNotification({
        id: `notif-${Date.now()}-${userId}`,
        message: `Case "${dbCase.title}" was ${action === 'APPROVE' ? 'approved' : 'rejected'} by ${approver?.firstName} ${approver?.lastName}.`,
        type: action === 'APPROVE' ? 'CASE_APPROVED' : 'CASE_REJECTED',
        userId,
        firmId,
        caseId: dbCase.id,
        isRead: false,
        createdAt: new Date()
      })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in case approval:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
