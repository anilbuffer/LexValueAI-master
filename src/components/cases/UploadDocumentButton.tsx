"use client"
import React, { useState, useRef } from "react"
import { Upload, Loader2, Info, CheckCircle } from "lucide-react"
import toast from 'react-hot-toast'

export function UploadDocumentButton({ caseId, role }: { caseId: string, role: string }) {
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)
  const scanProgress = 100;
  const scanStage = "COMPLETED";
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (uploadStatus) {
      toast.error("Please wait for the current scan to complete before uploading more documents.");
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    for (const file of files) {
      if (file.size > 200 * 1024 * 1024) {
        toast.error(`File ${file.name} exceeds the 200MB limit. Skipping.`)
        continue
      }
      if (file.type !== 'application/pdf') {
        toast.error(`File ${file.name} is not a valid PDF. Skipping.`)
        continue
      }
    }

    const validFiles = files.filter(f => f.type === 'application/pdf' && f.size <= 200 * 1024 * 1024)
    
    if (validFiles.length === 0) {
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    setUploadStatus(`Uploading...`)

    // Simulate API upload
    setTimeout(() => {
      toast.success(`${validFiles.length} document(s) uploaded successfully! AI analysis started.`)
      setUploadStatus(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }, 1500)
  }

  if (role !== 'PARALEGAL') {
    return null;
  }

  const isProcessing = scanProgress < 100;
  const isDisabled = !!uploadStatus || isProcessing;

  return (
    <div className="flex items-center gap-2 max-[480px]:w-full">
      {isProcessing && (
        <div className="flex items-center animate-in fade-in zoom-in duration-300">
          <ScanProgressPopover progress={scanProgress} stage={scanStage} />
        </div>
      )}

      <input
        type="file"
        multiple
        accept=".pdf,application/pdf"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileUpload}
        id="upload-document"
        disabled={isDisabled}
      />
      <label
        htmlFor="upload-document"
        className={`max-[480px]:w-full h-12 flex justify-center items-center px-5 border rounded-lg text-sm font-semibold transition-all gap-2 shrink-0 ${isDisabled ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' : 'border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 cursor-pointer'}`}
      >
        {uploadStatus ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {uploadStatus}
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            Add Document
          </>
        )}
      </label>
    </div>
  )
}

function ScanProgressPopover({ progress, stage }: { progress: number, stage: string }) {
  const stages = [
    { key: "TEXT_EXTRACTION", label: "Reading Documents" },
    { key: "VECTOR_EMBEDDING", label: "Organizing Case Data" },
    { key: "AI_ANALYSIS", label: "Generating AI Insights" }
  ];

  let currentStageIndex = -1;
  if (stage === "TEXT_EXTRACTION") currentStageIndex = 0;
  else if (stage === "VECTOR_EMBEDDING") currentStageIndex = 1;
  else if (stage === "AI_ANALYSIS") currentStageIndex = 2;
  else if (stage === "COMPLETED") currentStageIndex = 3;

  return (
    <div className="group/popover relative h-12 w-12 flex items-center justify-center border border-blue-200 bg-blue-50 rounded-lg shrink-0 cursor-help transition-all hover:bg-blue-100 hover:border-blue-300">
      <Info className="w-5 h-5 text-blue-600" />
      <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-64 bg-slate-800 text-white text-xs rounded-xl shadow-xl opacity-0 invisible group-hover/popover:opacity-100 group-hover/popover:visible transition-all duration-200 z-50 p-4 border border-slate-700 pointer-events-none">
        {/* Tooltip Arrow */}
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-800 border-l border-t border-slate-700 rotate-45"></div>

        <div className="flex justify-between items-center mb-3">
          <span className="font-bold text-slate-200">Scan Progress</span>
          <span className="font-mono text-teal-400 font-bold">{progress || 0}%</span>
        </div>

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
                <span className={isCurrent ? "text-blue-300 font-semibold" : isCompleted ? "text-slate-300" : "text-slate-500"}>
                  {s.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
