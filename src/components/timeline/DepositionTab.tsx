import React from 'react'
import { MessagesSquare, CheckCircle2 } from 'lucide-react'

export function DepositionTab({ caseData }: { caseData?: any }) {
  const questions: any[] = []

  if (caseData?.documents) {
    caseData.documents.forEach((doc: any) => {
      if (doc.aiAnalysis?.depositionPrep && Array.isArray(doc.aiAnalysis.depositionPrep)) {
        doc.aiAnalysis.depositionPrep.forEach((qItem: any) => {
          questions.push({
            text: typeof qItem === 'object' && qItem !== null ? qItem.text : qItem,
            pageNumber: typeof qItem === 'object' && qItem !== null ? qItem.pageNumber : null,
            documentName: doc.fileName
          })
        })
      }
    })
  }

  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-slate-50 p-5 border-b border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800">Deposition Prep</h2>
        <p className="text-sm text-slate-500 mt-1">AI suggested questions based on case intelligence.</p>
      </div>
      <div className="p-5 w-full">
        {questions.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
            <p className="text-slate-500">No deposition questions generated yet.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {questions.map((q, i) => (
              <div key={i} className="bg-white border border-slate-200/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] rounded-2xl overflow-hidden group hover:border-blue-300 transition-all duration-300">
                <div className="p-5 flex flex-col md:flex-row gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <MessagesSquare className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[17px] font-bold text-slate-800 leading-snug">"{q.text}"</h4>

                    <div className="mt-4 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">AI Note</span>
                      </div>
                      <p className="text-[14px] text-slate-600 leading-relaxed">Source: {q.documentName}{q.pageNumber ? ` (Page ${q.pageNumber})` : ''}. This question was flagged based on the contents of this document.</p>
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

