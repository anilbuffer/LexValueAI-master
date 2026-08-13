import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const session = await getSession()
    if (!session || !session.id || !session.firmId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''

    if (query.trim().length < 2) {
      return NextResponse.json({ success: true, results: { cases: [], users: [], notifications: [], auditLogs: [] } })
    }

    const firmId = session.firmId
    const role = session.role

    // ==========================================
    // 1. CASES QUERY BUILDER
    // ==========================================
    let caseRoleOr: any[] = []
    if (role === 'ADMIN') {
      // Admin sees everything in the firm
    } else if (role === 'MANAGING_PARTNER') {
      caseRoleOr = [
        { createdByUserId: session.id },
        { createdByUser: { managingPartnerId: session.id } },
        { assignedUsers: { some: { managingPartnerId: session.id } } },
        { assignedUsers: { some: { id: session.id } } }
      ]
    } else if (role === 'ATTORNEY') {
      caseRoleOr = [
        { createdByUserId: session.id },
        { createdByUser: { attorneyId: session.id } },
        { assignedUsers: { some: { attorneyId: session.id } } },
        { assignedUsers: { some: { id: session.id } } }
      ]
    } else {
      caseRoleOr = [
        { createdByUserId: session.id },
        { assignedUsers: { some: { id: session.id } } }
      ]
    }

    const caseWhere: any = {
      firmId,
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { client: { contains: query, mode: 'insensitive' } },
        { referenceId: { contains: query, mode: 'insensitive' } }
      ]
    }
    if (caseRoleOr.length > 0) {
      caseWhere.AND = [{ OR: caseRoleOr }]
    }

    // ==========================================
    // 2. USERS QUERY BUILDER
    // ==========================================
    let userWhere: any = null
    if (role !== 'PARALEGAL') {
      userWhere = {
        firmId,
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } }
        ]
      }
      if (role === 'ADMIN') {
        userWhere.id = { not: session.id }
      } else if (role === 'MANAGING_PARTNER') {
        userWhere.managingPartnerId = session.id
      } else if (role === 'ATTORNEY') {
        userWhere.attorneyId = session.id
      }
    }

    // ==========================================
    // 3. NOTIFICATIONS QUERY BUILDER
    // ==========================================
    const notifWhere: any = {
      firmId,
      userId: session.id,
      message: { contains: query, mode: 'insensitive' }
    }

    // ==========================================
    // 4. AUDIT LOGS QUERY BUILDER
    // ==========================================
    let auditWhere: any = null
    if (role === 'ADMIN' || role === 'MANAGING_PARTNER') {
      auditWhere = {
        firmId,
        OR: [
          { action: { contains: query, mode: 'insensitive' } },
          { details: { contains: query, mode: 'insensitive' } }
        ]
      }
    }

    // ==========================================
    // PARALLEL EXECUTION
    // ==========================================
    const [cases, users, notifications, auditLogs] = await Promise.all([
      prisma.case.findMany({
        where: caseWhere,
        take: 5,
        select: { id: true, title: true, type: true }
      }),
      userWhere ? prisma.user.findMany({
        where: userWhere,
        take: 3,
        select: { id: true, firstName: true, lastName: true, role: true, email: true }
      }) : Promise.resolve([]),
      prisma.notification.findMany({
        where: notifWhere,
        take: 3,
        select: { id: true, message: true, isRead: true }
      }),
      auditWhere ? prisma.auditLog.findMany({
        where: auditWhere,
        take: 3,
        select: { id: true, action: true, details: true }
      }) : Promise.resolve([])
    ])

    return NextResponse.json({
      success: true,
      results: { cases, users, notifications, auditLogs }
    })
  } catch (error) {
    console.error("Global search error:", error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
