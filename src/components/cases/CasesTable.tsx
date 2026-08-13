import React, { useState, useRef, useEffect } from 'react'
import { FolderOpen, Calendar, Loader2, Eye, FileText, Activity, XCircle, ChevronDown, CheckCircle, XOctagon, RefreshCw, Info, Trash2 } from "lucide-react"
import Link from 'next/link'

interface CasesTableProps {
  isLoading: boolean
  currentCases: any[]
  formatDate: (dateString: string) => string
  setSelectedCase: (c: any) => void
  setSummaryCase: (c: any) => void
  onCloseCase?: (c: any) => void
  userRole?: string | null
  selectedCaseIds?: string[]
  onToggleCaseSelection?: (caseId: string) => void
  onToggleAllSelection?: (allIds: string[]) => void
  onApproveCase?: (c: any) => void
  onRejectCase?: (c: any) => void
  onResubmitCase?: (c: any) => void
  onDeleteCase?: (c: any) => void
  currentUserId?: string
}

import { createPortal } from 'react-dom'

function ActionDropdown({ c, userRole, onCloseCase, setSelectedCase, setSummaryCase, onApproveCase, onRejectCase, onResubmitCase }: any) {
  const [isOpen, setIsOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, right: 0 })
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Allow closing if clicked outside
      if (!event.target) return;
      const target = event.target as HTMLElement;
      if (!target.closest('.action-dropdown-menu') && btnRef.current && !btnRef.current.contains(target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const updateCoords = () => {
      if (btnRef.current) {
        const rect = btnRef.current.getBoundingClientRect()
        setCoords({ top: rect.bottom + 4, right: window.innerWidth - rect.right })
      }
    }
    updateCoords()
    window.addEventListener('scroll', updateCoords, true)
    window.addEventListener('resize', updateCoords)
    return () => {
      window.removeEventListener('scroll', updateCoords, true)
      window.removeEventListener('resize', updateCoords)
    }
  }, [isOpen])

  const isScanCompleted = (c.flags !== null && c.flags !== undefined) || c.status === 'READY' || c.status === 'Closed';

  return (
    <>
      <button
        ref={btnRef}
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen) }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-[8px] hover:bg-slate-50 shadow-sm transition-all cursor-pointer"
      >
        <span>Actions</span>
        <ChevronDown className="w-3.5 h-3.5" />
      </button>

      {isOpen && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed w-36 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-[9999] action-dropdown-menu animate-in fade-in zoom-in-95 duration-100"
          style={{ top: coords.top, right: coords.right }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); setSelectedCase(c); }}
            className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            View Details
          </button>

          {isScanCompleted && (
            <button
              onClick={(e) => { e.stopPropagation(); setIsOpen(false); setSummaryCase(c); }}
              className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              View Summary
            </button>
          )}

          {c.status !== "Closed" && userRole === 'MANAGING_PARTNER' && onCloseCase && isScanCompleted && (
            <button
              onClick={(e) => { e.stopPropagation(); setIsOpen(false); onCloseCase(c); }}
              className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 border-t border-slate-100 mt-1 pt-2 cursor-pointer"
            >
              <XCircle className="w-3.5 h-3.5" />
              Close Case
            </button>
          )}

          {c.approvalStatus === 'PENDING' && userRole === 'ATTORNEY' && isScanCompleted && (
            <div className="border-t border-slate-100 mt-1 pt-1">
              {onApproveCase && (
                <button
                  onClick={(e) => { e.stopPropagation(); setIsOpen(false); onApproveCase(c); }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Approve
                </button>
              )}
              {onRejectCase && (
                <button
                  onClick={(e) => { e.stopPropagation(); setIsOpen(false); onRejectCase(c); }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                >
                  <XOctagon className="w-3.5 h-3.5" />
                  Reject
                </button>
              )}
            </div>
          )}

          {c.approvalStatus === 'REJECTED' && userRole === 'PARALEGAL' && onResubmitCase && (
            <div className="border-t border-slate-100 mt-1 pt-1">
              <button
                onClick={(e) => { e.stopPropagation(); setIsOpen(false); onResubmitCase(c); }}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Resubmit
              </button>
            </div>
          )}
        </div>,
        document.body
      )}
    </>
  )
}

function ScanProgressPopover({ progress, stage }: { progress: number, stage: string }) {
  const [isHovered, setIsHovered] = useState(false)
  const [coords, setCoords] = useState({ bottom: 0, left: 0 })
  const btnRef = useRef<HTMLDivElement>(null)

  const stages = [
    { key: "TEXT_EXTRACTION", label: "Reading Documents" },
    { key: "VECTOR_EMBEDDING", label: "Organizing Case Data" },
    { key: "AI_ANALYSIS", label: "Generating AI Insights" },
  ];

  let currentStageIndex = -1;
  if (stage === "TEXT_EXTRACTION") currentStageIndex = 0;
  else if (stage === "VECTOR_EMBEDDING") currentStageIndex = 1;
  else if (stage === "AI_ANALYSIS") currentStageIndex = 2;
  else if (stage === "COMPLETED") currentStageIndex = 3;

  useEffect(() => {
    if (!isHovered) return
    const updateCoords = () => {
      if (btnRef.current) {
        const rect = btnRef.current.getBoundingClientRect()
        setCoords({ 
          bottom: window.innerHeight - rect.top + 8, 
          left: rect.left + rect.width / 2 
        })
      }
    }
    updateCoords()
    window.addEventListener('scroll', updateCoords, true)
    window.addEventListener('resize', updateCoords)
    return () => {
      window.removeEventListener('scroll', updateCoords, true)
      window.removeEventListener('resize', updateCoords)
    }
  }, [isHovered])

  return (
    <div 
      className="inline-flex items-center ml-1"
      ref={btnRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Info className="w-4 h-4 text-slate-400 hover:text-teal-600 cursor-help transition-colors" />
      
      {isHovered && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed w-64 bg-slate-800 text-white text-xs rounded-xl shadow-xl z-[9999] p-4 border border-slate-700 animate-in fade-in zoom-in-95 duration-150"
          style={{ bottom: coords.bottom, left: coords.left, transform: 'translateX(-50%)', pointerEvents: 'none' }}
        >
          <div className="flex justify-between items-center mb-3">
            <span className="font-bold text-slate-200">Scan Progress</span>
            <span className="font-mono text-teal-400 font-bold">{progress || 0}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-700 h-1.5 rounded-full mb-4 overflow-hidden">
            <div className="bg-teal-500 h-full transition-all duration-500 ease-out" style={{ width: `${progress || 0}%` }}></div>
          </div>

          <div className="flex flex-col gap-2.5">
            {stages.map((s, idx) => {
              const isCompleted = currentStageIndex > idx || stage === "COMPLETED";
              const isCurrent = currentStageIndex === idx;

              return (
                <div key={s.key} className="flex items-center gap-2">
                  {isCompleted ? (
                    <CheckCircle className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin shrink-0" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0 flex items-center justify-center text-[8px] text-slate-500">-</div>
                  )}
                  <span className={`font-medium ${isCompleted ? 'text-slate-300' : isCurrent ? 'text-white' : 'text-slate-500'}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Triangle pointer */}
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-800"></div>
        </div>,
        document.body
      )}
    </div>
  )
}

export function CasesTable({
  isLoading, currentCases, formatDate, setSelectedCase, setSummaryCase,
  onCloseCase, userRole, selectedCaseIds, onToggleCaseSelection, onToggleAllSelection,
  onApproveCase, onRejectCase, onResubmitCase, onDeleteCase, currentUserId
}: CasesTableProps) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[1000px] text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200/60">
            {selectedCaseIds && onToggleCaseSelection && (
              <th className="py-4 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider w-10 align-middle whitespace-nowrap">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-600 cursor-pointer"
                    checked={currentCases.length > 0 && selectedCaseIds.length === currentCases.length}
                    onChange={(e) => {
                      if (onToggleAllSelection) {
                        onToggleAllSelection(e.target.checked ? currentCases.map(c => c.id) : [])
                      }
                    }}
                  />
                </div>
              </th>
            )}
            <th className="py-4 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Case ID</th>
            <th className="py-4 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Case Name</th>
            <th className="py-4 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Client</th>
            <th className="py-4 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Category</th>
            <th className="py-4 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Date of Incident</th>
            <th className="py-4 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Scan Status</th>
            <th className="py-4 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Assigned To</th>
            <th className="py-4 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Status</th>
            <th className="py-4 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider text-right whitespace-nowrap">Action</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={selectedCaseIds ? 10 : 9} className="py-16 text-center">
                <div className="flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 text-teal-600 animate-spin mb-4" />
                  <h3 className="text-base font-bold text-slate-800">Loading cases...</h3>
                </div>
              </td>
            </tr>
          ) : currentCases.length === 0 ? (
            <tr>
              <td colSpan={selectedCaseIds ? 10 : 9} className="py-16 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-4">
                    <FolderOpen className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">No cases found</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">We couldn&apos;t find any cases matching your criteria.</p>
                </div>
              </td>
            </tr>
          ) : (
            currentCases.map((c) => (
              <tr key={c.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors group">
                {selectedCaseIds && onToggleCaseSelection && (
                  <td className="py-4 px-2 align-middle whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-600 cursor-pointer"
                        checked={selectedCaseIds.includes(c.id)}
                        onChange={() => onToggleCaseSelection(c.id)}
                      />
                    </div>
                  </td>
                )}
                <td className="py-4 px-2 align-middle whitespace-nowrap">
                  <span className="text-sm font-medium text-slate-600 font-mono">{c.referenceId}</span>
                </td>
                <td className="py-4 px-2 align-middle whitespace-nowrap">
                  <span className="text-sm font-bold text-slate-800 group-hover:text-teal-600 transition-colors">{c.title}</span>
                </td>
                <td className="py-4 px-2 whitespace-nowrap">
                  <span className="text-sm font-medium text-slate-600">{c.client}</span>
                </td>
                <td className="py-4 px-2 whitespace-nowrap">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700">
                    {c.type}
                  </span>
                </td>
                <td className="py-4 px-2 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-sm font-medium">{formatDate(c.dateOfInjury)}</span>
                  </div>
                </td>
                <td className="py-4 px-2 whitespace-nowrap">
                  {(c.flags !== null && c.flags !== undefined) || c.status === 'READY' || c.status === 'Closed' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 border border-emerald-100 text-emerald-600">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Scan Completed
                    </span>
                  ) : c.status === 'FAILED' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 border border-rose-100 text-rose-600">
                      <XCircle className="w-3.5 h-3.5" />
                      Scan Failed
                    </span>
                  ) : (
                    <div className="inline-flex items-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Scanning...
                      </span>
                      <ScanProgressPopover progress={c.scanProgress} stage={c.scanStage} />
                    </div>
                  )}
                </td>
                <td className="py-4 px-2 whitespace-nowrap">
                  <div className="flex flex-col gap-1">
                    {(() => {
                      const allAssignees: any[] = [];
                      if (c.createdByUser && (c.createdByUser.role === 'PARALEGAL' || c.createdByUser.role === 'ATTORNEY')) {
                        allAssignees.push(c.createdByUser);
                        if (c.createdByUser.attorney) {
                          allAssignees.push(c.createdByUser.attorney);
                        }
                        if (c.createdByUser.managingPartner) {
                          allAssignees.push(c.createdByUser.managingPartner);
                        }
                      }
                      if (c.assignedUsers && c.assignedUsers.length > 0) {
                        allAssignees.push(...c.assignedUsers);
                      }

                      // Remove duplicates by ID and exclude the logged in user
                      const uniqueAssignees = Array.from(new Map(allAssignees.filter(Boolean).map(item => [item.id || item.firstName, item])).values())
                        .filter((u: any) => u.id !== currentUserId);

                      return uniqueAssignees.length > 0 ? (
                        uniqueAssignees.map((user: any) => (
                          <div key={user.id || user.firstName} className="inline-flex items-center gap-1">
                            <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                              {user.firstName} {user.lastName}
                              <span className="text-slate-400 font-normal ml-1">
                                ({user.role === 'ATTORNEY' ? 'A' : user.role === 'PARALEGAL' ? 'P' : user.role === 'MANAGING_PARTNER' ? 'MP' : user.role})
                              </span>
                            </span>
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">Unassigned</span>
                      );
                    })()}
                  </div>
                </td>
                <td className="py-4 px-2 whitespace-nowrap">
                  {c.status === 'Closed' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
                      Closed
                    </span>
                  ) : c.approvalStatus === 'PENDING' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100/60 text-amber-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                      Pending Approval
                    </span>
                  ) : c.approvalStatus === 'REJECTED' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100/60 text-rose-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                      Rejected
                    </span>
                  ) : c.approvalStatus === 'APPROVED' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100/60 text-blue-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      Approved
                    </span>
                  ) : c.status === "Ready" ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100/60 text-emerald-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      Ready
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100/60 text-amber-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                      Processing
                    </span>
                  )}
                </td>
                <td className="py-4 px-2 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    {(() => {
                      const isScanCompleted = (c.flags !== null && c.flags !== undefined) || c.status === 'READY' || c.status === 'Closed';

                      return (
                        <>
                          {isScanCompleted && (
                            <ActionDropdown
                              c={c}
                              userRole={userRole}
                              onCloseCase={onCloseCase}
                              setSelectedCase={setSelectedCase}
                              setSummaryCase={setSummaryCase}
                              onApproveCase={onApproveCase}
                              onRejectCase={onRejectCase}
                              onResubmitCase={onResubmitCase}
                            />
                          )}

                          {!isScanCompleted ? (
                            <div className="flex items-center gap-2">
                              {c.scanStage === 'FAILED' && (
                                <button onClick={async (e) => { 
                                  e.stopPropagation(); 
                                  try {
                                    setTimeout(() => {
                                      window.location.reload();
                                    }, 500);
                                  } catch (err) { console.error('Failed to rescan', err); }
                                }} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 text-white text-xs font-bold rounded-[8px] hover:bg-teal-700 shadow-sm transition-all cursor-pointer">
                                  <RefreshCw className="w-3.5 h-3.5" />
                                  Rescan
                                </button>
                              )}
                              <button onClick={(e) => { e.stopPropagation(); setSelectedCase(c); }} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 text-white text-xs font-bold rounded-[8px] hover:bg-teal-700 shadow-sm transition-all cursor-pointer">
                                <Eye className="w-3.5 h-3.5" />
                                View Details
                              </button>
                            </div>
                          ) : (
                            <Link href={`/cases/${c.id}/timeline`} onClick={(e) => e.stopPropagation()}>
                              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 text-white text-xs font-bold rounded-[8px] hover:bg-teal-700 shadow-sm transition-all cursor-pointer">
                                <Activity className="w-3.5 h-3.5" />
                                View Analysis
                              </button>
                            </Link>
                          )}

                          {userRole === 'ADMIN' && onDeleteCase && (
                            <button onClick={(e) => {
                              e.stopPropagation();
                              onDeleteCase(c);
                            }} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 text-xs font-bold rounded-[8px] hover:bg-red-100 shadow-sm transition-all cursor-pointer">
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
