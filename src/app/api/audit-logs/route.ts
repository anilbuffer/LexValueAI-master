import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const session = await getSession()
    if (!session || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const roleFilter = searchParams.get('role') || 'All'
    const fromDate = searchParams.get('fromDate')
    const toDate = searchParams.get('toDate')

    // Fetch user to get firmId and true role
    const currentUser = await prisma.user.findUnique({ where: { id: session.id } })
    if (!currentUser || !currentUser.firmId) {
      return NextResponse.json({ error: 'User not found or no firm assigned' }, { status: 404 })
    }

    const validFirmId = currentUser.firmId
    const currentRole = currentUser.role

    // Base WHERE clause: Must be within the same firm (Multi-tenant isolation)
    let whereClause: any = { firmId: validFirmId }

    // --- RBAC Logic ---
    if (currentRole === 'PARALEGAL') {
      return NextResponse.json({ error: 'Access denied.' }, { status: 403 })
    }

    let allowedRoles: string[] = []
    if (currentRole === 'ADMIN') {
      allowedRoles = ['ADMIN', 'MANAGING_PARTNER', 'ATTORNEY', 'PARALEGAL']
    } else if (currentRole === 'MANAGING_PARTNER') {
      allowedRoles = ['ATTORNEY', 'PARALEGAL']
    } else if (currentRole === 'ATTORNEY') {
      allowedRoles = ['PARALEGAL']
    }

    let userFilter: any = {}

    // Apply Role Filter from dropdown if specified, else use allowed roles
    if (roleFilter !== 'All') {
      if (allowedRoles.includes(roleFilter)) {
        userFilter.role = roleFilter
      } else {
        // Attempting to filter a role they don't have access to
        return NextResponse.json({ error: 'Forbidden role filter' }, { status: 403 })
      }
    } else {
      userFilter.role = { in: allowedRoles }
    }

    // Apply Hierarchy Filter
    if (currentRole === 'MANAGING_PARTNER') {
      userFilter.managingPartnerId = currentUser.id
    } else if (currentRole === 'ATTORNEY') {
      userFilter.attorneyId = currentUser.id
    }

    whereClause.user = userFilter

    // --- Search Logic ---
    if (search) {
      whereClause = {
        ...whereClause,
        OR: [
          { user: { firstName: { contains: search, mode: 'insensitive' } } },
          { user: { lastName: { contains: search, mode: 'insensitive' } } },
          { user: { email: { contains: search, mode: 'insensitive' } } },
          { action: { contains: search, mode: 'insensitive' } },
          { details: { contains: search, mode: 'insensitive' } },
        ]
      }
    }

    // --- Date Range Filter ---
    if (fromDate || toDate) {
      whereClause.createdAt = {}
      if (fromDate) whereClause.createdAt.gte = new Date(fromDate)
      if (toDate) {
        const to = new Date(toDate)
        to.setHours(23, 59, 59, 999) // End of day
        whereClause.createdAt.lte = to
      }
    }

    // Fetch total count for pagination
    const total = await prisma.auditLog.count({ where: whereClause })
    
    // Fetch records
    const logs = await prisma.auditLog.findMany({
      where: whereClause,
      include: {
        user: { select: { firstName: true, lastName: true, email: true, role: true } }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    })

    const formattedLogs = logs.map((log: any) => ({
      id: log.id,
      action: log.action,
      details: log.details,
      timestamp: log.createdAt,
      user: {
        name: `${log.user.firstName} ${log.user.lastName}`,
        email: log.user.email,
        role: log.user.role,
      }
    }))

    return NextResponse.json({
      success: true,
      logs: formattedLogs,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    }, { status: 200 })

  } catch (error) {
    console.error('Audit Log API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
