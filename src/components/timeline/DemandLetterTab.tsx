"use client"
import { Sparkles, Edit3, Copy, Download } from "lucide-react"
import toast from "react-hot-toast"

export function DemandLetterTab({ caseData }: { caseData: any }) {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-600" />
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">AI-generated demand letter</h2>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => toast.success("Demand letter ready for editing")}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-md hover:bg-slate-50 transition-colors text-sm font-medium"
            >
              <Edit3 className="w-4 h-4" /> Edit
            </button>
            <button 
              onClick={() => {
                navigator.clipboard.writeText("RE: Settlement Demand — Debra Espinoza...");
                toast.success("Copied to clipboard");
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-md hover:bg-slate-50 transition-colors text-sm font-medium"
            >
              <Copy className="w-4 h-4" /> Copy
            </button>
            <button 
              onClick={() => toast.success("Demand letter exported as PDF")}
              className="flex items-center gap-2 px-3 py-1.5 bg-teal-600 border border-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors text-sm font-medium shadow-sm"
            >
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>

        <div className="border border-slate-200/60 rounded-xl p-8 bg-white shadow-sm font-serif text-[15px] leading-relaxed text-slate-800">
          <div className="flex items-center gap-2 mb-8 text-teal-800 font-sans font-bold text-sm">
            <div className="w-6 h-6 rounded bg-teal-100 flex items-center justify-center text-teal-700">S</div>
            Sterling & Associates, PLLC - Tampa, Florida
          </div>

          <div className="mb-6">
            <p>RE: Settlement Demand — Debra Espinoza</p>
            <p>Date of Loss: 4/18/2025</p>
          </div>

          <p className="mb-6">Dear Claims Representative,</p>

          <p className="mb-6">
            This firm represents Debra Espinoza for injuries sustained in the personal injury incident referenced above. This letter and the enclosed medical chronology, specials summary, and imaging constitute our client's demand for settlement.
          </p>

          <p className="mb-6">
            <span className="font-bold">LIABILITY.</span> Liability is clear and undisputed on the facts documented in the incident report and corroborated by the property damage documentation enclosed.
          </p>

          <p className="mb-6">
            <span className="font-bold">INJURIES.</span> Debra Espinoza sustained a C5-C6 disc herniation with mild cord impingement and an L4-L5 protrusion, confirmed by MRI and correlated with dermatomal radicular complaints across four independent providers.
          </p>

          <p className="mb-6">
            <span className="font-bold">TREATMENT.</span> Care began the date of loss and progressed conservatively through physical therapy and a fluoroscopically guided cervical epidural steroid injection before an ACDF at C5-C6 was recommended by the treating orthopedic spine surgeon.
          </p>

          <p className="mb-6">
            <span className="font-bold">SPECIAL DAMAGES.</span> Past medical specials to date are itemized in the enclosed ledger. Future surgical and post-operative specials are supported by the treating surgeon's recommendation.
          </p>

          <p className="mb-6">
            <span className="font-bold">DEMAND.</span> Based on the foregoing, Debra Espinoza demands the sum stated in the enclosed cover sheet in full settlement of all claims. This demand remains open for thirty (30) days.
          </p>

          <div className="mt-8">
            <p className="mb-2">Very truly yours,</p>
            <p className="font-bold">Sterling & Associates, PLLC</p>
          </div>
        </div>
      </div>
    </div>
  )
}
