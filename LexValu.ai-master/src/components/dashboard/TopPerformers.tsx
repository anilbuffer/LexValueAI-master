import React from 'react'
import { Trophy, Star, TrendingUp, Medal, Award } from 'lucide-react'

export interface PerformerData {
  firstName: string;
  lastName: string;
  email: string | null;
  count: number;
}

interface TopPerformersProps {
  topAttorneys?: PerformerData[];
  topParalegals?: PerformerData[];
  topManagingPartners?: PerformerData[];
}

export function TopPerformers({ topAttorneys = [], topParalegals = [], topManagingPartners = [] }: TopPerformersProps) {
  return (
    <div className="grid-item-priority bg-white rounded-2xl border border-slate-200/50 shadow-md shadow-slate-200/50 p-6 flex flex-col h-full max-h-[480px]">
      
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-50 text-teal-600 rounded-lg border border-teal-100/50">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Top Performers</h3>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
          This Month
        </span>
      </div>

      <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1">
        
        {/* Top Managing Partners */}
        {topManagingPartners.length > 0 && (
          topManagingPartners.map((mp, idx) => (
            <div key={`mp-${idx}`} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 shrink-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-lg shrink-0">
                  {mp.firstName[0]}{mp.lastName[0]}
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-rose-500 capitalize mb-1 flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    Top Managing Partner
                  </div>
                  <h4 className="text-base font-bold text-slate-800">
                    {mp.firstName} {mp.lastName}
                  </h4>
                </div>
                </div>
                <div className="flex flex-col items-start sm:items-end justify-center sm:px-2 pt-3 sm:pt-0 border-t border-slate-100 sm:border-0 w-full sm:w-auto">
                  <span className="text-4xl font-bold text-slate-800 tracking-tight leading-none">
                    {mp.count}
                  </span>
                  <span className="text-xs text-slate-500 mt-1 font-medium">Cases in team</span>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Top Attorneys */}
        {topAttorneys.length > 0 ? (
          topAttorneys.map((attorney, idx) => (
            <div key={`attorney-${idx}`} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 shrink-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg shrink-0">
                  {attorney.firstName[0]}{attorney.lastName[0]}
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-blue-500 capitalize mb-1 flex items-center gap-1">
                    <Medal className="w-3 h-3" />
                    Top Attorney
                  </div>
                  <h4 className="text-base font-bold text-slate-800">
                    {attorney.firstName} {attorney.lastName}
                  </h4>
                </div>
                </div>
                <div className="flex flex-col items-start sm:items-end justify-center sm:px-2 pt-3 sm:pt-0 border-t border-slate-100 sm:border-0 w-full sm:w-auto">
                  <span className="text-4xl font-bold text-slate-800 tracking-tight leading-none">
                    {attorney.count}
                  </span>
                  <span className="text-xs text-slate-500 mt-1 font-medium">Cases approved</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 shrink-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg shrink-0">
                N/A
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-blue-500 capitalize mb-1 flex items-center gap-1">
                  <Medal className="w-3 h-3" />
                  Top Attorney
                </div>
                <h4 className="text-base font-bold text-slate-800">
                  No data yet
                </h4>
              </div>
                </div>
                <div className="flex flex-col items-start sm:items-end justify-center sm:px-2 pt-3 sm:pt-0 border-t border-slate-100 sm:border-0 w-full sm:w-auto">
                <span className="text-4xl font-bold text-slate-800 tracking-tight leading-none">
                  0
                </span>
                <span className="text-xs text-slate-500 mt-1 font-medium">Cases approved</span>
              </div>
              </div>
          </div>
        )}

        {/* Top Paralegals */}
        {topParalegals.length > 0 ? (
          topParalegals.map((paralegal, idx) => (
            <div key={`paralegal-${idx}`} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 shrink-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold text-lg shrink-0">
                  {paralegal.firstName[0]}{paralegal.lastName[0]}
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-teal-500 capitalize mb-1 flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Top Paralegal
                  </div>
                  <h4 className="text-base font-bold text-slate-800">
                    {paralegal.firstName} {paralegal.lastName}
                  </h4>
                </div>
                </div>
                <div className="flex flex-col items-start sm:items-end justify-center sm:px-2 pt-3 sm:pt-0 border-t border-slate-100 sm:border-0 w-full sm:w-auto">
                  <span className="text-4xl font-bold text-slate-800 tracking-tight leading-none">
                    {paralegal.count}
                  </span>
                  <span className="text-xs text-slate-500 mt-1 font-medium">Cases uploaded</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 shrink-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold text-lg shrink-0">
                N/A
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-teal-500 capitalize mb-1 flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Top Paralegal
                </div>
                <h4 className="text-base font-bold text-slate-800">
                  No data yet
                </h4>
              </div>
                </div>
                <div className="flex flex-col items-start sm:items-end justify-center sm:px-2 pt-3 sm:pt-0 border-t border-slate-100 sm:border-0 w-full sm:w-auto">
                <span className="text-4xl font-bold text-slate-800 tracking-tight leading-none">
                  0
                </span>
                <span className="text-xs text-slate-500 mt-1 font-medium">Cases uploaded</span>
              </div>
              </div>
          </div>
        )}

      </div>
    </div>
  )
}
