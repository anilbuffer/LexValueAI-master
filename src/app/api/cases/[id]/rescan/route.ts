import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: caseId } = await params;

    // Mock processing delay for smooth UI navigation experience
    await new Promise(resolve => setTimeout(resolve, 800));

    // Return mock success response without Prisma dependency
    return NextResponse.json({ success: true, message: 'Rescan initiated' });
  } catch (error) {
    console.error('Error initiating rescan:', error);
    return NextResponse.json({ error: 'Failed to initiate rescan' }, { status: 500 });
  }
}
