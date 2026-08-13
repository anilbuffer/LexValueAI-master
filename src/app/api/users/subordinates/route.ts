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
    const roleParam = searchParams.get('role')

    if (session.role === 'ADMIN') {
        const whereArgs: any = { 
            firmId: session.firmId,
            isActive: true,
            role: { in: ['MANAGING_PARTNER', 'ATTORNEY', 'PARALEGAL'] }
        }
        if (roleParam) whereArgs.role = roleParam

        const users = await prisma.user.findMany({
            where: whereArgs,
            select: { id: true, firstName: true, lastName: true, role: true, attorneyId: true }
        })
        return NextResponse.json({ success: true, users })
    }

    if (session.role === 'MANAGING_PARTNER') {
        let users: any[] = []
        const attorneysForMp = await prisma.user.findMany({
            where: { firmId: session.firmId, managingPartnerId: session.id, role: 'ATTORNEY' },
            select: { id: true }
        })
        const attyIds = attorneysForMp.map(a => a.id)

        if (!roleParam || roleParam === 'ATTORNEY') {
            const attorneys = await prisma.user.findMany({
                where: { firmId: session.firmId, managingPartnerId: session.id, isActive: true, role: 'ATTORNEY' },
                select: { id: true, firstName: true, lastName: true, role: true }
            })
            users = [...users, ...attorneys]
        }

        if (!roleParam || roleParam === 'PARALEGAL') {
            const paralegals = await prisma.user.findMany({
                where: { 
                    firmId: session.firmId, 
                    isActive: true, 
                    role: 'PARALEGAL',
                    OR: [
                        { managingPartnerId: session.id },
                        { attorneyId: { in: attyIds } }
                    ]
                },
                select: { id: true, firstName: true, lastName: true, role: true, attorneyId: true }
            })
            users = [...users, ...paralegals]
        }

        return NextResponse.json({ success: true, users })
    }

    if (session.role === 'ATTORNEY') {
        if (roleParam === 'ATTORNEY') {
            return NextResponse.json({ success: true, users: [] })
        }

        const paralegals = await prisma.user.findMany({
            where: { firmId: session.firmId, attorneyId: session.id, isActive: true, role: 'PARALEGAL' },
            select: { id: true, firstName: true, lastName: true, role: true, attorneyId: true }
        })
        return NextResponse.json({ success: true, users: paralegals })
    }

    return NextResponse.json({ success: true, users: [] })

  } catch (error) {
    console.error('Error fetching subordinates:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
