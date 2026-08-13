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
    const { fileName, mimeType, size, caseId } = body

    if (!fileName || !mimeType || !size || !caseId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Security: Check if user has access to this case
    const targetCase = await prisma.case.findUnique({ where: { id: caseId } })
    if (!targetCase) return NextResponse.json({ error: 'Case not found' }, { status: 404 })

    // Use session firmId or fetch user's firmId
    let firmId: string | undefined | null = session.firmId
    if (!firmId) {
       const user = await prisma.user.findUnique({ where: { id: session.id } })
       firmId = user?.firmId
    }

    if (!firmId) {
      return NextResponse.json({ error: 'User does not belong to a firm' }, { status: 403 })
    }
    
    const validFirmId = firmId as string

    if (targetCase.firmId !== validFirmId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Generate unique S3 Key
    const s3Key = `firms/${firmId}/cases/${caseId}/${Date.now()}_${fileName}`

    // Create Document record in DB (status: UPLOADED/PENDING)
    const newDocument = await prisma.document.create({
      data: {
        fileName,
        s3Key,
        size,
        mimeType,
        status: 'PENDING_UPLOAD',
        caseId,
        firmId: validFirmId
      }
    })

    // Generate Pre-signed URL for direct frontend upload
    const uploadUrl = await generatePresignedUploadUrl(s3Key, mimeType)

    return NextResponse.json({ success: true, uploadUrl, document: newDocument }, { status: 200 })
  } catch (error) {
    console.error('Error generating upload URL:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
