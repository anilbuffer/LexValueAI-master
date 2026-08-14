import { FileText } from "lucide-react"

export function DepositionOutlineTab({ caseData }: { caseData: any }) {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6">
        
        <div className="border border-slate-200/60 rounded-xl mb-6 bg-white overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 flex items-center gap-3">
            <h3 className="text-[16px] font-bold text-slate-900">Dr. Priya Shah, MD — Orthopedic Spine</h3>
            <span className="bg-teal-50 text-teal-700 text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Treating Physician</span>
          </div>
          
          <div className="p-5">
            <div className="mb-6">
              <h4 className="text-[12px] font-bold text-slate-800 uppercase tracking-wider mb-3">Qualifications and Treatment Relationship</h4>
              <ol className="list-decimal list-inside space-y-2 text-[14px] text-slate-700 font-medium">
                <li>Describe your board certification and spine practice.</li>
                <li>When did you first evaluate the plaintiff and on whose referral?</li>
                <li>What records did you review before forming your opinion?</li>
              </ol>
              <p className="text-[12px] text-slate-500 mt-2 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Page 11, Shah Orthopedic Consult</p>
            </div>

            <div className="mb-6">
              <h4 className="text-[12px] font-bold text-slate-800 uppercase tracking-wider mb-3">Causation</h4>
              <ol className="list-decimal list-inside space-y-2 text-[14px] text-slate-700 font-medium">
                <li>Do you hold an opinion to a reasonable degree of medical probability as to the cause of the C5-C6 herniation?</li>
                <li>How do you distinguish acute herniation from the degenerative change described by the radiologist?</li>
              </ol>
              <p className="text-[12px] text-slate-500 mt-2 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Page 11, Shah Orthopedic Consult</p>
            </div>

            <div>
              <h4 className="text-[12px] font-bold text-slate-800 uppercase tracking-wider mb-3">Treatment Gap</h4>
              <ol className="list-decimal list-inside space-y-2 text-[14px] text-slate-700 font-medium">
                <li>Were you aware of the interval between the injection and your surgical recommendation?</li>
                <li>Does that interval change your opinion on causation or necessity?</li>
              </ol>
              <p className="text-[12px] text-slate-500 mt-2 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Pages 5-17, treatment timeline</p>
            </div>
          </div>
        </div>

        <div className="border border-slate-200/60 rounded-xl bg-white overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 flex items-center gap-3">
            <h3 className="text-[16px] font-bold text-slate-900">Plaintiff</h3>
            <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Opposing Party</span>
          </div>
          
          <div className="p-5">
            <div>
              <h4 className="text-[12px] font-bold text-slate-800 uppercase tracking-wider mb-3">Prior Medical History</h4>
              <ol className="list-decimal list-inside space-y-2 text-[14px] text-slate-700 font-medium">
                <li>Describe any neck complaints before the date of loss.</li>
                <li>Who treated you and what was recommended?</li>
              </ol>
              <p className="text-[12px] text-slate-500 mt-2 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Page 3, Reyes Family Medicine</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
