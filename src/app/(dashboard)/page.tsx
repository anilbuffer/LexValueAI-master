import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
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

  // ----- Paralegal Specific KPI Data -----
  const myCasesCount = 14;
  const analyzedDocsCount = 42;
  const missingDocsCount = 3;
  const myCasesTrend = `+5 this month`;
  const analyzedTrend = `+12% vs last month`;
  const approvedTrend = `+8 this month`;

  // ----- Attorney Specific KPI Data -----
  const attorneyAssignedCount = 28;
  const attorneyApprovedCount = 18;
  const attorneyRejectedCount = 2;
  const attorneyPendingCount = 8;
  const attorneyAssignedTrend = `+6 this month`;
  const attorneyApprovedTrend = `+4 this month`;

  // ----- Shared KPI Data (Used by Paralegal) -----
  const returnedCasesCount = 2;
  const approvedCasesCount = 18;
  const pendingCasesCount = 8;

  const mpParalegalsCount = 12;
  const mpAttorneysCount = 8;
  const mpManagingPartnersCount = 3;

  const aiProcessedDocsCount = 156;
  const avgTurnaroundDays = 4;
  const closedCasesCount = 45;
  const closedCasesTrend = `+12 this month`;

  // --- Leaderboard Data for Managing Partner & Admin ---
  const topAttorneys: PerformerData[] = [
    { firstName: "Mike", lastName: "Ross", email: "mike@example.com", count: 12 },
    { firstName: "Louis", lastName: "Litt", email: "louis@example.com", count: 9 },
  ];
  const topParalegals: PerformerData[] = [
    { firstName: "Rachel", lastName: "Zane", email: "rachel@example.com", count: 18 },
    { firstName: "Donna", lastName: "Paulsen", email: "donna@example.com", count: 15 },
  ];
  const topManagingPartners: PerformerData[] = [
    { firstName: "Harvey", lastName: "Specter", email: "harvey@example.com", count: 42 },
    { firstName: "Jessica", lastName: "Pearson", email: "jessica@example.com", count: 38 },
  ];

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
