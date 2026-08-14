import { NextResponse } from 'next/server'
import { deleteS3Objects } from '@/lib/s3'
import { mockCases, mockDocuments, getMockFirm, createMockAuditLog, deleteMockCase, deleteMockDocument, getMockUsers } from '@/lib/mock-data'

export async function GET(request: Request) {
  try {
    // 1. Basic Protection - In production, this should be protected by a CRON_SECRET header
    const authHeader = request.headers.get('authorization')
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const firm = getMockFirm()
    let totalDeletedAcrossAllFirms = 0;

    // Simulate retention check for the single mock firm
    if (firm && firm.dataRetention && firm.dataRetention !== "Indefinitely") {
      const retentionYears = parseInt(firm.dataRetention, 10);
      if (!isNaN(retentionYears)) {
        const cutoffDate = new Date();
        cutoffDate.setFullYear(cutoffDate.getFullYear() - retentionYears);

        const casesToDelete = mockCases.filter(c => c.firmId === firm.id && c.status === 'Closed' && new Date(c.updatedAt) <= cutoffDate);
        
        if (casesToDelete.length > 0) {
          const caseIds = casesToDelete.map(c => c.id);
          
          const documents = mockDocuments.filter(d => caseIds.includes(d.caseId));
          const s3Keys = documents.map(d => d.s3Key).filter(Boolean);

          if (s3Keys.length > 0) {
            try {
              await deleteS3Objects(s3Keys);
            } catch (e) {
              console.error("Failed to delete S3 objects chunk during data retention purge:", e);
            }
          }

          documents.forEach(d => deleteMockDocument(d.id));
          caseIds.forEach(id => deleteMockCase(id));
          
          totalDeletedAcrossAllFirms += caseIds.length;

          const systemAdmin = getMockUsers().find(u => u.firmId === firm.id && u.role === 'ADMIN');
          if (systemAdmin) {
            createMockAuditLog({
              id: `log-${Date.now()}`,
              action: 'Automated Data Retention Purge',
              details: `SYSTEM AUTO-ACTION: Permanently deleted ${caseIds.length} closed cases that exceeded the ${retentionYears}-year data retention policy.`,
              firmId: firm.id,
              userId: systemAdmin.id,
              createdAt: new Date()
            });
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Automated cleanup complete. Purged ${totalDeletedAcrossAllFirms} old cases across all firms.`
    })
  } catch (error) {
    console.error("Data retention cron error:", error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
