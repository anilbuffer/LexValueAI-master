import React, { useEffect, useState } from 'react'
import { DollarSign, Download, AlertCircle, AlertTriangle, Calculator, ShieldAlert, HeartPulse, FileText } from "lucide-react"
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

  const standardBills = bills.filter(b => b.type === 'Standard' || !b.type);
  const lienBills = bills.filter(b => b.type && b.type !== 'Standard');
  const missingBills = bills.filter(b => b.isMissing);


  return (
    <div className="flex flex-col h-full bg-slate-50 animate-in fade-in slide-in-from-bottom-2 duration-500 overflow-hidden">
      {/* Header Banner */}
      <div className="bg-white p-4 border-b border-slate-200 shrink-0 flex items-center justify-between shadow-sm z-10 relative">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Specials & Recoveries</h2>
            <p className="text-xs text-slate-500 font-medium">Comprehensive medical tracking & modeling</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        
        {/* Summary Bar */}
        <div className="bg-white rounded-xl p-1 shadow-sm border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-200">
            <div className="p-4 bg-gradient-to-br from-slate-50 to-white rounded-tl-xl md:rounded-l-xl">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Billed</p>
              <p className="text-2xl font-bold text-slate-900">${totals.billed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-slate-50 to-white">
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Insurance Adjustments</p>
              <p className="text-2xl font-bold text-slate-900">${totals.adjusted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-slate-50 to-white">
              <p className="text-[10px] font-bold text-sky-600 uppercase tracking-wider mb-1">Paid</p>
              <p className="text-2xl font-bold text-slate-900">${totals.paid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-slate-50 to-white rounded-br-xl md:rounded-r-xl">
              <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider mb-1">Outstanding Balances / Liens</p>
              <p className="text-2xl font-bold text-rose-600">${totals.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>

        {/* Unbilled Care Detector */}
        {missingBills.length > 0 && (
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-5 flex gap-4 shadow-sm relative overflow-hidden group hover:border-amber-300 transition-colors">
            <div className="absolute -right-6 -top-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <AlertTriangle className="w-32 h-32 text-amber-600" />
            </div>
            <div className="mt-0.5 bg-amber-100 p-2 rounded-full h-fit border border-amber-200 shadow-sm relative z-10">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1 relative z-10">
              <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2">
                Unbilled Care Detector Active
                <span className="px-2 py-0.5 bg-amber-200 text-amber-800 rounded-full text-[10px] font-bold uppercase tracking-wider">AI Detected</span>
              </h3>
              <p className="text-xs text-amber-700/90 mt-1 max-w-2xl">
                Cross-referencing the Medical Chronology against the Medical Bills ledger highlights the following treatment visits without corresponding billing statements.
              </p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                {missingBills.map(b => (
                  <div key={b.id} className="text-xs bg-white/70 backdrop-blur-sm border border-amber-200/60 rounded-lg p-3 flex justify-between items-center shadow-sm">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-500/70" />
                      <span className="font-bold text-slate-800">{b.provider}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 font-medium">{b.datesOfService}</span>
                      <button className="text-[10px] font-bold text-amber-700 hover:text-amber-800 underline underline-offset-2">Request Bill</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-6">
            
            {/* Standard Bills Ledger */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-slate-500" />
                <h3 className="font-bold text-slate-800 text-sm">Standard Medical Bills</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-slate-50/80">
                    <tr className="border-b border-slate-200">
                      <th className="py-2.5 px-4 font-bold text-[10px] text-slate-500 uppercase tracking-wider">Provider</th>
                      <th className="py-2.5 px-4 font-bold text-[10px] text-slate-500 uppercase tracking-wider">Date of Service</th>
                      <th className="py-2.5 px-4 font-bold text-[10px] text-slate-500 uppercase tracking-wider text-right">Billed</th>
                      <th className="py-2.5 px-4 font-bold text-[10px] text-slate-500 uppercase tracking-wider text-right">Adj.</th>
                      <th className="py-2.5 px-4 font-bold text-[10px] text-slate-500 uppercase tracking-wider text-right">Paid</th>
                      <th className="py-2.5 px-4 font-bold text-[10px] text-slate-500 uppercase tracking-wider text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700 font-medium divide-y divide-slate-100">
                    {standardBills.filter(b => !b.isMissing).map((bill) => (
                      <tr key={bill.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="py-3 px-4 text-xs font-semibold text-slate-800">{bill.provider}</td>
                        <td className="py-3 px-4 text-slate-500 text-xs">{bill.datesOfService}</td>
                        <td className="py-3 px-4 text-right text-xs">${bill.billed?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td className="py-3 px-4 text-right text-xs text-emerald-600/80">${bill.adjusted?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td className="py-3 px-4 text-right text-xs">${bill.paid?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td className="py-3 px-4 text-right font-bold text-slate-800 text-xs group-hover:text-rose-600 transition-colors">${bill.balance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      </tr>
                    ))}
                    {standardBills.filter(b => !b.isMissing).length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-xs text-slate-400 italic">No standard medical bills logged.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Lien & Collateral Ledger */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-100 bg-rose-50/30 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                <h3 className="font-bold text-slate-800 text-sm">Lien & Collateral Source Ledger</h3>
                <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wider">Subrogation Tracking</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-slate-50/80">
                    <tr className="border-b border-slate-200">
                      <th className="py-2.5 px-4 font-bold text-[10px] text-slate-500 uppercase tracking-wider">Source / Provider</th>
                      <th className="py-2.5 px-4 font-bold text-[10px] text-slate-500 uppercase tracking-wider">Type</th>
                      <th className="py-2.5 px-4 font-bold text-[10px] text-slate-500 uppercase tracking-wider text-right">Asserted Amount</th>
                      <th className="py-2.5 px-4 font-bold text-[10px] text-slate-500 uppercase tracking-wider text-right">Paid to Date</th>
                      <th className="py-2.5 px-4 font-bold text-[10px] text-slate-500 uppercase tracking-wider text-right">Current Lien</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700 font-medium divide-y divide-slate-100">
                    {lienBills.map((bill) => (
                      <tr key={bill.id} className="hover:bg-rose-50/30 transition-colors group">
                        <td className="py-3 px-4 text-xs font-semibold text-slate-800">{bill.provider}</td>
                        <td className="py-3 px-4 text-xs">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border
                            ${bill.type === 'Medicare Lien' ? 'bg-sky-50 text-sky-700 border-sky-200' : 
                              bill.type === 'ERISA Subrogation' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 
                              'bg-purple-50 text-purple-700 border-purple-200'}`}
                          >
                            {bill.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right text-xs">${bill.billed?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td className="py-3 px-4 text-right text-xs">${bill.paid?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td className="py-3 px-4 text-right font-bold text-rose-600 text-xs">${bill.balance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      </tr>
                    ))}
                    {lienBills.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-xs text-slate-400 italic">No active liens or collateral sources.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

        </div>
      </div>
    </div>
  )
}
