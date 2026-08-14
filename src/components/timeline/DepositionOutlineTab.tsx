import React, { useEffect, useState } from 'react'
import { UserCheck, FileQuestion, AlertTriangle, BookOpen } from 'lucide-react'
import { getMockDepositionOutlines } from '@/lib/mock-data'
import toast from 'react-hot-toast'

export function DepositionOutlineTab({ caseData }: { caseData: any }) {
  const firmId = caseData?.firmId;
  const caseId = caseData?.id;

  const [outlines, setOutlines] = useState<any[]>([])

  useEffect(() => {
    if (firmId && caseId) {
      setOutlines(getMockDepositionOutlines(firmId, caseId));
    }
  }, [firmId, caseId])

  if (!outlines.length) {
    return (
      <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="bg-slate-50 p-3 border-b border-slate-200 shrink-0">
          <h2 className="text-lg font-bold text-slate-800">Deposition Outline</h2>
          <p className="text-xs text-slate-500 mt-0.5">AI-generated structure for witness and physician depositions.</p>
        </div>
        <div className="flex flex-col items-center justify-center p-12 text-slate-400 flex-1">
          <UserCheck className="w-12 h-12 mb-4 text-slate-300" />
          <p className="italic">No deposition outlines generated for this case yet.</p>
        </div>
      </div>
    )
  }

  const outline = outlines[0];

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-slate-50 p-3 border-b border-slate-200 shrink-0 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Deposition Outline</h2>
          <p className="text-xs text-slate-500 mt-0.5">Targeting: <span className="font-bold text-slate-700">{outline.deponentType}</span></p>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4">

          <div className="grid md:grid-cols-2 gap-4">
            {/* Gaps */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm border-t-4 border-t-amber-400">
              <h4 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-2 uppercase tracking-wide">
                <FileQuestion className="w-4 h-4 text-amber-500" /> Treatment Gaps
              </h4>
              <ul className="flex flex-col gap-2">
                {outline.gaps?.map((gap: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-slate-700 text-xs">
                    <span className="text-amber-500 mt-0.5">•</span>
                    {gap}
                  </li>
                ))}
              </ul>
            </div>

            {/* Inconsistencies */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm border-t-4 border-t-rose-400">
              <h4 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-2 uppercase tracking-wide">
                <AlertTriangle className="w-4 h-4 text-rose-500" /> Record Inconsistencies
              </h4>
              <ul className="flex flex-col gap-2">
                {outline.inconsistencies?.map((inc: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-slate-700 text-xs">
                    <span className="text-rose-500 mt-0.5">•</span>
                    {inc}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Question Lines */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm mt-2">
            <div className="bg-slate-50 p-4 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wide">
                <BookOpen className="w-4 h-4 text-teal-600" /> Suggested Lines of Questioning
              </h4>
            </div>
            <div className="p-0">
              {outline.questionLines?.map((ql: any, i: number) => (
                <div key={i} className="p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <div className="inline-block bg-teal-50 text-teal-700 px-2 py-0.5 rounded-md text-[10px] font-bold mb-2 uppercase tracking-wider">
                    {ql.topic}
                  </div>
                  <p className="text-base font-serif text-slate-800 mb-2 leading-normal">
                    "{ql.suggestedQuestion}"
                  </p>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                    <span className="w-4 h-4 bg-slate-200 rounded flex items-center justify-center text-[10px] text-slate-500">pg</span>
                    Citation: {ql.citation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
