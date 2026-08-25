"use client"
import { useState, useEffect } from "react"
import { Sparkles, Activity, FileQuestion, MessagesSquare, Flag, ChevronRight } from "lucide-react"
import { getUserRole } from "@/app/actions/auth"
import { ChronologyTab } from "@/components/timeline/ChronologyTab"
import { SummaryTab } from "@/components/timeline/SummaryTab"
import { GapsTab } from "@/components/timeline/GapsTab"
import { CaseIntelligenceBlock } from "@/components/timeline/CaseIntelligenceBlock"
import { MedicalBillsTab } from "@/components/timeline/MedicalBillsTab"
import { NegotiationTab } from "@/components/timeline/NegotiationTab"
import { CaseDocumentsTab } from "@/components/timeline/CaseDocumentsTab"
import { DemandLetterTab } from "@/components/timeline/DemandLetterTab"
import { DepositionOutlineTab } from "@/components/timeline/DepositionOutlineTab"

import { CaseValuationTab } from "@/components/timeline/CaseValuationTab"
import { RightSidebar } from "@/components/timeline/RightSidebar"
import { Receipt, Handshake, FolderOpen, Mail, UserCheck, Car, Target } from "lucide-react"

type TabType = 'flags' | 'chronology' | 'summary' | 'gaps' | 'bills' | 'negotiation' | 'documents' | 'demand_letter' | 'deposition_outline' | 'valuation'

import { useSearchParams } from "next/navigation"

export function TimelineTabs({ caseData }: { caseData: any }) {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<TabType>('chronology')
  const [role, setRole] = useState<string | null>(null)
  const [highlightedFlag, setHighlightedFlag] = useState<number | null>(null)

  useEffect(() => {
    getUserRole().then(setRole)
  }, [])

  useEffect(() => {
    const tabParam = searchParams.get('tab') as TabType
    if (tabParam && ['flags', 'chronology', 'summary', 'gaps', 'bills', 'negotiation', 'documents', 'demand_letter', 'deposition_outline', 'valuation'].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [searchParams])

  // Function to guess severity based on text content
  function guessSeverity(text: string): string {
    const lower = text.toLowerCase();
    if (lower.includes('gap') || lower.includes('missing') || lower.includes('delay') || lower.includes('inconsistent') || lower.includes('recommended') || lower.includes('cleared') || lower.includes('normal') || lower.includes('objective')) return 'medium';
    return 'high';
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

        <button
          onClick={() => setActiveTab('bills')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[14px] font-semibold transition-all whitespace-nowrap cursor-pointer border ${activeTab === 'bills'
            ? 'bg-teal-900 text-white border-teal-900 shadow-md'
            : 'bg-white text-slate-500 border-slate-200/50 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 shadow-sm'
            }`}
        >
          <div className={`${activeTab === 'bills' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'} p-1 rounded-md transition-colors`}>
            <Receipt className="w-4 h-4" />
          </div>
          Medical Bills
        </button>

        <button
          onClick={() => setActiveTab('negotiation')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[14px] font-semibold transition-all whitespace-nowrap cursor-pointer border ${activeTab === 'negotiation'
            ? 'bg-teal-900 text-white border-teal-900 shadow-md'
            : 'bg-white text-slate-500 border-slate-200/50 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 shadow-sm'
            }`}
        >
          <div className={`${activeTab === 'negotiation' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'} p-1 rounded-md transition-colors`}>
            <Handshake className="w-4 h-4" />
          </div>
          Negotiations
        </button>

        <button
          onClick={() => setActiveTab('documents')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[14px] font-semibold transition-all whitespace-nowrap cursor-pointer border ${activeTab === 'documents'
            ? 'bg-teal-900 text-white border-teal-900 shadow-md'
            : 'bg-white text-slate-500 border-slate-200/50 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 shadow-sm'
            }`}
        >
          <div className={`${activeTab === 'documents' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'} p-1 rounded-md transition-colors`}>
            <FolderOpen className="w-4 h-4" />
          </div>
          Case Documents
        </button>

        <button
          onClick={() => setActiveTab('demand_letter')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[14px] font-semibold transition-all whitespace-nowrap cursor-pointer border ${activeTab === 'demand_letter'
            ? 'bg-teal-900 text-white border-teal-900 shadow-md'
            : 'bg-white text-slate-500 border-slate-200/50 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 shadow-sm'
            }`}
        >
          <div className={`${activeTab === 'demand_letter' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'} p-1 rounded-md transition-colors`}>
            <Mail className="w-4 h-4" />
          </div>
          Demand Letter
        </button>

        <button
          onClick={() => setActiveTab('deposition_outline')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[14px] font-semibold transition-all whitespace-nowrap cursor-pointer border ${activeTab === 'deposition_outline'
            ? 'bg-teal-900 text-white border-teal-900 shadow-md'
            : 'bg-white text-slate-500 border-slate-200/50 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 shadow-sm'
            }`}
        >
          <div className={`${activeTab === 'deposition_outline' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'} p-1 rounded-md transition-colors`}>
            <UserCheck className="w-4 h-4" />
          </div>
          Deposition Outline
        </button>

        <button
          onClick={() => setActiveTab('valuation')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[14px] font-semibold transition-all whitespace-nowrap cursor-pointer border ${activeTab === 'valuation'
            ? 'bg-teal-900 text-white border-teal-900 shadow-md'
            : 'bg-white text-slate-500 border-slate-200/50 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 shadow-sm'
            }`}
        >
          <div className={`${activeTab === 'valuation' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'} p-1 rounded-md transition-colors`}>
            <Sparkles className="w-4 h-4" />
          </div>
          Settlement Intelligence
        </button>
      </div>

      <div className="flex flex-col xl:flex-row gap-[15px]">
        {/* Main Content Area */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200/50 flex flex-col overflow-hidden min-h-[500px]">
          {activeTab === 'flags' && <CaseIntelligenceBlock caseData={caseData} highlightedFlag={highlightedFlag} />}
          {activeTab === 'chronology' && <ChronologyTab caseData={caseData} />}
          {activeTab === 'summary' && <SummaryTab caseData={caseData} />}
          {activeTab === 'gaps' && <GapsTab caseData={caseData} role={role} />}
          {activeTab === 'bills' && <MedicalBillsTab caseData={caseData} />}
          {activeTab === 'valuation' && <CaseValuationTab caseData={caseData} />}
          {activeTab === 'negotiation' && <NegotiationTab caseData={caseData} />}
          {activeTab === 'documents' && <CaseDocumentsTab caseData={caseData} />}
          {activeTab === 'demand_letter' && <DemandLetterTab caseData={caseData} role={role} />}
          {activeTab === 'deposition_outline' && <DepositionOutlineTab caseData={caseData} />}
        </div>

        {/* Right Sidebar: Case Notes & Ask This Case */}
        <RightSidebar caseData={caseData} />
      </div>

    </div>
  )
}
