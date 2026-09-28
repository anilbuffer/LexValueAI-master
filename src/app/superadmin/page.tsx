"use client";

import Link from "next/link";
import {
  Building2,
  FileText,
  AlertTriangle,
  ChevronRight,
  Award,
  MessageSquare,
  Star,
  Clock,
  CheckCircle2,
  Bug,
  ThumbsUp,
  Eye,
  AlertCircle,
  Activity
} from "lucide-react";

// --- MOCK DATA ---

const stuckCasesQueue = [
  {
    id: "STK-104",
    firm: "Miller & Partners",
    caseNumber: "Case #104",
    title: "Miller & Partners – Case #104 failed at OCR extraction",
    stage: "OCR Extraction",
    reason: "PDF engine timed out on 240-page medical record scan",
    time: "12m ago",
    severity: "High",
  },
  {
    id: "STK-218",
    firm: "Smith & Associates",
    caseNumber: "Case #218",
    title: "Smith & Associates – Case #218 medical chronology indexing error",
    stage: "Chronology Indexing",
    reason: "Unrecognized table schema in imported deposition transcript",
    time: "45m ago",
    severity: "Medium",
  },
  {
    id: "STK-089",
    firm: "Johnson Legal Group",
    caseNumber: "Case #89",
    title: "Johnson Legal Group – Case #89 audio transcription failed",
    stage: "Audio Transcription",
    reason: "Corrupted audio stream encoding (AAC 96kbps)",
    time: "2h ago",
    severity: "High",
  },
  {
    id: "STK-302",
    firm: "Davis & Co.",
    caseNumber: "Case #302",
    title: "Davis & Co. – Case #302 document AI parsing timeout",
    stage: "Document AI Parsing",
    reason: "Upstream parser socket connection reset",
    time: "4h ago",
    severity: "Low",
  },
];

const betaFeedback = [
  {
    id: 1,
    user: "Sarah Jenkins",
    firm: "Miller & Partners",
    rating: 5,
    category: "Praise",
    comment: "The new chronology generator saved us over 6 hours on the Henderson case!",
    time: "1h ago",
  },
  {
    id: 2,
    user: "Robert Vance",
    firm: "Smith & Associates",
    rating: 2,
    category: "Bug Report",
    comment: "OCR stalls on multi-page PDF exhibits over 100MB. Needs auto-retry.",
    time: "3h ago",
  },
  {
    id: 3,
    user: "Elena Rostova",
    firm: "Johnson Legal Group",
    rating: 4,
    category: "Feature Idea",
    comment: "Would love a quick filter for pre-existing medical conditions in summary export.",
    time: "5h ago",
  },
];

const topFirms = [
  { id: 1, initials: "SA", name: "Smith & Associates", plan: "Enterprise", metric: "342 Users" },
  { id: 2, initials: "JL", name: "Johnson Legal Group", plan: "Professional", metric: "156 Users" },
  { id: 3, initials: "MP", name: "Miller & Partners", plan: "Starter", metric: "89 Users" },
];

export default function SuperadminDashboard() {
  return (
    <div className="p-6 md:p-8 space-y-6 bg-slate-50/50 min-h-screen w-full font-sans">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">System Overview</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Real-time operational monitoring & system processing health.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            System Processing Normal
          </span>
        </div>
      </div>

      {/* Operational Metrics Cards (3 Cards Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Active Firms Today */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs relative overflow-hidden group hover:border-slate-300 transition-all">
          <Activity className="absolute -bottom-4 -right-2 w-28 h-28 text-blue-500/5 -rotate-12 group-hover:scale-105 transition-transform pointer-events-none" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Firms Today</p>
              <h3 className="text-3xl font-black text-slate-900 mt-2 tracking-tight">14</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between text-xs relative z-10">
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">+2 vs yesterday</span>
            <span className="text-slate-500 font-medium text-[11px]">19 total registered</span>
          </div>
        </div>

        {/* Card 2: Cases Uploaded Today */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs relative overflow-hidden group hover:border-slate-300 transition-all">
          <FileText className="absolute -bottom-4 -right-2 w-28 h-28 text-teal-500/5 -rotate-12 group-hover:scale-105 transition-transform pointer-events-none" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Cases Uploaded Today</p>
              <h3 className="text-3xl font-black text-slate-900 mt-2 tracking-tight">1,284</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center border border-teal-100 shrink-0">
              <FileText className="w-5 h-5 text-teal-600" />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between text-xs relative z-10">
            <span className="text-teal-700 font-bold bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">+18% this week</span>
            <span className="text-slate-500 font-medium text-[11px]">1,277 processed</span>
          </div>
        </div>

        {/* Card 3: Total Stuck Cases */}
        <div className="bg-white rounded-2xl border border-rose-200/80 p-6 shadow-xs relative overflow-hidden group hover:border-rose-300 transition-all">
          <AlertTriangle className="absolute -bottom-4 -right-2 w-28 h-28 text-rose-500/5 -rotate-12 group-hover:scale-105 transition-transform pointer-events-none" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">Total Stuck Cases</p>
              <h3 className="text-3xl font-black text-slate-900 mt-2 tracking-tight">7</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center border border-rose-100 shrink-0">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between text-xs relative z-10">
            <span className="text-rose-700 font-bold bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">2 High Severity</span>
            <span className="text-slate-500 font-medium text-[11px]">Requires investigation</span>
          </div>
        </div>

      </div>

      {/* Main Grid: Stuck/Failed Cases Queue & Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Stuck / Failed Cases Widget (2 cols on lg) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                  Stuck / Failed Cases Queue
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time processing queue for documents & cases requiring intervention.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold bg-rose-50 text-rose-700 px-3 py-1 rounded-full border border-rose-100">
                  {stuckCasesQueue.length} Failed Items
                </span>
              </div>
            </div>

            <div className="space-y-3.5">
              {stuckCasesQueue.map((item) => (
                <div
                  key={item.id}
                  className="p-4 border border-slate-200/80 rounded-xl hover:border-slate-300 transition-all bg-slate-50/40 hover:bg-white hover:shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs ${
                        item.severity === "High"
                          ? "bg-rose-100 text-rose-700 border border-rose-200"
                          : item.severity === "Medium"
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}>
                        {item.severity === "High" ? "HIGH" : item.severity === "Medium" ? "MED" : "LOW"}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="font-semibold text-slate-700">{item.stage}</span>
                          <span>•</span>
                          <span className="text-slate-600">{item.reason}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center sm:flex-col sm:items-end justify-between shrink-0 gap-2">
                      <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {item.time}
                      </span>
                      <Link
                        href="/superadmin/audit-log"
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200/70 rounded-lg transition-colors shadow-2xs"
                      >
                        <FileText className="w-3.5 h-3.5 text-teal-700" /> View Log
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Showing recent failed extraction & indexing tasks</span>
            <Link href="/superadmin/audit-log" className="text-teal-700 font-bold hover:underline flex items-center gap-1">
              Open Full Audit Logs <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Column: Beta Feedback Preview & Top Client Firms */}
        <div className="space-y-6">

          {/* Beta Feedback Preview Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-teal-700" />
                  Beta Feedback Preview
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">Recent user ratings & feedback.</p>
              </div>
              <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full border border-amber-200/60 text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                4.7 / 5.0
              </div>
            </div>

            <div className="space-y-3.5">
              {betaFeedback.map((fb) => (
                <div key={fb.id} className="p-3.5 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-800">{fb.user}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      fb.category === "Bug Report"
                        ? "bg-rose-100 text-rose-700"
                        : fb.category === "Praise"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {fb.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 italic mt-1.5 leading-relaxed">
                    "{fb.comment}"
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                    <span className="font-semibold text-slate-500">{fb.firm}</span>
                    <span>{fb.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Client Firms Widget */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base">
                <Award className="w-4 h-4 text-teal-700" /> Top Client Firms
              </h3>
              <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">This Month</span>
            </div>

            <div className="space-y-3">
              {topFirms.map((firm) => (
                <div key={firm.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl bg-slate-50/50 hover:border-slate-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      firm.id === 1 ? 'bg-indigo-100 text-indigo-700' :
                      firm.id === 2 ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {firm.initials}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 leading-tight">{firm.name}</p>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase mt-0.5">{firm.plan}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">{firm.metric.split(' ')[0]}</p>
                    <p className="text-[10px] text-slate-500">{firm.metric.split(' ')[1]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

