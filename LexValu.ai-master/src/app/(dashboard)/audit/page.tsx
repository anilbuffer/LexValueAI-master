"use client"
import { CustomDatePicker } from '@/components/ui/CustomDatePicker'
import React, { useState, useRef, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight, Search, Filter, Shield, Calendar, Activity, Loader2, ArrowRight } from "lucide-react"
import { getUserRole } from "@/app/actions/auth"
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function AuditLogPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("All")
  const [dateFilter, setDateFilter] = useState({ from: "", to: "" })
  const ITEMS_PER_PAGE = 10

  const searchParams = useSearchParams();
  const query = searchParams.get("search");

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
      setDebouncedSearch(query);
    } else {
      setSearchQuery("");
      setDebouncedSearch("");
    }
  }, [query]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setCurrentPage(1)
    }, 500)
    return () => clearTimeout(handler)
  }, [searchQuery])

  const apiUrl = `/api/audit-logs?page=${currentPage}&limit=${ITEMS_PER_PAGE}&search=${encodeURIComponent(debouncedSearch)}&role=${roleFilter}&fromDate=${dateFilter.from}&toDate=${dateFilter.to}`
  const { data, isLoading } = useSWR(apiUrl, fetcher, { keepPreviousData: true })

  const currentLogs: any[] = data?.success ? data.logs : []
  const totalPages = data?.totalPages || 0
  const totalLogs = data?.total || 0

  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [role, setRole] = useState<string | null>(null)
  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getUserRole().then(setRole)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + currentLogs.length

  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages)
      }
    }
    return pages
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  const formatDate = (dateString: string) => {
    const d = new Date(dateString)
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + " " + d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="w-full p-2.5 pb-[15px] font-sans relative flex flex-col gap-[15px]">
      {/* Main Container matching the dashboard theme */}
      <div className="bg-white rounded-2xl shadow-md shadow-slate-200/50 border border-slate-200/50 p-5 flex flex-col gap-[20px]">
        {/* Header Section */}
        <div className="flex flex-col min-[992px]:flex-row items-start min-[992px]:items-center justify-between gap-4 min-[992px]:gap-0">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Audit Log</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Track user activity and system events.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full min-[992px]:w-auto">
            <div className="relative w-full sm:w-72">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="block w-full h-12 pl-12 pr-3 border border-slate-200 rounded-lg text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all cursor-text text-sm"
              />
            </div>

            <div className="relative w-full sm:w-auto" ref={filterRef}>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center justify-center gap-2 px-4 h-12 w-full rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-sm font-medium transition-all hover:cursor-pointer"
              >
                <Filter className="w-5 h-5 text-slate-400" />
                Filter
              </button>

              {/* Filter Dropdown */}
              {isFilterOpen && (
                <div className="absolute right-0 top-full mt-2 w-full sm:w-[400px] bg-white border border-slate-200 rounded-xl shadow-lg shadow-slate-200/50 z-50">
                  <div className="p-6">
                    {role !== 'PARALEGAL' && role !== 'ATTORNEY' && (
                      <>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Role Filter</div>
                        <select
                          value={roleFilter}
                          onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
                          className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 bg-white cursor-pointer"
                        >
                          <option value="All">All Roles</option>
                          {role === 'ADMIN' && (
                            <>
                              <option value="MANAGING_PARTNER">Managing Partner</option>
                              <option value="ATTORNEY">Attorney</option>
                              <option value="PARALEGAL">Paralegal</option>
                            </>
                          )}
                          {role === 'MANAGING_PARTNER' && (
                            <>
                              <option value="ATTORNEY">Attorney</option>
                              <option value="PARALEGAL">Paralegal</option>
                            </>
                          )}
                        </select>
                        <div className="h-px bg-slate-100 my-4 w-full"></div>
                      </>
                    )}

                    {/* Date Filter */}
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Date Range</div>
                    <div className="flex flex-col min-[480px]:flex-row gap-4">
                      <div className="flex-1 flex flex-col gap-2">
                        <label className="text-[13px] font-semibold text-slate-600">From</label>
                        <CustomDatePicker type="date"
                          value={dateFilter.from}
                          onChange={(e) => { setDateFilter(prev => ({ ...prev, from: e.target.value })); setCurrentPage(1); }}
                          className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all cursor-pointer bg-white"
                        />
                      </div>
                      <div className="flex-1 flex flex-col gap-2">
                        <label className="text-[13px] font-semibold text-slate-600">To</label>
                        <CustomDatePicker type="date"
                          value={dateFilter.to}
                          onChange={(e) => { setDateFilter(prev => ({ ...prev, to: e.target.value })); setCurrentPage(1); }}
                          className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-600/20 focus:border-slate-600 bg-white cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => {
                          setRoleFilter("All");
                          setDateFilter({ from: "", to: "" });
                          setCurrentPage(1);
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
        <div className="mt-4 overflow-x-auto custom-scrollbar pb-2">
          <table className="w-full min-w-[900px] text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-200/60">
                <th className="py-4 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">User</th>
                <th className="py-4 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                <th className="py-4 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Action</th>
                <th className="py-4 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Details</th>
                <th className="py-4 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Timestamp</th>
              </tr>
             </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Loader2 className="w-8 h-8 text-teal-600 animate-spin mb-4" />
                      <h3 className="text-base font-bold text-slate-800">Loading audit logs...</h3>
                    </div>
                  </td>
                </tr>
              ) : currentLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-4">
                        <Activity className="w-8 h-8 text-slate-300" />
                      </div>
                      <h3 className="text-base font-bold text-slate-800">No activity found</h3>
                      <p className="text-sm font-medium text-slate-500 mt-1">We couldn't find any audit logs matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentLogs.map((log) => (
                  <tr key={log.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800 group-hover:text-teal-600 transition-colors">{log.user.name}</span>
                        <span className="text-xs font-medium text-slate-500">{log.user.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
                        {log.user.role === 'ADMIN' && <Shield className="w-4 h-4 text-purple-500" />}
                        {log.user.role === 'MANAGING_PARTNER' && <Shield className="w-4 h-4 text-blue-500" />}
                        {log.user.role === 'ATTORNEY' && <Shield className="w-4 h-4 text-teal-500" />}
                        {log.user.role === 'PARALEGAL' && <Shield className="w-4 h-4 text-slate-400" />}
                        <span className="capitalize">{log.user.role.replace('_', ' ').toLowerCase()}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      <span className="text-sm text-slate-600 line-clamp-2 max-w-md">{log.details}</span>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-sm font-medium">{formatDate(log.timestamp)}</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between border-t border-slate-200/60 pt-4 gap-4 md:gap-0">
          <span className="text-sm text-slate-500 font-medium text-center md:text-left">
            Showing {totalLogs > 0 ? startIndex + 1 : 0} to {totalLogs > 0 ? Math.min(startIndex + ITEMS_PER_PAGE, totalLogs) : 0} of {totalLogs} entries
          </span>
          <div className="flex flex-wrap items-center justify-center gap-1">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4 pointer-events-none" />
            </button>

            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' && setCurrentPage(page)}
                disabled={page === "..."}
                className={`flex items-center justify-center w-8 h-8 rounded-lg text-sm font-semibold transition-colors hover:cursor-pointer ${page === currentPage
                  ? "bg-teal-600 text-white shadow-sm shadow-teal-600/20 border-transparent"
                  : page === "..."
                    ? "text-slate-400 bg-transparent border-transparent cursor-default"
                    : "text-slate-600 bg-white border border-slate-200 hover:bg-slate-50"
                  }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages || totalPages === 0}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer transition-colors"
            >
              <ChevronRight className="w-4 h-4 pointer-events-none" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
