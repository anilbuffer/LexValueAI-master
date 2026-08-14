"use client"

import { useState } from "react"
import { AlertCircle, FilePlus, ChevronRight } from "lucide-react"

export function PortalDocumentRequests({ requests }: { requests: any[] }) {
  if (!requests || requests.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 text-center text-slate-500">
          <p>No missing documents requested at this time.</p>
        </div>
      </div>
    );
  }

  const pendingRequests = requests.filter(r => r.status === "PENDING");

  if (pendingRequests.length === 0) {
    return null;
  }

  return (
    <div className="bg-amber-50 rounded-xl shadow-sm border border-amber-200 overflow-hidden">
      <div className="bg-amber-100/50 px-6 py-4 border-b border-amber-200">
        <h2 className="font-bold text-amber-900 text-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          Action Required: Missing Documents
        </h2>
        <p className="text-sm text-amber-700 mt-1">
          Your legal team has requested the following documents to proceed with your case.
        </p>
      </div>
      
      <div className="p-0">
        <ul className="divide-y divide-amber-100">
          {pendingRequests.map((req) => (
            <li key={req.id} className="p-6 hover:bg-amber-100/30 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-amber-900">{req.documentName}</h3>
                  <p className="text-sm text-amber-700 mt-1">{req.description}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-medium">
                    <span className="text-amber-600">Requested: {new Date(req.createdAt).toLocaleDateString()}</span>
                    {req.dueDate && <span className="text-rose-600">Due: {new Date(req.dueDate).toLocaleDateString()}</span>}
                    <span className="px-2 py-0.5 bg-amber-200 text-amber-800 rounded-full">Pending</span>
                  </div>
                </div>
                {/* 
                  Since we have a general upload component below this on the page (in the Documents tab), 
                  we can just encourage them to use it, or this button could scroll them to it.
                */}
                <button 
                  onClick={() => {
                    document.getElementById('portal-upload')?.click();
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm shrink-0"
                >
                  <FilePlus className="w-4 h-4" />
                  Upload
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
