import { AlertTriangle, Loader2, XCircle } from "lucide-react"

interface CloseCaseModalProps {
  isOpen: boolean;
  isClosing: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function CloseCaseModal({ isOpen, isClosing, onClose, onConfirm }: CloseCaseModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={() => !isClosing && onClose()}></div>
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-rose-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Close Case?</h3>
          <p className="text-sm text-slate-500 mb-6">
            Are you sure you want to close this case? This action will mark the case as resolved and start the data retention countdown.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isClosing}
              className="flex-1 h-12 px-5 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-all disabled:opacity-50 flex items-center justify-center cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isClosing}
              className="flex-1 h-12 px-5 border border-transparent bg-rose-600 text-white text-sm font-medium rounded-lg hover:bg-rose-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isClosing ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
              Close Case
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
