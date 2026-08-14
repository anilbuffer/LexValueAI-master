import React, { useState, useMemo } from 'react'
import { AlertTriangle, FileText, ShieldAlert, Zap, MessageSquare, Send } from 'lucide-react'

type Category = 'Data Integrity' | 'Causation & Defense Traps' | 'Treatment Gaps'

export function FlagsTab({ caseData }: { caseData?: any }) {
  const [activeCategory, setActiveCategory] = useState<Category>('Causation & Defense Traps')

  // Aggregate flags
  const rawFlags: any[] = []
  if (caseData?.documents) {
    caseData.documents.forEach((doc: any) => {
      if (doc.aiAnalysis?.flags && Array.isArray(doc.aiAnalysis.flags)) {
        doc.aiAnalysis.flags.forEach((flagText: string) => {
          rawFlags.push({
            text: flagText,
            documentName: doc.fileName
          })
        })
      }
    })
  }

  // If no flags, provide a rich mock list so we can see the design and feature set
  const baseFlags = rawFlags.length > 0 ? rawFlags : [
    { text: "Inconsistent Patient Names (e.g. John Doe vs Jonathon Doe) across initial intake forms.", documentName: "Intake_Form.pdf" },
    { text: "Pre-existing degenerative language noted in Lumbar MRI report.", documentName: "MRI_Report.pdf" },
    { text: "Cervical Orthosis Non-Compliance: Patient stopped wearing brace after 2 weeks.", documentName: "Progress_Notes.pdf" },
    { text: "45-day treatment gap between emergency room discharge and first physical therapy session.", documentName: "PT_Initial_Eval.pdf" }
  ];

  const enrichedFlags = useMemo(() => {
    return baseFlags.map((flag, i) => {
      const text = flag.text.toLowerCase()
      let category: Category = 'Data Integrity'
      let defExp = ''
      let counter = ''

      if (text.includes('gap') || text.includes('delay') || text.includes('missed') || text.includes('45-day')) {
        category = 'Treatment Gaps'
        defExp = 'Adjuster will argue the gap indicates injuries resolved quickly and subsequent PT was attorney-driven.'
        counter = 'Emphasize patient lacked transportation and could not secure an earlier appointment due to clinic backlog.'
      } else if (text.includes('pre-existing') || text.includes('degen') || text.includes('prior') || text.includes('cause')) {
        category = 'Causation & Defense Traps'
        defExp = 'Adjuster will attribute current pain entirely to age-related degenerative disc disease rather than the MVA.'
        counter = 'Utilize the "egg-shell plaintiff" doctrine; highlight that patient was asymptomatic prior to the collision.'
      } else if (text.includes('compliance') || text.includes('brace') || text.includes('orthosis')) {
        category = 'Causation & Defense Traps'
        defExp = 'Adjuster will argue failure to mitigate damages post-surgery because patient abandoned orthosis.'
        counter = 'Cite treating doctor note clarifying brace caused severe skin contact dermatitis, necessitating removal.'
      } else {
        category = 'Data Integrity'
        defExp = 'Adjuster will use mismatched names/DOB to delay authorization or question the authenticity of records.'
        counter = 'Prepare an affidavit of identity or obtain a corrected addendum from the facility immediately.'
      }

      return {
        ...flag,
        id: `flag-${i}`,
        category,
        defenseExploitation: defExp,
        counterStrategy: counter,
      }
    })
  }, [baseFlags])

  const filteredFlags = enrichedFlags.filter(f => f.category === activeCategory)

  // Actions mock
  const handlePushToDeposition = () => alert("Pushed to Deposition Outline: Auto-generating cross-examination questions...")
  const handleInsertDemand = () => alert("Inserted Counter-Argument into Demand Letter.")

  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header section with branding */}
      <div className="bg-slate-50 p-5 border-b border-slate-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-rose-100 rounded-lg shrink-0 mt-0.5">
            <ShieldAlert className="w-6 h-6 text-rose-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">The Defense Adjuster Engine</h2>
            <p className="text-sm text-slate-500 mt-1">Pinpointing vulnerabilities before the insurance company finds them. <span className="font-semibold text-slate-700">{enrichedFlags.length} total flags identified.</span></p>
          </div>
        </div>
      </div>

      {/* Severity Triage Tabs */}
      <div className="border-b border-slate-200 px-5 flex items-center gap-6 bg-white overflow-x-auto no-scrollbar">
        {(['Data Integrity', 'Causation & Defense Traps', 'Treatment Gaps'] as Category[]).map(cat => {
          const count = enrichedFlags.filter(f => f.category === cat).length
          const isActive = activeCategory === cat
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors flex items-center gap-2 ${
                isActive ? 'border-rose-500 text-rose-700' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {cat === 'Data Integrity' ? 'Critical Data Integrity Errors' : cat === 'Causation & Defense Traps' ? 'Causation & Defense Traps' : 'Treatment Gap Risks'}
              <span className={`text-[11px] px-2 py-0.5 rounded-full ${isActive ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>{count}</span>
            </button>
          )
        })}
      </div>

      {/* Flag Cards Container */}
      <div className="p-5 w-full bg-slate-50/50 min-h-[500px]">
        {filteredFlags.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-white">
            <p className="text-slate-500">No flags found in this category.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {filteredFlags.map((flag) => (
              <div key={flag.id} className="bg-white border border-rose-100 rounded-xl overflow-hidden shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-all duration-300">
                {/* Flag Header */}
                <div className="bg-rose-50/30 p-4 border-b border-rose-100 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-rose-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="text-[15px] font-bold text-slate-800 leading-snug">{flag.text}</h4>
                      <div className="flex items-center gap-2 text-[12px] text-slate-500 mt-1.5 font-medium">
                        <FileText className="w-3.5 h-3.5" />
                        Source: {flag.documentName}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Adjuster Impact & Plaintiff Counter-Strategy Cards */}
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Defense Exploitation */}
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 relative overflow-hidden group hover:border-amber-200 transition-colors">
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <ShieldAlert className="w-4 h-4 text-amber-600" />
                      <h5 className="text-[12px] font-bold text-amber-800 uppercase tracking-wider">Defense Exploitation</h5>
                    </div>
                    <p className="text-[13px] text-slate-700 leading-relaxed font-medium">{flag.defenseExploitation}</p>
                  </div>

                  {/* Plaintiff Counter-Strategy */}
                  <div className="bg-teal-50/30 rounded-lg p-4 border border-teal-100 relative overflow-hidden group hover:border-teal-200 transition-colors">
                    <div className="absolute top-0 left-0 w-1 h-full bg-teal-500"></div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Zap className="w-4 h-4 text-teal-600" />
                      <h5 className="text-[12px] font-bold text-teal-800 uppercase tracking-wider">Plaintiff Counter-Strategy</h5>
                    </div>
                    <p className="text-[13px] text-slate-700 leading-relaxed font-medium">{flag.counterStrategy}</p>
                  </div>
                </div>

                {/* One-Click Escalation Actions */}
                <div className="bg-slate-50 px-4 py-3 border-t border-slate-100 flex flex-wrap items-center gap-3">
                  <button onClick={handlePushToDeposition} className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-800 transition-colors shadow-sm">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                    Push to Deposition Outline
                  </button>
                  <button onClick={handleInsertDemand} className="flex items-center gap-1.5 text-[12px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-lg hover:bg-indigo-100 hover:text-indigo-700 transition-colors shadow-sm">
                    <Send className="w-3.5 h-3.5 text-indigo-500" />
                    Insert Counter-Argument into Demand Letter
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

