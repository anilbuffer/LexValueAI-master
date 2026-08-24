import React, { useEffect, useState } from 'react'
import { UserCheck, FileQuestion, AlertTriangle, BookOpen, ChevronDown, SplitSquareVertical, Gavel, FileText, CheckCircle2, XCircle, ArrowRight, ExternalLink, Filter, Sparkles, User, Stethoscope } from 'lucide-react'
import { getMockDepositionOutlines } from '@/lib/mock-data'
import { useRouter, usePathname } from 'next/navigation'
import toast from 'react-hot-toast'

type QuestionCategory = 'All' | 'Causation' | 'Treatment Gaps' | 'Prior Injuries' | 'Inconsistencies'

export function DepositionOutlineTab({ caseData }: { caseData: any }) {
  const firmId = caseData?.firmId || 'firm-1';
  const caseId = caseData?.id || 'case-1';

  const router = useRouter();
  const pathname = usePathname();

  const [outlines, setOutlines] = useState<any[]>([])
  const [activeOutlineIndex, setActiveOutlineIndex] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory>('All')

  useEffect(() => {
    if (firmId && caseId) {
      const data = getMockDepositionOutlines(firmId, caseId);
      setOutlines(data);
    }
  }, [firmId, caseId])

  if (!outlines.length) {
    return (
      <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-500 font-sans">
        <div className="bg-slate-50 p-5 border-b border-slate-200 shrink-0">
          <h2 className="text-xl font-bold text-slate-800">Deposition Outline</h2>
          <p className="text-xs text-slate-500 mt-1">AI-generated structure for witness, physician, and expert depositions.</p>
        </div>
        <div className="flex flex-col items-center justify-center p-12 text-slate-400 flex-1">
          <UserCheck className="w-12 h-12 mb-4 text-slate-300" />
          <p className="italic">No deposition outlines generated for this case yet.</p>
        </div>
      </div>
    )
  }

  const activeOutline = outlines[activeOutlineIndex] || outlines[0];

  const handleOpenSource = (citation: string) => {
    toast.success(`Opening medical citation: ${citation}`);
    router.push(`${pathname}?tab=chronology`);
  };

  const filteredQuestions = (activeOutline.questionLines || []).filter((q: any) => {
    if (selectedCategory === 'All') return true;
    return q.category === selectedCategory || q.topic?.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  return (
    <div className="flex flex-col h-full bg-slate-50/50 animate-in fade-in slide-in-from-bottom-2 duration-500 font-sans">
      
      {/* Header & Target Switcher */}
      <div className="bg-white p-5 border-b border-slate-200 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-indigo-700 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
              <Gavel className="w-3 h-3" /> Deposition Blueprints
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
            Deposition Outline & Impeachment Strategy
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            AI-formulated examination questions categorized by causation, treatment gaps, prior injuries, and record inconsistencies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Deponent:</span>
          <div className="relative">
            <select 
              className="appearance-none bg-slate-100 border border-slate-300 text-slate-900 text-xs font-bold rounded-xl pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer shadow-sm hover:bg-slate-200 transition-colors"
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

      {/* Category Filter Pills */}
      <div className="bg-slate-100/80 border-b border-slate-200 px-5 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mr-1">
          <Filter className="w-3 h-3" /> Filter By:
        </span>
        {(['All', 'Causation', 'Treatment Gaps', 'Prior Injuries', 'Inconsistencies'] as QuestionCategory[]).map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-teal-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
            }`}
          >
            {cat === 'All' ? 'All Questions' : `Questions about ${cat}`}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="p-5 md:p-8 flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto flex flex-col gap-6">

          {/* Top Grid: Gaps & Inconsistencies */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Gaps */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm border-l-4 border-l-amber-500">
              <h4 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-2 uppercase tracking-wide">
                <FileQuestion className="w-4 h-4 text-amber-500" /> Target Treatment & Record Gaps
              </h4>
              <ul className="flex flex-col gap-2">
                {activeOutline.gaps?.map((gap: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-slate-700 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-amber-500 font-bold mt-0.5 shrink-0">•</span>
                    <span className="leading-relaxed">{gap}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Inconsistencies */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm border-l-4 border-l-rose-500">
              <h4 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-2 uppercase tracking-wide">
                <AlertTriangle className="w-4 h-4 text-rose-500" /> Record Inconsistencies & Weaknesses
              </h4>
              <ul className="flex flex-col gap-2">
                {activeOutline.inconsistencies?.map((inc: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-slate-700 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-rose-500 font-bold mt-0.5 shrink-0">•</span>
                    <span className="leading-relaxed">{inc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Question Lines */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-teal-700" /> Examination Questions ({filteredQuestions.length})
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                Target: <strong>{activeOutline.deponentType}</strong>
              </span>
            </div>

            {filteredQuestions.map((ql: any, i: number) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:border-slate-300 transition-all">
                {/* Topic & Citation Header */}
                <div className="bg-slate-50/80 p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-900 border border-teal-200 px-3 py-1 rounded-lg text-xs font-bold">
                      <SplitSquareVertical className="w-3.5 h-3.5 text-teal-700" />
                      {ql.topic}
                    </span>
                    {ql.category && (
                      <span className="inline-flex items-center bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
                        {ql.category}
                      </span>
                    )}
                  </div>
                  
                  {/* Source Reference Link */}
                  {ql.citation && (
                    <button 
                      onClick={() => handleOpenSource(ql.citation)}
                      className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                      title="Open source medical record page"
                    >
                      <FileText className="w-3.5 h-3.5 text-teal-600" />
                      <span>Ref: {ql.citation}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </button>
                  )}
                </div>

                {/* Suggested Question */}
                <div className="p-5 md:p-6 space-y-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Suggested Examination Question:
                    </span>
                    <p className="text-base md:text-lg font-serif text-slate-900 leading-relaxed font-medium bg-slate-50/60 p-4 rounded-xl border border-slate-100">
                      "{ql.suggestedQuestion}"
                    </p>
                  </div>
                  
                  {/* Impeachment Strategy */}
                  {ql.impeachment && (
                    <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-xl">
                      <p className="text-xs font-bold text-rose-900 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                        <Gavel className="w-3.5 h-3.5 text-rose-600" /> Impeachment & Lock-In Objective
                      </p>
                      <p className="text-xs text-rose-950 leading-relaxed">{ql.impeachment}</p>
                    </div>
                  )}

                  {/* Branching Logic */}
                  {ql.branching && (
                    <div className="grid md:grid-cols-2 gap-3 pt-2">
                      {/* YES Branch */}
                      <div className="border border-emerald-200 bg-emerald-50/40 rounded-xl p-3.5 relative overflow-hidden">
                        <h5 className="text-xs font-bold text-emerald-800 mb-1.5 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> IF WITNESS ANSWERS YES:
                        </h5>
                        <div className="flex items-start gap-2 text-xs text-slate-700">
                          <ArrowRight className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                          <p className="leading-relaxed">{ql.branching.ifYes}</p>
                        </div>
                      </div>

                      {/* NO Branch */}
                      <div className="border border-rose-200 bg-rose-50/40 rounded-xl p-3.5 relative overflow-hidden">
                        <h5 className="text-xs font-bold text-rose-800 mb-1.5 flex items-center gap-1.5">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" /> IF WITNESS ANSWERS NO / DENIES:
                        </h5>
                        <div className="flex items-start gap-2 text-xs text-slate-700">
                          <ArrowRight className="w-3.5 h-3.5 text-rose-600 mt-0.5 shrink-0" />
                          <p className="leading-relaxed">{ql.branching.ifNo}</p>
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
