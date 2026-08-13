import React from 'react'
import { Briefcase, Users, UserCog, Clock, CheckCircle2, XCircle } from 'lucide-react'

interface ManagingPartnerMetricsProps {
  totalCasesCount: number;
  totalAttorneysCount: number;
  totalParalegalsCount: number;
  totalManagingPartnersCount?: number;
  pendingReviewCount: number;
  approvedCasesCount: number;
  rejectedCasesCount: number;
  casesTrend: string;
  isAdmin?: boolean;
  closedCasesCount?: number;
  closedCasesTrend?: string;
  aiProcessedDocsCount?: number;
  avgTurnaroundDays?: number;
}

export function ManagingPartnerMetrics({
  totalCasesCount,
  totalAttorneysCount,
  totalParalegalsCount,
  totalManagingPartnersCount = 0,
  pendingReviewCount,
  approvedCasesCount,
  rejectedCasesCount,
  casesTrend,
  isAdmin = false,
  closedCasesCount = 0,
  closedCasesTrend = '+0 this month',
  aiProcessedDocsCount = 0,
  avgTurnaroundDays = 0,
}: ManagingPartnerMetricsProps) {
  return (
    <div className={`grid max-[767px]:grid-cols-1 grid-cols-2 min-[992px]:grid-cols-3 xl:grid-cols-5 gap-[15px]`}>

      {/* Card 1: Total Cases */}
      <div className="bg-white rounded-2xl border border-slate-200/60 p-4 relative overflow-hidden group transition-all duration-300 hover:border-slate-300">
        <div className="absolute -bottom-8 -right-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
          <Briefcase className="w-28 h-28 text-blue-500 rotate-12" />
        </div>
        <div className="flex justify-between items-center relative z-10">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Cases</span>
          <div className="p-2 bg-blue-50 rounded-lg">
            <Briefcase className="w-5 h-5 text-blue-600" />
          </div>
        </div>
        <div className="mt-1 relative z-10">
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-bold text-slate-800 tracking-tight">{totalCasesCount}</h2>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium flex items-center gap-1.5">
            <span className="flex items-center text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
              {casesTrend.split(' ')[0]}
            </span>
            {casesTrend.split(' ').slice(1).join(' ')}
          </p>
        </div>
      </div>

      {/* Card 2: Pending Review */}
      <div className="bg-white rounded-2xl border border-slate-200/60 p-4 relative overflow-hidden group transition-all duration-300 hover:border-slate-300">
        <div className="absolute -bottom-8 -right-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
          <Clock className="w-28 h-28 text-amber-500 -rotate-12" />
        </div>
        <div className="flex justify-between items-center relative z-10">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Review</span>
          <div className="p-2 bg-amber-50 rounded-lg">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
        </div>
        <div className="mt-1 relative z-10">
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-bold text-slate-800 tracking-tight">{pendingReviewCount}</h2>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium flex items-center gap-1.5">
            <span className="flex items-center text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded font-bold">
              Awaiting
            </span>
            attorney review
          </p>
        </div>
      </div>

      {/* Card 3: Approved Cases */}
      <div className="bg-white rounded-2xl border border-slate-200/60 p-4 relative overflow-hidden group transition-all duration-300 hover:border-slate-300">
        <div className="absolute -bottom-8 -right-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
          <CheckCircle2 className="w-28 h-28 text-emerald-500 rotate-12" />
        </div>
        <div className="flex justify-between items-center relative z-10">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Approved Cases</span>
          <div className="p-2 bg-emerald-50 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
        <div className="mt-1 relative z-10">
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-bold text-slate-800 tracking-tight">{approvedCasesCount}</h2>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium flex items-center gap-1.5">
            <span className="flex items-center text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
              Verified
            </span>
            by attorneys
          </p>
        </div>
      </div>

      {/* Card 4: Rejected Cases */}
      <div className="bg-white rounded-2xl border border-slate-200/60 p-4 relative overflow-hidden group transition-all duration-300 hover:border-slate-300">
        <div className="absolute -bottom-8 -right-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
          <XCircle className="w-28 h-28 text-rose-500 -rotate-12" />
        </div>
        <div className="flex justify-between items-center relative z-10">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rejected Cases</span>
          <div className="p-2 bg-rose-50 rounded-lg">
            <XCircle className="w-5 h-5 text-rose-600" />
          </div>
        </div>
        <div className="mt-1 relative z-10">
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-bold text-slate-800 tracking-tight">{rejectedCasesCount}</h2>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium flex items-center gap-1.5">
            <span className="flex items-center text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded font-bold">
              Rejected
            </span>
            by attorneys
          </p>
        </div>
      </div>

      {/* Card 5: Closed Cases */}
      <div className="bg-white rounded-2xl border border-slate-200/60 p-4 relative overflow-hidden group transition-all duration-300 hover:border-slate-300">
        <div className="absolute -bottom-8 -right-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
          <CheckCircle2 className="w-28 h-28 text-emerald-500 -rotate-12" />
        </div>
        <div className="flex justify-between items-center relative z-10">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Closed Cases</span>
          <div className="p-2 bg-emerald-50 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
        <div className="mt-1 relative z-10">
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-bold text-slate-800 tracking-tight">{closedCasesCount}</h2>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium flex items-center gap-1.5">
            <span className="flex items-center text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
              {closedCasesTrend?.split(' ')[0] || '+0'}
            </span>
            {closedCasesTrend?.split(' ').slice(1).join(' ') || 'this month'}
          </p>
        </div>
      </div>

      {/* Card 9: AI Usage (Admin Only) */}
      {isAdmin && (
        <div className="bg-white rounded-2xl border border-slate-200/60 p-4 relative overflow-hidden group transition-all duration-300 hover:border-slate-300">
          <div className="absolute -bottom-8 -right-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
            <svg className="w-28 h-28 text-fuchsia-500 rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div className="flex justify-between items-center relative z-10">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Usage</span>
            <div className="p-2 bg-fuchsia-50 rounded-lg">
              <svg className="w-5 h-5 text-fuchsia-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
          </div>
          <div className="mt-1 relative z-10">
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl font-bold text-slate-800 tracking-tight">{aiProcessedDocsCount}</h2>
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium flex items-center gap-1.5">
              <span className="flex items-center text-fuchsia-600 bg-fuchsia-50 px-1.5 py-0.5 rounded font-bold">
                Pages
              </span>
              analyzed by AI
            </p>
          </div>
        </div>
      )}

      {/* Card 10: Avg Turnaround Time (Admin Only) */}
      {isAdmin && (
        <div className="bg-white rounded-2xl border border-slate-200/60 p-4 relative overflow-hidden group transition-all duration-300 hover:border-slate-300">
          <div className="absolute -bottom-8 -right-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
            <Clock className="w-28 h-28 text-orange-500 rotate-12" />
          </div>
          <div className="flex justify-between items-center relative z-10">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Turnaround Time</span>
            <div className="p-2 bg-orange-50 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <div className="mt-1 relative z-10">
            <div className="flex items-center gap-1.5">
              <h2 className="text-4xl font-bold text-slate-800 tracking-tight">{avgTurnaroundDays}</h2>
              <span className="text-lg text-slate-500 font-medium">days</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium flex items-center gap-1.5">
              <span className="flex items-center text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded font-bold">
                Average
              </span>
              to close cases
            </p>
          </div>
        </div>
      )}

      {/* Card 6: Total Paralegals */}
      {isAdmin && (
        <div className="bg-white rounded-2xl border border-slate-200/60 p-4 relative overflow-hidden group transition-all duration-300 hover:border-slate-300">
          <div className="absolute -bottom-8 -right-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
            <UserCog className="w-28 h-28 text-teal-500 -rotate-12" />
          </div>
          <div className="flex justify-between items-center relative z-10">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Paralegals</span>
            <div className="p-2 bg-teal-50 rounded-lg">
              <UserCog className="w-5 h-5 text-teal-600" />
            </div>
          </div>
          <div className="mt-1 relative z-10">
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl font-bold text-slate-800 tracking-tight">{totalParalegalsCount}</h2>
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium flex items-center gap-1.5">
              <span className="flex items-center text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded font-bold">
                Active
              </span>
              in firm
            </p>
          </div>
        </div>
      )}

      {/* Card 7: Total Attorneys */}
      {isAdmin && (
        <div className="bg-white rounded-2xl border border-slate-200/60 p-4 relative overflow-hidden group transition-all duration-300 hover:border-slate-300">
          <div className="absolute -bottom-8 -right-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
            <Users className="w-28 h-28 text-indigo-500 -rotate-12" />
          </div>
          <div className="flex justify-between items-center relative z-10">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Attorneys</span>
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <div className="mt-1 relative z-10">
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl font-bold text-slate-800 tracking-tight">{totalAttorneysCount}</h2>
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium flex items-center gap-1.5">
              <span className="flex items-center text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded font-bold">
                Active
              </span>
              in firm
            </p>
          </div>
        </div>
      )}

      {/* Card 8: Total Managing Partners (Admin Only) */}
      {isAdmin && (
        <div className="bg-white rounded-2xl border border-slate-200/60 p-4 relative overflow-hidden group transition-all duration-300 hover:border-slate-300">
          <div className="absolute -bottom-8 -right-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
            <UserCog className="w-28 h-28 text-purple-500 -rotate-12" />
          </div>
          <div className="flex justify-between items-center relative z-10">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Managing Partners</span>
            <div className="p-2 bg-purple-50 rounded-lg">
              <UserCog className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="mt-1 relative z-10">
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl font-bold text-slate-800 tracking-tight">{totalManagingPartnersCount}</h2>
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium flex items-center gap-1.5">
              <span className="flex items-center text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded font-bold">
                Active
              </span>
              in firm
            </p>
          </div>
        </div>
      )}



    </div>
  )
}
