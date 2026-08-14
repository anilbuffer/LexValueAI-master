import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const mockLogs = [
      {
        id: '1',
        action: 'User Login',
        details: 'User logged into the system',
        timestamp: new Date().toISOString(),
        user: { name: 'John Doe', email: 'john@example.com', role: 'ADMIN' }
      },
      {
        id: '2',
        action: 'Settings Updated',
        details: 'Firm settings were updated',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        user: { name: 'Jane Smith', email: 'jane@example.com', role: 'MANAGING_PARTNER' }
      }
    ]

    return NextResponse.json({
      success: true,
      logs: mockLogs,
      total: mockLogs.length,
      page,
      totalPages: 1
    }, { status: 200 })

  } catch (error) {
    console.error('Audit Log API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
