"use client";

import { useState, useMemo } from "react";
import {
  MessageSquare, Search, Filter, Bug, ThumbsUp, HelpCircle, Star, Building2,
  User, Calendar, CheckCircle2, Clock, AlertTriangle, ArrowUpRight, X, Reply, Eye, Sparkles
} from "lucide-react";
import LockedModuleOverlay from "@/components/LockedModuleOverlay";

export interface FeedbackSubmission {
  id: string;
  firmName: string;
  userName: string;
  userRole: "Attorney" | "Paralegal" | "Managing Partner" | "Legal Assistant";
  userEmail: string;
  category: "Bug Report" | "Feedback" | "Feature Request" | "Praise";
  rating?: number;
  message: string;
  dateSubmitted: string;
  status: "New" | "In Review" | "Resolved";
  severity?: "Low" | "Medium" | "High";
}

const mockFeedbackData: FeedbackSubmission[] = [
  {
    id: "FB-101",
    firmName: "Miller & Partners",
    userName: "Sarah Jenkins",
    userRole: "Attorney",
    userEmail: "s.jenkins@millerpartners.com",
    category: "Praise",
    rating: 5,
    message: "The new chronology generator saved us over 6 hours on the Henderson medical malpractice case! Excellent accuracy.",
    dateSubmitted: "Sep 28, 2026 16:40",
    status: "New",
  },
  {
    id: "FB-102",
    firmName: "Smith & Associates",
    userName: "Robert Vance",
    userRole: "Paralegal",
    userEmail: "r.vance@smithassociates.com",
    category: "Bug Report",
    rating: 2,
    message: "OCR extraction stalls when processing multi-page PDF exhibits over 100MB. Needs an automatic retry option.",
    dateSubmitted: "Sep 28, 2026 14:15",
    status: "In Review",
    severity: "High",
  },
  {
    id: "FB-103",
    firmName: "Johnson Legal Group",
    userName: "Elena Rostova",
    userRole: "Attorney",
    userEmail: "e.rostova@johnsonlegal.com",
    category: "Feature Request",
    rating: 4,
    message: "Would love a quick filter for pre-existing medical conditions in the medical summary timeline export.",
    dateSubmitted: "Sep 28, 2026 11:30",
    status: "New",
  },
  {
    id: "FB-104",
    firmName: "Davis & Co. Law",
    userName: "Marcus Thorne",
    userRole: "Paralegal",
    userEmail: "m.thorne@daviscolaw.com",
    category: "Bug Report",
    rating: 1,
    message: "Deposition audio transcription returned empty file for 45-minute MP3 file uploaded this morning.",
    dateSubmitted: "Sep 27, 2026 18:20",
    status: "Resolved",
    severity: "High",
  },
  {
    id: "FB-105",
    firmName: "Smith & Associates",
    userName: "Harvey Specter",
    userRole: "Managing Partner",
    userEmail: "harvey@smithassociates.com",
    category: "Feedback",
    rating: 5,
    message: "Platform speeds have improved dramatically after the latest update. Great job to the engineering team.",
    dateSubmitted: "Sep 26, 2026 09:10",
    status: "Resolved",
  },
];

export default function SuperadminFeedbackPage() {
  const [feedbackList, setFeedbackList] = useState<FeedbackSubmission[]>(mockFeedbackData);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedSubmission, setSelectedSubmission] = useState<FeedbackSubmission | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUpdateStatus = (id: string, newStatus: "New" | "In Review" | "Resolved") => {
    setFeedbackList((prev) =>
      prev.map((fb) => (fb.id === id ? { ...fb, status: newStatus } : fb))
    );
    showToast(`Feedback #${id} marked as ${newStatus}.`);
    if (selectedSubmission && selectedSubmission.id === id) {
      setSelectedSubmission({ ...selectedSubmission, status: newStatus });
    }
  };

  const filteredFeedback = useMemo(() => {
    return feedbackList.filter((fb) => {
      const matchesSearch =
        fb.firmName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fb.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fb.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fb.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = categoryFilter === "ALL" || fb.category === categoryFilter;
      const matchesStatus = statusFilter === "ALL" || fb.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [feedbackList, searchQuery, categoryFilter, statusFilter]);

  return (
    <div className="relative min-h-screen w-full font-sans">
      <div className="filter blur-[4px] pointer-events-none select-none opacity-50 p-6 md:p-8 space-y-6 bg-slate-50/50 min-h-screen w-full">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-[9999] flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-800 text-sm animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <MessageSquare className="w-6 h-6 text-teal-700" />
            Incoming Feedback & Bug Reports
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Centralized hub for feedback, bug submissions, and feature requests from firm users.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs text-xs">
          <span className="font-bold text-slate-700">{feedbackList.length} Total Submissions</span>
          <span>•</span>
          <span className="font-semibold text-rose-600">
            {feedbackList.filter((f) => f.category === "Bug Report" && f.status !== "Resolved").length} Open Bugs
          </span>
        </div>
      </div>

      {/* Stat Cards (Exact Shared Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Total Submissions */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs relative overflow-hidden group hover:border-slate-300 transition-all">
          <MessageSquare className="absolute -bottom-4 -right-2 w-28 h-28 text-teal-500/5 -rotate-12 group-hover:scale-105 transition-transform pointer-events-none" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Submissions</p>
              <h3 className="text-3xl font-black text-slate-900 mt-2 tracking-tight">{feedbackList.length}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center border border-teal-100 shrink-0">
              <MessageSquare className="w-5 h-5 text-teal-600" />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between text-xs relative z-10">
            <span className="text-teal-700 font-bold bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">Live feed</span>
            <span className="text-slate-500 font-medium text-[11px]">All tenant users</span>
          </div>
        </div>

        {/* Card 2: Bug Reports */}
        <div className="bg-white rounded-2xl border border-rose-200/80 p-6 shadow-xs relative overflow-hidden group hover:border-rose-300 transition-all">
          <Bug className="absolute -bottom-4 -right-2 w-28 h-28 text-rose-500/5 -rotate-12 group-hover:scale-105 transition-transform pointer-events-none" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">Bug Reports</p>
              <h3 className="text-3xl font-black text-slate-900 mt-2 tracking-tight">
                {feedbackList.filter((f) => f.category === "Bug Report").length}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center border border-rose-100 shrink-0">
              <Bug className="w-5 h-5 text-rose-600" />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between text-xs relative z-10">
            <span className="text-rose-700 font-bold bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">Action req</span>
            <span className="text-slate-500 font-medium text-[11px]">Technical review</span>
          </div>
        </div>

        {/* Card 3: Feature Ideas */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs relative overflow-hidden group hover:border-slate-300 transition-all">
          <Sparkles className="absolute -bottom-4 -right-2 w-28 h-28 text-blue-500/5 -rotate-12 group-hover:scale-105 transition-transform pointer-events-none" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Feature Ideas</p>
              <h3 className="text-3xl font-black text-slate-900 mt-2 tracking-tight">
                {feedbackList.filter((f) => f.category === "Feature Request").length}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between text-xs relative z-10">
            <span className="text-blue-700 font-bold bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">Suggestions</span>
            <span className="text-slate-500 font-medium text-[11px]">From firm staff</span>
          </div>
        </div>

        {/* Card 4: Avg Satisfaction */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs relative overflow-hidden group hover:border-slate-300 transition-all">
          <Star className="absolute -bottom-4 -right-2 w-28 h-28 text-amber-500/5 -rotate-12 group-hover:scale-105 transition-transform pointer-events-none" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Avg Satisfaction</p>
              <h3 className="text-3xl font-black text-slate-900 mt-2 tracking-tight">4.7<span className="text-lg text-slate-400 font-semibold">/5</span></h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100 shrink-0">
              <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between text-xs relative z-10">
            <span className="text-amber-700 font-bold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-100">★ High rating</span>
            <span className="text-slate-500 font-medium text-[11px]">User sentiment</span>
          </div>
        </div>

      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search feedback message, user, firm name..."
            className="w-full pl-9 pr-4 py-2 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-500 cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="Bug Report">Bug Reports</option>
            <option value="Feedback">Feedback</option>
            <option value="Feature Request">Feature Requests</option>
            <option value="Praise">Praise</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-500 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="New">New</option>
            <option value="In Review">In Review</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Centralized Submissions Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-[10.5px] uppercase tracking-wider font-bold text-slate-400 border-b border-slate-200 bg-slate-50/50">
              <tr>
                <th className="px-5 py-4 whitespace-nowrap">Firm Name</th>
                <th className="px-5 py-4 whitespace-nowrap">User Name & Role</th>
                <th className="px-4 py-4 whitespace-nowrap">Category</th>
                <th className="px-5 py-4 whitespace-nowrap">Message / Description</th>
                <th className="px-4 py-4 whitespace-nowrap">Date Submitted</th>
                <th className="px-4 py-4 whitespace-nowrap">Status</th>
                <th className="px-5 py-4 whitespace-nowrap text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredFeedback.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-400 text-sm">
                    No feedback entries match your filter.
                  </td>
                </tr>
              ) : (
                filteredFeedback.map((fb) => (
                  <tr key={fb.id} className="hover:bg-slate-50/60 transition-colors group">
                    {/* Firm Name */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-teal-700 shrink-0" />
                        <span className="font-bold text-slate-900 text-xs">{fb.firmName}</span>
                      </div>
                    </td>

                    {/* User Name & Role */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-xs">{fb.userName}</span>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase mt-0.5">
                          {fb.userRole}
                        </span>
                      </div>
                    </td>

                    {/* Category (Bug / Feedback / Feature / Praise) */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        fb.category === "Bug Report"
                          ? "bg-rose-100 text-rose-800 border border-rose-200"
                          : fb.category === "Praise"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : fb.category === "Feature Request"
                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                          : "bg-slate-100 text-slate-800 border border-slate-200"
                      }`}>
                        {fb.category === "Bug Report" && <Bug className="w-3 h-3 text-rose-600" />}
                        {fb.category === "Praise" && <ThumbsUp className="w-3 h-3 text-emerald-600" />}
                        {fb.category === "Feature Request" && <Sparkles className="w-3 h-3 text-blue-600" />}
                        {fb.category === "Feedback" && <MessageSquare className="w-3 h-3 text-slate-600" />}
                        {fb.category}
                      </span>
                    </td>

                    {/* Message / Description */}
                    <td className="px-5 py-4 max-w-md">
                      <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed italic">
                        "{fb.message}"
                      </p>
                      {fb.rating && (
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-amber-600 font-bold">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                          {fb.rating} / 5 Rating
                        </div>
                      )}
                    </td>

                    {/* Date Submitted */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {fb.dateSubmitted}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        fb.status === "New"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : fb.status === "In Review"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}>
                        {fb.status}
                      </span>
                    </td>

                    {/* Action Col */}
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedSubmission(fb)}
                          className="px-2.5 py-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                        >
                          View
                        </button>
                        {fb.status !== "Resolved" ? (
                          <button
                            onClick={() => handleUpdateStatus(fb.id, "Resolved")}
                            className="px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors"
                          >
                            Resolve
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateStatus(fb.id, "In Review")}
                            className="px-2.5 py-1 text-xs font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 rounded-md transition-colors"
                          >
                            Reopen
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspection Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  {selectedSubmission.id}
                </span>
                <h3 className="font-bold text-slate-900 text-base">Feedback Detail</h3>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block font-medium">Firm Name</span>
                  <span className="font-bold text-slate-900">{selectedSubmission.firmName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Submitted By</span>
                  <span className="font-bold text-slate-900">
                    {selectedSubmission.userName} ({selectedSubmission.userRole})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Contact Email</span>
                  <span className="font-semibold text-slate-700">{selectedSubmission.userEmail}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Date Submitted</span>
                  <span className="font-semibold text-slate-700">{selectedSubmission.dateSubmitted}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 font-bold block mb-1">Feedback Message</span>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 leading-relaxed italic">
                  "{selectedSubmission.message}"
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Status: <strong className="text-slate-800">{selectedSubmission.status}</strong></span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Close
                </button>
                {selectedSubmission.status !== "Resolved" && (
                  <button
                    onClick={() => handleUpdateStatus(selectedSubmission.id, "Resolved")}
                    className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs"
                  >
                    Mark Resolved
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
      <LockedModuleOverlay title="Incoming Feedback & Bug Reports" />
    </div>
  );
}
