import React from 'react'
import { FileQuestion, FileText } from 'lucide-react'

interface GapsTabProps {
  caseData?: any;
  role: string | null;
}

export function GapsTab({ caseData, role }: GapsTabProps) {
  const handlePageClick = async (documentId: string, pageStr: string) => {
    if (!documentId) return;
    const match = pageStr.match(/\d+/);
    const pageNum = match ? match[0] : null;
    try {
      const res = await fetch(`/api/documents/${documentId}/download`);
      if (res.ok) {
        const data = await res.json();
        if (data.downloadUrl) {
          const url = pageNum ? `${data.downloadUrl}#page=${pageNum}` : data.downloadUrl;
          window.open(url, '_blank');
        }
      }
    } catch (e) {
      console.error('Failed to open document:', e);
    }
  };

  const gaps: any[] = []

  if (caseData?.documents) {
    caseData.documents.forEach((doc: any) => {
      if (doc.aiAnalysis?.gaps && Array.isArray(doc.aiAnalysis.gaps)) {
        doc.aiAnalysis.gaps.forEach((gap: any) => {
          const text = typeof gap === 'string' ? gap : gap.text;
          const words = text.split(' ');
          const title = gap.title || words.slice(0, 5).join(' ');

          gaps.push({
            title,
            text,
            documentName: doc.fileName,
            documentId: doc.id,
            page: typeof gap === 'string' ? "Source page unclear" : (gap.pageNumber || "Source page unclear"),
            confidence: typeof gap === 'string' ? "Medium" : (gap.confidence || "Medium")
          })
        })
      }
    })
  }

  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-slate-50 p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Missing Records</h2>
          <p className="text-sm text-slate-500 mt-1">Identified gaps in the documentation that need attention.</p>
        </div>
      </div>
      <div className="p-5 w-full">
        {gaps.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
            <p className="text-slate-500">No missing records or gaps identified yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {gaps.map((gap, i) => {
              const page = gap.page || 1;
              return (
                <div key={i} className="bg-white border border-slate-200/60 rounded-xl p-5 flex flex-col justify-between group">
                  <div className="flex items-start gap-3.5 mb-3">
                    <div className="w-9 h-9 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                      <FileQuestion className="w-4.5 h-4.5 text-amber-500" />
                    </div>
                    <div className="flex flex-col flex-1 pt-0.5 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-[15px] font-bold text-slate-800 leading-tight">{gap.title}</h4>
                        <div className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${
                          gap.confidence === 'High' ? 'bg-rose-100 text-rose-700 border-rose-200' :
                          gap.confidence === 'Low' ? 'bg-slate-100 text-slate-500 border-slate-200' :
                          'bg-amber-100 text-amber-700 border-amber-200'
                        }`}>
                          {gap.confidence}
                        </div>
                      </div>
                      <p className="text-[14px] text-slate-700 leading-relaxed mt-1.5">{gap.text}</p>
                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center w-full min-w-0">
                        <div 
                          title={page === "Source page unclear" ? `Page unclear, ${gap.documentName}` : `Page ${page}, ${gap.documentName}`}
                          onClick={(e) => { e.stopPropagation(); handlePageClick(gap.documentId, String(page)); }}
                          className="flex items-center gap-2 text-[12px] text-teal-700 font-semibold bg-teal-50 border border-teal-100 px-3 py-2 rounded-md max-w-full overflow-hidden cursor-pointer hover:bg-teal-100 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                          <span className="truncate whitespace-nowrap overflow-hidden">
                            {page === "Source page unclear" ? `Page unclear, ${gap.documentName}` : `Page ${page}, ${gap.documentName}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

