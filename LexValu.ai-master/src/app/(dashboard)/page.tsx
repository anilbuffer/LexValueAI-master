import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { DashboardCharts } from "@/components/DashboardCharts"
import { AdvancedMetrics } from "@/components/dashboard/AdvancedMetrics"
import { AttorneyMetrics } from "@/components/dashboard/AttorneyMetrics"
import { PriorityTasks } from "@/components/dashboard/PriorityTasks"
import { AIProcessingQueue } from "@/components/dashboard/AIProcessingQueue"
import { ManagingPartnerMetrics } from "@/components/dashboard/ManagingPartnerMetrics"
import { TopPerformers, PerformerData } from "@/components/dashboard/TopPerformers"

export const dynamic = 'force-dynamic'

export default async function DashboardOverview() {
  const session = await getSession()
  if (!session) redirect('/login')

  // Shared Filters
  let roleOr: any[] = []
  if (session.role === 'ADMIN') {
    // Admin sees everything in the firm (will just use firmId below)
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
    // Paralegal or others
    roleOr = [
      { createdByUserId: session.id },
      { assignedUsers: { some: { id: session.id } } }
    ]
  }

  const userCaseFilter: any = { firmId: session.firmId };
  if (roleOr.length > 0) {
    userCaseFilter.OR = roleOr;
  }

  // ----- Paralegal Specific KPI Data -----
  const myCasesCount = await prisma.case.count({ where: userCaseFilter });
  const analyzedDocsCount = await prisma.case.count({ where: { ...userCaseFilter, scanStage: 'COMPLETED' } });

  const documentsWithAnalysis = await prisma.document.findMany({
    where: { case: userCaseFilter, status: 'READY' },
    select: { aiAnalysis: true }
  });
  let missingDocsCount = 0;
  for (const doc of documentsWithAnalysis) {
    if (doc.aiAnalysis && typeof doc.aiAnalysis === 'object') {
      const analysis = doc.aiAnalysis as any;
      if (Array.isArray(analysis.gaps)) missingDocsCount += analysis.gaps.length;
    }
  }

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

  const myCasesThisMonth = await prisma.case.count({ where: { ...userCaseFilter, createdAt: { gte: thirtyDaysAgo } } });
  const myCasesTrend = `+${myCasesThisMonth} this month`;

  const analyzedCurrentMonth = await prisma.case.count({ where: { ...userCaseFilter, scanStage: 'COMPLETED', updatedAt: { gte: thirtyDaysAgo } } });
  const analyzedLastMonth = await prisma.case.count({ where: { ...userCaseFilter, scanStage: 'COMPLETED', updatedAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } });
  let analyzedPercent = 0;
  if (analyzedLastMonth === 0) {
    analyzedPercent = analyzedCurrentMonth > 0 ? 100 : 0;
  } else {
    analyzedPercent = Math.round(((analyzedCurrentMonth - analyzedLastMonth) / analyzedLastMonth) * 100);
  }
  const analyzedTrend = `${analyzedPercent >= 0 ? '+' : ''}${analyzedPercent}% vs last month`;

  const approvedThisMonth = await prisma.case.count({ where: { ...userCaseFilter, approvalStatus: 'APPROVED', updatedAt: { gte: thirtyDaysAgo } } });
  const approvedTrend = `+${approvedThisMonth} this month`;

  // ----- Attorney Specific KPI Data -----
  const attorneyAssignedCount = await prisma.case.count({ where: userCaseFilter })
  const attorneyApprovedCount = await prisma.case.count({ where: { ...userCaseFilter, approvalStatus: 'APPROVED' } })
  const attorneyRejectedCount = await prisma.case.count({ where: { ...userCaseFilter, approvalStatus: 'REJECTED' } })
  const attorneyPendingCount = await prisma.case.count({ where: { ...userCaseFilter, approvalStatus: 'PENDING', scanStage: 'COMPLETED' } })

  // Attorney Trends
  const attorneyAssignedThisMonth = await prisma.case.count({ where: { ...userCaseFilter, createdAt: { gte: thirtyDaysAgo } } });
  const attorneyAssignedTrend = `+${attorneyAssignedThisMonth} this month`;

  const attorneyApprovedThisMonth = await prisma.case.count({ where: { ...userCaseFilter, approvalStatus: 'APPROVED', updatedAt: { gte: thirtyDaysAgo } } });
  const attorneyApprovedTrend = `+${attorneyApprovedThisMonth} this month`;

  // ----- Shared KPI Data (Used by Paralegal) -----
  const returnedCasesCount = await prisma.case.count({ where: { ...userCaseFilter, approvalStatus: 'REJECTED' } });
  const approvedCasesCount = await prisma.case.count({ where: { ...userCaseFilter, approvalStatus: 'APPROVED' } });
  const pendingCasesCount = await prisma.case.count({ where: { ...userCaseFilter, approvalStatus: 'PENDING', scanStage: 'COMPLETED' } });

  let mpParalegalsCount = 0;
  let mpAttorneysCount = 0;
  let mpManagingPartnersCount = 0;

  if (session.role === 'ADMIN') {
    mpParalegalsCount = await prisma.user.count({ where: { firmId: session.firmId, role: 'PARALEGAL' } });
    mpAttorneysCount = await prisma.user.count({ where: { firmId: session.firmId, role: 'ATTORNEY' } });
    mpManagingPartnersCount = await prisma.user.count({ where: { firmId: session.firmId, role: 'MANAGING_PARTNER' } });
  } else if (session.role === 'MANAGING_PARTNER') {
    mpAttorneysCount = await prisma.user.count({ where: { firmId: session.firmId, role: 'ATTORNEY', managingPartnerId: session.id } });
    mpParalegalsCount = await prisma.user.count({ where: { firmId: session.firmId, role: 'PARALEGAL', attorney: { managingPartnerId: session.id } } });
    mpManagingPartnersCount = 1; // Showing 1 as they are the MP for their team
  }

  const aiProcessedDocsCount = await prisma.document.count({
    where: { case: userCaseFilter, status: 'READY' }
  });

  const closedCasesQuery = await prisma.case.findMany({
    where: { ...userCaseFilter, approvalStatus: { in: ['APPROVED', 'REJECTED'] } },
    select: { createdAt: true, updatedAt: true }
  });
  let totalDays = 0;
  closedCasesQuery.forEach(c => {
    const diffTime = Math.abs(c.updatedAt.getTime() - c.createdAt.getTime());
    totalDays += Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  });
  const avgTurnaroundDays = closedCasesQuery.length > 0 ? Math.round(totalDays / closedCasesQuery.length) : 0;

  let closedCasesCount = 0;
  let closedCasesThisMonth = 0;
  if (session.role === 'ADMIN' || session.role === 'MANAGING_PARTNER') {
    closedCasesCount = await prisma.case.count({
      where: { ...userCaseFilter, status: 'Closed' }
    });
    closedCasesThisMonth = await prisma.case.count({
      where: { ...userCaseFilter, status: 'Closed', updatedAt: { gte: thirtyDaysAgo } }
    });
  }
  const closedCasesTrend = `+${closedCasesThisMonth} this month`;

  // --- Leaderboard Data for Managing Partner & Admin ---
  let topAttorneys: PerformerData[] = [];
  let topParalegals: PerformerData[] = [];
  let topManagingPartners: PerformerData[] = [];

  if (session.role === 'MANAGING_PARTNER' || session.role === 'ADMIN') {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const attorneyLogs = await prisma.auditLog.groupBy({
      by: ['userId'],
      where: {
        firmId: session.firmId,
        action: 'CASE_APPROVED',
        createdAt: { gte: startOfMonth }
      },
      _count: { userId: true },
      orderBy: { _count: { userId: 'desc' } },
      take: 10
    });

    if (attorneyLogs.length > 0) {
      const topCount = attorneyLogs[0]._count.userId;
      const topTied = attorneyLogs.filter(log => log._count.userId === topCount);
      for (const t of topTied) {
        const attorneyData = await prisma.user.findUnique({ where: { id: t.userId }, select: { firstName: true, lastName: true, email: true } });
        if (attorneyData) {
          topAttorneys.push({ ...attorneyData, count: topCount });
        }
      }
    }

    const paralegalCases = await prisma.case.groupBy({
      by: ['createdByUserId'],
      where: {
        firmId: session.firmId,
        createdAt: { gte: startOfMonth },
        createdByUserId: { not: null }
      },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });

    let paralegalCounts: { userId: string, count: number }[] = [];
    for (const pc of paralegalCases) {
      if (!pc.createdByUserId) continue;
      const u = await prisma.user.findUnique({ where: { id: pc.createdByUserId }, select: { id: true, role: true } });
      if (u && u.role === 'PARALEGAL') {
        paralegalCounts.push({ userId: u.id, count: pc._count.id });
      }
    }

    if (paralegalCounts.length > 0) {
      const topCount = paralegalCounts[0].count;
      const topTied = paralegalCounts.filter(p => p.count === topCount);
      for (const t of topTied) {
        const u = await prisma.user.findUnique({ where: { id: t.userId }, select: { firstName: true, lastName: true, email: true } });
        if (u) {
          topParalegals.push({ ...u, count: topCount });
        }
      }
    }

    if (session.role === 'ADMIN') {
      const mps = await prisma.user.findMany({
        where: { firmId: session.firmId, role: 'MANAGING_PARTNER', isActive: true },
        select: { id: true, firstName: true, lastName: true, email: true }
      });
      let mpPerformance: { mp: any, count: number }[] = [];
      for (const mp of mps) {
        // Count cases handled by MP's team this month
        const count = await prisma.case.count({
          where: {
            firmId: session.firmId,
            createdAt: { gte: startOfMonth },
            OR: [
              { createdByUserId: mp.id },
              { createdByUser: { managingPartnerId: mp.id } },
              { assignedUsers: { some: { managingPartnerId: mp.id } } }
            ]
          }
        });
        mpPerformance.push({ mp, count });
      }

      if (mpPerformance.length > 0) {
        mpPerformance.sort((a, b) => b.count - a.count);
        const topCount = mpPerformance[0].count;
        if (topCount > 0) {
          const topTied = mpPerformance.filter(p => p.count === topCount);
          for (const t of topTied) {
            topManagingPartners.push({ ...t.mp, count: t.count });
          }
        }
      }
    }
  }

  return (
    <div className="w-full p-2.5 pb-[15px] font-sans relative flex flex-col gap-[15px]">

      {/* Top Section Wrapper */}
      <div className="bg-white rounded-2xl shadow-md shadow-slate-200/50 border border-slate-200/50 p-5 flex flex-col gap-[20px]">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
              {session.role === 'ADMIN' ? 'System Overview' : (session.role === 'MANAGING_PARTNER' ? 'Team Overview' : 'My Workspace')}
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              {session.role === 'ADMIN' ? 'A snapshot of system-wide activity and metrics.' : (session.role === 'MANAGING_PARTNER' ? 'A snapshot of all-time activity across all team cases.' : 'A snapshot of your recent case activity and tasks.')}
            </p>
          </div>
          <Link href="/reports" className="flex items-center gap-1.5 h-12 px-5 border border-teal-100 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-medium text-sm transition-all group cursor-pointer">
            View full report
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Dynamic Metrics Cards Based on Role */}
        {session.role === 'ATTORNEY' ? (
          <AttorneyMetrics
            assignedCount={attorneyAssignedCount}
            approvedCount={attorneyApprovedCount}
            rejectedCount={attorneyRejectedCount}
            pendingCount={attorneyPendingCount}
            assignedTrend={attorneyAssignedTrend}
            approvedTrend={attorneyApprovedTrend}
          />
        ) : (session.role === 'MANAGING_PARTNER' || session.role === 'ADMIN') ? (
          <ManagingPartnerMetrics
            totalCasesCount={myCasesCount}
            totalAttorneysCount={mpAttorneysCount}
            totalParalegalsCount={mpParalegalsCount}
            totalManagingPartnersCount={mpManagingPartnersCount}
            pendingReviewCount={pendingCasesCount}
            approvedCasesCount={approvedCasesCount}
            rejectedCasesCount={returnedCasesCount}
            casesTrend={myCasesTrend}
            isAdmin={session.role === 'ADMIN'}
            closedCasesCount={closedCasesCount}
            closedCasesTrend={closedCasesTrend}
            aiProcessedDocsCount={aiProcessedDocsCount}
            avgTurnaroundDays={avgTurnaroundDays}
          />
        ) : (
          <AdvancedMetrics
            myCasesCount={myCasesCount}
            analyzedDocsCount={analyzedDocsCount}
            missingDocsCount={missingDocsCount}
            returnedCasesCount={returnedCasesCount}
            approvedCasesCount={approvedCasesCount}
            pendingCasesCount={pendingCasesCount}
            myCasesTrend={myCasesTrend}
            analyzedTrend={analyzedTrend}
            approvedTrend={approvedTrend}
          />
        )}
      </div>

      {/* Master Dashboard Layout */}
      <div className="master-dashboard-grid">
        {/* Priority Tasks or Leaderboard */}
        {(session.role === 'MANAGING_PARTNER' || session.role === 'ADMIN') ? (
          <TopPerformers topAttorneys={topAttorneys} topParalegals={topParalegals} topManagingPartners={topManagingPartners} />
        ) : (
          <PriorityTasks />
        )}

        {/* Real-time AI Processing Queue */}
        <AIProcessingQueue />

        {/* Charts */}
        <DashboardCharts />
      </div>

    </div>
  )
}
