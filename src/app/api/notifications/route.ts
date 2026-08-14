import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getMockUsers, mockNotifications } from '@/lib/mock-data'

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
    const currentUser = getMockUsers().find(u => u.id === session.id)
    if (!currentUser || !currentUser.firmId) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    let filtered = mockNotifications.filter(n => n.firmId === currentUser.firmId && n.userId === currentUser.id)

    if (isReadFilter === 'true') {
      filtered = filtered.filter(n => n.isRead === true)
    } else if (isReadFilter === 'false') {
      filtered = filtered.filter(n => n.isRead === false)
    }

    if (search) {
      filtered = filtered.filter(n => n.message.toLowerCase().includes(search.toLowerCase()))
    }

    if (dateFrom || dateTo) {
      if (dateFrom) {
        const fromD = new Date(dateFrom)
        filtered = filtered.filter(n => new Date(n.createdAt) >= fromD)
      }
      if (dateTo) {
        const toD = new Date(dateTo)
        toD.setUTCHours(23, 59, 59, 999)
        filtered = filtered.filter(n => new Date(n.createdAt) <= toD)
      }
    }

    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = filtered.length;
    const notifications = filtered.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      success: true,
      notifications,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1
    }, { status: 200 })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
