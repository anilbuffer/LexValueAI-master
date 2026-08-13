"use client"
import React, { useState, useRef, useEffect } from "react"
import { FileText, FileSpreadsheet, File, ChevronDown, Download, Loader2 } from "lucide-react"
import { exportToExcel, exportToWord, exportToPDF } from "@/lib/exportUtils"

export function ExportDropdown({ role, caseData }: { role: string, caseData: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isExporting, setIsExporting] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (role === 'PARALEGAL') {
    return null;
  }

  const handleExport = async (type: 'excel' | 'word' | 'pdf') => {
    try {
      setIsExporting(type);
      if (type === 'excel') await exportToExcel(caseData);
      else if (type === 'word') await exportToWord(caseData);
      else if (type === 'pdf') await exportToPDF(caseData);
      setIsOpen(false);
    } catch (e) {
      console.error("Export failed:", e);
      alert("Failed to export case data.");
    } finally {
      setIsExporting(null);
    }
  }

  return (
    <div className="relative max-[480px]:w-full" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        disabled={!!isExporting}
        className="max-[480px]:w-full h-12 flex justify-center items-center px-5 border border-transparent rounded-lg text-sm font-medium text-white bg-teal-900 hover:bg-teal-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-900 transition-all cursor-pointer gap-2 disabled:opacity-70"
      >
        {isExporting ? <Loader2 className="w-4 h-4 text-white/80 animate-spin" /> : <Download className="w-4 h-4 text-white/80" />}
        {isExporting ? 'Exporting...' : 'Export'}
        <ChevronDown className={`w-4 h-4 text-white/80 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg shadow-slate-200/50 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="p-1.5 flex flex-col gap-0.5">
            <button 
              onClick={() => handleExport('excel')}
              className="w-full flex items-center px-3 py-2.5 hover:bg-emerald-50 rounded-lg text-sm font-medium text-emerald-700 transition-colors cursor-pointer group"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2.5 text-emerald-600" />
              Excel
            </button>
            <div className="h-px bg-slate-100 mx-2 my-0.5"></div>
            <button 
              onClick={() => handleExport('word')}
              className="w-full flex items-center px-3 py-2.5 hover:bg-blue-50 rounded-lg text-sm font-medium text-blue-700 transition-colors cursor-pointer group"
            >
              <FileText className="w-4 h-4 mr-2.5 text-blue-600" />
              Word
            </button>
            <div className="h-px bg-slate-100 mx-2 my-0.5"></div>
            <button 
              onClick={() => handleExport('pdf')}
              className="w-full flex items-center px-3 py-2.5 hover:bg-rose-50 rounded-lg text-sm font-medium text-rose-700 transition-colors cursor-pointer group"
            >
              <File className="w-4 h-4 mr-2.5 text-rose-600" />
              PDF
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
