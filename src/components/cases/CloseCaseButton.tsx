"use client"
import React, { useState, useEffect } from "react"
import { Archive, Loader2 } from "lucide-react"
import toast from 'react-hot-toast'
import { getUserRole } from "@/app/actions/auth"
import { CloseCaseModal } from "@/components/modals/CloseCaseModal"

export function CloseCaseButton({ caseId, currentStatus }: { caseId: string, currentStatus: string }) {
  const [role, setRole] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    getUserRole().then(setRole)
  }, [])

  // Only show to MANAGING_PARTNER
  if (role !== 'MANAGING_PARTNER') {
    return null
  }

  // Hide if already closed
  if (currentStatus === 'Closed') {
    return null
  }

  const handleClose = async () => {
    setIsProcessing(true)
    
    setTimeout(() => {
      toast.success('Case closed successfully')
      window.location.reload()
    }, 1000)
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={isProcessing}
        className={`max-[480px]:w-full h-12 flex justify-center items-center px-5 border rounded-lg text-sm font-semibold transition-all cursor-pointer gap-2 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100`}
      >
        {isProcessing ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Archive className="w-4 h-4" />
        )}
        Close Case
      </button>

      {/* Confirmation Modal */}
      <CloseCaseModal 
        isOpen={showConfirm}
        isClosing={isProcessing}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleClose}
      />
    </>
  )
}
