"use client"
import React, { useState, useEffect } from "react"
import { Check, X, Loader2, AlertTriangle, CheckCircle, CheckCircle2 } from "lucide-react"
import toast from 'react-hot-toast'
import { getUserRole } from "@/app/actions/auth"

export function CaseApprovalButtons({ caseId, currentApprovalStatus }: { caseId: string, currentApprovalStatus: string }) {
  const [role, setRole] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState<string | null>(null)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [rejectReason, setRejectReason] = useState("")

  useEffect(() => {
    getUserRole().then(setRole)
  }, [])

  // Only show to attorneys
  if (role !== 'ATTORNEY') {
    return null
  }

  // Only show if the case is still pending
  if (currentApprovalStatus !== 'PENDING') {
    return null
  }

  const submitAction = async (action: 'APPROVE' | 'REJECT', reason = "") => {
    setIsProcessing(action)
    
    setTimeout(() => {
      toast.success(action === 'APPROVE' ? 'Case approved successfully' : 'Case rejected')
      window.location.reload()
    }, 1000)
  }

  const handleApproveClick = () => setShowApproveModal(true)
  const handleConfirmApprove = () => submitAction('APPROVE')
  const handleRejectClick = () => setShowRejectModal(true)
  const handleConfirmReject = () => {
    if (!rejectReason.trim()) {
      toast.error("A reason is required to reject a case.")
      return
    }
    submitAction('REJECT', rejectReason.trim())
  }



  return (
    <>
      <div className="flex max-[480px]:flex-col items-center max-[480px]:items-stretch gap-3">
        <button
          onClick={handleApproveClick}
          disabled={!!isProcessing}
          className={`max-[480px]:w-full h-12 flex justify-center items-center px-5 border border-emerald-200 rounded-lg text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 focus:outline-none transition-all cursor-pointer gap-2 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isProcessing === 'APPROVE' ? (
            <Loader2 className="w-4 h-4 animate-spin text-emerald-600/80" />
          ) : (
            <Check className="w-4 h-4 text-emerald-600" />
          )}
          Approve
        </button>

        <button
          onClick={handleRejectClick}
          disabled={!!isProcessing}
          className={`max-[480px]:w-full h-12 flex justify-center items-center px-5 border border-rose-200 rounded-lg text-sm font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 focus:outline-none transition-all cursor-pointer gap-2 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isProcessing === 'REJECT' ? (
            <Loader2 className="w-4 h-4 animate-spin text-rose-600/80" />
          ) : (
            <X className="w-4 h-4 text-rose-600" />
          )}
          Reject
        </button>
      </div>

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => isProcessing !== 'APPROVE' && setShowApproveModal(false)}></div>
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
                  onClick={() => setShowApproveModal(false)}
                  disabled={isProcessing === 'APPROVE'}
                  className="flex-1 h-12 px-5 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-all disabled:opacity-50 flex items-center justify-center cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmApprove}
                  disabled={isProcessing === 'APPROVE'}
                  className="flex-1 h-12 px-5 border border-transparent bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing === 'APPROVE' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Confirm Approval
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => isProcessing !== 'REJECT' && setShowRejectModal(false)}></div>
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
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowRejectModal(false)}
                  disabled={isProcessing === 'REJECT'}
                  className="flex-1 h-12 px-5 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-all disabled:opacity-50 flex items-center justify-center cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReject}
                  disabled={isProcessing === 'REJECT' || !rejectReason.trim()}
                  className="flex-1 h-12 px-5 border border-transparent bg-rose-600 text-white text-sm font-medium rounded-lg hover:bg-rose-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing === 'REJECT' ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
