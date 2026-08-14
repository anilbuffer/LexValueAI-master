import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session || !session.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Clients cannot view internal notes
    if (session.role === 'CLIENT') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id: caseId } = await params
    const targetCase = await prisma.case.findUnique({
      where: { id: caseId },
      select: { firmId: true }
    })

    if (!targetCase) return NextResponse.json({ error: 'Case not found' }, { status: 404 })

    let firmId: string | undefined | null = session.firmId
    if (!firmId) {
      const user = await prisma.user.findUnique({ where: { id: session.id } })
      firmId = user?.firmId
    }

    if (!firmId || targetCase.firmId !== firmId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const notes = await prisma.caseNote.findMany({
      where: {
        caseId,
        firmId
      },
      include: {
        author: {
          select: { firstName: true, lastName: true, role: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, notes })
  } catch (error) {
    console.error('Error fetching case notes:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session || !session.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    if (session.role === 'CLIENT') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id: caseId } = await params
    const targetCase = await prisma.case.findUnique({
      where: { id: caseId },
      select: { firmId: true }
    })

    if (!targetCase) return NextResponse.json({ error: 'Case not found' }, { status: 404 })

    let firmId: string | undefined | null = session.firmId
    if (!firmId) {
      const user = await prisma.user.findUnique({ where: { id: session.id } })
      firmId = user?.firmId
    }

    if (!firmId || targetCase.firmId !== firmId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await request.json()
    const { content, tags } = body

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const note = await prisma.caseNote.create({
      data: {
        content,
        tags: Array.isArray(tags) ? tags : [],
        authorId: session.id,
        caseId,
        firmId
      }
    })

    return NextResponse.json({ success: true, note })
  } catch (error) {
    console.error('Error creating case note:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
