import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { generatePresignedUploadUrl } from '@/lib/s3'

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { caseId, fileName, mimeType, size, isTemp } = body

    let firmId = session.firmId
    if (!firmId) {
      const user = await prisma.user.findUnique({ where: { id: session.id } })
      firmId = user?.firmId || ''
    }

    if (isTemp) {
      if (!fileName || !mimeType) {
        return NextResponse.json({ error: 'Missing fileName or mimeType for temp upload' }, { status: 400 })
      }
      const s3Key = `temp_cases/${firmId}/${crypto.randomUUID()}/${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      try {
        const presignedUrl = await generatePresignedUploadUrl(s3Key, mimeType)
        return NextResponse.json({ success: true, presignedUrl, s3Key }, { status: 201 })
      } catch (e: any) {
        console.error('Error generating temp presigned URL:', e)
        return NextResponse.json({ error: 'Failed to generate upload URL.' }, { status: 500 })
      }
    }

    if (!caseId || !fileName || !mimeType || size === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify user has access to this case
    const dbCase = await prisma.case.findUnique({
      where: { id: caseId }
    })

    if (!dbCase) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 })
    }

    if (dbCase.firmId !== firmId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Security: Prevent concurrent uploads if case is currently scanning/processing
    if (dbCase.scanProgress < 100) {
      return NextResponse.json({ error: 'Case is currently processing a document. Please wait.' }, { status: 409 })
    }
    // Duplicate check
    const existingDoc = await prisma.document.findFirst({
      where: {
        caseId: caseId,
        fileName: fileName,
        size: size
      }
    });

    if (existingDoc) {
      return NextResponse.json({ error: 'A document with this exact name and size already exists in this case.' }, { status: 409 })
    }

    // Generate unique S3 key
    const s3Key = `firms/${firmId}/cases/${caseId}/${crypto.randomUUID()}_${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`

    let presignedUrl = ''
    try {
      presignedUrl = await generatePresignedUploadUrl(s3Key, mimeType)
    } catch (e: any) {
      console.error('Error generating presigned URL:', e)
      return NextResponse.json({ error: 'Failed to generate upload URL. Please check AWS configuration.' }, { status: 500 })
    }

    // Create Document record in DB
    const document = await prisma.document.create({
      data: {
        fileName,
        s3Key,
        mimeType,
        size,
        status: 'PENDING_UPLOAD', // Will be updated to PROCESSING once confirmed
        caseId,
        firmId
      }
    })

    return NextResponse.json({ success: true, presignedUrl, documentId: document.id }, { status: 201 })
  } catch (error) {
    console.error('Error in presigned-url route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
