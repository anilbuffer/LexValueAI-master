import React from 'react'
import { AlertTriangle, FileText, Calendar, Activity, Car, Stethoscope } from 'lucide-react'

function getFlagIcon(text: string, severity: string) {
  const lowerText = text.toLowerCase();

  let Icon = AlertTriangle;
  if (lowerText.includes('gap')) Icon = Calendar;
  else if (lowerText.includes('surgery') || lowerText.includes('medical')) Icon = Stethoscope;
  else if (lowerText.includes('speeding') || lowerText.includes('collision') || lowerText.includes('accident')) Icon = Car;
  else if (lowerText.includes('mri') || lowerText.includes('disease') || lowerText.includes('pain')) Icon = Activity;

  if (severity === 'medium') return <Icon className="w-4 h-4 text-amber-500" />;
  if (severity === 'low') return <Icon className="w-4 h-4 text-emerald-500" />;
  return <Icon className="w-4 h-4 text-rose-500" />;
}

export function CaseIntelligenceBlock({ caseData, highlightedFlag }: { caseData?: any, highlightedFlag?: number | null }) {
  const handlePageClick = async (documentId: string, pageStr: string) => {
    if (!documentId) return;
    const match = pageStr.match(/\d+/);
    const pageNum = match ? match[0] : null;
    try {
      alert("Mock Download: In a real app, this would open the PDF.");
    } catch (e) {
      console.error('Failed to open document:', e);
    }
  };

  // Aggregate flags from all documents that have aiAnalysis
  const flags: any[] = []

  function guessSeverity(text: string): string {
    const lower = text.toLowerCase();
    if (lower.includes('gap') || lower.includes('missing') || lower.includes('delay') || lower.includes('inconsistent') || lower.includes('recommended') || lower.includes('cleared') || lower.includes('normal') || lower.includes('objective')) return 'medium';
    return 'high';
  }

  if (caseData?.documents) {
    caseData.documents.forEach((doc: any) => {
      if (doc.aiAnalysis?.flags && Array.isArray(doc.aiAnalysis.flags)) {
        doc.aiAnalysis.flags.forEach((flag: any) => {
          let title = "Identified Flag";
          let text = "";
          let severity = "high";
          let page = "Source page unclear";
          let confidence = "Medium";

          if (typeof flag === 'string') {
            text = flag;
            const words = flag.split(' ');
            title = words.slice(0, 5).join(' ');
            severity = guessSeverity(flag);
          } else {
            text = flag.text;
            title = flag.title || "Identified Flag";
            severity = flag.severity || guessSeverity(title);
            page = flag.pageNumber || "Source page unclear";
            confidence = flag.confidence || "Medium";
          }

          flags.push({
            title,
            text,
            severity,
            documentName: doc.fileName,
            documentId: doc.id,
            page,
            confidence
          })
        })
      }
    })
  }

  // If there are no flags, show a nice empty state that still looks premium
  if (flags.length === 0) {
    return (
      <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="bg-slate-50 p-5 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800">Case Flags</h2>
          <p className="text-sm text-slate-500 mt-1">Critical risk indicators identified by AI.</p>
        </div>
        <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 m-5">
          <p className="text-slate-500">No flags identified yet. Upload a medical record to extract critical case flags.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header */}
      <div className="bg-slate-50 p-5 border-b border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800">Case Flags</h2>
        <p className="text-sm text-slate-500 mt-1">{flags.length} critical risk indicators identified by AI.</p>
      </div>

      {/* Flags Grid Area */}
      <div className="p-5 w-full bg-slate-50/30">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {flags.map((flag, idx) => {
            const page = flag.page || 1;
            let bgClass = "bg-rose-50 border-rose-100 shadow-[0_0_0_2px_rgba(244,63,94,0.05)]";
            if (flag.severity === 'medium') bgClass = "bg-amber-50 border-amber-100 shadow-[0_0_0_2px_rgba(245,158,11,0.05)]";
            if (flag.severity === 'low') bgClass = "bg-emerald-50 border-emerald-100 shadow-[0_0_0_2px_rgba(16,185,129,0.05)]";

            return (
              <div
                key={idx}
                className={`bg-white rounded-xl p-5 flex flex-col justify-between group cursor-default transition-all duration-300 ${highlightedFlag === idx
                  ? 'border-2 border-teal-500 shadow-[0_4px_20px_-4px_rgba(20,184,166,0.2)]'
                  : 'border border-slate-200/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06)] hover:border-amber-300/60'
                  }`}
              >
                <div>
                  <div className="flex items-start gap-3 mb-2 justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full shrink-0 border flex items-center justify-center group-hover:scale-110 transition-transform ${bgClass}`}>
                        {getFlagIcon(flag.text, flag.severity)}
                      </div>
                      <h4 className="text-[15px] font-bold text-slate-800 leading-tight">{flag.title}</h4>
                    </div>
                    <div className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${flag.confidence === 'High' ? 'bg-rose-100 text-rose-700 border-rose-200' :
                      flag.confidence === 'Low' ? 'bg-slate-100 text-slate-500 border-slate-200' :
                        'bg-amber-100 text-amber-700 border-amber-200'
                      }`}>
                      {flag.confidence}
                    </div>
                  </div>
                  <p className="text-[14px] text-slate-600 leading-relaxed font-normal mb-3">{flag.text}</p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center w-full min-w-0">
                  <div
                    title={page === "Source page unclear" ? `Page unclear, ${flag.documentName}` : `Page ${page}, ${flag.documentName}`}
                    onClick={(e) => { e.stopPropagation(); handlePageClick(flag.documentId, String(page)); }}
                    className="flex items-center gap-2 text-[12px] text-teal-700 font-semibold bg-teal-50 border border-teal-100 px-3 py-2 rounded-md max-w-full overflow-hidden cursor-pointer hover:bg-teal-100 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span className="truncate whitespace-nowrap overflow-hidden">
                      {page === "Source page unclear" ? `Page unclear, ${flag.documentName}` : `Page ${page}, ${flag.documentName}`}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
