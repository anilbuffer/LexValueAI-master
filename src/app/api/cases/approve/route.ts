import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

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

    const dbCase = await prisma.case.findUnique({
      where: { id: caseId },
      include: { 
        createdByUser: true,
        assignedUsers: true
      }
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

    // Role-based hierarchy check for Attorney
    const isCreatorSubordinate = dbCase.createdByUserId === session.id || dbCase.createdByUser?.attorneyId === session.id;
    const isAssignedSubordinate = dbCase.assignedUsers.some((u: any) => u.id === session.id || u.attorneyId === session.id);
    if (!isCreatorSubordinate && !isAssignedSubordinate) {
      return NextResponse.json({ error: 'Forbidden. You do not have access to approve this case.' }, { status: 403 })
    }

    // Update the case
    await prisma.case.update({
      where: { id: caseId },
      data: {
        approvalStatus: action === 'APPROVE' ? 'APPROVED' : 'REJECTED',
        rejectionReason: action === 'REJECT' ? rejectionReason : null
      }
    })

    try {
      await prisma.auditLog.create({
        data: {
          action: action === 'APPROVE' ? 'CASE_APPROVED' : 'CASE_REJECTED',
          details: `Case "${dbCase.title}" was ${action === 'APPROVE' ? 'approved' : 'rejected'}.`,
          userId: session.id,
          firmId: firmId,
          caseId: caseId,
        }
      })
    } catch (e) {
      console.error('Failed to create audit log for case approval:', e)
    }

    try {
      const approver = await prisma.user.findUnique({ where: { id: session.id } })
      const admins = await prisma.user.findMany({ where: { firmId, role: 'ADMIN' } })
      
      const targetUserIds = new Set<string>()
      // Notify the case creator
      if (dbCase.createdByUserId) targetUserIds.add(dbCase.createdByUserId)
      // Notify the MP of the approver (if they have one)
      if (approver?.managingPartnerId) targetUserIds.add(approver.managingPartnerId)
      // Notify admins
      admins.forEach(admin => targetUserIds.add(admin.id))
      // Don't notify the approver themselves
      targetUserIds.delete(session.id)

      const notifications = Array.from(targetUserIds).map(userId => ({
        message: `Case "${dbCase.title}" was ${action === 'APPROVE' ? 'approved' : 'rejected'} by ${approver?.firstName} ${approver?.lastName}.`,
        type: action === 'APPROVE' ? 'CASE_APPROVED' : 'CASE_REJECTED',
        userId,
        firmId,
        caseId: dbCase.id
      }))

      if (notifications.length > 0) {
        await prisma.notification.createMany({ data: notifications })
      }
    } catch (e) {
      console.error('Failed to create notifications for case approval:', e)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in case approval:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
