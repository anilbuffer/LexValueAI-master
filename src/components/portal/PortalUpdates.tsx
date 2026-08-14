"use client"

import { Clock, Info } from "lucide-react"

export function PortalUpdates({ updates }: { updates: any[] }) {
  if (!updates || updates.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 text-center text-slate-500">
          <p>No updates available for your case yet.</p>
        </div>
      </div>
    );
  }

  // Sort updates by date descending
  const sortedUpdates = [...updates].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
        <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
          <Clock className="w-5 h-5 text-teal-600" />
          Case Timeline & Updates
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Stay informed with the latest developments in your case.
        </p>
      </div>
      
      <div className="p-6">
        <div className="relative border-l-2 border-slate-200 ml-3 space-y-8">
          {sortedUpdates.map((update, index) => (
            <div key={update.id} className="relative pl-6">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-teal-500 flex items-center justify-center">
                {index === 0 && <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse" />}
              </div>
              <div>
                <p className="text-xs font-semibold text-teal-600 mb-1">{new Date(update.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    {update.title}
                  </h3>
                  <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                    {update.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
