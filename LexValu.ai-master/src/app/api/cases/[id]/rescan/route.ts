import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { processDocumentInBackground } from '@/lib/workers/documentProcessor';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: caseId } = await params;
    const caseRecord = await prisma.case.findUnique({
      where: { id: caseId },
      include: { documents: true }
    });

    if (!caseRecord || caseRecord.firmId !== session.firmId) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    // Reset the case scan status
    await prisma.case.update({
      where: { id: caseId },
      data: {
        scanStage: 'PENDING',
        scanProgress: 0,
        status: 'Processing',
        flags: 0
      }
    });

    // Reset all document statuses and trigger background processing
    for (const doc of caseRecord.documents) {
      await prisma.document.update({
        where: { id: doc.id },
        data: {
          status: 'PENDING',
          aiAnalysis: Prisma.DbNull
        }
      });
      // Fire and forget the background worker for each document
      processDocumentInBackground(doc.id).catch(err => {
        console.error(`Failed to process document ${doc.id}:`, err);
      });
    }

    return NextResponse.json({ success: true, message: 'Rescan initiated' });
  } catch (error) {
    console.error('Error initiating rescan:', error);
    return NextResponse.json({ error: 'Failed to initiate rescan' }, { status: 500 });
  }
}
