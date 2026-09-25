"use client";

import { useState, useMemo } from "react";
import { Download, Building2, Briefcase, DollarSign, Search, Filter, TrendingUp, X, CheckCircle2, RotateCcw, Users } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const mockRevenueData = [
  { month: "Jan", revenue: 45000, cases: 120 },
  { month: "Feb", revenue: 52000, cases: 132 },
  { month: "Mar", revenue: 61000, cases: 145 },
  { month: "Apr", revenue: 58000, cases: 140 },
  { month: "May", revenue: 75000, cases: 180 },
  { month: "Jun", revenue: 82000, cases: 195 },
  { month: "Jul", revenue: 95000, cases: 210 },
];

const mockFirmStats = [
  { id: 1, firm: "Smith & Associates", cases: 345, revenue: "$145,000", revenueNum: 145000, status: "Active", users: 15, growth: "+12%" },
  { id: 2, firm: "Johnson Legal Group", cases: 128, revenue: "$42,500", revenueNum: 42500, status: "Active", users: 5, growth: "+5%" },
  { id: 3, firm: "Miller & Partners", cases: 210, revenue: "$85,000", revenueNum: 85000, status: "Warning", users: 10, growth: "-2%" },
  { id: 4, firm: "Davis & Davis", cases: 450, revenue: "$210,000", revenueNum: 210000, status: "Active", users: 24, growth: "+18%" },
];

const firmChartData: Record<string, { month: string; revenue: number; cases: number }[]> = {
  "Smith & Associates": [
    { month: "Jan", revenue: 14000, cases: 32 },
    { month: "Feb", revenue: 16500, cases: 38 },
    { month: "Mar", revenue: 19000, cases: 42 },
    { month: "Apr", revenue: 18200, cases: 40 },
    { month: "May", revenue: 23500, cases: 52 },
    { month: "Jun", revenue: 25800, cases: 58 },
    { month: "Jul", revenue: 28000, cases: 65 },
  ],
  "Johnson Legal Group": [
    { month: "Jan", revenue: 4200, cases: 12 },
    { month: "Feb", revenue: 5100, cases: 15 },
    { month: "Mar", revenue: 5800, cases: 18 },
    { month: "Apr", revenue: 5500, cases: 16 },
    { month: "May", revenue: 7000, cases: 20 },
    { month: "Jun", revenue: 7400, cases: 22 },
    { month: "Jul", revenue: 7500, cases: 25 },
  ],
  "Miller & Partners": [
    { month: "Jan", revenue: 9500, cases: 25 },
    { month: "Feb", revenue: 11000, cases: 28 },
    { month: "Mar", revenue: 13000, cases: 30 },
    { month: "Apr", revenue: 12500, cases: 29 },
    { month: "May", revenue: 13500, cases: 32 },
    { month: "Jun", revenue: 13000, cases: 31 },
    { month: "Jul", revenue: 12500, cases: 35 },
  ],
  "Davis & Davis": [
    { month: "Jan", revenue: 18000, cases: 45 },
    { month: "Feb", revenue: 21000, cases: 52 },
    { month: "Mar", revenue: 24000, cases: 58 },
    { month: "Apr", revenue: 23000, cases: 55 },
    { month: "May", revenue: 32000, cases: 72 },
    { month: "Jun", revenue: 36000, cases: 80 },
    { month: "Jul", revenue: 42000, cases: 88 },
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
    return mockRevenueData;
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
      const headers = ["Firm Name", "Status", "Total Cases", "Total Revenue", "Total Users", "MoM Growth"];
      const rows = filteredFirms.map((f) => [
        `"${f.firm}"`,
        f.status,
        f.cases,
        `"${f.revenue}"`,
        f.users,
        `"${f.growth}"`,
      ]);
      const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `Platform_Report_${selectedFirm === "all" ? "AllFirms" : selectedFirm.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setToastMessage(
        `Report for ${selectedFirm === "all" ? "All Firms" : selectedFirm} exported successfully.`
      );
      setTimeout(() => setToastMessage(null), 3500);
    } catch {
      setToastMessage("Failed to export report.");
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  return (
    <div className="p-6 space-y-6 w-full">
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
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Platform Analytics</h1>
            {selectedFirm !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
                <Building2 className="w-3.5 h-3.5 text-teal-600" />
                Filtered: {selectedFirm}
              </span>
            )}
          </div>
          <p className="text-slate-500 mt-1">
            {selectedFirm === "all"
              ? "Superadmin overview of all firms, cases, and revenue."
              : `Dedicated report view and performance metrics for ${selectedFirm}.`}
          </p>
        </div>

        {/* Global Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Firm-wise Filter */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500 transition-all">
            <Building2 className="w-4 h-4 text-teal-600" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Firm:</span>
            <select
              value={selectedFirm}
              onChange={(e) => setSelectedFirm(e.target.value)}
              className="text-sm font-semibold text-slate-800 bg-transparent outline-none cursor-pointer"
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
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date:</span>
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="text-sm text-slate-700 bg-transparent outline-none cursor-pointer font-medium"
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
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0f766e] hover:bg-[#0d655e] text-white rounded-lg font-semibold transition-colors shadow-sm text-sm"
          >
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Card 1: Active Firms / Selected Firm Status */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4 hover:border-slate-300 transition-colors">
          <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">
              {activeFirmData ? "Tenant Firm" : "Total Active Firms"}
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {activeFirmData ? activeFirmData.firm : "142"}
            </p>
            <div className="flex items-center gap-1 mt-1 text-xs font-medium text-emerald-600">
              {activeFirmData ? (
                <span className="flex items-center gap-1 text-slate-600">
                  <Users className="w-3 h-3 text-indigo-600" /> {activeFirmData.users} Licensed Seats
                </span>
              ) : (
                <>
                  <TrendingUp className="w-3 h-3" /> 12 new this month
                </>
              )}
            </div>
          </div>
        </div>

        {/* Card 2: Cases Managed */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4 hover:border-slate-300 transition-colors">
          <div className="w-12 h-12 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">
              {activeFirmData ? `${activeFirmData.firm} Cases` : "Total Cases Managed"}
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {activeFirmData ? activeFirmData.cases.toLocaleString() : "12,450"}
            </p>
            <div className="flex items-center gap-1 mt-1 text-xs font-medium text-emerald-600">
              <TrendingUp className="w-3 h-3" />
              {activeFirmData ? `${activeFirmData.growth} MoM growth` : "+8.4% from last month"}
            </div>
          </div>
        </div>

        {/* Card 3: Platform / Firm Revenue */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4 hover:border-slate-300 transition-colors">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">
              {activeFirmData ? `${activeFirmData.firm} Revenue` : "Total Platform Revenue"}
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {activeFirmData ? activeFirmData.revenue : "$468,000"}
            </p>
            <div className="flex items-center gap-1 mt-1 text-xs font-medium text-emerald-600">
              <TrendingUp className="w-3 h-3" />
              {activeFirmData
                ? `Avg $${Math.round(activeFirmData.revenueNum / activeFirmData.cases)}/case`
                : "+15.2% YoY"}
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Revenue Over Time</h3>
            <p className="text-sm text-slate-500">
              {activeFirmData
                ? `Monthly revenue trend for ${activeFirmData.firm}.`
                : "Monthly aggregate revenue across all firms."}
            </p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  tickFormatter={(value) => `$${value >= 1000 ? `${value / 1000}k` : value}`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(value: any) => [`$${Number(value || 0).toLocaleString()}`, "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-900">New Cases Volume</h3>
            <p className="text-sm text-slate-500">
              {activeFirmData
                ? `Monthly new cases added by ${activeFirmData.firm}.`
                : "Number of cases added per month globally."}
            </p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  cursor={{ fill: "#f1f5f9" }}
                />
                <Bar dataKey="cases" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={32} name="Cases Added" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Firm Performance Breakdown Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Firm Performance Breakdown</h3>
            <p className="text-sm text-slate-500">
              {selectedFirm === "all"
                ? "Detailed metrics per tenant firm."
                : `Filtered breakdown for ${selectedFirm}.`}
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
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200 whitespace-nowrap">
              <tr>
                <th className="px-6 py-4">Firm Name</th>
                <th className="px-6 py-4">Total Cases</th>
                <th className="px-6 py-4">Total Revenue</th>
                <th className="px-6 py-4">Total Users</th>
                <th className="px-6 py-4">MoM Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredFirms.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-400">
                    No firms match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredFirms.map((stat) => (
                  <tr
                    key={stat.id}
                    className={`hover:bg-slate-50 transition-colors ${selectedFirm === stat.firm ? "bg-teal-50/40" : ""}`}
                  >
                    <td className="px-6 py-4 font-semibold text-slate-900 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      {stat.firm}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700">{stat.cases.toLocaleString()}</td>
                    <td className="px-6 py-4 font-semibold text-emerald-700">{stat.revenue}</td>
                    <td className="px-6 py-4">{stat.users}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-medium ${stat.growth.startsWith("+") ? "text-emerald-600" : "text-red-600"
                          }`}
                      >
                        {stat.growth}
                      </span>
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


