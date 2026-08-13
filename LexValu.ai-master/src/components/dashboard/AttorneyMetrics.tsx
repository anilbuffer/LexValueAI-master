import { Briefcase, CheckCircle2, FileOutput, Clock } from "lucide-react"

interface AttorneyMetricsProps {
  assignedCount: number
  approvedCount: number
  rejectedCount: number
  pendingCount: number
  assignedTrend: string
  approvedTrend: string
}

export function AttorneyMetrics({
  assignedCount,
  approvedCount,
  rejectedCount,
  pendingCount,
  assignedTrend,
  approvedTrend
}: AttorneyMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[15px]">
      
      {/* Card 1: Assigned Cases */}
      <div className="bg-white rounded-2xl border border-slate-200/60 p-4 relative overflow-hidden group transition-all duration-300 hover:border-slate-300">
        <div className="absolute -bottom-8 -right-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
          <Briefcase className="w-28 h-28 text-blue-500 rotate-12" />
        </div>
        <div className="flex justify-between items-center relative z-10">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Cases</span>
          <div className="p-2 bg-blue-50 rounded-lg">
            <Briefcase className="w-5 h-5 text-blue-600" />
          </div>
        </div>
        <div className="mt-1 relative z-10">
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-bold text-slate-800 tracking-tight">{assignedCount}</h2>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium flex items-center gap-1.5">
            <span className="flex items-center text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
              {assignedTrend.split(' ')[0]}
            </span>
            {assignedTrend.split(' ').slice(1).join(' ')}
          </p>
        </div>
      </div>

      {/* Card 2: Needs Review */}
      <div className="bg-white rounded-2xl border border-slate-200/60 p-4 relative overflow-hidden group transition-all duration-300 hover:border-slate-300">
        <div className="absolute -bottom-8 -right-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
          <Clock className="w-28 h-28 text-indigo-500 -rotate-12" />
        </div>
        <div className="flex justify-between items-center relative z-10">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Needs Review</span>
          <div className="p-2 bg-indigo-50 rounded-lg">
            <Clock className="w-5 h-5 text-indigo-600" />
          </div>
        </div>
        <div className="mt-1 relative z-10">
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-bold text-slate-800 tracking-tight">{pendingCount}</h2>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium flex items-center gap-1.5">
            <span className="flex items-center text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded font-bold">
              Awaiting
            </span>
            your approval
          </p>
        </div>
      </div>

      {/* Card 3: Approved Cases */}
      <div className="bg-white rounded-2xl border border-slate-200/60 p-4 relative overflow-hidden group transition-all duration-300 hover:border-slate-300">
        <div className="absolute -bottom-8 -right-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
          <CheckCircle2 className="w-28 h-28 text-emerald-500 -rotate-12" />
        </div>
        <div className="flex justify-between items-center relative z-10">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Approved Cases</span>
          <div className="p-2 bg-emerald-50 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
        <div className="mt-1 relative z-10">
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-bold text-slate-800 tracking-tight">{approvedCount}</h2>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium flex items-center gap-1.5">
            <span className="flex items-center text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
              {approvedTrend.split(' ')[0]}
            </span>
            {approvedTrend.split(' ').slice(1).join(' ')}
          </p>
        </div>
      </div>

      {/* Card 4: Returned Cases */}
      <div className="bg-white rounded-2xl border border-slate-200/60 p-4 relative overflow-hidden group transition-all duration-300 hover:border-slate-300">
        <div className="absolute -bottom-8 -right-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
          <FileOutput className="w-28 h-28 text-rose-500 rotate-12" />
        </div>
        <div className="flex justify-between items-center relative z-10">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Returned Cases</span>
          <div className="p-2 bg-rose-50 rounded-lg">
            <FileOutput className="w-5 h-5 text-rose-600" />
          </div>
        </div>
        <div className="mt-1 relative z-10">
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-bold text-slate-800 tracking-tight">{rejectedCount}</h2>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium flex items-center gap-1.5">
            <span className="flex items-center text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded font-bold">
              Returned
            </span>
            to paralegal
          </p>
        </div>
      </div>

    </div>
  )
}
