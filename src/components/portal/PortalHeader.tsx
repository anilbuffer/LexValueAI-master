import { ShieldCheck, User } from "lucide-react"

export default function PortalHeader({ firmName }: { firmName: string }) {
  return (
    <header className="relative p-4 bg-white rounded-2xl m-2.5 shadow-md shadow-slate-200/50 flex items-center justify-between shrink-0 z-50 border border-slate-200/50 max-w-5xl mx-auto w-[calc(100%-20px)] mt-4">
      
      {/* Left: Branding */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-600/20">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">{firmName}</h1>
          <p className="text-xs font-medium text-teal-600">Secure Client Portal</p>
        </div>
      </div>

      {/* Right: Plaintiff Indicator */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg">
        <User className="w-4 h-4 text-slate-500" />
        <span className="text-sm font-semibold text-slate-700">Plaintiff Access</span>
      </div>

    </header>
  )
}
