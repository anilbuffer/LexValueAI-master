"use client"
import React, { useState, useRef, useEffect } from "react"
import { Upload, Loader2, Info, CheckCircle } from "lucide-react"
import toast from 'react-hot-toast'
import { getUserRole } from "@/app/actions/auth"

export function UploadDocumentButton({ caseId, role }: { caseId: string, role: string }) {
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)
  const [scanProgress, setScanProgress] = useState<number>(100)
  const [scanStage, setScanStage] = useState<string>("COMPLETED")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const pollStatus = async () => {
      try {
        const res = await fetch(`/api/cases/${caseId}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.success) {
          setScanProgress((prev) => {
            // If we were processing and now finished, reload to show new data
            if (prev < 100 && prev > 0 && data.scanProgress === 100) {
              toast.success("AI Analysis completed! Refreshing...");
              setTimeout(() => window.location.reload(), 1500);
            }
            return data.scanProgress;
          });
          setScanStage(data.scanStage);
        }
      } catch (err) { }
    }

    pollStatus();
    const interval = setInterval(pollStatus, 4000);
    return () => clearInterval(interval);
  }, [caseId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (scanProgress < 100 || uploadStatus) {
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
    
    const uniqueFiles: File[] = [];
    const seenFiles = new Set();
    for (const newFile of validFiles) {
      const key = `${newFile.name}-${newFile.size}`;
      if (seenFiles.has(key)) {
        toast.error(`File "${newFile.name}" is already selected.`);
      } else {
        seenFiles.add(key);
        uniqueFiles.push(newFile);
      }
    }

    if (uniqueFiles.length === 0) {
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    try {
      let uploadedCount = 0;
      for (let i = 0; i < uniqueFiles.length; i++) {
        const file = uniqueFiles[i]
        setUploadStatus(`Uploading ${i + 1} of ${uniqueFiles.length}...`)

        const res = await fetch('/api/documents/presigned-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            caseId: caseId,
            fileName: file.name,
            mimeType: file.type,
            size: file.size
          })
        })

        const resData = await res.json()

        if (!res.ok) {
          if (res.status === 409) {
            toast.error(`Duplicate: ${resData.error}`)
            continue
          }
          throw new Error(`Failed to generate upload URL for ${file.name}: ${resData.error || 'Unknown error'}`)
        }

        const { presignedUrl, documentId } = resData

        if (!presignedUrl) {
          throw new Error(`Failed to generate upload URL for ${file.name}`)
        }

        // 2. Upload directly to S3
        const uploadRes = await fetch(presignedUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file
        })

        if (!uploadRes.ok) {
          throw new Error(`S3 upload failed for ${file.name}`)
        }

        // 3. Confirm upload and trigger processing
        await fetch('/api/documents/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ documentId })
        })

        uploadedCount++;
      }

      if (uploadedCount > 0) {
        toast.success(`${uploadedCount} document(s) uploaded successfully! AI analysis started.`)
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload some documents. Please try again.")
    } finally {
      setUploadStatus(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
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
