"use client"

import { Activity, AlertTriangle, CheckCircle2, ChevronRight, FileText, UploadCloud, PenTool } from "lucide-react"

import { useRouter } from "next/navigation"

interface PortalDashboardProps {
  caseData: any;
  documentRequests: any[];
  uploadedDocuments: any[];
  onNavigate?: (tab: "dashboard" | "timeline" | "documents" | "authorizations") => void;
}

export function PortalDashboard({ caseData, documentRequests, uploadedDocuments, onNavigate }: PortalDashboardProps) {
  const router = useRouter();

  const handleNavigate = (tab: "dashboard" | "timeline" | "documents" | "authorizations") => {
    if (onNavigate) {
      onNavigate(tab);
    } else {
      router.push(`/portal/${tab === 'dashboard' ? '' : tab}`);
    }
  };

  const getClientFriendlyStatus = (status: string) => {
    switch (status) {
      case "ACTIVE": return "Documents Being Collected";
      case "REVIEWING": return "Medical Records Under Review";
      case "PENDING": return "Attorney Review";
      case "NEGOTIATING": return "Negotiation";
      default: return "Documents Being Collected";
    }
  }

  const getStatusDescription = (status: string) => {
    switch (status) {
      case "ACTIVE": return "We are currently gathering necessary documents and evidence for your case.";
      case "REVIEWING": return "Your medical records are currently under review by our team.";
      case "PENDING": return "Your legal team is currently reviewing your case to prepare the next steps.";
      case "NEGOTIATING": return "We are currently in negotiations with the opposing party.";
      default: return "We are processing your case information.";
    }
  }

  const pendingRequests = documentRequests.filter(r => r.status === 'PENDING');
  // For demo, assume HIPAA needs signature if there's no specific prop, or check mock data
  const needsHIPAA = true; 

  const recentDocs = uploadedDocuments.slice(0, 3);

  // Mocked Timeline Milestones
  const milestones = [
    { label: "Case Opened", completed: true },
    { label: "Documents Submitted", completed: true },
    { label: "Medical Records Collected", completed: true },
    { label: "Attorney Review", completed: false, active: true },
    { label: "Demand Preparation", completed: false },
    { label: "Negotiation", completed: false },
    { label: "Settlement / Closure", completed: false }
  ];

  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Status & Actions */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Case Status */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 uppercase tracking-wider text-xs font-bold text-slate-500">
              Case Status
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 rounded-full bg-teal-500 animate-pulse" />
                <h3 className="text-xl font-bold text-slate-800">{getClientFriendlyStatus(caseData.status)}</h3>
              </div>
              <p className="text-slate-600 text-sm">{getStatusDescription(caseData.status)}</p>
            </div>
          </div>

          {/* Action Required */}
          <div className="bg-white rounded-xl shadow-sm border border-amber-200 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
            <div className="bg-amber-50/50 px-6 py-4 border-b border-amber-100 uppercase tracking-wider text-xs font-bold text-amber-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Action Required
            </div>
            <div className="p-0 divide-y divide-slate-100">
              
              {pendingRequests.map(req => (
                <div key={req.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      {req.documentName} Requested
                    </h4>
                    <p className="text-sm text-slate-500 mt-1">Please upload your {req.documentName}.</p>
                  </div>
                  <button 
                    onClick={() => handleNavigate('documents')}
                    className="shrink-0 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-teal-500 transition-colors flex items-center gap-2"
                  >
                    <UploadCloud className="w-4 h-4" />
                    Upload Document
                  </button>
                </div>
              ))}

              {needsHIPAA && (
                <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                      <PenTool className="w-4 h-4 text-slate-400" />
                      HIPAA Authorization
                    </h4>
                    <p className="text-sm text-slate-500 mt-1">Signature required to request medical records.</p>
                  </div>
                  <button 
                    onClick={() => handleNavigate('authorizations')}
                    className="shrink-0 px-4 py-2 bg-teal-600 border border-transparent rounded-lg text-sm font-semibold text-white hover:bg-teal-700 transition-colors flex items-center gap-2"
                  >
                    Review & Sign
                  </button>
                </div>
              )}

            </div>
          </div>

          {/* Recent Documents */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <span className="uppercase tracking-wider text-xs font-bold text-slate-500">Recent Documents</span>
              <button onClick={() => handleNavigate('documents')} className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center">
                View All <ChevronRight className="w-3 h-3 ml-1" />
              </button>
            </div>
            <div className="p-0 divide-y divide-slate-100">
              {recentDocs.length > 0 ? recentDocs.map((doc, idx) => (
                <div key={idx} className="p-4 px-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span className="font-medium text-slate-800 text-sm">{doc.name || doc.fileName}</span>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    doc.status === 'Accepted' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {doc.status || "Under Review"}
                  </span>
                </div>
              )) : (
                <div className="p-6 text-center text-slate-500 text-sm">No recent documents uploaded.</div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Timeline */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-6">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <span className="uppercase tracking-wider text-xs font-bold text-slate-500">Case Timeline</span>
              <button onClick={() => handleNavigate('timeline')} className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center">
                Details <ChevronRight className="w-3 h-3 ml-1" />
              </button>
            </div>
            <div className="p-6">
              <div className="relative border-l-2 border-slate-200 ml-3 space-y-6">
                {milestones.map((milestone, idx) => (
                  <div key={idx} className="relative pl-5">
                    {milestone.completed ? (
                      <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                    ) : milestone.active ? (
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-4 border-teal-500" />
                    ) : (
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-slate-300" />
                    )}
                    
                    <span className={`text-sm font-medium ${
                      milestone.completed ? 'text-slate-800' : milestone.active ? 'text-teal-700 font-bold' : 'text-slate-400'
                    }`}>
                      {milestone.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
