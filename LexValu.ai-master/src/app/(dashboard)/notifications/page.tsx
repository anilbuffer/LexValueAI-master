"use client"
import { CustomDatePicker } from '@/components/ui/CustomDatePicker'
import React, { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight, Search, Bell, Loader2, CheckCircle2, Filter } from "lucide-react"
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function NotificationsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [readFilter, setReadFilter] = useState("All")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
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

  let isReadParam = ''
  if (readFilter === 'Unread') isReadParam = 'false'
  if (readFilter === 'Read') isReadParam = 'true'

  const apiUrl = `/api/notifications?page=${currentPage}&limit=${ITEMS_PER_PAGE}&search=${encodeURIComponent(debouncedSearch)}&isRead=${isReadParam}&dateFrom=${dateFilter.from}&dateTo=${dateFilter.to}`
  const { data, isLoading, mutate } = useSWR(apiUrl, fetcher, { keepPreviousData: true })

  const notifications: any[] = data?.success ? data.notifications : []
  const totalPages = data?.totalPages || 0
  const totalLogs = data?.total || 0

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE

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

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })
  }

  const markAsRead = async (id: string) => {
    try {
      await fetch('/api/notifications/read', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id })
      });
      mutate(); // re-fetch data
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="w-full p-2.5 pb-[15px] font-sans relative flex flex-col gap-[15px]">
      <div className="bg-white rounded-2xl shadow-md shadow-slate-200/50 border border-slate-200/50 p-5 flex flex-col gap-[20px]">
        {/* Header Section */}
        <div className="flex flex-col min-[992px]:flex-row items-start min-[992px]:items-center justify-between gap-4 min-[992px]:gap-0">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Notifications</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Stay updated on your cases and assignments.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full min-[992px]:w-auto">
            <div className="relative w-full sm:w-72">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="block w-full h-12 pl-12 pr-3 border border-slate-200 rounded-lg text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all cursor-text text-sm"
              />
            </div>

            <div className="relative w-full sm:w-auto">
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
                    {/* Status Filter */}
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Status</label>
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input type="radio" name="readFilter" checked={readFilter === "All"} onChange={() => { setReadFilter("All"); setCurrentPage(1); }} className="rounded-full border-slate-300 text-teal-600 focus:ring-teal-600 focus:ring-offset-0 cursor-pointer" />
                        <span className="text-sm text-slate-700 font-medium group-hover:text-teal-700 transition-colors">All Status</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input type="radio" name="readFilter" checked={readFilter === "Unread"} onChange={() => { setReadFilter("Unread"); setCurrentPage(1); }} className="rounded-full border-slate-300 text-teal-600 focus:ring-teal-600 focus:ring-offset-0 cursor-pointer" />
                        <span className="text-sm text-slate-700 font-medium group-hover:text-teal-700 transition-colors">Unread</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input type="radio" name="readFilter" checked={readFilter === "Read"} onChange={() => { setReadFilter("Read"); setCurrentPage(1); }} className="rounded-full border-slate-300 text-teal-600 focus:ring-teal-600 focus:ring-offset-0 cursor-pointer" />
                        <span className="text-sm text-slate-700 font-medium group-hover:text-teal-700 transition-colors">Read</span>
                      </label>
                    </div>

                    <div className="h-px bg-slate-100 my-4 w-full"></div>

                    {/* Date Filter */}
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Date Range</div>
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
                          className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all cursor-pointer bg-white"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => {
                          setReadFilter("All");
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
          <table className="w-full min-w-[800px] text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-200/60">
                <th className="py-4 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Type</th>
                <th className="py-4 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Message</th>
                <th className="py-4 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="py-4 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Loader2 className="w-8 h-8 text-teal-600 animate-spin mb-4" />
                      <h3 className="text-base font-bold text-slate-800">Loading notifications...</h3>
                    </div>
                  </td>
                </tr>
              ) : notifications.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-4">
                        <Bell className="w-8 h-8 text-slate-300" />
                      </div>
                      <h3 className="text-base font-bold text-slate-800">No notifications found</h3>
                      <p className="text-sm font-medium text-slate-500 mt-1">You are all caught up.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                notifications.map((notif) => (
                  <tr key={notif.id} className={`border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors group ${!notif.isRead ? 'bg-slate-50/30' : ''}`}>
                    <td className="py-4 px-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                        {notif.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2">
                        {!notif.isRead && <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0"></span>}
                        <span className={`text-sm ${!notif.isRead ? 'font-bold text-slate-900' : 'font-medium text-slate-600'}`}>
                          {notif.message}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <span className="text-sm font-medium text-slate-500">{formatDate(notif.createdAt)}</span>
                    </td>
                    <td className="py-4 px-2 text-right">
                      {!notif.isRead ? (
                        <button 
                          onClick={() => markAsRead(notif.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Mark as Read
                        </button>
                      ) : (
                        <span className="text-xs font-medium text-slate-400">Read</span>
                      )}
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
