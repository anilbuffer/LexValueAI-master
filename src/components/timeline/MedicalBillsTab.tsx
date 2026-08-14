import React, { useEffect, useState } from 'react'
import { DollarSign, Download, AlertCircle } from "lucide-react"
import toast from "react-hot-toast"
import { getMockMedicalBills } from '@/lib/mock-data'

export function MedicalBillsTab({ caseData }: { caseData: any }) {
  const firmId = caseData?.firmId;
  const caseId = caseData?.id;

  const [bills, setBills] = useState<any[]>([])

  useEffect(() => {
    if (firmId && caseId) {
      setBills(getMockMedicalBills(firmId, caseId));
    }
  }, [firmId, caseId])

  const totals = bills.reduce((acc, bill) => {
    acc.billed += (bill.billed || 0);
    acc.adjusted += (bill.adjusted || 0);
    acc.paid += (bill.paid || 0);
    acc.balance += (bill.balance || 0);
    return acc;
  }, { billed: 0, adjusted: 0, paid: 0, balance: 0 });

  return (
    <div className="flex flex-col h-full bg-white animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-slate-50 p-5 border-b border-slate-200 shrink-0 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Medical Bills Ledger</h2>
          <p className="text-sm text-slate-500 mt-1">Track itemized special damages</p>
        </div>
      </div>
      
      <div className="p-6 flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-xl border border-slate-200/60 shadow-sm bg-white">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Total Billed</p>
            <p className="text-3xl font-bold text-slate-900">${totals.billed.toLocaleString()}</p>
          </div>
          <div className="p-5 rounded-xl border border-slate-200/60 shadow-sm bg-white">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Adjustments</p>
            <p className="text-3xl font-bold text-slate-900">${totals.adjusted.toLocaleString()}</p>
          </div>
          <div className="p-5 rounded-xl border border-slate-200/60 shadow-sm bg-white">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Paid</p>
            <p className="text-3xl font-bold text-slate-900">${totals.paid.toLocaleString()}</p>
          </div>
          <div className="p-5 rounded-xl border border-teal-200 shadow-sm bg-teal-50/50">
            <p className="text-[11px] font-bold text-teal-600 uppercase tracking-wider mb-2">Outstanding Balance</p>
            <p className="text-3xl font-bold text-teal-800">${totals.balance.toLocaleString()}</p>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-sm">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200">
                <th className="pb-3 pt-4 px-4 font-bold text-[11px] text-slate-500 uppercase tracking-wider">Provider</th>
                <th className="pb-3 pt-4 px-4 font-bold text-[11px] text-slate-500 uppercase tracking-wider">Date of Service</th>
                <th className="pb-3 pt-4 px-4 font-bold text-[11px] text-slate-500 uppercase tracking-wider text-right">Billed</th>
                <th className="pb-3 pt-4 px-4 font-bold text-[11px] text-slate-500 uppercase tracking-wider text-right">Adjustment</th>
                <th className="pb-3 pt-4 px-4 font-bold text-[11px] text-slate-500 uppercase tracking-wider text-right">Paid</th>
                <th className="pb-3 pt-4 px-4 font-bold text-[11px] text-slate-500 uppercase tracking-wider text-right">Balance</th>
              </tr>
            </thead>
            <tbody className="text-slate-700 font-medium">
              {bills.map((bill) => (
                <tr key={bill.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-4">{bill.provider}</td>
                  <td className="py-4 px-4 text-slate-500">{bill.datesOfService}</td>
                  <td className="py-4 px-4 text-right">${bill.billed?.toLocaleString()}</td>
                  <td className="py-4 px-4 text-right">${bill.adjusted?.toLocaleString()}</td>
                  <td className="py-4 px-4 text-right">${bill.paid?.toLocaleString()}</td>
                  <td className="py-4 px-4 text-right font-bold text-slate-800">${bill.balance?.toLocaleString()}</td>
                </tr>
              ))}
              {!bills.length && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 italic">No medical bills logged.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
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
