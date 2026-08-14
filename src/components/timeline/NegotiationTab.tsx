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
      <div className="bg-slate-50 p-3 border-b border-slate-200 shrink-0 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Negotiation Tracker</h2>
          <p className="text-xs text-slate-500 mt-0.5">Track demands, counteroffers, and settlement lifecycle.</p>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        {!logs.length ? (
          <div className="flex flex-col items-center justify-center p-8 text-slate-400">
            <Handshake className="w-10 h-10 mb-3 text-slate-300" />
            <p className="italic text-sm">No negotiation history logged.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 relative">
            {/* Vertical timeline line */}
            <div className="absolute left-[15px] top-4 bottom-4 w-px bg-slate-200 z-0"></div>

            {logs.map((log, i) => (
              <div key={log.id} className="relative z-10 flex gap-4 items-start">
                <div className="w-8 h-8 shrink-0 bg-white border-2 border-teal-500 rounded-full flex items-center justify-center text-teal-600 font-bold text-xs shadow-sm">
                  {logs.length - i}
                </div>

                <div className="flex-1 bg-white border border-slate-200 rounded-lg p-3 shadow-sm hover:border-slate-300 transition-colors">
                  <div className="flex items-center justify-between mb-2 border-b border-slate-100 pb-2">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{log.party}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(log.date).toLocaleDateString()}
                        {log.responseDays > 0 && <span className="ml-2 text-rose-600 font-medium bg-rose-50 px-2 py-0.5 rounded-full text-[10px]">{log.responseDays} days pending</span>}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Demand Amount</p>
                      <p className="text-base font-bold text-teal-700">
                        {log.demandAmount ? `$${log.demandAmount.toLocaleString()}` : '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Counteroffer</p>
                      <p className="text-base font-bold text-rose-700">
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
