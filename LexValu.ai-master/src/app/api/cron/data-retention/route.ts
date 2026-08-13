import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { deleteS3Objects } from '@/lib/s3'

export async function GET(request: Request) {
  try {
    // 1. Basic Protection - In production, this should be protected by a CRON_SECRET header
    const authHeader = request.headers.get('authorization')
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Fetch all firms to process their individual retention policies
    const firms = await prisma.firm.findMany({
      select: { id: true, name: true, dataRetention: true }
    })

    let totalDeletedAcrossAllFirms = 0;

    for (const firm of firms) {
      try {
        // Skip if they want to keep data indefinitely
        if (firm.dataRetention === "Indefinitely" || !firm.dataRetention) {
          continue;
        }

        // Parse the number of years (e.g. "7" from "7 Years (Standard)")
        const retentionYears = parseInt(firm.dataRetention, 10);
        if (isNaN(retentionYears)) {
          continue;
        }

        // 3. Calculate cutoff date exactly X years ago
        const cutoffDate = new Date();
        cutoffDate.setFullYear(cutoffDate.getFullYear() - retentionYears);

        // 4. Find cases to delete to count them and prepare for audit log
        const casesToDelete = await prisma.case.findMany({
          where: {
            firmId: firm.id,
            status: 'Closed',
            updatedAt: { lte: cutoffDate }
          },
          select: { id: true }
        });

        if (casesToDelete.length > 0) {
          const caseIds = casesToDelete.map(c => c.id);

          // Fetch all S3 keys for all documents in all these cases to delete from AWS S3
          const documents = await prisma.document.findMany({
            where: { caseId: { in: caseIds } },
            select: { s3Key: true }
          });
          const s3Keys = documents.map(d => d.s3Key).filter(Boolean);

          // AWS S3 DeleteObjects max limit is 1000 keys per request. Process in chunks.
          for (let i = 0; i < s3Keys.length; i += 1000) {
            const chunk = s3Keys.slice(i, i + 1000);
            try {
              await deleteS3Objects(chunk);
            } catch (e) {
              console.error("Failed to delete S3 objects chunk during data retention purge:", e);
            }
          }

          // Perform bulk cascade delete in DB (process in chunks to avoid Prisma query limits)
          let deletedCount = 0;
          for (let i = 0; i < caseIds.length; i += 1000) {
            const chunkIds = caseIds.slice(i, i + 1000);
            const deleteResult = await prisma.case.deleteMany({
              where: {
                id: { in: chunkIds }
              }
            });
            deletedCount += deleteResult.count;
          }

          totalDeletedAcrossAllFirms += deletedCount;

          // 5. Create an Audit Log entry so the firm knows the system deleted data
          const systemAdmin = await prisma.user.findFirst({
            where: { firmId: firm.id },
            orderBy: { role: 'asc' } // ADMIN is alphabetically first
          });

          if (systemAdmin) {
            await prisma.auditLog.create({
              data: {
                action: 'Automated Data Retention Purge',
                details: `SYSTEM AUTO-ACTION: Permanently deleted ${deletedCount} closed cases that exceeded the ${retentionYears}-year data retention policy.`,
                firmId: firm.id,
                userId: systemAdmin.id
              }
            });
          }
        }
      } catch (firmError) {
        console.error(`Error processing data retention for firm ${firm.id}:`, firmError);
        // Continue to the next firm even if this one fails
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
