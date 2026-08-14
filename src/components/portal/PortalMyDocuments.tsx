"use client"

import { FileText, CheckCircle2, Clock, XCircle } from "lucide-react"

export function PortalMyDocuments({ documents }: { documents: any[] }) {
  if (!documents || documents.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-6">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-600" />
            My Uploaded Documents
          </h2>
        </div>
        <div className="p-6 text-center text-slate-500">
          <p>You have not uploaded any documents yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-6">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
        <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
          <FileText className="w-5 h-5 text-teal-600" />
          My Uploaded Documents
        </h2>
      </div>
      <div className="p-0">
        <ul className="divide-y divide-slate-100">
          {documents.map((doc) => (
            <li key={doc.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">{doc.fileName}</h3>
                  <p className="text-xs text-slate-500">{doc.category} • Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="shrink-0">
                {doc.status === "ACCEPTED" && (
                  <span className="flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" /> Accepted
                  </span>
                )}
                {doc.status === "PENDING_REVIEW" && (
                  <span className="flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                    <Clock className="w-3 h-3" /> Under Review
                  </span>
                )}
                {doc.status === "REJECTED" && (
                  <span className="flex items-center gap-1 text-xs font-medium text-rose-700 bg-rose-50 px-2 py-1 rounded-md border border-rose-200">
                    <XCircle className="w-3 h-3" /> Needs Attention
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
