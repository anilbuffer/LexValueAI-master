import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const url = new URL(req.url);
    const fromDateStr = url.searchParams.get('fromDate');
    const toDateStr = url.searchParams.get('toDate');

    const dateFilter: any = {};
    let isFiltered = false;

    if (fromDateStr) {
      const d = new Date(fromDateStr);
      if (!isNaN(d.getTime())) { dateFilter.gte = d; isFiltered = true; }
    }
    if (toDateStr) {
      const d = new Date(toDateStr);
      d.setHours(23, 59, 59, 999);
      if (!isNaN(d.getTime())) { dateFilter.lte = d; isFiltered = true; }
    }

    let roleOr: any[] = [];
    if (session.role === 'ADMIN') {
      // Admin sees everything
    } else if (session.role === 'MANAGING_PARTNER') {
      roleOr = [
        { createdByUserId: session.id },
        { createdByUser: { managingPartnerId: session.id } },
        { assignedUsers: { some: { managingPartnerId: session.id } } },
        { assignedUsers: { some: { id: session.id } } }
      ];
    } else if (session.role === 'ATTORNEY') {
      roleOr = [
        { createdByUserId: session.id },
        { createdByUser: { attorneyId: session.id } },
        { assignedUsers: { some: { attorneyId: session.id } } },
        { assignedUsers: { some: { id: session.id } } }
      ];
    } else {
      // Paralegal
      roleOr = [
        { createdByUserId: session.id },
        { assignedUsers: { some: { id: session.id } } }
      ];
    }

    const baseFilter: any = { firmId: session.firmId };
    if (roleOr.length > 0) {
      baseFilter.OR = roleOr;
    }

    const userCaseFilter = {
      ...baseFilter,
      createdAt: Object.keys(dateFilter).length > 0 ? dateFilter : undefined
    };

    // 1. My Cases
    const myCasesCount = await prisma.case.count({ where: userCaseFilter });

    // 2. Analyzed
    const analyzedDocsCount = await prisma.case.count({
      where: { ...userCaseFilter, scanStage: 'COMPLETED' }
    });

    // 3. Missing Documents (Calculate by iterating)
    const documentsWithAnalysis = await prisma.document.findMany({
      where: {
        case: userCaseFilter,
        status: 'READY'
      },
      select: { aiAnalysis: true }
    });

    let missingDocsCount = 0;
    for (const doc of documentsWithAnalysis) {
      if (doc.aiAnalysis && typeof doc.aiAnalysis === 'object') {
        const analysis = doc.aiAnalysis as any;
        if (Array.isArray(analysis.gaps)) {
          missingDocsCount += analysis.gaps.length;
        }
      }
    }

    const auditLogFilter: any = { firmId: session.firmId, case: baseFilter };
    if (Object.keys(dateFilter).length > 0) {
      auditLogFilter.createdAt = dateFilter;
    }

    // 4. Returned Cases
    const returnedCasesCount = await prisma.auditLog.count({
      where: { firmId: session.firmId, case: baseFilter, action: 'CASE_REJECTED', ...(isFiltered ? { createdAt: dateFilter } : {}) }
    });

    // 5. Approved Cases
    const approvedCasesCount = await prisma.auditLog.count({
      where: { firmId: session.firmId, case: baseFilter, action: 'CASE_APPROVED', ...(isFiltered ? { createdAt: dateFilter } : {}) }
    });

    // 6. Pending Approval (Current Status)
    const pendingCasesCount = await prisma.case.count({
      where: { ...userCaseFilter, approvalStatus: 'PENDING', scanStage: 'COMPLETED' }
    });

    // Calculate Trends
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

    const myCasesThisMonth = await prisma.case.count({
      where: { ...baseFilter, createdAt: { gte: thirtyDaysAgo } }
    });

    const analyzedCurrentMonth = await prisma.case.count({
      where: { ...baseFilter, scanStage: 'COMPLETED', updatedAt: { gte: thirtyDaysAgo } }
    });
    const analyzedLastMonth = await prisma.case.count({
      where: { ...baseFilter, scanStage: 'COMPLETED', updatedAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } }
    });

    let analyzedPercent = 0;
    if (analyzedLastMonth === 0) {
      analyzedPercent = analyzedCurrentMonth > 0 ? 100 : 0;
    } else {
      analyzedPercent = Math.round(((analyzedCurrentMonth - analyzedLastMonth) / analyzedLastMonth) * 100);
    }

    const approvedThisMonth = await prisma.auditLog.count({
      where: { firmId: session.firmId, case: baseFilter, action: 'CASE_APPROVED', createdAt: { gte: thirtyDaysAgo } }
    });

    // 7. Total Flags
    const casesWithFlags = await prisma.case.findMany({
      where: userCaseFilter,
      select: { flags: true }
    });
    const totalFlagsCount = casesWithFlags.reduce((sum, c) => sum + (c.flags || 0), 0);

    const closedCasesCount = await prisma.case.count({
      where: { ...userCaseFilter, status: 'Closed' }
    });
    const closedCasesThisMonth = await prisma.case.count({
      where: { ...userCaseFilter, status: 'Closed', updatedAt: { gte: thirtyDaysAgo } }
    });

    const aiProcessedDocsCount = await prisma.document.count({
      where: { case: userCaseFilter, status: 'READY' }
    });

    const turnaroundCasesQuery = await prisma.case.findMany({
      where: { ...userCaseFilter, approvalStatus: { in: ['APPROVED', 'REJECTED'] } },
      select: { createdAt: true, updatedAt: true }
    });
    let totalDays = 0;
    turnaroundCasesQuery.forEach((c: any) => {
      const diffTime = Math.abs(c.updatedAt.getTime() - c.createdAt.getTime());
      totalDays += Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    });
    const avgTurnaroundDays = turnaroundCasesQuery.length > 0 ? Math.round(totalDays / turnaroundCasesQuery.length) : 0;

    const totalParalegalsCount = await prisma.user.count({ where: { firmId: session.firmId, role: 'PARALEGAL' } });
    const totalAttorneysCount = await prisma.user.count({ where: { firmId: session.firmId, role: 'ATTORNEY' } });
    const totalManagingPartnersCount = await prisma.user.count({ where: { firmId: session.firmId, role: 'MANAGING_PARTNER' } });

    // 8. Top Case Category (For Paralegal - Current Status)
    const categoryCounts = await prisma.case.groupBy({
      by: ['type'],
      where: userCaseFilter,
      _count: { type: true },
      orderBy: { _count: { type: 'desc' } },
      take: 1
    });

    let topCategory = "N/A";
    let topCategoryCount = 0;
    if (categoryCounts.length > 0) {
      topCategory = categoryCounts[0].type;
      topCategoryCount = categoryCounts[0]._count.type;
    }

    // Top Approved Category (For Attorney - Historical via AuditLog)
    const approvedLogs = await prisma.auditLog.findMany({
      where: { ...auditLogFilter, action: 'CASE_APPROVED', caseId: { not: null } },
      include: { case: { select: { type: true } } }
    });
    const approvedTypeMap: Record<string, number> = {};
    approvedLogs.forEach((log: any) => {
      const t = log.case?.type;
      if (t) approvedTypeMap[t] = (approvedTypeMap[t] || 0) + 1;
    });
    const sortedApprovedTypes = Object.entries(approvedTypeMap).sort((a, b) => b[1] - a[1]);

    let topApproved = "N/A";
    let topApprovedCount = 0;
    if (sortedApprovedTypes.length > 0) {
      topApproved = sortedApprovedTypes[0][0];
      topApprovedCount = sortedApprovedTypes[0][1];
    }

    // Top Rejected Category (For Attorney - Historical via AuditLog)
    const rejectedLogs = await prisma.auditLog.findMany({
      where: { ...auditLogFilter, action: 'CASE_REJECTED', caseId: { not: null } },
      include: { case: { select: { type: true } } }
    });
    const rejectedTypeMap: Record<string, number> = {};
    rejectedLogs.forEach((log: any) => {
      const t = log.case?.type;
      if (t) rejectedTypeMap[t] = (rejectedTypeMap[t] || 0) + 1;
    });
    const sortedRejectedTypes = Object.entries(rejectedTypeMap).sort((a, b) => b[1] - a[1]);

    let topRejected = "N/A";
    let topRejectedCount = 0;
    if (sortedRejectedTypes.length > 0) {
      topRejected = sortedRejectedTypes[0][0];
      topRejectedCount = sortedRejectedTypes[0][1];
    }

    // Top Closed Category
    const closedLogs = await prisma.auditLog.findMany({
      where: { ...auditLogFilter, action: 'CASE_CLOSED', caseId: { not: null } },
      include: { case: { select: { type: true } } }
    });
    const closedTypeMap: Record<string, number> = {};
    closedLogs.forEach((log: any) => {
      const t = log.case?.type;
      if (t) closedTypeMap[t] = (closedTypeMap[t] || 0) + 1;
    });
    const sortedClosedTypes = Object.entries(closedTypeMap).sort((a, b) => b[1] - a[1]);

    let topClosed = "N/A";
    let topClosedCount = 0;
    if (sortedClosedTypes.length > 0) {
      topClosed = sortedClosedTypes[0][0];
      topClosedCount = sortedClosedTypes[0][1];
    }

    // Top Performers for Managing Partner
    let topAttorneyStr = "N/A";
    let topAttorneyCount = 0;

    let topParalegalStr = "N/A";
    let topParalegalCount = 0;

    let topManagingPartnerStr = "N/A";
    let topManagingPartnerCount = 0;

    if (session.role === 'MANAGING_PARTNER' || session.role === 'ADMIN') {
      const attorneyLogs = await prisma.auditLog.groupBy({
        by: ['userId'],
        where: {
          ...auditLogFilter,
          action: 'CASE_APPROVED',
        },
        _count: { userId: true },
        orderBy: { _count: { userId: 'desc' } }
      });

      if (attorneyLogs.length > 0 && attorneyLogs[0].userId) {
        topAttorneyCount = attorneyLogs[0]._count.userId;
        const topTied = attorneyLogs.filter((log: any) => log._count.userId === topAttorneyCount);
        const names = [];
        for (const t of topTied) {
          if (!t.userId) continue;
          const u = await prisma.user.findUnique({ where: { id: t.userId }, select: { firstName: true, lastName: true } });
          if (u) names.push(`${u.firstName} ${u.lastName}`);
        }
        if (names.length > 0) topAttorneyStr = names.join(', ');
      }

      const paralegalCasesFilter = {
        ...userCaseFilter,
        createdByUserId: { not: null }
      };

      const paralegalCases = await prisma.case.groupBy({
        by: ['createdByUserId'],
        where: paralegalCasesFilter,
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } }
      });

      const paralegalCounts: { userId: string, count: number }[] = [];
      for (const pc of paralegalCases) {
        if (!pc.createdByUserId) continue;
        const u = await prisma.user.findUnique({ where: { id: pc.createdByUserId }, select: { role: true } });
        if (u && u.role === 'PARALEGAL') {
          paralegalCounts.push({ userId: pc.createdByUserId, count: pc._count.id });
        }
      }

      if (paralegalCounts.length > 0) {
        topParalegalCount = paralegalCounts[0].count;
        const topTied = paralegalCounts.filter((p: any) => p.count === topParalegalCount);
        const names = [];
        for (const t of topTied) {
          const u = await prisma.user.findUnique({ where: { id: t.userId }, select: { firstName: true, lastName: true } });
          if (u) names.push(`${u.firstName} ${u.lastName}`);
        }
        if (names.length > 0) topParalegalStr = names.join(', ');
      }

      // Top Managing Partner (Admin only)
      if (session.role === 'ADMIN') {
        const teamCases = await prisma.case.findMany({
          where: userCaseFilter,
          select: { createdByUserId: true, createdAt: true }
        });

        const mps = await prisma.user.findMany({
          where: { firmId: session.firmId, role: 'MANAGING_PARTNER' },
          select: { id: true, firstName: true, lastName: true }
        });

        const mpPerformance: { mp: any, count: number }[] = [];
        for (const mp of mps) {
          const subordinates = await prisma.user.findMany({
            where: {
              OR: [
                { managingPartnerId: mp.id },
                { attorney: { managingPartnerId: mp.id } }
              ]
            },
            select: { id: true }
          });
          const subordinateIds = new Set(subordinates.map((s: any) => s.id));
          subordinateIds.add(mp.id);

          const count = teamCases.filter((c: any) => c.createdByUserId && subordinateIds.has(c.createdByUserId)).length;
          if (count > 0) {
            mpPerformance.push({ mp, count });
          }
        }
        
        if (mpPerformance.length > 0) {
          mpPerformance.sort((a, b) => b.count - a.count);
          topManagingPartnerCount = mpPerformance[0].count;
          const topTied = mpPerformance.filter((p: any) => p.count === topManagingPartnerCount);
          topManagingPartnerStr = topTied.map((p: any) => `${p.mp.firstName} ${p.mp.lastName}`).join(', ');
        }
      }
    }

    // Calculate Latest Dates
    const getLastUpdate = async (filter: any, dateField: string = 'updatedAt') => {
      const result = await prisma.case.findFirst({
        where: filter,
        orderBy: { [dateField]: 'desc' },
        select: { [dateField]: true }
      });
      return result ? (result as any)[dateField].toISOString() : null;
    };

    const dateMyCases = await getLastUpdate(userCaseFilter, 'createdAt');
    const dateAnalyzed = await getLastUpdate({ ...userCaseFilter, scanStage: 'COMPLETED' });
    const dateReturned = await getLastUpdate({ ...userCaseFilter, approvalStatus: 'REJECTED' });
    const dateApproved = await getLastUpdate({ ...userCaseFilter, approvalStatus: 'APPROVED' });
    const datePending = await getLastUpdate({ ...userCaseFilter, approvalStatus: 'PENDING', scanStage: 'COMPLETED' });

    // For Missing Docs & Flags, we'll approximate using the latest updated case that has flags or docs
    const dateFlags = await getLastUpdate({ ...userCaseFilter, flags: { gt: 0 } });

    let dateTopCategory = null;
    if (topCategory !== "N/A") {
      dateTopCategory = await getLastUpdate({ ...userCaseFilter, type: topCategory });
    }

    let dateTopApproved = null;
    if (topApproved !== "N/A") {
      dateTopApproved = await getLastUpdate({ ...userCaseFilter, type: topApproved, approvalStatus: 'APPROVED' });
    }

    let dateTopRejected = null;
    if (topRejected !== "N/A") {
      dateTopRejected = await getLastUpdate({ ...userCaseFilter, type: topRejected, approvalStatus: 'REJECTED' });
    }

    let dateTopClosed = null;
    if (topClosed !== "N/A") {
      dateTopClosed = await getLastUpdate({ ...userCaseFilter, type: topClosed, status: 'Closed' });
    }

    let metricsData = [
      {
        id: 'my_cases',
        metric: session.role === 'ATTORNEY' ? 'Assigned Cases' : (session.role === 'MANAGING_PARTNER' ? 'Team Cases' : (session.role === 'ADMIN' ? 'Firm Cases' : 'My Cases')),
        count: myCasesCount,
        statusText: isFiltered ? 'in selected period' : `+${myCasesThisMonth} this month`,
        statusType: 'positive',
        lastUpdated: dateMyCases
      },
      {
        id: 'analyzed',
        metric: 'Analyzed',
        count: analyzedDocsCount,
        statusText: isFiltered ? 'in selected period' : `${analyzedPercent >= 0 ? '+' : ''}${analyzedPercent}% vs last month`,
        statusType: 'positive',
        lastUpdated: dateAnalyzed
      },
      {
        id: 'missing_docs',
        metric: 'Missing Documents',
        count: missingDocsCount,
        statusText: missingDocsCount > 0 ? 'Action required for processing' : 'No action required',
        statusType: missingDocsCount > 0 ? 'negative' : 'neutral',
        lastUpdated: dateFlags // approximation
      },
      {
        id: 'returned',
        metric: session.role === 'ATTORNEY' ? 'Returned Cases' : (session.role === 'MANAGING_PARTNER' ? 'Rejected Cases' : 'Returned by Attorney'),
        count: returnedCasesCount,
        statusText: returnedCasesCount > 0
          ? (session.role === 'ATTORNEY' ? 'Returned for rework' : (session.role === 'MANAGING_PARTNER' ? 'Rework requested' : (isFiltered ? 'Needs review' : 'Needs review this month')))
          : (isFiltered ? 'No returns in selected period' : (session.role === 'MANAGING_PARTNER' ? 'No rejections this month' : 'No returns this month')),
        statusType: returnedCasesCount > 0 ? 'warning' : 'neutral',
        lastUpdated: dateReturned
      },
      {
        id: 'approved',
        metric: 'Approved Cases',
        count: approvedCasesCount,
        statusText: isFiltered ? 'in selected period' : `+${approvedThisMonth} this month`,
        statusType: 'positive',
        lastUpdated: dateApproved
      },

      {
        id: 'pending',
        metric: session.role === 'ATTORNEY' ? 'Needs Review' : 'Pending Approval',
        count: pendingCasesCount,
        statusText: pendingCasesCount > 0 ? (session.role === 'ATTORNEY' ? 'Awaiting your review' : 'Awaiting attorney review') : 'All caught up',
        statusType: pendingCasesCount > 0 ? 'neutral' : 'neutral',
        lastUpdated: datePending
      },
      {
        id: 'closed_cases',
        metric: 'Closed Cases',
        count: closedCasesCount,
        statusText: `+${closedCasesThisMonth} this month`,
        statusType: 'positive',
        lastUpdated: dateTopClosed
      },
      {
        id: 'total_flags',
        metric: 'Total Flags',
        count: totalFlagsCount,
        statusText: totalFlagsCount > 0 ? 'Review flagged items' : 'No flags active',
        statusType: totalFlagsCount > 0 ? 'warning' : 'neutral',
        lastUpdated: dateFlags
      },
      {
        id: 'top_category',
        metric: 'Top Case Category',
        count: topCategoryCount,
        statusText: topCategory !== "N/A" ? `${topCategory}` : 'No cases yet',
        statusType: 'neutral',
        lastUpdated: dateTopCategory
      },
      {
        id: 'top_approved_category',
        metric: 'Top Approved Case Category',
        count: topApprovedCount,
        statusText: topApproved !== "N/A" ? `${topApproved}` : 'No approved cases yet',
        statusType: 'positive',
        lastUpdated: dateTopApproved
      },
      {
        id: 'top_rejected_category',
        metric: 'Top Rejected Case Category',
        count: topRejectedCount,
        statusText: topRejected !== "N/A" ? `${topRejected}` : 'No rejected cases yet',
        statusType: 'negative',
        lastUpdated: dateTopRejected
      },
      {
        id: 'top_closed_category',
        metric: 'Top Closed Case Category',
        count: topClosedCount,
        statusText: topClosed !== "N/A" ? `${topClosed}` : 'No closed cases yet',
        statusType: 'positive',
        lastUpdated: dateTopClosed
      },
      {
        id: 'ai_usage',
        metric: 'AI Usage (Pages)',
        count: aiProcessedDocsCount,
        statusText: 'Pages analyzed by AI',
        statusType: 'positive',
        lastUpdated: dateAnalyzed
      },
      {
        id: 'turnaround_time',
        metric: 'Turnaround Time',
        count: avgTurnaroundDays,
        statusText: 'Average to close cases (days)',
        statusType: 'warning',
        lastUpdated: dateApproved
      },
      {
        id: 'top_attorney',
        metric: 'Top Attorney',
        count: topAttorneyCount,
        statusText: topAttorneyStr !== "N/A" ? `${topAttorneyStr}` : 'No data yet',
        statusType: 'positive',
        lastUpdated: dateApproved
      },
      {
        id: 'top_paralegal',
        metric: 'Top Paralegal',
        count: topParalegalCount,
        statusText: topParalegalStr !== "N/A" ? `${topParalegalStr}` : 'No data yet',
        statusType: 'positive',
        lastUpdated: dateMyCases
      },
      {
        id: 'top_managing_partner',
        metric: 'Top Managing Partner',
        count: topManagingPartnerCount,
        statusText: topManagingPartnerStr !== "N/A" ? `${topManagingPartnerStr}` : 'No data yet',
        statusType: 'positive',
        lastUpdated: dateMyCases // approximation
      }
    ];


    if (session.role === 'ATTORNEY') {
      const allowedAttorneyMetrics = ['my_cases', 'pending', 'approved', 'returned', 'top_approved_category', 'top_rejected_category'];
      metricsData = metricsData.filter((m: any) => allowedAttorneyMetrics.includes(m.id));
    } else if (session.role === 'ADMIN') {
      const allowedAdminMetrics = [
        'my_cases', 'pending', 'closed_cases', 'approved', 'returned', 
        'ai_usage', 'turnaround_time',
        'top_category', 'top_approved_category', 'top_rejected_category', 'top_closed_category',
        'top_managing_partner', 'top_attorney', 'top_paralegal'
      ];
      metricsData = metricsData.filter((m: any) => allowedAdminMetrics.includes(m.id));
    } else if (session.role === 'MANAGING_PARTNER') {
      const allowedManagingPartnerMetrics = ['my_cases', 'pending', 'closed_cases', 'approved', 'returned', 'top_attorney', 'top_paralegal', 'top_category', 'top_approved_category', 'top_rejected_category', 'top_closed_category'];
      metricsData = metricsData.filter((m: any) => allowedManagingPartnerMetrics.includes(m.id));
    } else {
      // Paralegal role
      const allowedParalegalMetrics = ['my_cases', 'analyzed', 'missing_docs', 'returned', 'approved', 'pending', 'top_category', 'top_approved_category', 'top_rejected_category'];
      metricsData = metricsData.filter((m: any) => allowedParalegalMetrics.includes(m.id));
    }

    return NextResponse.json({ success: true, data: metricsData });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
