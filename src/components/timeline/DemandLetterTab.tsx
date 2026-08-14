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

Please be advised that this office represents ${caseData?.client || 'our client'} in connection with severe and permanent injuries sustained on ${caseData?.dateOfInjury ? new Date(caseData.dateOfInjury).toLocaleDateString() : 'the date of loss'}. This letter, along with the enclosed medical chronology, case flags, narrative summary, and medical bills ledger, constitutes our client's formal demand for settlement.

I. INTRODUCTION & LIABILITY SUMMARY
On ${caseData?.dateOfInjury ? new Date(caseData.dateOfInjury).toLocaleDateString() : 'the date of loss'}, our client was the restrained driver of a vehicle completely stopped at a steady red light at the intersection of Atlantic Ave and Flatbush Ave, Brooklyn NY. The defendant, operating a commercial vehicle, failed to stop and rear-ended our client's vehicle at approximately 35 MPH. Liability is clear and undisputed; the defendant was cited at the scene for following too closely (NYPD Police Report MV104). 

II. INJURY DESCRIPTION
The sheer force of the impact caused our client to be thrust violently forward and backward, resulting in immediate onset of severe neck and back pain that subsequently radiated to her extremities. MRI diagnostics and independent clinical evaluations confirmed the following traumatic injuries:
• Severe cervical spondylosis with radiculopathy at C5-C7
• Superior labral anterior-posterior (SLAP) tear of the right shoulder
• Medial meniscus tear of the left knee

Prior to this collision, ${caseData?.client || 'our client'} was a healthy individual with no history of neck pain or upper extremity symptoms. Her life has been permanently altered by the defendant's negligence.

III. TREATMENT SUMMARY
Conservative treatment, including physical therapy and pain management, failed to provide relief from the debilitating symptoms. Consequently, our client was forced to undergo multiple invasive surgical procedures to address the injuries sustained in the crash:
• Left Knee Arthroscopy with partial medial meniscectomy (June 15, 2018)
• Anterior Cervical Discectomy and Fusion (ACDF) at C5-C6 and C6-C7 with anterior plating and allograft (October 15, 2018)
• Right Shoulder Arthroscopy with extensive debridement and SLAP repair (November 12, 2018)

Our client continues to experience significant functional limitations, chronic pain, and requires ongoing medical care.

IV. SPECIAL DAMAGES BREAKDOWN
As a direct and proximate result of the collision, our client has incurred substantial medical expenses. The attached medical bills ledger itemizes the past medical specials, which currently total $${totalSpecials.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.

V. SETTLEMENT DEMAND AMOUNT
Considering the undisputed liability, the catastrophic nature of the injuries requiring a two-level cervical fusion and multiple arthroscopic surgeries, the immense pain and suffering, and the total medical specials of $${totalSpecials.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}, we demand the sum of $500,000.00 in full and final settlement of this claim.

This demand remains open for thirty (30) days from the date of this letter. If we do not receive a favorable response within this timeframe, we will proceed with filing suit without further notice.

We look forward to your prompt response.`)

  return (
    <div className="flex flex-col h-full bg-white animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-slate-50 p-3 border-b border-slate-200 shrink-0 flex max-[640px]:flex-col min-[640px]:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="bg-teal-100 text-teal-600 p-1.5 rounded-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">AI-Generated Demand Letter</h2>
            <p className="text-xs text-slate-500 mt-0.5">Editable draft pre-filled with case details.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-2.5 py-1 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-xs font-semibold shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
          ) : (
            <button 
              onClick={() => { setIsEditing(false); toast.success("Draft saved successfully."); }}
              className="flex items-center gap-2 px-2.5 py-1 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-xs font-semibold shadow-sm"
            >
              <Save className="w-3.5 h-3.5" /> Save
            </button>
          )}
          <button 
            onClick={() => {
              navigator.clipboard.writeText(letterContent);
              toast.success("Copied to clipboard");
            }}
            className="flex items-center gap-2 px-2.5 py-1 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-xs font-semibold shadow-sm"
          >
            <Copy className="w-3.5 h-3.5" /> Copy
          </button>
          <button 
            onClick={() => toast.success("Demand letter exported as PDF")}
            className="flex items-center gap-2 px-2.5 py-1 bg-slate-800 border border-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors text-xs font-semibold shadow-sm"
          >
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto bg-slate-100/50">
        <div className="max-w-4xl mx-auto border border-slate-200/60 rounded-lg p-6 md:p-8 bg-white shadow-sm font-serif text-sm leading-normal text-slate-800">
          
          <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 font-bold text-lg">
              {firm?.name.charAt(0)}
            </div>
            <div>
              <p className="font-sans font-bold text-slate-800 tracking-wide uppercase text-xs">{firm?.name}</p>
              <p className="font-sans text-[10px] text-slate-500">{firm?.address} • {firm?.phone}</p>
            </div>
          </div>

          <div className="mb-5 text-slate-600">
            <p className="font-bold text-slate-800">RE: Settlement Demand — {caseData?.client}</p>
            <p>Date of Loss: {caseData?.dateOfInjury ? new Date(caseData.dateOfInjury).toLocaleDateString() : 'Unknown'}</p>
          </div>

          {isEditing ? (
            <textarea
              value={letterContent}
              onChange={(e) => setLetterContent(e.target.value)}
              className="w-full min-h-[600px] p-3 border border-teal-500 rounded-lg outline-none focus:ring-4 focus:ring-teal-500/10 font-serif leading-normal text-slate-700 resize-y bg-white"
            />
          ) : (
            <div className="whitespace-pre-wrap font-serif text-slate-700 leading-normal">
              {letterContent}
            </div>
          )}

          <div className="mt-8 pt-5 border-t border-slate-100">
            <p className="mb-2 text-slate-600">Very truly yours,</p>
            <p className="font-bold font-sans text-slate-800">{firm?.name}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
