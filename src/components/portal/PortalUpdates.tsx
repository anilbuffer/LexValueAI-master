"use client"

import { ActivitySquare, CheckCircle2 } from "lucide-react"

export function PortalUpdates({ updates }: { updates: any[] }) {
  // Mocked Timeline Milestones as requested by the user
  const milestones = [
    { label: "Case Opened", description: "Your case has been formally opened with our firm.", completed: true },
    { label: "Documents Submitted", description: "Initial documents have been received.", completed: true },
    { label: "Medical Records Collected", description: "We have collected the necessary medical records.", completed: true },
    { label: "Attorney Review", description: "Your legal team is currently reviewing your case.", completed: false, active: true },
    { label: "Demand Preparation", description: "We are preparing a demand letter for the opposing party.", completed: false },
    { label: "Negotiation", description: "We are currently in negotiations.", completed: false },
    { label: "Settlement / Closure", description: "Your case is being finalized.", completed: false }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
        <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
          <ActivitySquare className="w-5 h-5 text-teal-600" />
          Case Timeline
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Track the overall progress of your case.
        </p>
      </div>
      
      <div className="p-8">
        <div className="relative border-l-2 border-slate-200 ml-4 space-y-8">
          {milestones.map((milestone, index) => (
            <div key={index} className="relative pl-8">
              {milestone.completed ? (
                <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center border-4 border-white shadow-sm">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              ) : milestone.active ? (
                <div className="absolute -left-[13px] top-1.5 w-6 h-6 rounded-full bg-white border-4 border-teal-500 shadow-sm" />
              ) : (
                <div className="absolute -left-[11px] top-2 w-5 h-5 rounded-full bg-white border-2 border-slate-300" />
              )}
              
              <div className={`bg-slate-50 rounded-lg p-5 border ${
                milestone.active ? 'border-teal-200 shadow-sm' : 'border-slate-100'
              }`}>
                <h3 className={`font-bold text-base flex items-center gap-2 ${
                  milestone.completed ? 'text-slate-800' : milestone.active ? 'text-teal-700' : 'text-slate-500'
                }`}>
                  {milestone.label}
                  {milestone.active && <span className="text-xs font-bold bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full ml-2">Current Stage</span>}
                </h3>
                <p className={`text-sm mt-1 leading-relaxed ${
                  milestone.active ? 'text-slate-700' : 'text-slate-500'
                }`}>
                  {milestone.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
