"use client"
import { CustomDatePicker } from '@/components/ui/CustomDatePicker'

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight, Search, Filter, Loader2, AlertTriangle, X, CheckCircle2, RefreshCw } from "lucide-react"
import { getUserRole, getCurrentUserId } from "@/app/actions/auth"
import useSWR from 'swr'
import { CaseSummaryDrawer } from "@/components/modals/CaseSummaryDrawer"
import { CasesTable } from "@/components/cases/CasesTable"
import { CaseDetailsDrawer } from "@/components/cases/CaseDetailsDrawer"
import { CloseCaseModal } from "@/components/modals/CloseCaseModal"
import { DeleteCaseModal } from "@/components/cases/DeleteCaseModal"
import { closeCase } from "@/app/actions/cases"
import toast from "react-hot-toast"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function CasesPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCase, setSelectedCase] = useState<any>(null)
  const [summaryCase, setSummaryCase] = useState<any>(null)
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState({ pending: false, approved: false, rejected: false, closed: false })
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [dateFilter, setDateFilter] = useState({ from: "", to: "" })

  const searchParams = useSearchParams();
  const query = searchParams.get("search");

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
      setDebouncedSearch(query);
    } else {
      setSearchQuery("");
      setDebouncedSearch("");
    }
  }, [query]);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false)
  const [caseToClose, setCaseToClose] = useState<any>(null)
  const [isClosing, setIsClosing] = useState(false)
  const [caseToDelete, setCaseToDelete] = useState<any>(null)
  const [isDeletingCase, setIsDeletingCase] = useState(false)
  const [role, setRole] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  // Assignment state
  const [selectedCaseIds, setSelectedCaseIds] = useState<string[]>([])
  const [subordinates, setSubordinates] = useState<any[]>([])
  const [assignMpId, setAssignMpId] = useState<string>('')
  const [assignAttorneyId, setAssignAttorneyId] = useState<string>('')
  const [assignParalegalId, setAssignParalegalId] = useState<string>('')
  const [isAssigning, setIsAssigning] = useState(false)

  // Rejection modal state
  const [rejectCaseTarget, setRejectCaseTarget] = useState<any>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [isRejecting, setIsRejecting] = useState(false)

  // Approval modal state
  const [approveCaseTarget, setApproveCaseTarget] = useState<any>(null)
  const [isApproving, setIsApproving] = useState(false)

  // Resubmit modal state
  const [resubmitCaseTarget, setResubmitCaseTarget] = useState<any>(null)
  const [isResubmitting, setIsResubmitting] = useState(false)

  const ITEMS_PER_PAGE = 10
  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setCurrentPage(1)
    }, 500)
    return () => clearTimeout(handler)
  }, [searchQuery])

  const apiUrl = `/api/cases?page=${currentPage}&limit=${ITEMS_PER_PAGE}&search=${encodeURIComponent(debouncedSearch)}&statusPending=${statusFilter.pending}&statusApproved=${statusFilter.approved}&statusRejected=${statusFilter.rejected}&statusClosed=${statusFilter.closed}&category=${encodeURIComponent(categoryFilter)}&fromDate=${dateFilter.from}&toDate=${dateFilter.to}`
  const { data, isLoading, mutate } = useSWR(apiUrl, fetcher, { keepPreviousData: true, refreshInterval: 20000 })

  const currentCases: any[] = data?.success ? data.cases : []
  const totalPages = data?.totalPages || 0
  const totalCases = data?.total || 0

  useEffect(() => {
    getUserRole().then(setRole)
    getCurrentUserId().then(setCurrentUserId)
  }, [])

  useEffect(() => {
    if (role === 'MANAGING_PARTNER' || role === 'ATTORNEY') {
      fetch('/api/users/subordinates')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setSubordinates(data.users)
          }
        })
        .catch(e => console.error("Failed to fetch subordinates", e))
    }
  }, [role])

  const handleAssignCases = async () => {
    if (selectedCaseIds.length === 0) return
    if (!assignAttorneyId || !assignParalegalId) {
      toast.error('Both Attorney and Paralegal must be selected')
      return
    }

    setIsAssigning(true)
    try {
      const userIds = []
      if (assignAttorneyId) userIds.push(assignAttorneyId)
      if (assignParalegalId) userIds.push(assignParalegalId)

      const res = await fetch('/api/cases/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseIds: selectedCaseIds, userIds })
      })

      const data = await res.json()
      if (data.success) {
        toast.success(`Assigned ${selectedCaseIds.length} case(s) successfully!`)
        setSelectedCaseIds([])
        setAssignAttorneyId('')
        setAssignParalegalId('')
        mutate()
      } else {
        toast.error(data.error || 'Failed to assign cases')
      }
    } catch (e) {
      toast.error('An error occurred during assignment')
    } finally {
      setIsAssigning(false)
    }
  }

  const toggleCaseSelection = (caseId: string) => {
    setSelectedCaseIds(prev =>
      prev.includes(caseId) ? prev.filter(id => id !== caseId) : [...prev, caseId]
    )
  }

  const handleApproveCase = (c: any) => {
    setApproveCaseTarget(c)
  }

  const submitApproveCase = async () => {
    if (!approveCaseTarget) return
    setIsApproving(true)
    try {
      const res = await fetch('/api/cases/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId: approveCaseTarget.id, action: 'APPROVE' })
      })
      if (!res.ok) throw new Error('Failed to approve')
      toast.success('Case approved successfully')
      mutate()
      setApproveCaseTarget(null)
    } catch (error) {
      toast.error('Failed to approve case')
    } finally {
      setIsApproving(false)
    }
  }

  const handleRejectCase = (c: any) => {
    setRejectCaseTarget(c)
    setRejectReason("")
  }

  const submitRejectCase = async () => {
    if (!rejectCaseTarget) return
    setIsRejecting(true)
    try {
      const res = await fetch('/api/cases/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId: rejectCaseTarget.id, action: 'REJECT', rejectionReason: rejectReason })
      })
      if (!res.ok) throw new Error('Failed to reject')
      toast.success('Case rejected successfully')
      mutate()
      setRejectCaseTarget(null)
    } catch (error) {
      toast.error('Failed to reject case')
    } finally {
      setIsRejecting(false)
    }
  }

  const handleResubmitCase = (c: any) => {
    setResubmitCaseTarget(c)
  }

  const submitResubmitCase = async () => {
    if (!resubmitCaseTarget) return
    setIsResubmitting(true)
    try {
      const res = await fetch('/api/cases/resubmit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId: resubmitCaseTarget.id })
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to resubmit')
      }
      toast.success('Case resubmitted successfully for approval')
      mutate()
      setResubmitCaseTarget(null)
    } catch (error: any) {
      toast.error(error.message || 'Failed to resubmit case')
    } finally {
      setIsResubmitting(false)
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + currentCases.length

  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages)
      }
    }
    return pages
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  // Helper to format date
  const formatDate = (dateString: string) => {
    const d = new Date(dateString)
    return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
  }

  const handleCloseCase = async () => {
    if (!caseToClose) return;
    setIsClosing(true);
    try {
      await closeCase(caseToClose.id);
      toast.success("Case marked as closed successfully");
      setIsCloseModalOpen(false);
      setCaseToClose(null);
      mutate(); // Refresh the list
    } catch (error: any) {
      toast.error(error.message || "Failed to close case");
    } finally {
      setIsClosing(false);
    }
  }

  const handleDeleteCase = (c: any) => {
    setCaseToDelete(c);
  }

  const confirmDeleteCase = async () => {
    if (!caseToDelete) return;
    setIsDeletingCase(true);
    try {
      const res = await fetch(`/api/cases?id=${caseToDelete.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete case');
      }
      toast.success('Case deleted successfully');
      setCaseToDelete(null);
      mutate();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete case');
    } finally {
      setIsDeletingCase(false);
    }
  }

  return (
    <div className="w-full p-2.5 pb-[15px] font-sans relative flex flex-col gap-[15px]">

      {/* Main Container matching the dashboard theme */}
      <div className="bg-white rounded-2xl shadow-md shadow-slate-200/50 border border-slate-200/50 p-5 flex flex-col gap-[20px]">

        {/* Header Section */}
        <div className="flex flex-col min-[992px]:flex-row min-[992px]:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight max-[991px]:text-center">Cases & AI analysis</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium max-[991px]:text-center">Upload medical records, generate chronologies, review flags.</p>
          </div>

          <div className="flex max-[991px]:flex-col items-center gap-3 max-[991px]:w-full">

            <div className="relative w-72 max-[991px]:w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search cases..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="block w-full h-12 pl-12 pr-3 border border-slate-200 rounded-lg text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all cursor-text text-sm"
              />
            </div>
            <div className="relative max-[991px]:w-full" ref={filterRef}>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center max-[991px]:justify-center gap-2 px-4 h-12 rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-sm font-medium transition-all hover:cursor-pointer max-[991px]:w-full"
              >
                <Filter className="w-5 h-5 text-slate-400" />
                Filter
              </button>

              {/* Filter Dropdown */}
              {isFilterOpen && (
                <div className="absolute right-0 top-full mt-2 w-full sm:w-[400px] bg-white border border-slate-200 rounded-xl shadow-lg shadow-slate-200/50 z-50">
                  <div className="p-6">
                    {/* Status Filter */}
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Status</label>
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" checked={statusFilter.pending} onChange={(e) => { setStatusFilter({ ...statusFilter, pending: e.target.checked }); setCurrentPage(1); }} className="rounded border-slate-300 text-teal-600 focus:ring-teal-600 focus:ring-offset-0 cursor-pointer" />
                        <span className="text-sm text-slate-700 font-medium group-hover:text-teal-700 transition-colors">Pending Approval</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" checked={statusFilter.approved} onChange={(e) => { setStatusFilter({ ...statusFilter, approved: e.target.checked }); setCurrentPage(1); }} className="rounded border-slate-300 text-teal-600 focus:ring-teal-600 focus:ring-offset-0 cursor-pointer" />
                        <span className="text-sm text-slate-700 font-medium group-hover:text-teal-700 transition-colors">Approved</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" checked={statusFilter.rejected} onChange={(e) => { setStatusFilter({ ...statusFilter, rejected: e.target.checked }); setCurrentPage(1); }} className="rounded border-slate-300 text-teal-600 focus:ring-teal-600 focus:ring-offset-0 cursor-pointer" />
                        <span className="text-sm text-slate-700 font-medium group-hover:text-teal-700 transition-colors">Rejected</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" checked={statusFilter.closed} onChange={(e) => { setStatusFilter({ ...statusFilter, closed: e.target.checked }); setCurrentPage(1); }} className="rounded border-slate-300 text-teal-600 focus:ring-teal-600 focus:ring-offset-0 cursor-pointer" />
                        <span className="text-sm text-slate-700 font-medium group-hover:text-teal-700 transition-colors">Closed</span>
                      </label>
                    </div>

                    <div className="h-px bg-slate-100 my-4 w-full"></div>

                    {/* Category Filter */}
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Category</div>
                    <select
                      value={categoryFilter}
                      onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 bg-white cursor-pointer"
                    >
                      <option value="All">All Categories</option>
                      <option value="Personal Injury">Personal Injury</option>
                      <option value="Medical Malpractice">Medical Malpractice</option>
                      <option value="Criminal">Criminal</option>
                      <option value="Other">Other</option>
                    </select>

                    <div className="h-px bg-slate-100 my-4 w-full"></div>

                    {/* Date Filter */}
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Date of Incident</div>
                    <div className="flex flex-col min-[480px]:flex-row gap-4">
                      <div className="flex-1 flex flex-col gap-2">
                        <label className="text-[13px] font-semibold text-slate-600">From</label>
                        <CustomDatePicker
                          type="date"
                          value={dateFilter.from}
                          onChange={(e: any) => { setDateFilter(prev => ({ ...prev, from: e.target.value })); setCurrentPage(1); }}
                          className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all cursor-pointer bg-white"
                        />
                      </div>
                      <div className="flex-1 flex flex-col gap-2">
                        <label className="text-[13px] font-semibold text-slate-600">To</label>
                        <CustomDatePicker
                          type="date"
                          value={dateFilter.to}
                          onChange={(e: any) => { setDateFilter(prev => ({ ...prev, to: e.target.value })); setCurrentPage(1); }}
                          className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all cursor-pointer bg-white"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => {
                          setStatusFilter({ pending: false, approved: false, rejected: false, closed: false });
                          setCategoryFilter("All");
                          setDateFilter({ from: "", to: "" });
                          setCurrentPage(1);
                        }}
                        className="text-xs font-semibold text-teal-600 hover:text-teal-700 hover:underline cursor-pointer"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bulk Action Bar */}
        {selectedCaseIds.length > 0 && role === 'MANAGING_PARTNER' && (
          <div className="w-full flex flex-col sm:flex-row items-center justify-start bg-teal-50/50 p-4 rounded-xl border border-teal-100 gap-4 mt-2">
            <span className="text-sm font-bold text-teal-900 mr-2">{selectedCaseIds.length} Case{selectedCaseIds.length > 1 ? 's' : ''} Selected</span>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <select
                className="w-full sm:w-auto h-12 px-4 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all cursor-pointer min-w-[200px]"
                value={assignAttorneyId}
                onChange={e => {
                  setAssignAttorneyId(e.target.value);
                  setAssignParalegalId(""); // Reset paralegal when attorney changes
                }}
              >
                <option value="">Select Attorney</option>
                {subordinates.filter(u => u.role === 'ATTORNEY').map(u => (
                  <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>
                ))}
              </select>

              {assignAttorneyId && (
                <select
                  className="w-full sm:w-auto h-12 px-4 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all cursor-pointer min-w-[200px]"
                  value={assignParalegalId}
                  onChange={e => setAssignParalegalId(e.target.value)}
                >
                  <option value="">Select Paralegal</option>
                  {subordinates.filter(u => u.role === 'PARALEGAL' && u.attorneyId === assignAttorneyId).map(u => (
                    <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>
                  ))}
                </select>
              )}

              <button
                onClick={handleAssignCases}
                disabled={isAssigning || (!assignAttorneyId || !assignParalegalId)}
                className="w-full sm:w-auto h-12 flex justify-center items-center px-6 border border-transparent rounded-lg text-sm font-medium text-white bg-teal-900 hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-900 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isAssigning ? <Loader2 className="w-5 h-5 animate-spin" /> : "Assign Cases"}
              </button>
            </div>
          </div>
        )}

        {/* Table Section */}
        <CasesTable
          isLoading={isLoading || currentUserId === null}
          currentCases={currentCases}
          formatDate={formatDate}
          setSelectedCase={setSelectedCase}
          setSummaryCase={setSummaryCase}
          onCloseCase={(c) => { setCaseToClose(c); setIsCloseModalOpen(true); }}
          userRole={role}
          selectedCaseIds={role === 'MANAGING_PARTNER' ? selectedCaseIds : undefined}
          onToggleCaseSelection={role === 'MANAGING_PARTNER' ? toggleCaseSelection : undefined}
          onToggleAllSelection={role === 'MANAGING_PARTNER' ? setSelectedCaseIds : undefined}
          onRejectCase={(c) => setRejectCaseTarget(c)}
          onApproveCase={(c) => setApproveCaseTarget(c)}
          onResubmitCase={(c) => handleResubmitCase(c)}
          onDeleteCase={handleDeleteCase}
          currentUserId={currentUserId || ''}
        />

        {/* Pagination Footer */}
        <div className="flex max-[767px]:flex-col max-[767px]:gap-4 items-center justify-between border-t border-slate-200/60 pt-4">
          <span className="text-sm text-slate-500 font-medium max-[767px]:text-center max-[767px]:w-full">
            Showing {totalCases > 0 ? startIndex + 1 : 0} to {totalCases > 0 ? Math.min(startIndex + ITEMS_PER_PAGE, totalCases) : 0} of {totalCases} entries
          </span>
          <div className="flex flex-wrap items-center justify-center max-[767px]:w-full gap-1">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4 pointer-events-none" />
            </button>

            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' && setCurrentPage(page)}
                disabled={page === "..."}
                className={`flex items-center justify-center w-8 h-8 rounded-lg text-sm font-semibold transition-colors hover:cursor-pointer ${page === currentPage
                  ? "bg-teal-600 text-white shadow-sm shadow-teal-600/20 border-transparent"
                  : page === "..."
                    ? "text-slate-400 bg-transparent border-transparent cursor-default"
                    : "text-slate-600 bg-white border border-slate-200 hover:bg-slate-50"
                  }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages || totalPages === 0}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer transition-colors"
            >
              <ChevronRight className="w-4 h-4 pointer-events-none" />
            </button>
          </div>
        </div>
      </div>

      {/* Side Drawer for View Details */}
      <CaseDetailsDrawer
        selectedCase={selectedCase}
        setSelectedCase={setSelectedCase}
        formatDate={formatDate}
        currentUserId={currentUserId || ''}
      />

      <CaseSummaryDrawer
        isOpen={!!summaryCase}
        onClose={() => setSummaryCase(null)}
        title={summaryCase?.title}
        summary={
          (() => {
            if (!summaryCase?.documents || summaryCase.documents.length === 0) return null;
            
            const summaries = summaryCase.documents
              .map((d: any) => {
                const text = d.aiAnalysis?.shortSummary || d.summary;
                if (!text) return null;
                
                const firstParagraph = text.split('\n').find((line: string) => {
                  const trimmed = line.trim();
                  return trimmed.length > 20 && !trimmed.startsWith('---') && !trimmed.startsWith('***') && !trimmed.startsWith('#') && /[a-z]/i.test(trimmed);
                });
                return firstParagraph || null;
              })
              .filter(Boolean);
              
            if (summaries.length > 0) {
              const combinedParagraph = summaries.join(' ');
              return `<div class="text-slate-700 leading-relaxed text-[15px]">${combinedParagraph}</div>`;
            }
            return null;
          })()
        }
      />

      <CloseCaseModal
        isOpen={isCloseModalOpen}
        isClosing={isClosing}
        onClose={() => setIsCloseModalOpen(false)}
        onConfirm={handleCloseCase}
      />

      <DeleteCaseModal
        isOpen={!!caseToDelete}
        isDeleting={isDeletingCase}
        onClose={() => !isDeletingCase && setCaseToDelete(null)}
        onConfirm={confirmDeleteCase}
      />

      {/* Reject Reason Modal */}
      {
        rejectCaseTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60" onClick={() => { if (!isRejecting) { setRejectCaseTarget(null); setRejectReason(""); } }}></div>
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-rose-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Reject Case</h3>
                <p className="text-sm text-slate-500 mb-6">
                  Please provide a reason for rejecting this case.
                </p>

                <div className="mb-6 text-left">
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Reason for rejection (optional)..."
                    className="w-full h-32 px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none text-slate-700 bg-slate-50 text-sm"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => { setRejectCaseTarget(null); setRejectReason(""); }}
                    disabled={isRejecting}
                    className="flex-1 h-12 px-5 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-all disabled:opacity-50 flex items-center justify-center cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitRejectCase}
                    disabled={isRejecting}
                    className="flex-1 h-12 px-5 border border-transparent bg-rose-600 text-white text-sm font-medium rounded-lg hover:bg-rose-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isRejecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                    Confirm Rejection
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Approve Modal */}
      {
        approveCaseTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60" onClick={() => !isApproving && setApproveCaseTarget(null)}></div>
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Approve Case</h3>
                <p className="text-sm text-slate-500 mb-6">
                  Are you sure you want to approve this case? It will be marked as approved and can proceed to the next steps.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setApproveCaseTarget(null)}
                    disabled={isApproving}
                    className="flex-1 h-12 px-5 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-all disabled:opacity-50 flex items-center justify-center cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitApproveCase}
                    disabled={isApproving}
                    className="flex-1 h-12 px-5 border border-transparent bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isApproving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    Confirm Approval
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Resubmit Modal */}
      {
        resubmitCaseTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60" onClick={() => !isResubmitting && setResubmitCaseTarget(null)}></div>
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RefreshCw className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Resubmit Case</h3>
                <p className="text-sm text-slate-500 mb-6">
                  Are you sure you want to resubmit this case for approval? Make sure you have fixed the issues mentioned in the rejection reason.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setResubmitCaseTarget(null)}
                    disabled={isResubmitting}
                    className="flex-1 h-12 px-5 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-all disabled:opacity-50 flex items-center justify-center cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitResubmitCase}
                    disabled={isResubmitting}
                    className="flex-1 h-12 px-5 border border-transparent bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isResubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    Resubmit Case
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div >
  )
}
