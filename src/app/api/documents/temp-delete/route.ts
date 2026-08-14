import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { deleteS3Objects } from '@/lib/s3'
import { getMockUsers } from '@/lib/mock-data'

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { s3Keys } = body

    if (!s3Keys || !Array.isArray(s3Keys) || s3Keys.length === 0) {
      return NextResponse.json({ success: true }) // Nothing to delete
    }

    // Security: Only allow deleting from the user's firm temp_cases folder
    let firmId = session.firmId
    if (!firmId) {
      const user = getMockUsers().find(u => u.id === session.id)
      firmId = user?.firmId || ''
    }

    const validKeys = s3Keys.filter(key => typeof key === 'string' && key.startsWith(`firms/${firmId}/temp_cases/`))

    if (validKeys.length > 0) {
      await deleteS3Objects(validKeys)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting temp files:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
