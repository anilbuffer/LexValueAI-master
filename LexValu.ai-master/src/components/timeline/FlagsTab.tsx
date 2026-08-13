import React from 'react'
import { AlertTriangle, FileText } from 'lucide-react'

export function FlagsTab({ caseData }: { caseData?: any }) {
  // Aggregate flags from all documents that have aiAnalysis
  const flags: any[] = []
  
  if (caseData?.documents) {
    caseData.documents.forEach((doc: any) => {
      if (doc.aiAnalysis?.flags && Array.isArray(doc.aiAnalysis.flags)) {
        doc.aiAnalysis.flags.forEach((flagText: string) => {
          flags.push({
            text: flagText,
            documentName: doc.fileName
          })
        })
      }
    })
  }

  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-slate-50 p-5 border-b border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800">Intelligence Flags</h2>
        <p className="text-sm text-slate-500 mt-1">{flags.length} critical risk indicators identified by AI.</p>
      </div>

      <div className="p-5 w-full">
        {flags.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
            <p className="text-slate-500">No flags identified yet. Upload a document to automatically analyze risks.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {flags.map((flag, index) => (
              <div key={index} className="bg-white border border-slate-100 rounded-2xl p-4 md:p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] hover:border-amber-200 transition-all duration-300 group-hover:-translate-y-1 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                    <h4 className="text-[16px] md:text-[17px] font-semibold text-slate-800">AI Identified Flag</h4>
                  </div>
                  <p className="text-[14px] text-slate-600 leading-normal mb-3">{flag.text}</p>
                  <div className="pt-2 border-t border-slate-50 flex items-center gap-3 w-full min-w-0">
                    <div className="flex items-center gap-2 text-[12px] text-slate-600 font-semibold bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg hover:bg-teal-50 hover:text-teal-700 hover:border-teal-100 cursor-pointer transition-colors max-w-full overflow-hidden">
                      <FileText className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                      <span className="truncate whitespace-nowrap overflow-hidden">Source: {flag.documentName}</span>
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

