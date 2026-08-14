import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session || !session.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    if (session.role === 'CLIENT') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id: caseId } = await params

    const mockBills = [
      {
        id: '1',
        providerName: 'City Hospital',
        dateOfService: new Date('2023-10-01').toISOString(),
        billedAmount: 5000,
        adjustment: 1000,
        amountPaid: 2000,
        balance: 2000,
        caseId,
      },
      {
        id: '2',
        providerName: 'Dr. Smith Clinic',
        dateOfService: new Date('2023-10-15').toISOString(),
        billedAmount: 1500,
        adjustment: 200,
        amountPaid: 1300,
        balance: 0,
        caseId,
      }
    ]

    return NextResponse.json({ success: true, bills: mockBills })
  } catch (error) {
    console.error('Error fetching medical bills:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session || !session.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    if (session.role === 'CLIENT') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id: caseId } = await params

    const body = await request.json()
    const { providerName, dateOfService, billedAmount, adjustment, amountPaid, balance } = body

    if (!providerName || !dateOfService || billedAmount === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const mockBill = {
      id: Math.random().toString(36).substring(7),
      providerName,
      dateOfService: new Date(dateOfService).toISOString(),
      billedAmount: parseFloat(billedAmount),
      adjustment: adjustment ? parseFloat(adjustment) : null,
      amountPaid: amountPaid ? parseFloat(amountPaid) : null,
      balance: balance ? parseFloat(balance) : null,
      caseId,
    }

    return NextResponse.json({ success: true, bill: mockBill })
  } catch (error) {
    console.error('Error creating medical bill:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
