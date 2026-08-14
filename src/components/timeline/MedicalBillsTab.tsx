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
      <div className="bg-slate-50 p-3 border-b border-slate-200 shrink-0 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Medical Bills Ledger</h2>
          <p className="text-xs text-slate-500 mt-0.5">Track itemized special damages</p>
        </div>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          <div className="p-3 rounded-lg border border-slate-200/60 shadow-sm bg-white">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Billed</p>
            <p className="text-lg font-bold text-slate-900">${totals.billed.toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-lg border border-slate-200/60 shadow-sm bg-white">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Adjustments</p>
            <p className="text-lg font-bold text-slate-900">${totals.adjusted.toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-lg border border-slate-200/60 shadow-sm bg-white">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Paid</p>
            <p className="text-lg font-bold text-slate-900">${totals.paid.toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-lg border border-teal-200 shadow-sm bg-teal-50/50">
            <p className="text-[10px] font-bold text-teal-600 uppercase tracking-wider mb-1">Outstanding Balance</p>
            <p className="text-lg font-bold text-teal-800">${totals.balance.toLocaleString()}</p>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-sm">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200">
                <th className="py-2 px-3 font-bold text-[10px] text-slate-500 uppercase tracking-wider">Provider</th>
                <th className="py-2 px-3 font-bold text-[10px] text-slate-500 uppercase tracking-wider">Date of Service</th>
                <th className="py-2 px-3 font-bold text-[10px] text-slate-500 uppercase tracking-wider text-right">Billed</th>
                <th className="py-2 px-3 font-bold text-[10px] text-slate-500 uppercase tracking-wider text-right">Adjustment</th>
                <th className="py-2 px-3 font-bold text-[10px] text-slate-500 uppercase tracking-wider text-right">Paid</th>
                <th className="py-2 px-3 font-bold text-[10px] text-slate-500 uppercase tracking-wider text-right">Balance</th>
              </tr>
            </thead>
            <tbody className="text-slate-700 font-medium">
              {bills.map((bill) => (
                <tr key={bill.id} className={`border-b border-slate-100 last:border-0 transition-colors ${bill.isMissing ? 'bg-red-50/50 hover:bg-red-50' : 'hover:bg-slate-50/50'}`}>
                  <td className="py-2 px-3 flex items-center gap-2 text-xs">
                    {bill.provider}
                    {bill.isMissing && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-600">
                        Bill missing
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-slate-500 text-xs">{bill.datesOfService}</td>
                  <td className="py-2 px-3 text-right text-xs">${bill.billed?.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right text-xs">${bill.adjusted?.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right text-xs">${bill.paid?.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right font-bold text-slate-800 text-xs">${bill.balance?.toLocaleString()}</td>
                </tr>
              ))}
              {!bills.length && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-xs text-slate-400 italic">No medical bills logged.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-end">
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
