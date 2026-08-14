import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getMockUsers } from '@/lib/mock-data'

export async function GET(request: Request) {
  try {
    const session = await getSession()
    if (!session || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const roleParam = searchParams.get('role')

    const allUsers = getMockUsers().filter(u => u.firmId === session.firmId && u.isActive)

    if (session.role === 'ADMIN') {
        let users = allUsers.filter(u => ['MANAGING_PARTNER', 'ATTORNEY', 'PARALEGAL'].includes(u.role))
        if (roleParam) {
            users = users.filter(u => u.role === roleParam)
        }
        const formattedUsers = users.map(u => ({ id: u.id, firstName: u.firstName, lastName: u.lastName, role: u.role, attorneyId: u.attorneyId }))
        return NextResponse.json({ success: true, users: formattedUsers })
    }

    if (session.role === 'MANAGING_PARTNER') {
        let users: any[] = []
        const attorneysForMp = allUsers.filter(u => u.managingPartnerId === session.id && u.role === 'ATTORNEY')
        const attyIds = attorneysForMp.map((a: any) => a.id)

        if (!roleParam || roleParam === 'ATTORNEY') {
            const attorneys = attorneysForMp.map(u => ({ id: u.id, firstName: u.firstName, lastName: u.lastName, role: u.role }))
            users = [...users, ...attorneys]
        }

        if (!roleParam || roleParam === 'PARALEGAL') {
            const paralegals = allUsers
              .filter(u => u.role === 'PARALEGAL' && (u.managingPartnerId === session.id || attyIds.includes(u.attorneyId)))
              .map(u => ({ id: u.id, firstName: u.firstName, lastName: u.lastName, role: u.role, attorneyId: u.attorneyId }))
            users = [...users, ...paralegals]
        }

        return NextResponse.json({ success: true, users })
    }

    if (session.role === 'ATTORNEY') {
        if (roleParam === 'ATTORNEY') {
            return NextResponse.json({ success: true, users: [] })
        }

        const paralegals = allUsers
          .filter(u => u.attorneyId === session.id && u.role === 'PARALEGAL')
          .map(u => ({ id: u.id, firstName: u.firstName, lastName: u.lastName, role: u.role, attorneyId: u.attorneyId }))
        return NextResponse.json({ success: true, users: paralegals })
    }

    return NextResponse.json({ success: true, users: [] })

  } catch (error) {
    console.error('Error fetching subordinates:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
