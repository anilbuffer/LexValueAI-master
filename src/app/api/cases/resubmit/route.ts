import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getMockCaseById, updateMockCase, getMockUsers } from '@/lib/mock-data'

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only Paralegals (and Admins/Managing Partners) can resubmit cases
    if (session.role !== 'PARALEGAL' && session.role !== 'ADMIN' && session.role !== 'MANAGING_PARTNER') {
      return NextResponse.json({ error: 'Only Paralegals can resubmit cases' }, { status: 403 })
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

    // Resubmit the case (set to PENDING)
    updateMockCase(caseId, {
      approvalStatus: 'PENDING',
      rejectionReason: null,
      updatedAt: new Date()
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in case resubmit:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
