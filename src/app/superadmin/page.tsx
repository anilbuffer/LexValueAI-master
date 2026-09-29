"use client";

import Link from "next/link";
import {
  Building2,
  FileText,
  ChevronRight,
  Award,
  Clock,
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


const topFirms = [
  { id: 1, initials: "SA", name: "Smith & Associates", plan: "Enterprise", metric: "342 Users" },
  { id: 2, initials: "JL", name: "Johnson Legal Group", plan: "Professional", metric: "156 Users" },
  { id: 3, initials: "MP", name: "Miller & Partners", plan: "Starter", metric: "89 Users" },
  { id: 4, initials: "DC", name: "Davis & Co.", plan: "Enterprise", metric: "48 Users" },
];

export default function SuperadminDashboard() {
  return (
    <div className="p-6 md:p-8 space-y-6 bg-slate-50/50 min-h-screen w-full font-sans">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">System Overview</h1>
        </div>
      </div>

      {/* Operational Metrics Cards (3 Cards Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Card 1: Active Firms */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs relative overflow-hidden group hover:border-slate-300 transition-all">
          <Activity className="absolute -bottom-4 -right-2 w-28 h-28 text-blue-500/5 -rotate-12 group-hover:scale-105 transition-transform pointer-events-none" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Firms</p>
              <h3 className="text-3xl font-black text-slate-900 mt-2 tracking-tight">14</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between text-xs relative z-10">
            <span className="text-slate-500 font-medium text-[11px]">19 total registered</span>
          </div>
        </div>

        {/* Card 2: Cases Uploaded */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs relative overflow-hidden group hover:border-slate-300 transition-all">
          <FileText className="absolute -bottom-4 -right-2 w-28 h-28 text-teal-500/5 -rotate-12 group-hover:scale-105 transition-transform pointer-events-none" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Cases Uploaded</p>
              <h3 className="text-3xl font-black text-slate-900 mt-2 tracking-tight">1,284</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center border border-teal-100 shrink-0">
              <FileText className="w-5 h-5 text-teal-600" />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between text-xs relative z-10">
            <span className="text-slate-500 font-medium text-[11px]">1,277 processed</span>
          </div>
        </div>

        {/* Card 3: Not Approved Firms */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs relative overflow-hidden group hover:border-slate-300 transition-all">
          <Building2 className="absolute -bottom-4 -right-2 w-28 h-28 text-amber-500/5 -rotate-12 group-hover:scale-105 transition-transform pointer-events-none" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Not Approved Firms</p>
              <h3 className="text-3xl font-black text-slate-900 mt-2 tracking-tight">5</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100 shrink-0">
              <Building2 className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between text-xs relative z-10 min-h-[16px]">
          </div>
        </div>

      </div>

      {/* Main Grid: Stuck/Failed Cases Queue & Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Stuck / Failed Cases Widget (2 cols on lg) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 flex flex-col justify-between h-full">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                  Failed Cases Queue
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Processing queue for documents & cases requiring intervention.
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
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs ${item.severity === "High"
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
                      </div>
                    </div>

                    <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {item.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Top Firms */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 flex flex-col justify-between h-full">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <Award className="w-5 h-5 text-teal-700" /> Top Firms
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Most active tenant firms this month.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold bg-teal-50 text-teal-700 px-3 py-1 rounded-full border border-teal-100">
                  This Month
                </span>
              </div>
            </div>

            <div className="space-y-3.5">
              {topFirms.map((firm) => (
                <div
                  key={firm.id}
                  className="p-4 border border-slate-200/80 rounded-xl hover:border-slate-300 transition-all bg-slate-50/40 hover:bg-white hover:shadow-xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        firm.id === 1
                          ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                          : firm.id === 2
                          ? "bg-blue-100 text-blue-700 border border-blue-200"
                          : firm.id === 3
                          ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                          : "bg-purple-100 text-purple-700 border border-purple-200"
                      }`}
                    >
                      {firm.initials}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 leading-snug">{firm.name}</p>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase mt-0.5">{firm.plan}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-black text-slate-900">{firm.metric.split(" ")[0]}</p>
                    <p className="text-[10px] text-slate-500">{firm.metric.split(" ")[1]}</p>
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

