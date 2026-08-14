import React, { useState, useEffect } from 'react'
import { Sparkles, Edit3, Copy, Download, Save } from "lucide-react"
import toast from "react-hot-toast"
import { getMockFirm, getMockMedicalBills } from '@/lib/mock-data'

export function DemandLetterTab({ caseData }: { caseData: any }) {
  const firm = getMockFirm();
  const bills = getMockMedicalBills(caseData?.firmId, caseData?.id);
  const totalSpecials = bills.reduce((acc, b) => acc + (b.billed || 0), 0);

  const [isEditing, setIsEditing] = useState(false)
  
  const [letterContent, setLetterContent] = useState(`Dear Claims Representative,

This firm represents ${caseData?.client || 'the client'} for injuries sustained in the personal injury incident. This letter and the enclosed medical chronology, specials summary, and imaging constitute our client's demand for settlement.

LIABILITY. Liability is clear and undisputed on the facts documented in the incident report and corroborated by the property damage documentation enclosed.

INJURIES. ${caseData?.client || 'The client'} sustained injuries confirmed by MRI and correlated with clinical findings across independent providers.

TREATMENT. Care progressed conservatively through physical therapy before further interventions were recommended.

SPECIAL DAMAGES. Past medical specials to date total $${totalSpecials.toLocaleString()} as itemized in the enclosed ledger. 

DEMAND. Based on the foregoing, ${caseData?.client || 'the client'} demands the sum stated in the enclosed cover sheet in full settlement of all claims. This demand remains open for thirty (30) days.`)

  return (
    <div className="flex flex-col h-full bg-white animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-slate-50 p-5 border-b border-slate-200 shrink-0 flex max-[640px]:flex-col min-[640px]:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="bg-teal-100 text-teal-600 p-1.5 rounded-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">AI-Generated Demand Letter</h2>
            <p className="text-sm text-slate-500 mt-0.5">Editable draft pre-filled with case details.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-semibold shadow-sm"
            >
              <Edit3 className="w-4 h-4" /> Edit
            </button>
          ) : (
            <button 
              onClick={() => { setIsEditing(false); toast.success("Draft saved successfully."); }}
              className="flex items-center gap-2 px-3 py-1.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-semibold shadow-sm"
            >
              <Save className="w-4 h-4" /> Save
            </button>
          )}
          <button 
            onClick={() => {
              navigator.clipboard.writeText(letterContent);
              toast.success("Copied to clipboard");
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-semibold shadow-sm"
          >
            <Copy className="w-4 h-4" /> Copy
          </button>
          <button 
            onClick={() => toast.success("Demand letter exported as PDF")}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 border border-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors text-sm font-semibold shadow-sm"
          >
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      <div className="p-6 md:p-8 flex-1 overflow-y-auto bg-slate-100/50">
        <div className="max-w-4xl mx-auto border border-slate-200/60 rounded-xl p-8 md:p-12 bg-white shadow-sm font-serif text-[15px] leading-relaxed text-slate-800">
          
          <div className="flex items-center gap-3 mb-10 pb-6 border-b border-slate-100">
            <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 font-bold text-xl">
              {firm?.name.charAt(0)}
            </div>
            <div>
              <p className="font-sans font-bold text-slate-800 tracking-wide uppercase text-sm">{firm?.name}</p>
              <p className="font-sans text-xs text-slate-500">{firm?.address} • {firm?.phone}</p>
            </div>
          </div>

          <div className="mb-8 text-slate-600">
            <p className="font-bold text-slate-800">RE: Settlement Demand — {caseData?.client}</p>
            <p>Date of Loss: {caseData?.dateOfInjury ? new Date(caseData.dateOfInjury).toLocaleDateString() : 'Unknown'}</p>
          </div>

          {isEditing ? (
            <textarea
              value={letterContent}
              onChange={(e) => setLetterContent(e.target.value)}
              className="w-full min-h-[400px] p-4 border border-teal-500 rounded-lg outline-none focus:ring-4 focus:ring-teal-500/10 font-serif leading-relaxed text-slate-700 resize-y bg-white"
            />
          ) : (
            <div className="whitespace-pre-wrap font-serif text-slate-700 leading-loose">
              {letterContent}
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-slate-100">
            <p className="mb-3 text-slate-600">Very truly yours,</p>
            <p className="font-bold font-sans text-slate-800">{firm?.name}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
