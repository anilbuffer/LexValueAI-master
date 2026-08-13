import { X, FileText } from "lucide-react"

interface CaseSummaryDrawerProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  summary?: string | null
}

export function CaseSummaryDrawer({ isOpen, onClose, title, summary }: CaseSummaryDrawerProps) {
  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-40 transition-opacity" onClick={onClose}></div>
      <div className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-white shadow-2xl z-50 transform transition-transform duration-300 translate-x-0 border-l border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-600" />
            AI Case Summary
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto flex-1 bg-white">
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">
              {title || "Case Document"}
            </h3>
            <div className="prose prose-slate prose-sm max-w-none text-slate-700 leading-relaxed">
              {summary ? (
                <div dangerouslySetInnerHTML={{ __html: summary.replace(/\n/g, '<br/>') }} />
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <FileText className="w-12 h-12 mb-3 opacity-20" />
                  <p>No summary is available yet. The AI is still processing the documents.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-white">
          <button onClick={onClose} className="w-full h-[46px] flex items-center justify-center bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-[10px] hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer">
            Close
          </button>
        </div>
      </div>
    </>
  )
}
