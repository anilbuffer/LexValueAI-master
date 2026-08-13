import React from 'react'
import { BrainCircuit, FileWarning, FileOutput, CheckCircle2, Clock, Briefcase } from 'lucide-react'

interface AdvancedMetricsProps {
  myCasesCount: number;
  analyzedDocsCount: number;
  missingDocsCount: number;
  returnedCasesCount: number;
  approvedCasesCount: number;
  pendingCasesCount: number;
  myCasesTrend: string;
  analyzedTrend: string;
  approvedTrend: string;
}

export function AdvancedMetrics({
  myCasesCount,
  analyzedDocsCount,
  missingDocsCount,
  returnedCasesCount,
  approvedCasesCount,
  pendingCasesCount,
  myCasesTrend,
  analyzedTrend,
  approvedTrend,
}: AdvancedMetricsProps) {
  return (
    <div className="grid max-[767px]:grid-cols-1 grid-cols-2 min-[992px]:grid-cols-3 custom-grid-1600 gap-[15px]">

      {/* Card 1: My cases */}
      <div className="bg-white rounded-2xl border border-slate-200/60 p-4 relative overflow-hidden group transition-all duration-300 hover:border-slate-300">
        <div className="absolute -bottom-8 -right-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
          <Briefcase className="w-28 h-28 text-blue-500 rotate-12" />
        </div>
        <div className="flex justify-between items-center relative z-10">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">My cases</span>
          <div className="p-2 bg-blue-50 rounded-lg">
            <Briefcase className="w-5 h-5 text-blue-600" />
          </div>
        </div>
        <div className="mt-1 relative z-10">
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-bold text-slate-800 tracking-tight">{myCasesCount}</h2>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium flex items-center gap-1.5">
            <span className="flex items-center text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
              {myCasesTrend.split(' ')[0]}
            </span>
            {myCasesTrend.split(' ').slice(1).join(' ')}
          </p>
        </div>
      </div>

      {/* Card 2: Analyzed */}
      <div className="bg-white rounded-2xl border border-slate-200/60 p-4 relative overflow-hidden group transition-all duration-300 hover:border-slate-300">
        <div className="absolute -bottom-8 -right-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
          <BrainCircuit className="w-28 h-28 text-teal-500 -rotate-12" />
        </div>
        <div className="flex justify-between items-center relative z-10">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Analyzed</span>
          <div className="p-2 bg-teal-50 rounded-lg">
            <BrainCircuit className="w-5 h-5 text-teal-600" />
          </div>
        </div>
        <div className="mt-1 relative z-10">
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-bold text-slate-800 tracking-tight">{analyzedDocsCount}</h2>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium flex items-center gap-1.5">
            <span className="flex items-center text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
              {analyzedTrend.split(' ')[0]}
            </span>
            {analyzedTrend.split(' ').slice(1).join(' ')}
          </p>
        </div>
      </div>

      {/* Card 3: Pending approval cases */}
      <div className="bg-white rounded-2xl border border-slate-200/60 p-4 relative overflow-hidden group transition-all duration-300 hover:border-slate-300">
        <div className="absolute -bottom-8 -right-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
          <Clock className="w-28 h-28 text-indigo-500 -rotate-12" />
        </div>
        <div className="flex justify-between items-center relative z-10">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending approval</span>
          <div className="p-2 bg-indigo-50 rounded-lg">
            <Clock className="w-5 h-5 text-indigo-600" />
          </div>
        </div>
        <div className="mt-1 relative z-10">
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-bold text-slate-800 tracking-tight">{pendingCasesCount}</h2>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium flex items-center gap-1.5">
            <span className="flex items-center text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded font-bold">
              Awaiting
            </span>
            attorney review
          </p>
        </div>
      </div>

      {/* Card 4: Approved cases */}
      <div className="bg-white rounded-2xl border border-slate-200/60 p-4 relative overflow-hidden group transition-all duration-300 hover:border-slate-300">
        <div className="absolute -bottom-8 -right-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
          <CheckCircle2 className="w-28 h-28 text-emerald-500 rotate-12" />
        </div>
        <div className="flex justify-between items-center relative z-10">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Approved cases</span>
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
              {approvedTrend.split(' ')[0]}
            </span>
            {approvedTrend.split(' ').slice(1).join(' ')}
          </p>
        </div>
      </div>

      {/* Card 5: Missing documents */}
      <div className="bg-white rounded-2xl border border-slate-200/60 p-4 relative overflow-hidden group transition-all duration-300 hover:border-slate-300">
        <div className="absolute -bottom-8 -right-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
          <FileWarning className="w-28 h-28 text-amber-500 rotate-12" />
        </div>
        <div className="flex justify-between items-center relative z-10">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Missing documents</span>
          <div className="p-2 bg-amber-50 rounded-lg">
            <FileWarning className="w-5 h-5 text-amber-600" />
          </div>
        </div>
        <div className="mt-1 relative z-10">
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-bold text-slate-800 tracking-tight">{missingDocsCount}</h2>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium flex items-center gap-1.5">
            <span className="flex items-center text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded font-bold">
              Action required
            </span>
            for processing
          </p>
        </div>
      </div>

      {/* Card 6: Returned by attorney */}
      <div className="bg-white rounded-2xl border border-slate-200/60 p-4 relative overflow-hidden group transition-all duration-300 hover:border-slate-300">
        <div className="absolute -bottom-8 -right-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
          <FileOutput className="w-28 h-28 text-rose-500 -rotate-12" />
        </div>
        <div className="flex justify-between items-center relative z-10">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Returned by attorney</span>
          <div className="p-2 bg-rose-50 rounded-lg">
            <FileOutput className="w-5 h-5 text-rose-600" />
          </div>
        </div>
        <div className="mt-1 relative z-10">
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-bold text-slate-800 tracking-tight">{returnedCasesCount}</h2>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium flex items-center gap-1.5">
            <span className="flex items-center text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded font-bold">
              Needs review
            </span>
            to proceed
          </p>
        </div>
      </div>

    </div>
  )
}
