import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { deleteS3Objects, moveS3Object } from '@/lib/s3'
import { processDocumentInBackground } from '@/lib/workers/documentProcessor'

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Role check: Allow PARALEGAL and MANAGING_PARTNER to create cases
    if (session.role !== 'PARALEGAL' && session.role !== 'MANAGING_PARTNER') {
      return NextResponse.json({ error: 'Only Paralegals and Managing Partners can create cases' }, { status: 403 })
    }

    // Get firmId (from session or database if missing in old token)
    let firmId = session.firmId
    if (!firmId) {
      const user = await prisma.user.findUnique({ where: { id: session.id } })
      if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 })
      firmId = user.firmId
    }

    const body = await request.json()
    const { referenceId, title, client, type, dateOfInjury, customPrompt, clientEmail, clientPhone, clientAge, clientGender, clientAddress, tempFiles } = body

    if (!referenceId || !title || !client || !type || !dateOfInjury || !clientEmail || !clientPhone || !clientAge || !clientGender || !clientAddress) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientEmail)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(clientPhone) || clientPhone.replace(/[^\d]/g, '').length < 7) {
      return NextResponse.json({ error: 'Invalid phone format' }, { status: 400 })
    }

    const ageNum = parseInt(clientAge, 10);
    if (isNaN(ageNum) || ageNum <= 0 || ageNum > 130) {
      return NextResponse.json({ error: 'Invalid age' }, { status: 400 })
    }

    // Ensure Case ID (referenceId) is unique within the firm
    const existingCase = await prisma.case.findFirst({
      where: {
        firmId: firmId,
        referenceId: referenceId
      }
    })

    if (existingCase) {
      return NextResponse.json({ error: 'A case with this Case ID already exists in your firm. Please use a unique Case ID.' }, { status: 409 })
    }

    // Create the case
    const newCase = await prisma.case.create({
      data: {
        referenceId,
        title,
        client,
        type,
        dateOfInjury: new Date(dateOfInjury),
        status: 'Processing', // Default status for new cases
        customPrompt: customPrompt || undefined,
        clientEmail: clientEmail,
        clientPhone: clientPhone,
        clientAge: parseInt(clientAge, 10),
        clientGender: clientGender,
        clientAddress: clientAddress,
        approvalStatus: 'PENDING',
        firmId: firmId,
        createdByUserId: session.id,
      },
    })

    // Process Temporary Files if provided
    if (tempFiles && Array.isArray(tempFiles) && tempFiles.length > 0) {
      for (const file of tempFiles) {
        if (!file.s3Key || !file.fileName || !file.mimeType) continue;
        
        const targetS3Key = `firms/${firmId}/cases/${newCase.id}/${Date.now()}_${file.fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        
        try {
          await moveS3Object(file.s3Key, targetS3Key);
          
          const newDoc = await prisma.document.create({
            data: {
              fileName: file.fileName,
              s3Key: targetS3Key,
              size: file.size || 0,
              mimeType: file.mimeType,
              status: 'PROCESSING',
              caseId: newCase.id,
              firmId: firmId
            }
          });
          
          // Trigger background worker
          processDocumentInBackground(newDoc.id).catch(console.error);
        } catch (e) {
          console.error("Failed to process temp file:", file.fileName, e);
        }
      }
    }

    try {
      await prisma.auditLog.create({
        data: {
          action: 'CASE_CREATED',
          details: `Case "${newCase.title}" created for client ${newCase.client}`,
          userId: session.id,
          firmId: firmId,
          caseId: newCase.id,
        }
      })
    } catch (e) {
      console.error('Failed to create audit log for case creation:', e)
    }

    try {
      const creator = await prisma.user.findUnique({ where: { id: session.id } })
      const admins = await prisma.user.findMany({ where: { firmId, role: 'ADMIN' } })

      const targetUserIds = new Set<string>()
      if (creator?.managingPartnerId) targetUserIds.add(creator.managingPartnerId)
      admins.forEach(admin => targetUserIds.add(admin.id))
      // Don't notify the creator themselves if they are admin
      targetUserIds.delete(session.id)

      const notifications = Array.from(targetUserIds).map(userId => ({
        message: `New Case "${newCase.title}" created by ${creator?.firstName} ${creator?.lastName}`,
        type: 'CASE_CREATED',
        userId,
        firmId,
        caseId: newCase.id
      }))

      if (notifications.length > 0) {
        await prisma.notification.createMany({ data: notifications })
      }
    } catch (e) {
      console.error('Failed to create notifications for case creation:', e)
    }

    return NextResponse.json({ success: true, case: newCase }, { status: 201 })
  } catch (error) {
    console.error('Error creating case: [Secure Log]')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const session = await getSession()
    if (!session || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({ where: { id: session.id } })
    if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 401 })

    const firmId = session.firmId || dbUser.firmId

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const search = searchParams.get('search') || ''
    const statusPending = searchParams.get('statusPending') === 'true'
    const statusApproved = searchParams.get('statusApproved') === 'true'
    const statusRejected = searchParams.get('statusRejected') === 'true'
    const statusClosed = searchParams.get('statusClosed') === 'true'
    const category = searchParams.get('category') || 'All'
    const fromDate = searchParams.get('fromDate') || ''
    const toDate = searchParams.get('toDate') || ''

    const skip = (page - 1) * limit

    const whereClause: any = { firmId: firmId }

    let roleOr: any[] = []
    if (session.role === 'ADMIN') {
      // Admin sees everything in the firm
    } else if (session.role === 'MANAGING_PARTNER') {
      roleOr = [
        { createdByUserId: session.id },
        { createdByUser: { managingPartnerId: session.id } },
        { assignedUsers: { some: { managingPartnerId: session.id } } },
        { assignedUsers: { some: { id: session.id } } }
      ]
    } else if (session.role === 'ATTORNEY') {
      roleOr = [
        { createdByUserId: session.id },
        { createdByUser: { attorneyId: session.id } },
        { assignedUsers: { some: { attorneyId: session.id } } },
        { assignedUsers: { some: { id: session.id } } }
      ]
    } else {
      // Paralegal or others
      roleOr = [
        { createdByUserId: session.id },
        { assignedUsers: { some: { id: session.id } } }
      ]
    }

    let searchOr: any[] = []
    if (search) {
      searchOr = [
        { title: { contains: search, mode: 'insensitive' } },
        { client: { contains: search, mode: 'insensitive' } },
        { referenceId: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (roleOr.length > 0 && searchOr.length > 0) {
      whereClause.AND = [
        { OR: roleOr },
        { OR: searchOr }
      ]
    } else if (roleOr.length > 0) {
      whereClause.OR = roleOr
    } else if (searchOr.length > 0) {
      whereClause.OR = searchOr
    }

    const hasStatusFilter = statusPending || statusApproved || statusRejected || statusClosed;

    const statusConditions: any[] = [];

    if (hasStatusFilter) {
      if (statusPending) statusConditions.push({ approvalStatus: 'PENDING', status: { not: 'Closed' } });
      if (statusApproved) statusConditions.push({ approvalStatus: 'APPROVED', status: { not: 'Closed' } });
      if (statusRejected) statusConditions.push({ approvalStatus: 'REJECTED', status: { not: 'Closed' } });
      if (statusClosed) statusConditions.push({ status: 'Closed' });

      whereClause.AND = whereClause.AND || [];
      whereClause.AND.push({ OR: statusConditions });
    }

    if (category !== 'All') {
      whereClause.type = category
    }

    if (fromDate || toDate) {
      whereClause.dateOfInjury = {}
      if (fromDate) {
        whereClause.dateOfInjury.gte = new Date(fromDate)
      }
      if (toDate) {
        const toD = new Date(toDate)
        toD.setHours(23, 59, 59, 999)
        whereClause.dateOfInjury.lte = toD
      }
    }

    const [total, cases] = await prisma.$transaction([
      prisma.case.count({ where: whereClause }),
      prisma.case.findMany({
        where: whereClause,
        include: {
          documents: true,
          createdByUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true,
              attorney: { select: { id: true, firstName: true, lastName: true, role: true } },
              managingPartner: { select: { id: true, firstName: true, lastName: true, role: true } }
            }
          },
          assignedUsers: { select: { id: true, firstName: true, lastName: true, role: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      })
    ])

    const totalPages = Math.max(1, Math.ceil(total / limit))

    return NextResponse.json({ success: true, cases, total, totalPages, currentPage: page }, { status: 200 })

  } catch (error: any) {
    require('fs').writeFileSync('e:\\\\Lex-AI\\\\api_error.log', error.stack || error.toString());
    console.error('Error fetching cases:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession()
    if (!session || !session.id || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Case ID is required' }, { status: 400 })
    }

    // Get firmId
    let firmId = session.firmId
    if (!firmId) {
      const user = await prisma.user.findUnique({ where: { id: session.id } })
      if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 })
      firmId = user.firmId
    }

    // Verify case exists and belongs to firm
    const existingCase = await prisma.case.findUnique({
      where: { id, firmId }
    })

    if (!existingCase) {
      return NextResponse.json({ error: 'Case not found or unauthorized' }, { status: 404 })
    }

    // Delete from S3 first to avoid orphaned files
    const documents = await prisma.document.findMany({ where: { caseId: id }, select: { s3Key: true } })
    const s3Keys = documents.map(d => d.s3Key).filter(Boolean)
    if (s3Keys.length > 0) {
      await deleteS3Objects(s3Keys)
    }

    await prisma.case.delete({
      where: { id, firmId }
    })

    try {
      await prisma.auditLog.create({
        data: {
          action: 'CASE_DELETED',
          details: `Case "${existingCase.title}" was deleted.`,
          userId: session.id,
          firmId: firmId,
          caseId: id,
        }
      })
    } catch (e) {
      console.error('Failed to create audit log for case deletion:', e)
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error deleting case:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
