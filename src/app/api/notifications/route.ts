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
    const isReadFilter = searchParams.get('isRead')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    // Fetch user to ensure firmId and role
    const currentUser = await prisma.user.findUnique({ where: { id: session.id } })
    if (!currentUser || !currentUser.firmId) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const whereClause: Record<string, any> = {
      firmId: currentUser.firmId,
      userId: currentUser.id
    }

    if (isReadFilter === 'true') {
      whereClause.isRead = true
    } else if (isReadFilter === 'false') {
      whereClause.isRead = false
    }

    if (search) {
      whereClause.message = { contains: search, mode: 'insensitive' }
    }

    if (dateFrom || dateTo) {
      whereClause.createdAt = {}
      if (dateFrom) {
        whereClause.createdAt.gte = new Date(dateFrom)
      }
      if (dateTo) {
        const endOfDay = new Date(dateTo)
        endOfDay.setUTCHours(23, 59, 59, 999)
        whereClause.createdAt.lte = endOfDay
      }
    }

    const total = await prisma.notification.count({ where: whereClause })

    const notifications = await prisma.notification.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    })

    return NextResponse.json({
      success: true,
      notifications,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    }, { status: 200 })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
