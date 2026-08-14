import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getMockCaseById, getMockUsers } from '@/lib/mock-data'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session || !session.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Clients cannot view internal notes
    if (session.role === 'CLIENT') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id: caseId } = await params
    const targetCase = getMockCaseById(caseId)

    if (!targetCase) return NextResponse.json({ error: 'Case not found' }, { status: 404 })

    let firmId: string | undefined | null = session.firmId
    if (!firmId) {
      const user = getMockUsers().find(u => u.id === session.id)
      firmId = user?.firmId
    }

    if (!firmId || targetCase.firmId !== firmId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    // MOCK DATA for notes
    const notes = [
      {
        id: 'mock-note-1',
        content: 'This is a mock note for testing purposes.',
        tags: ['Important', 'Mock'],
        authorId: session.id,
        caseId,
        firmId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: {
          firstName: 'John',
          lastName: 'Doe',
          role: 'LAWYER'
        }
      }
    ]

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
    const targetCase = getMockCaseById(caseId)

    if (!targetCase) return NextResponse.json({ error: 'Case not found' }, { status: 404 })

    let firmId: string | undefined | null = session.firmId
    if (!firmId) {
      const user = getMockUsers().find(u => u.id === session.id)
      firmId = user?.firmId
    }

    if (!firmId || targetCase.firmId !== firmId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await request.json()
    const { content, tags } = body

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    // MOCK DATA for note creation
    const note = {
      id: `mock-note-${Date.now()}`,
      content,
      tags: Array.isArray(tags) ? tags : [],
      authorId: session.id,
      caseId,
      firmId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        firstName: 'Current',
        lastName: 'User',
        role: session.role || 'LAWYER'
      }
    }

    return NextResponse.json({ success: true, note })
  } catch (error) {
    console.error('Error creating case note:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
