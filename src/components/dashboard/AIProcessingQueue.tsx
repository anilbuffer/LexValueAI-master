import React from 'react'
import { Loader2, ChevronRight, CheckCircle2, Activity } from 'lucide-react'
import { ViewSummaryButton } from '@/components/ViewSummaryButton'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { getMockCases, getMockDocumentsForCase } from '@/lib/mock-data'

function timeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return Math.floor(seconds) + "s ago";
}

export async function AIProcessingQueue() {
  const session = await getSession();
  if (!session) return null;

  const mockCases = getMockCases();

  // 1. Fetch Active Cases
  const activeCases = mockCases.filter(c => !c.flags && !['READY', 'Closed', 'FAILED'].includes(c.status)).slice(0, 4);

  // 2. Fetch Recently Completed Cases
  const completedLimit = Math.max(3, 4 - activeCases.length);
  const completedCases = mockCases.filter(c => ['READY', 'Closed'].includes(c.status) || c.flags).slice(0, completedLimit);

  const totalItems = activeCases.length + completedCases.length;

  return (
    <div className="grid-item-queue bg-white rounded-2xl border border-slate-200/50 shadow-md shadow-slate-200/50 overflow-hidden relative flex flex-col h-full max-h-[480px]">
      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 bg-slate-50/50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
          </div>
          <h3 className="text-lg font-bold text-slate-800">Live AI Processing Queue</h3>
        </div>
        <Link href="/cases" className="flex items-center justify-center gap-1.5 h-12 px-5 border border-teal-100 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-medium text-sm transition-all group cursor-pointer w-full min-[480px]:w-auto">
          View All
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100 flex-1 overflow-y-auto custom-scrollbar">
        {totalItems === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 min-h-[300px]">
            <Activity className="w-10 h-10 text-slate-300 mb-2" />
            <p className="font-medium text-slate-500">No AI processing activity</p>
            <p className="text-sm">Cases currently scanning or recently analyzed will appear here.</p>
          </div>
        ) : null}

        {/* Active Processing Items */}
        {activeCases.map((c) => (
          <div key={c.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 transition-colors group relative overflow-hidden gap-4">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500"></div>
            <div className="flex items-center gap-5 ml-2 flex-1 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center border border-teal-100 shrink-0">
                <Loader2 className="w-6 h-6 text-teal-600 animate-spin" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-base font-bold text-slate-800 truncate" title={c.title}>{c.title}</h4>
                <p className="text-xs font-medium text-slate-500 mt-0.5 flex items-center gap-2">
                  <span className="text-teal-600 font-semibold bg-teal-50 px-2 py-0.5 rounded">
                    {c.scanStage === 'QUEUED' ? 'Queued' : 
                     c.scanStage === 'TEXT_EXTRACTION' ? 'Extracting Text' :
                     c.scanStage === 'PII_FILTERING' ? 'Securing PHI' :
                     c.scanStage === 'VECTOR_EMBEDDING' ? 'Vectorizing' :
                     c.scanStage === 'AI_ANALYSIS' ? 'AI Analysis' :
                     'Analyzing Records'}
                  </span>
                  <span>·</span>
                  {c.scanProgress}% complete
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 sm:ml-auto ml-16">
              <div className="w-32 bg-slate-100 rounded-full h-2 overflow-hidden hidden sm:block">
                <div
                  className="bg-gradient-to-r from-teal-400 to-teal-500 h-full rounded-full relative transition-all duration-500"
                  style={{ width: `${c.scanProgress || 5}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Completed Items */}
        {completedCases.map((c) => {
          let missingCount = 0;
          let flagsCount = 0;
          let summaryText = "";

          const docs = getMockDocumentsForCase(c.id);

          docs.forEach((doc) => {
            if (doc.summary) summaryText = doc.summary;
            if (doc.aiAnalysis && typeof doc.aiAnalysis === 'object') {
              const analysis = doc.aiAnalysis as any;
              if (Array.isArray(analysis.gaps)) {
                missingCount += analysis.gaps.length;
              }
              if (Array.isArray(analysis.flags)) {
                flagsCount += analysis.flags.length;
              }
            }
          });

          const totalFlags = flagsCount;
          if (!summaryText) {
            summaryText = `AI has successfully processed the medical records for this case. ${totalFlags} risk flags were identified. Click View Timeline to see the full chronological breakdown.`;
          } else {
            // Keep only the first paragraph and limit length
            summaryText = summaryText.split('\n').filter((p: string) => p.trim().length > 0)[0] || summaryText;
            if (summaryText.length > 1200) {
              summaryText = summaryText.substring(0, 1200) + '...';
            }
          }

          return (
            <div key={c.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 transition-colors group gap-4">
              <div className="flex items-center gap-5 ml-3 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100 group-hover:scale-105 transition-transform shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={`/cases/${c.id}/timeline`} className="block min-w-0">
                    <h4 className="text-base font-bold text-slate-800 cursor-pointer group-hover:text-teal-600 transition-colors truncate" title={c.title}>{c.title}</h4>
                  </Link>
                  <p className="text-xs font-medium text-slate-500 mt-0.5 truncate" title={`Completed ${timeAgo(c.updatedAt)} · ${c.type}`}>
                    <span className="text-slate-400">Completed {timeAgo(c.updatedAt)}</span>
                    <span className="mx-2">·</span>
                    <span>{c.type}</span>
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 w-full sm:w-auto ml-0 min-[480px]:ml-16 sm:ml-auto">
                <div className="hidden sm:flex sm:flex-col items-end gap-1.5">
                  {missingCount > 0 && (
                    <div className="flex items-center gap-1.5 bg-rose-50/80 border border-rose-100/80 px-2 py-0.5 rounded-md shadow-sm shadow-rose-100/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                      <span className="text-[11px] font-bold text-rose-700">{missingCount} Missing records</span>
                    </div>
                  )}
                  {totalFlags > 0 && (
                    <div className="flex items-center gap-1.5 bg-amber-50/80 border border-amber-100/80 px-2 py-0.5 rounded-md shadow-sm shadow-amber-100/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      <span className="text-[11px] font-bold text-amber-700">{totalFlags} Flags detected</span>
                    </div>
                  )}
                  {missingCount === 0 && totalFlags === 0 && (
                    <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-[8px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span className="text-xs font-bold text-emerald-600">Processed cleanly</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col min-[480px]:flex-row gap-2 w-full min-[480px]:w-auto mt-2 min-[480px]:mt-0">
                  <ViewSummaryButton
                    title={c.title}
                    summary={summaryText}
                    className="w-full justify-center min-[480px]:w-auto"
                  />
                  <Link href={`/cases/${c.id}/timeline`} className="w-full min-[480px]:w-auto">
                    <button className="w-full justify-center px-3 py-1.5 bg-teal-600 text-white text-xs font-bold rounded-[8px] hover:bg-teal-700 shadow-sm shadow-teal-600/20 transition-all flex items-center gap-1.5 cursor-pointer">
                      <Activity className="w-3.5 h-3.5" />
                      View Timeline
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}} />
    </div>
  )
}
