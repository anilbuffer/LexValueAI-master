"use client"
import { CustomDatePicker } from '@/components/ui/CustomDatePicker'
import React, { useState, useRef, useEffect } from "react"
import { CreditCard, ArrowUpRight, Download, Clock, ShieldCheck, Zap, Search, Filter, ChevronLeft, ChevronRight, FileText, X, Trash2, AlertTriangle } from "lucide-react"
import { getUserRole } from "@/app/actions/auth"

export default function BillingPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isManageSeatsOpen, setIsManageSeatsOpen] = useState(false)
  const [isDeleteCardOpen, setIsDeleteCardOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState("All")
  const [dateFilter, setDateFilter] = useState({ from: "", to: "" })
  const [role, setRole] = useState<string | null>(null)
  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getUserRole().then(setRole)
  }, [])
  
  const ITEMS_PER_PAGE = 5

  const allInvoices = [
    { id: "INV-2023-08", date: "Aug 01, 2023, 10:30 AM", amount: "$499.00", status: "Paid", plan: "Enterprise", isoDate: "2023-08-01" },
    { id: "INV-2023-07", date: "Jul 01, 2023, 11:15 AM", amount: "$499.00", status: "Paid", plan: "Enterprise", isoDate: "2023-07-01" },
    { id: "INV-2023-06", date: "Jun 01, 2023, 09:45 AM", amount: "$499.00", status: "Paid", plan: "Enterprise", isoDate: "2023-06-01" },
    { id: "INV-2023-05", date: "May 01, 2023, 02:20 PM", amount: "$499.00", status: "Paid", plan: "Enterprise", isoDate: "2023-05-01" },
    { id: "INV-2023-04", date: "Apr 01, 2023, 01:05 PM", amount: "$499.00", status: "Paid", plan: "Enterprise", isoDate: "2023-04-01" },
    { id: "INV-2023-03", date: "Mar 01, 2023, 10:00 AM", amount: "$299.00", status: "Paid", plan: "Pro", isoDate: "2023-03-01" },
    { id: "INV-2023-02", date: "Feb 01, 2023, 04:30 PM", amount: "$299.00", status: "Paid", plan: "Pro", isoDate: "2023-02-01" },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const filteredInvoices = allInvoices.filter(inv => {
    // Search match
    const matchesSearch = inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inv.date.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status match
    const matchesStatus = statusFilter === "All" || inv.status === statusFilter;
    
    // Date match
    let matchesDate = true;
    if (dateFilter.from) {
      matchesDate = matchesDate && new Date(inv.isoDate) >= new Date(dateFilter.from);
    }
    if (dateFilter.to) {
      matchesDate = matchesDate && new Date(inv.isoDate) <= new Date(dateFilter.to);
    }

    return matchesSearch && matchesStatus && matchesDate;
  })

  const totalPages = Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentInvoices = filteredInvoices.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const goToNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1) }
  const goToPrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1) }

  return (
    <div className="w-full p-2.5 pb-[15px] font-sans relative flex flex-col gap-[15px]">
      
      {/* Header Section Container */}
      <div className="bg-white rounded-2xl shadow-md shadow-slate-200/50 border border-slate-200/50 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Billing & Subscriptions</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Manage your firm's subscription plan, payment methods, and billing history.</p>
          </div>
          {role === 'ADMIN' && (
            <div className="flex items-center gap-3">
               <button className="h-12 flex justify-center items-center px-5 border border-transparent rounded-lg text-sm font-medium text-white bg-teal-900 hover:bg-teal-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-900 transition-all cursor-pointer group">
                View Pricing Plans
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Top Section: Plan & Payment Method */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[15px]">
        
        {/* Left Column: Current Plan (takes 2 columns) */}
        <div className="lg:col-span-2 flex flex-col h-full">
          <div className="bg-white rounded-2xl shadow-md shadow-slate-200/50 border border-slate-200/50 p-6 flex flex-col justify-between hover:shadow-lg hover:shadow-slate-200/60 transition-all h-full">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-teal-50 border border-teal-100 rounded-xl flex items-center justify-center shrink-0">
                  <Zap className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Enterprise Plan</h2>
                  <p className="text-sm font-medium text-slate-500">Billed monthly</p>
                </div>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                Active
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-6 border-y border-slate-100">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Current Usage</p>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold text-slate-800 tracking-tight">12</span>
                  <span className="text-sm font-medium text-slate-500 mb-1.5">/ 15 Users</span>
                </div>
              </div>
              
              <div className="h-full w-px bg-slate-100 hidden sm:block"></div>
              
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Next Billing Date</p>
                <div className="flex items-end gap-2">
                  <span className="text-xl font-bold text-slate-800">September 1, 2023</span>
                </div>
              </div>
              
              <div className="h-full w-px bg-slate-100 hidden sm:block"></div>
              
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Monthly Cost</p>
                <div className="flex items-end gap-1">
                  <span className="text-xl font-bold text-slate-800">$499</span>
                  <span className="text-sm font-medium text-slate-500 mb-0.5">.00</span>
                </div>
              </div>
            </div>

            {role === 'ADMIN' && (
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button className="h-12 flex-1 flex justify-center items-center px-5 border border-transparent rounded-lg text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 transition-all shadow-sm shadow-teal-600/20 cursor-pointer group">
                  <Zap className="w-4 h-4 mr-2" />
                  Upgrade Plan
                  <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
                <button 
                  onClick={() => setIsManageSeatsOpen(true)}
                  className="h-12 flex-1 flex justify-center items-center px-5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Manage Seats
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Payment Method (takes 1 column) */}
        <div className="flex flex-col h-full">
          <div className="bg-white rounded-2xl shadow-md shadow-slate-200/50 border border-slate-200/50 p-6 flex flex-col justify-between hover:shadow-lg hover:shadow-slate-200/60 transition-all h-full">
            <div>
              <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-800">Payment Method</h2>
                <p className="text-sm font-medium text-slate-500 mt-1">Manage your credit cards.</p>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between bg-slate-50/50 group/card hover:border-slate-300 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-9 bg-white border border-slate-200 rounded flex items-center justify-center shadow-sm shrink-0">
                    <span className="font-bold text-blue-800 text-xs italic tracking-tighter">VISA</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Visa ending in 4242</p>
                    <p className="text-xs font-medium text-slate-500">Expires 12/2025</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Default</span>
                  {role === 'ADMIN' && (
                    <>
                      <div className="w-px h-4 bg-slate-200 hidden sm:block"></div>
                      <button 
                        onClick={() => setIsDeleteCardOpen(true)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {role === 'ADMIN' && (
              <button 
                onClick={() => setIsPaymentModalOpen(true)}
                className="mt-6 h-12 w-full flex justify-center items-center px-5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-all cursor-pointer group"
              >
                <CreditCard className="w-4 h-4 mr-2 text-slate-400 group-hover:text-teal-600 transition-colors" />
                Add Payment Method
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Bottom Section: Billing History Table */}
      <div className="bg-white rounded-2xl shadow-md shadow-slate-200/50 border border-slate-200/50 p-5 flex flex-col gap-[20px]">
        
        {/* Table Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Billing History</h2>
            <p className="text-slate-500 text-sm mt-1 font-medium">View and download past invoices.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-72">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search invoices..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="block w-full h-12 pl-12 pr-3 border border-slate-200 rounded-lg text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all cursor-text text-sm"
              />
            </div>
            
            <div className="relative" ref={filterRef}>
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 h-12 rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-sm font-medium transition-all cursor-pointer"
              >
                <Filter className="w-5 h-5 text-slate-400" />
                Filter
              </button>

              {/* Filter Dropdown */}
              {isFilterOpen && (
                <div className="absolute right-0 top-full mt-2 w-[400px] bg-white border border-slate-200 rounded-xl shadow-lg shadow-slate-200/50 z-50">
                  <div className="p-6">
                    {/* Status Filter */}
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Status</div>
                    <select
                      value={statusFilter}
                      onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 bg-white cursor-pointer"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Paid">Paid</option>
                      <option value="Unpaid">Unpaid</option>
                      <option value="Failed">Failed</option>
                    </select>

                    <div className="h-px bg-slate-100 my-4 w-full"></div>

                    {/* Date Filter */}
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Invoice Date</div>
                    <div className="flex gap-4">
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
                          setStatusFilter("All");
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

        {/* Table */}
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/60">
                <th className="py-4 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Invoice ID</th>
                <th className="py-4 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Date & Time</th>
                <th className="py-4 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Plan</th>
                <th className="py-4 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="py-4 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="py-4 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentInvoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-4">
                        <FileText className="w-8 h-8 text-slate-300" />
                      </div>
                      <h3 className="text-base font-bold text-slate-800">No invoices found</h3>
                      <p className="text-sm font-medium text-slate-500 mt-1">We couldn't find any invoices matching your search.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors group cursor-pointer">
                    <td className="py-4 px-2">
                      <span className="text-sm font-bold text-slate-800 group-hover:text-teal-600 transition-colors">{invoice.id}</span>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-sm font-medium">{invoice.date}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <span className="text-sm font-medium text-slate-600">{invoice.plan}</span>
                    </td>
                    <td className="py-4 px-2">
                      <span className="text-sm font-bold text-slate-800">{invoice.amount}</span>
                    </td>
                    <td className="py-4 px-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <button className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-teal-600 shadow-sm transition-all cursor-pointer">
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {filteredInvoices.length > 0 && (
          <div className="flex items-center justify-between border-t border-slate-200/60 pt-4">
            <span className="text-sm text-slate-500 font-medium">
              Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredInvoices.length)} of {filteredInvoices.length} entries
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-4 h-4 pointer-events-none" />
              </button>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer transition-colors"
              >
                <ChevronRight className="w-4 h-4 pointer-events-none" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Security Badge */}
      <div className="flex items-center justify-center gap-2 mt-2 text-slate-400">
        <ShieldCheck className="w-4 h-4" />
        <span className="text-xs font-medium">Payments are securely processed by Stripe. Your data is encrypted and HIPAA compliant.</span>
      </div>

      {/* Payment Method Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-stretch justify-end" onClick={() => setIsPaymentModalOpen(false)}>
          <div className="bg-white shadow-2xl border-l border-slate-200 w-full max-w-md overflow-hidden animate-slide-in-right flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
              <h2 className="text-xl font-bold text-slate-800">Add Payment Method</h2>
              <button type="button" onClick={() => setIsPaymentModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setIsPaymentModalOpen(false); }} className="p-6 space-y-5 overflow-y-auto flex-1 flex flex-col">
              <div className="flex-1 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-900 block">Name on Card</label>
                  <input required type="text" className="block w-full h-12 px-3 border border-slate-200 rounded-lg text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all" placeholder="John Doe" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-900 block">Card Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CreditCard className="h-5 w-5 text-slate-400" />
                    </div>
                    <input required type="text" className="block w-full h-12 pl-10 pr-3 border border-slate-200 rounded-lg text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all" placeholder="0000 0000 0000 0000" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-900 block">Expiry (MM/YY)</label>
                    <input required type="text" className="block w-full h-12 px-3 border border-slate-200 rounded-lg text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-900 block">CVC</label>
                    <input required type="text" className="block w-full h-12 px-3 border border-slate-200 rounded-lg text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all" placeholder="123" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                   <ShieldCheck className="w-5 h-5 text-teal-600" />
                   <span className="text-xs font-medium text-slate-600">Your card details are encrypted and securely stored by Stripe.</span>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex gap-3 mt-auto shrink-0">
                <button type="button" onClick={() => setIsPaymentModalOpen(false)} className="flex-1 h-12 flex justify-center items-center px-4 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-200 transition-all cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="flex-1 h-12 flex justify-center items-center px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-teal-900 hover:bg-teal-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-900 transition-all cursor-pointer group whitespace-nowrap">
                  Save Card
                  <ArrowUpRight className="ml-2 h-4 w-4 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Seats Modal */}
      {isManageSeatsOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-stretch justify-end" onClick={() => setIsManageSeatsOpen(false)}>
          <div className="bg-white shadow-2xl border-l border-slate-200 w-full max-w-md overflow-hidden animate-slide-in-right flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
              <h2 className="text-xl font-bold text-slate-800">Manage Seats</h2>
              <button type="button" onClick={() => setIsManageSeatsOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setIsManageSeatsOpen(false); }} className="p-6 space-y-5 overflow-y-auto flex-1 flex flex-col">
              <div className="flex-1 space-y-5">
                <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 mb-4">
                  <h3 className="text-[15px] font-bold text-teal-800 mb-1">How seats work</h3>
                  <p className="text-[13px] font-medium text-teal-600 leading-snug">
                    You currently have 15 seats. Every user (Attorney, Paralegal, etc.) requires 1 seat. 
                    Adding more seats will instantly prorate your current billing cycle.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-900 block">Total User Seats</label>
                  <div className="flex items-center gap-3">
                    <input required type="number" min="12" defaultValue="15" className="block w-32 h-12 px-3 border border-slate-200 rounded-lg text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all" />
                    <span className="text-sm font-medium text-slate-500">Seats (Min: 12 used)</span>
                  </div>
                </div>

                <div className="h-px bg-slate-100 my-4 w-full"></div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">New Monthly Cost</span>
                  <span className="text-lg font-bold text-slate-800">$499.00</span>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex gap-3 mt-auto shrink-0">
                <button type="button" onClick={() => setIsManageSeatsOpen(false)} className="flex-1 h-12 flex justify-center items-center px-4 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-200 transition-all cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="flex-1 h-12 flex justify-center items-center px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-teal-900 hover:bg-teal-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-900 transition-all cursor-pointer group whitespace-nowrap">
                  Save Changes
                  <ArrowUpRight className="ml-2 h-4 w-4 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteCardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsDeleteCardOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Remove Payment Method?</h3>
              <p className="text-sm text-slate-500 mb-6">
                Are you sure you want to remove Visa ending in 4242? If this is your only payment method, your subscription may be interrupted on the next billing date.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteCardOpen(false)}
                  className="flex-1 h-12 px-5 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-all flex items-center justify-center cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsDeleteCardOpen(false)}
                  className="flex-1 h-12 px-5 border border-transparent bg-rose-600 text-white text-sm font-medium rounded-lg hover:bg-rose-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
    </div>
  )
}
