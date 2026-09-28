"use client";

import { useState, useMemo } from "react";
import {
  Download, Building2, Briefcase, Search, TrendingUp, X, CheckCircle2, RotateCcw,
  Users, Clock, AlertTriangle, Activity, CheckCircle, BarChart3
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const mockCasesData = [
  { month: "Jan", cases: 120, processed: 118, stuck: 2 },
  { month: "Feb", cases: 132, processed: 130, stuck: 2 },
  { month: "Mar", cases: 145, processed: 144, stuck: 1 },
  { month: "Apr", cases: 140, processed: 138, stuck: 2 },
  { month: "May", cases: 180, processed: 178, stuck: 2 },
  { month: "Jun", cases: 195, processed: 191, stuck: 4 },
  { month: "Jul", cases: 210, processed: 207, stuck: 3 },
];

const mockFirmStats = [
  {
    id: 1,
    firm: "Smith & Associates",
    casesHandled: 345,
    avgProcessingTime: "1.4 mins",
    stuckCount: 0,
    status: "Healthy",
    users: 15,
  },
  {
    id: 2,
    firm: "Johnson Legal Group",
    casesHandled: 128,
    avgProcessingTime: "1.8 mins",
    stuckCount: 0,
    status: "Healthy",
    users: 5,
  },
  {
    id: 3,
    firm: "Miller & Partners",
    casesHandled: 210,
    avgProcessingTime: "4.2 mins",
    stuckCount: 2,
    status: "Needs Action",
    users: 10,
  },
  {
    id: 4,
    firm: "Davis & Davis",
    casesHandled: 450,
    avgProcessingTime: "3.1 mins",
    stuckCount: 1,
    status: "Warning",
    users: 24,
  },
];

const firmChartData: Record<string, { month: string; cases: number; processed: number; stuck: number }[]> = {
  "Smith & Associates": [
    { month: "Jan", cases: 32, processed: 32, stuck: 0 },
    { month: "Feb", cases: 38, processed: 38, stuck: 0 },
    { month: "Mar", cases: 42, processed: 42, stuck: 0 },
    { month: "Apr", cases: 40, processed: 40, stuck: 0 },
    { month: "May", cases: 52, processed: 52, stuck: 0 },
    { month: "Jun", cases: 58, processed: 58, stuck: 0 },
    { month: "Jul", cases: 65, processed: 65, stuck: 0 },
  ],
  "Johnson Legal Group": [
    { month: "Jan", cases: 12, processed: 12, stuck: 0 },
    { month: "Feb", cases: 15, processed: 15, stuck: 0 },
    { month: "Mar", cases: 18, processed: 18, stuck: 0 },
    { month: "Apr", cases: 16, processed: 16, stuck: 0 },
    { month: "May", cases: 20, processed: 20, stuck: 0 },
    { month: "Jun", cases: 22, processed: 22, stuck: 0 },
    { month: "Jul", cases: 25, processed: 25, stuck: 0 },
  ],
  "Miller & Partners": [
    { month: "Jan", cases: 25, processed: 24, stuck: 1 },
    { month: "Feb", cases: 28, processed: 28, stuck: 0 },
    { month: "Mar", cases: 30, processed: 30, stuck: 0 },
    { month: "Apr", cases: 29, processed: 28, stuck: 1 },
    { month: "May", cases: 32, processed: 31, stuck: 1 },
    { month: "Jun", cases: 31, processed: 30, stuck: 1 },
    { month: "Jul", cases: 35, processed: 33, stuck: 2 },
  ],
  "Davis & Davis": [
    { month: "Jan", cases: 45, processed: 44, stuck: 1 },
    { month: "Feb", cases: 52, processed: 52, stuck: 0 },
    { month: "Mar", cases: 58, processed: 58, stuck: 0 },
    { month: "Apr", cases: 55, processed: 54, stuck: 1 },
    { month: "May", cases: 72, processed: 71, stuck: 1 },
    { month: "Jun", cases: 80, processed: 79, stuck: 1 },
    { month: "Jul", cases: 88, processed: 87, stuck: 1 },
  ],
};

export default function ReportsPage() {
  const [selectedFirm, setSelectedFirm] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState("This Month");
  const [statusFilter, setStatusFilter] = useState("all");
  const [firmSearch, setFirmSearch] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Selected firm object if specific firm selected
  const activeFirmData = useMemo(() => {
    if (selectedFirm === "all") return null;
    return mockFirmStats.find((f) => f.firm === selectedFirm) || null;
  }, [selectedFirm]);

  // Chart data dynamic by firm
  const chartData = useMemo(() => {
    if (selectedFirm !== "all" && firmChartData[selectedFirm]) {
      return firmChartData[selectedFirm];
    }
    return mockCasesData;
  }, [selectedFirm]);

  // Filtered firm table
  const filteredFirms = useMemo(() => {
    return mockFirmStats.filter((item) => {
      if (selectedFirm !== "all" && item.firm !== selectedFirm) return false;
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (firmSearch.trim()) {
        const q = firmSearch.toLowerCase();
        return item.firm.toLowerCase().includes(q) || item.status.toLowerCase().includes(q);
      }
      return true;
    });
  }, [selectedFirm, statusFilter, firmSearch]);

  const handleResetFilters = () => {
    setSelectedFirm("all");
    setStatusFilter("all");
    setFirmSearch("");
    setSelectedDateRange("This Month");
  };

  const handleExportCSV = () => {
    try {
      const headers = [
        "Firm Name",
        "Total Cases Handled",
        "Average Processing Time",
        "Stuck / Error Count",
        "Users",
      ];
      const rows = filteredFirms.map((f) => [
        `"${f.firm}"`,
        f.casesHandled,
        `"${f.avgProcessingTime}"`,
        f.stuckCount,
        f.users,
      ]);
      const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `Case_Performance_Report_${
          selectedFirm === "all" ? "AllFirms" : selectedFirm.replace(/\s+/g, "_")
        }_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setToastMessage(
        `Operational case report for ${
          selectedFirm === "all" ? "All Firms" : selectedFirm
        } exported successfully.`
      );
      setTimeout(() => setToastMessage(null), 3500);
    } catch {
      setToastMessage("Failed to export report.");
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 bg-slate-50/50 min-h-screen w-full font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[9999] flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-800 text-sm animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Operational Case Reports
            </h1>
            {selectedFirm !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
                <Building2 className="w-3.5 h-3.5 text-teal-600" />
                Filtered: {selectedFirm}
              </span>
            )}
          </div>
          <p className="text-slate-500 mt-1 text-sm">
            {selectedFirm === "all"
              ? "Platform case processing volume, processing speed, and failure rate metrics."
              : `Operational processing breakdown and stuck case metrics for ${selectedFirm}.`}
          </p>
        </div>

        {/* Global Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Firm-wise Filter */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500 transition-all">
            <Building2 className="w-4 h-4 text-teal-600" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Firm:
            </span>
            <select
              value={selectedFirm}
              onChange={(e) => setSelectedFirm(e.target.value)}
              className="text-xs font-semibold text-slate-800 bg-transparent outline-none cursor-pointer"
            >
              <option value="all">All Tenant Firms</option>
              {mockFirmStats.map((f) => (
                <option key={f.id} value={f.firm}>
                  {f.firm}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Filter */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500 transition-all">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Date:
            </span>
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="text-xs text-slate-700 bg-transparent outline-none cursor-pointer font-medium"
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
              <option>All Time</option>
            </select>
          </div>

          {/* Reset Filters if active */}
          {(selectedFirm !== "all" || statusFilter !== "all" || firmSearch.trim()) && (
            <button
              onClick={handleResetFilters}
              title="Reset all filters"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          {/* Export Report */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-[#124b4b] hover:bg-[#0d3636] text-white rounded-lg font-semibold transition-colors shadow-sm text-xs"
          >
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* Operational KPI Cards (3 Cards Grid - Exact Shared Style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Active Tenant Firms */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs relative overflow-hidden group hover:border-slate-300 transition-all">
          <Activity className="absolute -bottom-4 -right-2 w-28 h-28 text-blue-500/5 -rotate-12 group-hover:scale-105 transition-transform pointer-events-none" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {activeFirmData ? "Tenant Firm" : "Active Tenant Firms"}
              </p>
              <h3 className="text-3xl font-black text-slate-900 mt-2 tracking-tight">
                {activeFirmData ? activeFirmData.firm : "14"}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between text-xs relative z-10">
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
              {activeFirmData ? `${activeFirmData.users} Users` : "+2 vs yesterday"}
            </span>
            <span className="text-slate-500 font-medium text-[11px]">
              {activeFirmData ? "Licensed firm" : "19 total registered"}
            </span>
          </div>
        </div>

        {/* Card 2: Total Cases Handled */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs relative overflow-hidden group hover:border-slate-300 transition-all">
          <Briefcase className="absolute -bottom-4 -right-2 w-28 h-28 text-teal-500/5 -rotate-12 group-hover:scale-105 transition-transform pointer-events-none" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {activeFirmData ? `${activeFirmData.firm} Cases` : "Total Cases Handled"}
              </p>
              <h3 className="text-3xl font-black text-slate-900 mt-2 tracking-tight">
                {activeFirmData ? activeFirmData.casesHandled.toLocaleString() : "1,133"}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center border border-teal-100 shrink-0">
              <Briefcase className="w-5 h-5 text-teal-600" />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between text-xs relative z-10">
            <span className="text-teal-700 font-bold bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">
              +14.2% velocity
            </span>
            <span className="text-slate-500 font-medium text-[11px]">Throughput normal</span>
          </div>
        </div>

        {/* Card 3: Avg Processing Time & Stuck Count */}
        <div className="bg-white rounded-2xl border border-rose-200/80 p-6 shadow-xs relative overflow-hidden group hover:border-rose-300 transition-all">
          <AlertTriangle className="absolute -bottom-4 -right-2 w-28 h-28 text-rose-500/5 -rotate-12 group-hover:scale-105 transition-transform pointer-events-none" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">
                Total Stuck / Failure Cases
              </p>
              <h3 className="text-3xl font-black text-slate-900 mt-2 tracking-tight">
                {activeFirmData ? activeFirmData.stuckCount : "3"}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center border border-rose-100 shrink-0">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between text-xs relative z-10">
            <span className="text-rose-700 font-bold bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
              Avg {activeFirmData ? activeFirmData.avgProcessingTime : "2.6 mins"} / case
            </span>
            <span className="text-slate-500 font-medium text-[11px]">Requires investigation</span>
          </div>
        </div>

      </div>

      {/* Primary Visual: Cases Volume Chart (Full Width) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-teal-600" />
              Cases Volume & Processing Throughput
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {activeFirmData
                ? `Monthly case volume and processing breakdown for ${activeFirmData.firm}.`
                : "Primary operational view of case volume added and processed across all firms."}
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-teal-600"></div>
              <span className="text-slate-700">Cases Added</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-indigo-500"></div>
              <span className="text-slate-700">Processed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-rose-500"></div>
              <span className="text-slate-700">Stuck</span>
            </div>
          </div>
        </div>

        <div className="h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
              <Tooltip
                contentStyle={{
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                }}
                cursor={{ fill: "#f8fafc" }}
              />
              <Bar dataKey="cases" fill="#0d9488" radius={[4, 4, 0, 0]} barSize={28} name="Cases Added" />
              <Bar dataKey="processed" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={28} name="Processed Successfully" />
              <Bar dataKey="stuck" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={28} name="Stuck / Failed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Operational Performance Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Operational Case Performance Breakdown
            </h3>
            <p className="text-xs text-slate-500">
              {selectedFirm === "all"
                ? "Tenant firm case volume, average processing duration, and stuck counts."
                : `Operational case metrics breakdown for ${selectedFirm}.`}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* Table Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={firmSearch}
                onChange={(e) => setFirmSearch(e.target.value)}
                placeholder="Search firm..."
                className="w-48 sm:w-60 pl-9 pr-8 py-2 text-xs text-slate-600 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-sm"
              />
              {firmSearch && (
                <button
                  onClick={() => setFirmSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200 whitespace-nowrap">
              <tr>
                <th className="px-6 py-4">Firm Name</th>
                <th className="px-6 py-4">Total Cases Handled</th>
                <th className="px-6 py-4">Average Processing Time</th>
                <th className="px-6 py-4">Stuck / Error Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredFirms.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-400">
                    No firms match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredFirms.map((stat) => (
                  <tr
                    key={stat.id}
                    className={`hover:bg-slate-50/70 transition-colors ${
                      selectedFirm === stat.firm ? "bg-teal-50/40" : ""
                    }`}
                  >
                    <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-teal-700" />
                      {stat.firm}
                    </td>
                    <td className="px-6 py-4 font-extrabold text-slate-900">
                      {stat.casesHandled.toLocaleString()} Cases
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {stat.avgProcessingTime}
                    </td>
                    <td className="px-6 py-4">
                      {stat.stuckCount > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          {stat.stuckCount} Stuck / Error
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          0 Errors
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}



