import { NextResponse } from 'next/server'
import { getMockCases, getMockUser } from '@/lib/mock-data'

export async function POST(request: Request) {
  const newCase = { ...getMockCases()[0], id: `mock-${Date.now()}`, title: 'Newly Created Mock Case' };
  return NextResponse.json({ success: true, case: newCase }, { status: 201 })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '10', 10)
  
  const allCases = getMockCases()
  
  const skip = (page - 1) * limit
  const paginatedCases = allCases.slice(skip, skip + limit)
  const total = allCases.length
  const totalPages = Math.max(1, Math.ceil(total / limit))

  return NextResponse.json({ success: true, cases: paginatedCases, total, totalPages, currentPage: page }, { status: 200 })
}

export async function DELETE(request: Request) {
  return NextResponse.json({ success: true }, { status: 200 })
}
