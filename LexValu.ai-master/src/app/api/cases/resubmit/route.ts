import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

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

    const dbCase = await prisma.case.findUnique({
      where: { id: caseId }
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

    // Resubmit the case (set to PENDING)
    await prisma.case.update({
      where: { id: caseId },
      data: {
        approvalStatus: 'PENDING',
        rejectionReason: null
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in case resubmit:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
