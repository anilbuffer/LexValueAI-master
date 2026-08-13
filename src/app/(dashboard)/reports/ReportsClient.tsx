"use client"
import { CustomDatePicker } from '@/components/ui/CustomDatePicker'

import { useState, useRef, useEffect } from "react"
import { Filter, Loader2, Search, Briefcase, BrainCircuit, FileWarning, Undo2, CheckCircle2, Clock, Flag, TrendingUp, Medal, Star } from "lucide-react"

const formatDateStr = (isoString: string | null) => {
  if (!isoString) return "—";
  const date = new Date(isoString);
  const formatted = date.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true
  });
  // Adjusts format to "Aug 4, 2026 at 2:30 PM"
  return formatted.replace(/, (\d+:\d+ [APM]+)/i, ' at $1');
};

const metricIcons: Record<string, React.ReactNode> = {
  my_cases: <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center"><Briefcase className="w-4 h-4 text-teal-600" /></div>,
  analyzed: <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center"><BrainCircuit className="w-4 h-4 text-emerald-600" /></div>,
  missing_docs: <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center"><FileWarning className="w-4 h-4 text-rose-600" /></div>,
  total_flags: <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center"><Flag className="w-4 h-4 text-orange-600" /></div>,
  top_category: <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center"><TrendingUp className="w-4 h-4 text-purple-600" /></div>,
  top_approved_category: <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center"><TrendingUp className="w-4 h-4 text-teal-600" /></div>,
  top_rejected_category: <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center"><TrendingUp className="w-4 h-4 text-rose-600" /></div>,
  returned: <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center"><Undo2 className="w-4 h-4 text-amber-600" /></div>,
  approved: <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-teal-600" /></div>,
  pending: <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center"><Clock className="w-4 h-4 text-indigo-600" /></div>,
  top_attorney: <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center"><Medal className="w-4 h-4 text-blue-600" /></div>,
  top_paralegal: <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center"><Star className="w-4 h-4 text-teal-600" /></div>,
  top_managing_partner: <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center"><Medal className="w-4 h-4 text-purple-600" /></div>,
  top_closed_category: <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center"><TrendingUp className="w-4 h-4 text-purple-600" /></div>,
  closed_cases: <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-emerald-600" /></div>,
  ai_usage: <div className="w-8 h-8 rounded-lg bg-fuchsia-50 flex items-center justify-center"><BrainCircuit className="w-4 h-4 text-fuchsia-600" /></div>,
  turnaround_time: <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center"><Clock className="w-4 h-4 text-orange-600" /></div>,
};

// Simulated Reports Data
const getMockReports = (isAdmin: boolean, isManagingPartner: boolean) => {
  if (isAdmin) {
    return [
      { id: 'total_cases', metric: 'Total Cases in System', count: 1205, statusType: 'neutral', statusText: 'All time', lastUpdated: new Date().toISOString() },
      { id: 'ai_usage', metric: 'AI Scan Requests', count: 980, statusType: 'positive', statusText: '+15% this week', lastUpdated: new Date().toISOString() },
      { id: 'total_flags', metric: 'Total Flags Generated', count: 4320, statusType: 'neutral', statusText: 'Across all cases', lastUpdated: new Date().toISOString() }
    ];
  }
  if (isManagingPartner) {
    return [
      { id: 'my_cases', metric: 'Team Cases', count: 45, statusType: 'positive', statusText: '+5 this week', lastUpdated: new Date().toISOString() },
      { id: 'approved', metric: 'Approved Cases', count: 32, statusType: 'positive', statusText: '+2 today', lastUpdated: new Date().toISOString() },
      { id: 'pending', metric: 'Pending Approval', count: 8, statusType: 'warning', statusText: 'Action required', lastUpdated: new Date().toISOString() },
      { id: 'returned', metric: 'Returned Cases', count: 5, statusType: 'negative', statusText: 'Needs review', lastUpdated: new Date().toISOString() }
    ];
  }
  return [
    { id: 'my_cases', metric: 'My Cases', count: 12, statusType: 'positive', statusText: 'Up to date', lastUpdated: new Date().toISOString() },
    { id: 'analyzed', metric: 'AI Analyzed', count: 10, statusType: 'positive', statusText: 'Scan completed', lastUpdated: new Date().toISOString() },
    { id: 'pending', metric: 'Pending Approval', count: 2, statusType: 'warning', statusText: 'Awaiting manager', lastUpdated: new Date().toISOString() }
  ];
};

export function ReportsClient({ isManagingPartner = false, isAdmin = false }: { isManagingPartner?: boolean, isAdmin?: boolean }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [dateFilter, setDateFilter] = useState({ from: "", to: "" })
  const [searchQuery, setSearchQuery] = useState("")
  const filterRef = useRef<HTMLDivElement>(null)

  const [currentData, setCurrentData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    setCurrentData(getMockReports(isAdmin, isManagingPartner));
    setIsLoading(false)
  }, [isAdmin, isManagingPartner])

  const filteredData = currentData.filter(row => row.metric.toLowerCase().includes(searchQuery.toLowerCase()))

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const getStatusBadge = (id: string, type: string, text: string) => {
    // Split the text to highlight the first part (like "+2", "Action required")
    const words = text.split(" ");
    let badgeText = words[0];
    let remainingText = words.slice(1).join(" ");

    if (id === 'top_category' || id === 'top_attorney' || id === 'top_paralegal') {
      badgeText = "";
      remainingText = text;
    } else if (text.startsWith("Action required")) {
      badgeText = "Action required";
      remainingText = text.replace("Action required", "").trim();
    } else if (text.startsWith("Needs review")) {
      badgeText = "Needs review";
      remainingText = text.replace("Needs review", "").trim();
    } else if (text.startsWith("Awaiting")) {
      badgeText = "Awaiting";
      remainingText = text.replace("Awaiting", "").trim();
    } else if (text.startsWith("No action") || text.startsWith("No returns") || text.startsWith("All caught") || text.startsWith("in selected")) {
      badgeText = "";
      remainingText = text;
    }

    let badgeClass = "bg-slate-100 text-slate-600";
    if (type === 'positive') badgeClass = "bg-emerald-50 text-emerald-600 border-emerald-100";
    if (type === 'negative') badgeClass = "bg-rose-50 text-rose-600 border-rose-100";
    if (type === 'warning') badgeClass = "bg-amber-50 text-amber-600 border-amber-100";
    if (badgeText === 'Awaiting') badgeClass = "bg-indigo-50 text-indigo-600 border-indigo-100";

    return (
      <div className="flex items-center gap-2">
        {badgeText && (
          <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${badgeClass}`}>
            {badgeText}
          </span>
        )}
        <span className="text-sm font-medium text-slate-500">{remainingText}</span>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md shadow-slate-200/50 border border-slate-200/50 p-5 flex flex-col gap-[20px]">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
              {isAdmin ? 'System Performance Reports' : (isManagingPartner ? 'Team Performance Reports' : 'My Performance Reports')}
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              {isAdmin ? 'Review system-wide case activity and metrics in real-time.' : (isManagingPartner ? 'Review team-wide case activity and metrics in real-time.' : 'Review your case activity and metrics in real-time.')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-72">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search metrics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full h-12 pl-12 pr-3 border border-slate-200 rounded-lg text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all cursor-text text-sm"
              />
            </div>

            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 h-12 rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-sm font-medium transition-all hover:cursor-pointer"
              >
                <Filter className="w-5 h-5 text-slate-400" />
                Filter
              </button>

              {/* Filter Dropdown */}
              {isFilterOpen && (
                <div className="absolute right-0 top-full mt-2 w-[400px] bg-white border border-slate-200 rounded-xl shadow-lg shadow-slate-200/50 z-50">
                  <div className="p-6">
                    {/* Date Filter */}
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Filter Period</div>
                    <div className="flex gap-4">
                      <div className="flex-1 flex flex-col gap-2">
                        <label className="text-[13px] font-semibold text-slate-600">From</label>
                        <CustomDatePicker type="date"
                          value={dateFilter.from}
                          onChange={(e: any) => setDateFilter(prev => ({ ...prev, from: e.target.value }))}
                          className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all cursor-pointer bg-white"
                        />
                      </div>
                      <div className="flex-1 flex flex-col gap-2">
                        <label className="text-[13px] font-semibold text-slate-600">To</label>
                        <CustomDatePicker type="date"
                          value={dateFilter.to}
                          onChange={(e: any) => setDateFilter(prev => ({ ...prev, to: e.target.value }))}
                          className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all cursor-pointer bg-white"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => {
                          setDateFilter({ from: "", to: "" });
                        }}
                        className="text-xs font-semibold text-teal-600 hover:text-teal-700 hover:underline cursor-pointer"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="p-4 pb-3">Metric</th>
                <th className="p-4 pb-3">Count</th>
                <th className="p-4 pb-3">Status</th>
                <th className="p-4 pb-3 text-right">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center">
                    <Loader2 className="w-8 h-8 text-teal-500 animate-spin mx-auto mb-4" />
                    <p className="text-sm font-medium text-slate-500">Loading KPI Data...</p>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-slate-500 text-sm font-medium">
                    No data available for the selected period.
                  </td>
                </tr>
              ) : (
                filteredData.map((row: any) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50/50 transition-colors duration-150"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {metricIcons[row.id]}
                        <span className="font-semibold text-slate-800 text-sm">{row.metric}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-bold text-slate-700">
                        {row.count}
                      </span>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(row.id, row.statusType, row.statusText)}
                    </td>
                    <td className="p-4 text-right text-sm font-medium text-slate-400">
                      {formatDateStr(row.lastUpdated)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </>
  )
}
