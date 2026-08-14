import React, { useEffect, useState } from 'react'
import { UserCheck, FileQuestion, AlertTriangle, BookOpen, ChevronDown, SplitSquareVertical, Gavel, FileText, CheckCircle2, XCircle, ArrowRight } from 'lucide-react'
import { getMockDepositionOutlines } from '@/lib/mock-data'
import toast from 'react-hot-toast'

export function DepositionOutlineTab({ caseData }: { caseData: any }) {
  const firmId = caseData?.firmId;
  const caseId = caseData?.id;

  const [outlines, setOutlines] = useState<any[]>([])
  const [activeOutlineIndex, setActiveOutlineIndex] = useState(0)

  useEffect(() => {
    if (firmId && caseId) {
      const data = getMockDepositionOutlines(firmId, caseId);
      setOutlines(data);
    }
  }, [firmId, caseId])

  if (!outlines.length) {
    return (
      <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="bg-slate-50 p-4 border-b border-slate-200 shrink-0">
          <h2 className="text-xl font-bold text-slate-800">Deposition Outline</h2>
          <p className="text-sm text-slate-500 mt-1">AI-generated structure for witness and physician depositions.</p>
        </div>
        <div className="flex flex-col items-center justify-center p-12 text-slate-400 flex-1">
          <UserCheck className="w-12 h-12 mb-4 text-slate-300" />
          <p className="italic">No deposition outlines generated for this case yet.</p>
        </div>
      </div>
    )
  }

  const activeOutline = outlines[activeOutlineIndex];

  return (
    <div className="flex flex-col h-full bg-slate-50/50 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header & Target Switcher */}
      <div className="bg-white p-4 border-b border-slate-200 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-10">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Gavel className="w-5 h-5 text-indigo-600" /> Deposition Blueprints
          </h2>
          <p className="text-sm text-slate-500 mt-1">Cross-examination structures & lock-in paths.</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-slate-600">Target Witness:</span>
          <div className="relative">
            <select 
              className="appearance-none bg-slate-100 border border-slate-300 text-slate-800 text-sm font-bold rounded-lg pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm hover:bg-slate-200 transition-colors"
              value={activeOutlineIndex}
              onChange={(e) => setActiveOutlineIndex(Number(e.target.value))}
            >
              {outlines.map((out, idx) => (
                <option key={out.id} value={idx}>{out.deponentType}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 md:p-6 flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto flex flex-col gap-6">

          {/* Top Grid: Gaps & Inconsistencies */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Gaps */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm border-l-4 border-l-amber-400 hover:shadow-md transition-shadow">
              <h4 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-2 uppercase tracking-wide">
                <FileQuestion className="w-4 h-4 text-amber-500" /> Treatment & Record Gaps
              </h4>
              <ul className="flex flex-col gap-2.5">
                {activeOutline.gaps?.map((gap: string, i: number) => (
                  <li key={i} className="flex items-start gap-2.5 text-slate-700 text-sm bg-slate-50 p-2 rounded-md">
                    <span className="text-amber-500 mt-0.5 shrink-0">•</span>
                    <span className="leading-snug">{gap}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Inconsistencies */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm border-l-4 border-l-rose-400 hover:shadow-md transition-shadow">
              <h4 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-2 uppercase tracking-wide">
                <AlertTriangle className="w-4 h-4 text-rose-500" /> Record Inconsistencies
              </h4>
              <ul className="flex flex-col gap-2.5">
                {activeOutline.inconsistencies?.map((inc: string, i: number) => (
                  <li key={i} className="flex items-start gap-2.5 text-slate-700 text-sm bg-slate-50 p-2 rounded-md">
                    <span className="text-rose-500 mt-0.5 shrink-0">•</span>
                    <span className="leading-snug">{inc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Question Lines */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mt-2">
              <BookOpen className="w-5 h-5 text-indigo-600" /> Lock-In Question Trees
            </h3>

            {activeOutline.questionLines?.map((ql: any, i: number) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Topic Header */}
                <div className="bg-slate-100 p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    <SplitSquareVertical className="w-3.5 h-3.5" />
                    {ql.topic}
                  </div>
                  
                  {/* Impeachment / Citation Badge */}
                  {ql.citation && (
                    <button 
                      onClick={() => toast.success(`Opening reference: ${ql.citation}`)}
                      className="inline-flex items-center gap-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      title="Open conflicting medical record page"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Ref: {ql.citation}
                    </button>
                  )}
                </div>

                {/* Question */}
                <div className="p-5">
                  <p className="text-lg font-serif text-slate-800 leading-relaxed font-medium">
                    "{ql.suggestedQuestion}"
                  </p>
                  
                  {/* Impeachment Note */}
                  {ql.impeachment && (
                    <div className="mt-4 p-3 bg-red-50 border-l-2 border-red-400 rounded-r-lg">
                      <p className="text-xs font-bold text-red-800 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                        <Gavel className="w-3.5 h-3.5" /> Impeachment Mode
                      </p>
                      <p className="text-sm text-red-900 leading-snug">{ql.impeachment}</p>
                    </div>
                  )}

                  {/* Branching Logic */}
                  {ql.branching && (
                    <div className="mt-5 grid md:grid-cols-2 gap-4">
                      {/* YES Branch */}
                      <div className="border border-green-200 bg-green-50/50 rounded-lg p-4 relative overflow-hidden group hover:bg-green-100/50 transition-colors">
                        <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                        <h5 className="text-xs font-bold text-green-700 mb-2 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> IF WITNESS ANSWERS YES:
                        </h5>
                        <div className="flex items-start gap-2 text-sm text-slate-700">
                          <ArrowRight className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                          <p>{ql.branching.ifYes}</p>
                        </div>
                      </div>

                      {/* NO Branch */}
                      <div className="border border-red-200 bg-red-50/50 rounded-lg p-4 relative overflow-hidden group hover:bg-red-100/50 transition-colors">
                        <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                        <h5 className="text-xs font-bold text-red-700 mb-2 flex items-center gap-1.5">
                          <XCircle className="w-4 h-4" /> IF WITNESS ANSWERS NO / DENIES:
                        </h5>
                        <div className="flex items-start gap-2 text-sm text-slate-700">
                          <ArrowRight className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                          <p>{ql.branching.ifNo}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
