import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function PUT(request: Request) {
  try {
    const session = await getSession()
    if (!session || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { notificationId, markAll } = body

    if (markAll) {
      // Mark all as read for this user
      await prisma.notification.updateMany({
        where: { userId: session.id, isRead: false },
        data: { isRead: true }
      })
      return NextResponse.json({ success: true, message: 'All notifications marked as read' })
    }

    if (!notificationId) {
      return NextResponse.json({ error: 'Notification ID required' }, { status: 400 })
    }

    // Verify ownership
    const notification = await prisma.notification.findUnique({ where: { id: notificationId } })
    if (!notification || notification.userId !== session.id) {
      return NextResponse.json({ error: 'Notification not found or unauthorized' }, { status: 403 })
    }

    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
