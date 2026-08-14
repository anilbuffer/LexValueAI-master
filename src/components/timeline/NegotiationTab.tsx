import React, { useEffect, useState } from 'react'
import { Handshake, Plus, Clock } from 'lucide-react'
import { getMockNegotiationLogs } from '@/lib/mock-data'

export function NegotiationTab({ caseData }: { caseData: any }) {
  const firmId = caseData?.firmId;
  const caseId = caseData?.id;

  const [logs, setLogs] = useState<any[]>([])

  useEffect(() => {
    if (firmId && caseId) {
      setLogs(getMockNegotiationLogs(firmId, caseId));
    }
  }, [firmId, caseId])

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-slate-50 p-5 border-b border-slate-200 shrink-0 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Negotiation Tracker</h2>
          <p className="text-sm text-slate-500 mt-1">Track demands, counteroffers, and settlement lifecycle.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-semibold transition-all shadow-sm">
          <Plus className="w-4 h-4" /> Log Offer
        </button>
      </div>

      <div className="p-6 md:p-8 flex-1 overflow-y-auto">
        {!logs.length ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-400">
            <Handshake className="w-12 h-12 mb-4 text-slate-300" />
            <p className="italic">No negotiation history logged.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 relative">
            {/* Vertical timeline line */}
            <div className="absolute left-[23px] top-4 bottom-4 w-px bg-slate-200 z-0"></div>

            {logs.map((log, i) => (
              <div key={log.id} className="relative z-10 flex gap-6 items-start">
                <div className="w-12 h-12 shrink-0 bg-white border-2 border-teal-500 rounded-full flex items-center justify-center text-teal-600 font-bold text-sm shadow-sm">
                  {logs.length - i}
                </div>
                
                <div className="flex-1 bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-slate-300 transition-colors">
                  <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg">{log.party}</h4>
                      <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3.5 h-3.5" /> 
                        {new Date(log.date).toLocaleDateString()}
                        {log.responseDays > 0 && <span className="ml-2 text-rose-600 font-medium bg-rose-50 px-2 py-0.5 rounded-full text-xs">{log.responseDays} days pending</span>}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Demand Amount</p>
                      <p className="text-xl font-bold text-teal-700">
                        {log.demandAmount ? `$${log.demandAmount.toLocaleString()}` : '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Counteroffer</p>
                      <p className="text-xl font-bold text-rose-700">
                        {log.counterOffer ? `$${log.counterOffer.toLocaleString()}` : '-'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
