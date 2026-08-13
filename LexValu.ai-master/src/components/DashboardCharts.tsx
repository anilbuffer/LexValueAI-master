import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardChartsClient } from './DashboardChartsClient'

export async function DashboardCharts() {
  const session = await getSession();
  if (!session) return null;

  let roleOr: any[] = []
  if (session.role === 'ADMIN') {
    // Admin
  } else if (session.role === 'MANAGING_PARTNER') {
    roleOr = [
      { createdByUserId: session.id },
      { createdByUser: { managingPartnerId: session.id } },
      { assignedUsers: { some: { managingPartnerId: session.id } } },
      { assignedUsers: { some: { id: session.id } } }
    ]
  } else if (session.role === 'ATTORNEY') {
    roleOr = [
      { createdByUserId: session.id },
      { createdByUser: { attorneyId: session.id } },
      { assignedUsers: { some: { attorneyId: session.id } } },
      { assignedUsers: { some: { id: session.id } } }
    ]
  } else {
    // Paralegal
    roleOr = [
      { createdByUserId: session.id },
      { assignedUsers: { some: { id: session.id } } }
    ]
  }

  const userCaseFilter: any = { firmId: session.firmId };
  if (roleOr.length > 0) {
    userCaseFilter.OR = roleOr;
  }

  const isAdmin = session.role === 'ADMIN';
  const isManagingPartner = session.role === 'MANAGING_PARTNER' || isAdmin;
  const isAttorney = session.role === 'ATTORNEY' || isManagingPartner;

  const currentYear = new Date().getFullYear();
  const startOfYear = new Date(currentYear, 0, 1);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyData = months.map(m => ({ name: m, metric1: 0, metric2: 0, metric3: 0, metric4: 0 }));

  let donutTotal = 0;
  const typeStats = new Map<string, { approved: number, returned: number, closed: number, totalActioned: number, casesCount: number }>();

  if (isAttorney) {
    // Use AuditLogs for Attorney Performance Trends and Donut Chart
    const attorneyLogs = await prisma.auditLog.findMany({
      where: {
        firmId: session.firmId,
        action: { in: ['CASE_APPROVED', 'CASE_REJECTED', 'CASE_CLOSED'] },
        createdAt: { gte: startOfYear },
        case: userCaseFilter
      },
      include: {
        case: {
          select: { type: true }
        }
      }
    });

    attorneyLogs.forEach(log => {
      const monthIndex = log.createdAt.getMonth();
      const caseType = log.case?.type || 'Unknown';

      if (!typeStats.has(caseType)) {
        typeStats.set(caseType, { approved: 0, returned: 0, closed: 0, totalActioned: 0, casesCount: 0 });
      }
      const stats = typeStats.get(caseType)!;

      if (log.action === 'CASE_APPROVED') {
        monthlyData[monthIndex].metric1 += 1;
        donutTotal += 1;
        stats.approved += 1;
        stats.totalActioned += 1;
      } else if (log.action === 'CASE_REJECTED') {
        monthlyData[monthIndex].metric2 += 1;
        donutTotal += 1;
        stats.returned += 1;
        stats.totalActioned += 1;
      } else if (log.action === 'CASE_CLOSED') {
        monthlyData[monthIndex].metric4 += 1; // Actual Closed cases
        stats.closed += 1;
      }
    });

    if (isManagingPartner) {
      const createdCases = await prisma.case.findMany({
        where: {
          ...userCaseFilter,
          createdAt: { gte: startOfYear }
        },
        select: { createdAt: true, type: true }
      });
      
      donutTotal = createdCases.length;

      createdCases.forEach(c => {
        const monthIndex = c.createdAt.getMonth();
        monthlyData[monthIndex].metric3 += 1;
        
        if (!typeStats.has(c.type)) {
          typeStats.set(c.type, { approved: 0, returned: 0, closed: 0, totalActioned: 0, casesCount: 0 });
        }
        const stats = typeStats.get(c.type)!;
        stats.casesCount += 1;
      });
    }

  } else {
    // Paralegal Processing Activity
    const paralegalLogs = await prisma.auditLog.findMany({
      where: {
        firmId: session.firmId,
        action: { in: ['CASE_APPROVED', 'CASE_REJECTED'] },
        createdAt: { gte: startOfYear },
        case: userCaseFilter
      },
      include: {
        case: {
          select: { type: true }
        }
      }
    });

    paralegalLogs.forEach(log => {
      const monthIndex = log.createdAt.getMonth();
      const caseType = log.case?.type || 'Unknown';

      if (!typeStats.has(caseType)) {
        typeStats.set(caseType, { approved: 0, returned: 0, closed: 0, totalActioned: 0, casesCount: 0 });
      }
      const stats = typeStats.get(caseType)!;

      if (log.action === 'CASE_APPROVED') {
        monthlyData[monthIndex].metric1 += 1;
        stats.approved += 1;
      } else if (log.action === 'CASE_REJECTED') {
        monthlyData[monthIndex].metric2 += 1;
        stats.returned += 1;
      }
    });

    const createdCases = await prisma.case.findMany({
      where: {
        ...userCaseFilter,
        createdAt: { gte: startOfYear }
      },
      select: { createdAt: true, type: true }
    });
    
    donutTotal = createdCases.length;

    createdCases.forEach(c => {
      const monthIndex = c.createdAt.getMonth();
      monthlyData[monthIndex].metric3 += 1;
      
      if (!typeStats.has(c.type)) {
        typeStats.set(c.type, { approved: 0, returned: 0, closed: 0, totalActioned: 0, casesCount: 0 });
      }
      const stats = typeStats.get(c.type)!;
      stats.casesCount += 1;
    });
  }

  // Convert Map to Array
  const donutData = Array.from(typeStats.entries())
    .map(([name, stats]) => {
      const value = isManagingPartner ? stats.casesCount : (isAttorney ? stats.totalActioned : stats.casesCount);
      return { name, value, approved: stats.approved, returned: stats.returned, closed: stats.closed };
    })
    .filter(d => d.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  return (
    <DashboardChartsClient
      lineData={monthlyData}
      donutData={donutData}
      totalMetric={donutTotal}
      isAttorney={isAttorney}
      isManagingPartner={isManagingPartner}
      isAdmin={isAdmin}
    />
  )
}
