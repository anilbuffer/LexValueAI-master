import { TrendingUp, TrendingDown } from "lucide-react"

export function NegotiationTab({ caseData }: { caseData: any }) {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6">
        <div className="p-8 rounded-2xl border border-teal-100 bg-teal-50/30 text-center mb-8">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Predicted Settlement Range</p>
          <p className="text-4xl font-extrabold text-slate-900 tracking-tight">$185,000 – $260,000</p>
          <p className="text-sm font-medium text-slate-500 mt-2">Confidence: <span className="text-slate-800 font-bold">Medium</span></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-5 rounded-xl border border-slate-200/60 flex flex-col gap-2 shadow-sm bg-white hover:border-slate-300 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-slate-900">Surgical recommendation (ACDF)</p>
                <p className="text-[12px] font-medium text-slate-500">High impact</p>
              </div>
            </div>
          </div>
          
          <div className="p-5 rounded-xl border border-slate-200/60 flex flex-col gap-2 shadow-sm bg-white hover:border-slate-300 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-slate-900">Objective imaging with cord impingement</p>
                <p className="text-[12px] font-medium text-slate-500">High impact</p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-slate-200/60 flex flex-col gap-2 shadow-sm bg-white hover:border-slate-300 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-slate-900">Explicit causation language from treating surgeon</p>
                <p className="text-[12px] font-medium text-slate-500">Medium impact</p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-slate-200/60 flex flex-col gap-2 shadow-sm bg-white hover:border-slate-300 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                <TrendingDown className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-slate-900">5-month treatment gap</p>
                <p className="text-[12px] font-medium text-slate-500">Medium impact</p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-slate-200/60 flex flex-col gap-2 shadow-sm bg-white hover:border-slate-300 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                <TrendingDown className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-slate-900">Degenerative language in MRI report</p>
                <p className="text-[12px] font-medium text-slate-500">Medium impact</p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-slate-200/60 flex flex-col gap-2 shadow-sm bg-white hover:border-slate-300 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                <TrendingDown className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-slate-900">Prior cervical complaints (2021)</p>
                <p className="text-[12px] font-medium text-slate-500">Low impact</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 font-medium">
          Estimate derived from case flags, structured medical data, verdict comparables, and prior attorney corrections. Not legal advice.
        </p>
      </div>
    </div>
  )
}
