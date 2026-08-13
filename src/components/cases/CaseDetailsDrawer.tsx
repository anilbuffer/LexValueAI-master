import React from 'react'
import { X, Briefcase, User, FileText as FileTextIcon, Download, AlertTriangle, Users, Loader2, CheckCircle, XCircle } from 'lucide-react'

interface CaseDetailsDrawerProps {
  selectedCase: any
  setSelectedCase: (c: any) => void
  formatDate: (dateString: string) => string
  currentUserId?: string
}

export function CaseDetailsDrawer({ selectedCase, setSelectedCase, formatDate, currentUserId }: CaseDetailsDrawerProps) {
  if (!selectedCase) return null

  const formatPhone = (phone: string | null | undefined) => {
    if (!phone) return "N/A"
    const cleaned = ('' + phone).replace(/\D/g, '')
    // Handle 10 digit or 11 digit (starting with 1) US numbers
    const match = cleaned.match(/^(?:1)?(\d{3})(\d{3})(\d{4})$/)
    if (match) return '+1 (' + match[1] + ') ' + match[2] + '-' + match[3]
    return phone
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-40 transition-opacity" onClick={() => setSelectedCase(null)}></div>
      <div className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-white shadow-2xl z-50 transform transition-transform duration-300 translate-x-0 border-l border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Case Details</h2>
          <button onClick={() => setSelectedCase(null)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-8">

          {/* Case Info */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> Case Information
            </h3>
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm grid grid-cols-2 gap-y-5 gap-x-4">
              <div className="col-span-2">
                <div className="text-[13px] text-slate-500 font-medium mb-1">Case Title</div>
                <div className="text-[15px] font-semibold text-slate-800">{selectedCase.title}</div>
              </div>
              <div>
                <div className="text-[13px] text-slate-500 font-medium mb-1">Case ID</div>
                <div className="text-[15px] font-medium text-slate-800 font-mono">{selectedCase.referenceId || 'N/A'}</div>
              </div>
              <div>
                <div className="text-[13px] text-slate-500 font-medium mb-1">Category</div>
                <div className="text-[15px] font-medium text-slate-800">{selectedCase.type}</div>
              </div>
              <div>
                <div className="text-[13px] text-slate-500 font-medium mb-1">Date of Incident</div>
                <div className="text-[15px] font-medium text-slate-800">{formatDate(selectedCase.dateOfInjury)}</div>
              </div>
              <div>
                <div className="text-[13px] text-slate-500 font-medium mb-2">Status</div>
                <div className="text-[15px] font-medium text-slate-800">
                  {selectedCase.status === 'Closed' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
                      Closed
                    </span>
                  ) : selectedCase.approvalStatus === 'PENDING' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100/60 text-amber-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                      Pending Approval
                    </span>
                  ) : selectedCase.approvalStatus === 'REJECTED' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100/60 text-rose-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                      Rejected
                    </span>
                  ) : selectedCase.approvalStatus === 'APPROVED' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100/60 text-blue-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      Approved
                    </span>
                  ) : selectedCase.status === "Ready" ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100/60 text-emerald-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      Ready
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100/60 text-amber-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                      {selectedCase.status || "Processing"}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-[13px] text-slate-500 font-medium mb-2">Scan Status</div>
                <div className="text-[15px] font-medium text-slate-800">
                  {(selectedCase.flags !== null && selectedCase.flags !== undefined) || selectedCase.status === 'READY' || selectedCase.status === 'Closed' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 border border-emerald-100 text-emerald-600">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Scan Completed
                    </span>
                  ) : selectedCase.status === 'FAILED' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 border border-rose-100 text-rose-600">
                      <XCircle className="w-3.5 h-3.5" />
                      Scan Failed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Scanning...
                    </span>
                  )}
                </div>
              </div>
              {selectedCase.customPrompt && (
                <div className="col-span-2">
                  <div className="text-[13px] text-slate-500 font-medium mb-1">Custom Instructions</div>
                  <div className="text-[14px] font-medium text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">{selectedCase.customPrompt}</div>
                </div>
              )}
              {selectedCase.approvalStatus === 'REJECTED' && selectedCase.rejectionReason && (
                <div className="col-span-2 bg-rose-50 border border-rose-200 rounded-lg p-4">
                  <div className="text-[15px] text-rose-800 font-bold mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-5 h-5" /> Reason for Rejection
                  </div>
                  <div className="text-[14px] font-normal text-rose-900 leading-normal">{selectedCase.rejectionReason}</div>
                </div>
              )}
            </div>
          </div>

          {/* Client Info */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4" /> Client Information
            </h3>
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm grid grid-cols-2 gap-y-5 gap-x-4">
              <div className="col-span-2">
                <div className="text-[13px] text-slate-500 font-medium mb-1">Full Name</div>
                <div className="text-[15px] font-semibold text-slate-800">{selectedCase.client}</div>
              </div>
              <div>
                <div className="text-[13px] text-slate-500 font-medium mb-1">Email Address</div>
                <div className="text-[14px] font-medium text-slate-800 break-all">{selectedCase.clientEmail}</div>
              </div>
              <div>
                <div className="text-[13px] text-slate-500 font-medium mb-1">Phone Number</div>
                <div className="text-[15px] font-medium text-slate-800">{formatPhone(selectedCase.clientPhone)}</div>
              </div>
              <div>
                <div className="text-[13px] text-slate-500 font-medium mb-1">Age</div>
                <div className="text-[15px] font-medium text-slate-800">{selectedCase.clientAge} years</div>
              </div>
              <div>
                <div className="text-[13px] text-slate-500 font-medium mb-1">Gender</div>
                <div className="text-[15px] font-medium text-slate-800">{selectedCase.clientGender}</div>
              </div>
              <div className="col-span-2">
                <div className="text-[13px] text-slate-500 font-medium mb-1">Residential Address</div>
                <div className="text-[15px] font-medium text-slate-800 leading-relaxed">{selectedCase.clientAddress}</div>
              </div>
            </div>
          </div>

          {/* Assignment Info */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4" /> Assignment Information
            </h3>
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
              <div>
                <div className="text-[13px] text-slate-500 font-medium mb-2">Assigned Users</div>
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    const allAssignees: any[] = [];
                    if (selectedCase.createdByUser && (selectedCase.createdByUser.role === 'PARALEGAL' || selectedCase.createdByUser.role === 'ATTORNEY')) {
                      allAssignees.push(selectedCase.createdByUser);
                      if (selectedCase.createdByUser.attorney) {
                        allAssignees.push(selectedCase.createdByUser.attorney);
                      }
                      if (selectedCase.createdByUser.managingPartner) {
                        allAssignees.push(selectedCase.createdByUser.managingPartner);
                      }
                    }
                    if (selectedCase.assignedUsers && selectedCase.assignedUsers.length > 0) {
                      allAssignees.push(...selectedCase.assignedUsers);
                    }

                    const uniqueAssignees = Array.from(new Map(allAssignees.filter(Boolean).map(item => [item.id || item.firstName, item])).values())
                      .filter((u: any) => u.id !== currentUserId);

                    return uniqueAssignees.length > 0 ? (
                      uniqueAssignees.map((user: any) => (
                        <span key={user.id || user.firstName} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg">
                          {user.firstName} {user.lastName}
                          <span className="text-slate-400 font-normal ml-1">
                            ({user.role === 'ATTORNEY' ? 'Attorney' : user.role === 'PARALEGAL' ? 'Paralegal' : user.role === 'MANAGING_PARTNER' ? 'Managing Partner' : user.role})
                          </span>
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-400 italic">Unassigned</span>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Attached Documents */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <FileTextIcon className="w-4 h-4" /> Attached Documents
            </h3>
            {selectedCase.documents && selectedCase.documents.length > 0 ? (
              selectedCase.documents.map((doc: any) => (
                <div key={doc.id} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center gap-3 group">
                  <div className="w-10 h-10 bg-rose-50 border border-rose-100 rounded-lg flex items-center justify-center text-rose-500 shrink-0">
                    <FileTextIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[14px] font-semibold text-slate-800">{doc.fileName}</div>
                    <div className="text-[12px] font-medium text-slate-500 mt-0.5">
                      {(doc.size / (1024 * 1024)).toFixed(1)} MB • Uploaded on {formatDate(doc.createdAt)}
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        alert("Mock Download: In a real app, this would download the file.");
                      } catch (e) {
                        console.error('Failed to download document:', e)
                      }
                    }}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-teal-600 transition-colors cursor-pointer"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-500 italic p-4 bg-slate-50 rounded-xl border border-slate-200">
                No documents attached yet.
              </div>
            )}
          </div>

        </div>

        <div className="p-6 border-t border-slate-100 bg-white">
          <button onClick={() => setSelectedCase(null)} className="w-full h-[46px] flex items-center justify-center bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-[10px] hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer">
            Close
          </button>
        </div>
      </div>
    </>
  )
}
