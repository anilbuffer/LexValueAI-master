"use client"
import { DollarSign, Download, AlertCircle } from "lucide-react"
import toast from "react-hot-toast"

export function MedicalBillsTab({ caseData }: { caseData: any }) {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-5 rounded-xl border border-slate-200/60 shadow-sm bg-white">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Total Billed</p>
            <p className="text-3xl font-bold text-slate-900">$19,990</p>
          </div>
          <div className="p-5 rounded-xl border border-slate-200/60 shadow-sm bg-white">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Adjustments</p>
            <p className="text-3xl font-bold text-slate-900">$4,130</p>
          </div>
          <div className="p-5 rounded-xl border border-slate-200/60 shadow-sm bg-white">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Outstanding Balance</p>
            <p className="text-3xl font-bold text-slate-900">$11,890</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200/60">
                <th className="pb-3 pt-4 px-4 font-bold text-[11px] text-slate-500 uppercase tracking-wider">Provider</th>
                <th className="pb-3 pt-4 px-4 font-bold text-[11px] text-slate-500 uppercase tracking-wider">Date of Service</th>
                <th className="pb-3 pt-4 px-4 font-bold text-[11px] text-slate-500 uppercase tracking-wider text-right">Billed</th>
                <th className="pb-3 pt-4 px-4 font-bold text-[11px] text-slate-500 uppercase tracking-wider text-right">Adjustment</th>
                <th className="pb-3 pt-4 px-4 font-bold text-[11px] text-slate-500 uppercase tracking-wider text-right">Paid</th>
                <th className="pb-3 pt-4 px-4 font-bold text-[11px] text-slate-500 uppercase tracking-wider text-right">Balance</th>
              </tr>
            </thead>
            <tbody className="text-slate-700 font-medium">
              <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                <td className="py-4 px-4">St. Mary Hospital — ED</td>
                <td className="py-4 px-4">4/18/2025</td>
                <td className="py-4 px-4 text-right">$8,420</td>
                <td className="py-4 px-4 text-right">$2,100</td>
                <td className="py-4 px-4 text-right">$1,500</td>
                <td className="py-4 px-4 text-right">$4,820</td>
              </tr>
              <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                <td className="py-4 px-4">Reyes Family Medicine</td>
                <td className="py-4 px-4">4/22/2025</td>
                <td className="py-4 px-4 text-right">$460</td>
                <td className="py-4 px-4 text-right">$90</td>
                <td className="py-4 px-4 text-right">$370</td>
                <td className="py-4 px-4 text-right">$0</td>
              </tr>
              <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                <td className="py-4 px-4">Coastal Physical Therapy</td>
                <td className="py-4 px-4">5/6/2025</td>
                <td className="py-4 px-4 text-right">$3,960</td>
                <td className="py-4 px-4 text-right">$640</td>
                <td className="py-4 px-4 text-right">$1,200</td>
                <td className="py-4 px-4 text-right">$2,120</td>
              </tr>
              <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                <td className="py-4 px-4">Atlas Imaging Center</td>
                <td className="py-4 px-4">6/3/2025</td>
                <td className="py-4 px-4 text-right">$2,850</td>
                <td className="py-4 px-4 text-right">$500</td>
                <td className="py-4 px-4 text-right">$0</td>
                <td className="py-4 px-4 text-right">$2,350</td>
              </tr>
              <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                <td className="py-4 px-4">Pain Management Associates</td>
                <td className="py-4 px-4">7/5/2025</td>
                <td className="py-4 px-4 text-right">$4,300</td>
                <td className="py-4 px-4 text-right">$800</td>
                <td className="py-4 px-4 text-right">$900</td>
                <td className="py-4 px-4 text-right">$2,600</td>
              </tr>
              <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors bg-rose-50/50">
                <td className="py-4 px-4 flex items-center gap-2">
                  Shah Orthopedic Spine
                  <span className="inline-flex items-center rounded-md bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700">Bill missing</span>
                </td>
                <td className="py-4 px-4">9/5/2025</td>
                <td className="py-4 px-4 text-right">$0</td>
                <td className="py-4 px-4 text-right">$0</td>
                <td className="py-4 px-4 text-right">$0</td>
                <td className="py-4 px-4 text-right">$0</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <button 
            onClick={() => toast.success("Specials summary exported successfully")}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 shadow-sm text-[13px] transition-colors"
          >
            <Download className="w-4 h-4" />
            Export specials summary
          </button>
        </div>
      </div>
    </div>
  )
}
