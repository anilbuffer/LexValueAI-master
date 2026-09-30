import { Lock } from "lucide-react";

interface LockedModuleOverlayProps {
  title: string;
  description?: string;
}

export default function LockedModuleOverlay({
  title,
  description = "This module is currently locked and will be unlocked in the next release phase. Direct interactions are disabled."
}: LockedModuleOverlayProps) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center p-6 bg-slate-900/10 backdrop-blur-[2px] pointer-events-auto select-none">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 shadow-2xl p-8 max-w-md w-full text-center flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
        <div className="w-14 h-14 rounded-2xl bg-slate-100/90 border border-slate-200 text-slate-700 flex items-center justify-center mb-4 shadow-xs">
          <Lock className="w-6 h-6 text-slate-700 stroke-[1.8]" />
        </div>
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200/80 px-3 py-1 rounded-full mb-2">
          Locked • Next Phase
        </span>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">
          {title}
        </h3>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
