import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { mockCases, mockUsers, mockNotifications, mockAuditLogs } from '@/lib/mock-data'

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
    const lowerQuery = query.toLowerCase()

    let cases = mockCases.filter(c => c.firmId === firmId && (
      c.title.toLowerCase().includes(lowerQuery) ||
      (c.client && c.client.toLowerCase().includes(lowerQuery)) ||
      (c.referenceId && c.referenceId.toLowerCase().includes(lowerQuery))
    ));

    // Very simplified role check for search
    if (role === 'MANAGING_PARTNER') {
      const currentUser = mockUsers.find(u => u.id === session.id)
      const subIds = mockUsers.filter(u => u.managingPartnerId === session.id).map(u => u.id)
      cases = cases.filter(c => c.createdByUserId === session.id || (c.createdByUserId && subIds.includes(c.createdByUserId)) || c.assignedUsers?.some((u:any) => u.id === session.id || subIds.includes(u.id)))
    } else if (role === 'ATTORNEY') {
      const subIds = mockUsers.filter(u => u.attorneyId === session.id).map(u => u.id)
      cases = cases.filter(c => c.createdByUserId === session.id || (c.createdByUserId && subIds.includes(c.createdByUserId)) || c.assignedUsers?.some((u:any) => u.id === session.id || subIds.includes(u.id)))
    } else if (role === 'PARALEGAL') {
      cases = cases.filter(c => c.createdByUserId === session.id || c.assignedUsers?.some((u:any) => u.id === session.id))
    }

    let users: any[] = []
    if (role !== 'PARALEGAL') {
      users = mockUsers.filter(u => u.firmId === firmId && (
        u.firstName.toLowerCase().includes(lowerQuery) ||
        u.lastName.toLowerCase().includes(lowerQuery) ||
        u.email.toLowerCase().includes(lowerQuery)
      ));
      if (role === 'ADMIN') {
        users = users.filter(u => u.id !== session.id)
      } else if (role === 'MANAGING_PARTNER') {
        users = users.filter(u => u.managingPartnerId === session.id)
      } else if (role === 'ATTORNEY') {
        users = users.filter(u => u.attorneyId === session.id)
      }
    }

    let notifications = mockNotifications.filter(n => n.firmId === firmId && n.userId === session.id && n.message.toLowerCase().includes(lowerQuery));

    let auditLogs: any[] = []
    if (role === 'ADMIN' || role === 'MANAGING_PARTNER') {
      auditLogs = mockAuditLogs.filter(a => a.firmId === firmId && (
        a.action.toLowerCase().includes(lowerQuery) ||
        a.details.toLowerCase().includes(lowerQuery)
      ));
    }

    return NextResponse.json({
      success: true,
      results: { 
        cases: cases.slice(0, 5).map(c => ({ id: c.id, title: c.title, type: c.type })),
        users: users.slice(0, 3).map(u => ({ id: u.id, firstName: u.firstName, lastName: u.lastName, role: u.role, email: u.email })),
        notifications: notifications.slice(0, 3).map(n => ({ id: n.id, message: n.message, isRead: n.isRead })),
        auditLogs: auditLogs.slice(0, 3).map(a => ({ id: a.id, action: a.action, details: a.details }))
      }
    })
  } catch (error) {
    console.error("Global search error:", error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
