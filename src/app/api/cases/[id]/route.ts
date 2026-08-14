import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getMockCaseById, getMockUsers, getMockDocumentsForCase, deleteMockCase } from '@/lib/mock-data'
import { deleteS3Objects } from '@/lib/s3'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session || !session.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id: caseId } = await params
    const targetCase = getMockCaseById(caseId)

    if (!targetCase) return NextResponse.json({ error: 'Case not found' }, { status: 404 })

    let firmId: string | undefined | null = session.firmId
    if (!firmId) {
      const user = getMockUsers().find(u => u.id === session.id)
      firmId = user?.firmId
    }

    if (!firmId) return NextResponse.json({ error: 'User does not belong to a firm' }, { status: 403 })

    if (targetCase.firmId !== firmId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const createdByUser = getMockUsers().find(u => u.id === targetCase.createdByUserId)

    // RBAC check
    if (session.role === 'MANAGING_PARTNER') {
      const isCreatorSubordinate = targetCase.createdByUserId === session.id || createdByUser?.managingPartnerId === session.id;
      const isAssignedSubordinate = targetCase.assignedUsers?.some((u: any) => u.id === session.id || u.managingPartnerId === session.id);
      if (!isCreatorSubordinate && !isAssignedSubordinate) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    } else if (session.role === 'ATTORNEY') {
      const isCreatorSubordinate = targetCase.createdByUserId === session.id || createdByUser?.attorneyId === session.id;
      const isAssignedSubordinate = targetCase.assignedUsers?.some((u: any) => u.id === session.id || u.attorneyId === session.id);
      if (!isCreatorSubordinate && !isAssignedSubordinate) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    } else if (session.role === 'PARALEGAL') {
      const isCreator = targetCase.createdByUserId === session.id;
      const isAssigned = targetCase.assignedUsers?.some((u: any) => u.id === session.id);
      if (!isCreator && !isAssigned) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({ success: true, scanProgress: targetCase.scanProgress, scanStage: targetCase.scanStage, status: targetCase.status })
  } catch (error) {
    console.error('Error fetching case:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Only Admins can delete cases' }, { status: 403 })
    }

    const { id: caseId } = await params

    const targetCase = getMockCaseById(caseId)
    if (!targetCase) return NextResponse.json({ error: 'Case not found' }, { status: 404 })

    // Check firm isolation
    let firmId: string | undefined | null = session.firmId
    if (!firmId) {
      const user = getMockUsers().find(u => u.id === session.id)
      if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 })
      firmId = user.firmId
    }

    if (!firmId || targetCase.firmId !== firmId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Delete from S3 first to avoid orphaned files
    const documents = getMockDocumentsForCase(caseId)
    const s3Keys = documents.map((d: any) => d.s3Key).filter(Boolean)
    if (s3Keys.length > 0) {
      await deleteS3Objects(s3Keys)
    }

    // Delete case
    deleteMockCase(caseId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting case:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
