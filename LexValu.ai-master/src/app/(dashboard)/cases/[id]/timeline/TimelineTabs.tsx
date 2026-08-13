"use client"
import { useState, useEffect } from "react"
import { Sparkles, Activity, FileQuestion, MessagesSquare, Flag, ChevronRight } from "lucide-react"
import { getUserRole } from "@/app/actions/auth"
import { ChronologyTab } from "@/components/timeline/ChronologyTab"
import { SummaryTab } from "@/components/timeline/SummaryTab"
import { GapsTab } from "@/components/timeline/GapsTab"
import { CaseIntelligenceBlock } from "@/components/timeline/CaseIntelligenceBlock"

type TabType = 'flags' | 'chronology' | 'summary' | 'gaps'

export function TimelineTabs({ caseData }: { caseData: any }) {
  const [activeTab, setActiveTab] = useState<TabType>('chronology')
  const [role, setRole] = useState<string | null>(null)
  const [highlightedFlag, setHighlightedFlag] = useState<number | null>(null)

  useEffect(() => {
    getUserRole().then(setRole)
    const params = new URLSearchParams(window.location.search)
    const tabParam = params.get('tab') as TabType
    if (tabParam && ['flags', 'chronology', 'summary', 'gaps'].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [])

  // Function to guess severity based on text content
  function guessSeverity(text: string): string {
    const lower = text.toLowerCase();
    if (lower.includes('gap') || lower.includes('missing') || lower.includes('delay') || lower.includes('inconsistent') || lower.includes('recommended') || lower.includes('cleared') || lower.includes('normal') || lower.includes('objective')) return 'medium';
    return 'high';
  }

  // Extract flags for the right sidebar
  const flags: any[] = []
  if (caseData?.documents) {
    caseData.documents.forEach((doc: any) => {
      if (doc.aiAnalysis?.flags && Array.isArray(doc.aiAnalysis.flags)) {
        doc.aiAnalysis.flags.forEach((flag: any) => {
          let title = "Identified Flag";
          let confidence = "High";
          
          if (typeof flag === 'string') {
            title = flag;
          } else {
            title = flag.title || flag.text || "Identified Flag";
            confidence = flag.confidence || "High";
          }
          
          flags.push({ title, confidence })
        })
      }
    })
  }

  function getDotStyle(confidence: string) {
    const c = (confidence || '').toLowerCase();
    if (c === 'high') return 'bg-rose-500';
    if (c === 'low') return 'bg-slate-400';
    return 'bg-amber-400'; // medium
  }

  return (
    <div className="flex flex-col gap-[15px]">

      {/* Top Horizontal Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setActiveTab('chronology')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[14px] font-semibold transition-all whitespace-nowrap cursor-pointer border ${activeTab === 'chronology'
            ? 'bg-teal-900 text-white border-teal-900 shadow-md'
            : 'bg-white text-slate-500 border-slate-200/50 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 shadow-sm'
            }`}
        >
          <div className={`${activeTab === 'chronology' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'} p-1 rounded-md transition-colors`}>
            <Activity className="w-4 h-4" />
          </div>
          Medical Chronology
        </button>

        <button
          onClick={() => setActiveTab('flags')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[14px] font-semibold transition-all whitespace-nowrap cursor-pointer border ${activeTab === 'flags'
            ? 'bg-teal-900 text-white border-teal-900 shadow-md'
            : 'bg-white text-slate-500 border-slate-200/50 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 shadow-sm'
            }`}
        >
          <div className={`${activeTab === 'flags' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'} p-1 rounded-md transition-colors`}>
            <Flag className="w-4 h-4" />
          </div>
          Case Flags
        </button>

        <button
          onClick={() => setActiveTab('summary')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[14px] font-semibold transition-all whitespace-nowrap cursor-pointer border ${activeTab === 'summary'
            ? 'bg-teal-900 text-white border-teal-900 shadow-md'
            : 'bg-white text-slate-500 border-slate-200/50 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 shadow-sm'
            }`}
        >
          <div className={`${activeTab === 'summary' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'} p-1 rounded-md transition-colors`}>
            <Sparkles className="w-4 h-4" />
          </div>
          Narrative Summary
        </button>

        <button
          onClick={() => setActiveTab('gaps')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[14px] font-semibold transition-all whitespace-nowrap cursor-pointer border ${activeTab === 'gaps'
            ? 'bg-teal-900 text-white border-teal-900 shadow-md'
            : 'bg-white text-slate-500 border-slate-200/50 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 shadow-sm'
            }`}
        >
          <div className={`${activeTab === 'gaps' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'} p-1 rounded-md transition-colors`}>
            <FileQuestion className="w-4 h-4" />
          </div>
          Missing Records
        </button>
      </div>

      <div className="flex flex-col xl:flex-row gap-[15px]">
        {/* Main Content Area */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200/50 flex flex-col overflow-hidden min-h-[500px]">
          {activeTab === 'flags' && <CaseIntelligenceBlock caseData={caseData} highlightedFlag={highlightedFlag} />}
          {activeTab === 'chronology' && <ChronologyTab caseData={caseData} />}
          {activeTab === 'summary' && <SummaryTab caseData={caseData} />}
          {activeTab === 'gaps' && <GapsTab caseData={caseData} role={role} />}
        </div>

        {/* Right Sidebar: Case Flags Summary */}
        <div className="w-full xl:w-[380px] shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm sticky top-4 overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-5 bg-white border-b border-slate-100">
              <Sparkles className="w-5 h-5 text-rose-500" />
              <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">Case Flags</h2>
            </div>
            
            <div className="flex flex-col">
              {flags.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-[13px] text-slate-500">No flags identified yet.</p>
                </div>
              ) : (
                flags.map((flag, idx) => {
                  const dotStyle = getDotStyle(flag.confidence);
                  return (
                    <div 
                      key={idx} 
                      className={`group flex items-center px-5 py-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer ${highlightedFlag === idx ? 'bg-teal-50/50' : ''}`}
                      onClick={() => {
                        setActiveTab('flags')
                        setHighlightedFlag(idx)
                        // Smooth scroll to the tab if on mobile, though usually it's side-by-side
                      }}
                    >
                      <div className={`w-2.5 h-2.5 rounded-full ${dotStyle} mr-3.5 shrink-0 mt-1`}></div>
                      <span className="text-[15px] text-slate-700 font-medium group-hover:text-slate-900 transition-colors flex-1 pr-2 leading-tight">
                        {flag.title}
                      </span>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
