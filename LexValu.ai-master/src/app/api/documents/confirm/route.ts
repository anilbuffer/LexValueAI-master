import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { processDocumentInBackground } from '@/lib/workers/documentProcessor'

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { documentId } = body

    if (!documentId) {
      return NextResponse.json({ error: 'Missing documentId' }, { status: 400 })
    }

    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: { case: true }
    })

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Security: Check if user has access to this firm's data (HIPAA/Multi-tenant)
    let firmId: string | undefined | null = session.firmId
    if (!firmId) {
      const user = await prisma.user.findUnique({ where: { id: session.id } })
      firmId = user?.firmId
    }

    if (document.firmId !== firmId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (document.status !== 'PENDING_UPLOAD') {
      return NextResponse.json({ error: 'Document is not pending upload' }, { status: 400 })
    }

    // Step 1: Update status to PROCESSING
    await prisma.document.update({
      where: { id: documentId },
      data: { status: 'PROCESSING' }
    })

    // Step 2: Trigger the background worker (DO NOT AWAIT)
    // This allows the API to return immediately while the heavy Textract/pgvector job runs in the background.
    processDocumentInBackground(documentId).catch(console.error);

    // Step 3: Return success immediately
    return NextResponse.json({
      success: true,
      message: 'Upload confirmed. Document is now being processed in the background.'
    }, { status: 200 })

  } catch (error) {
    console.error('Error confirming document upload:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
