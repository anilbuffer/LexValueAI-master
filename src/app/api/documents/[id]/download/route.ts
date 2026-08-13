import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { generatePresignedDownloadUrl } from '@/lib/s3'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: documentId } = await params

    const document = await prisma.document.findUnique({
      where: { id: documentId }
    })

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Ensure the user belongs to the same firm as the document
    let firmId = session.firmId
    if (!firmId) {
      const user = await prisma.user.findUnique({ where: { id: session.id } })
      if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 })
      firmId = user.firmId
    }

    if (document.firmId !== firmId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const downloadUrl = await generatePresignedDownloadUrl(document.s3Key)

    return NextResponse.json({ success: true, downloadUrl }, { status: 200 })

  } catch (error) {
    console.error('Error getting download URL:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
