import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { mockNotifications } from '@/lib/mock-data'

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
      mockNotifications.forEach(n => {
        if (n.userId === session.id && !n.isRead) {
          n.isRead = true;
        }
      });
      return NextResponse.json({ success: true, message: 'All notifications marked as read' })
    }

    if (!notificationId) {
      return NextResponse.json({ error: 'Notification ID required' }, { status: 400 })
    }

    // Verify ownership
    const notification = mockNotifications.find(n => n.id === notificationId)
    if (!notification || notification.userId !== session.id) {
      return NextResponse.json({ error: 'Notification not found or unauthorized' }, { status: 403 })
    }

    notification.isRead = true;

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
