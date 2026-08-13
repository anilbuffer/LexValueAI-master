"use client"
import { useState } from "react"
import { FileOutput } from "lucide-react"
import { CaseSummaryDrawer } from "@/components/modals/CaseSummaryDrawer"

export function ViewSummaryButton({ title, summary, className }: { title: string, summary: string, className?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-[8px] hover:bg-slate-50 hover:text-slate-900 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer ${className || ''}`}
      >
        <FileOutput className="w-3.5 h-3.5" />
        View Summary
      </button>

      <CaseSummaryDrawer 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={title}
        summary={summary}
      />
    </>
  )
}
