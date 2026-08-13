"use client"
import { CustomDatePicker } from '@/components/ui/CustomDatePicker'
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import toast from "react-hot-toast"

import { ChevronLeft, ChevronRight, Search, Filter, Plus, Hexagon, User, Calendar, Edit2, Eye, X, Trash2, Mail, Lock, Phone, Loader2, AlertTriangle } from "lucide-react"
import { UserFormModal } from "@/components/users/UserFormModal"
import { DeleteUserModal } from "@/components/users/DeleteUserModal"

const initialMockUsers = [
  { id: "1", firstName: "Alice", lastName: "Smith", email: "alice@example.com", role: "ADMIN", phone: "5551234567", status: "Active", joined: "Jan 1, 2026, 10:00 AM", createdAt: "2026-01-01T10:00:00Z", managingPartnerId: "", attorneyId: "" },
  { id: "2", firstName: "Bob", lastName: "Jones", email: "bob@example.com", role: "MANAGING_PARTNER", phone: "5552345678", status: "Active", joined: "Jan 2, 2026, 11:00 AM", createdAt: "2026-01-02T11:00:00Z", managingPartnerId: "", attorneyId: "" },
  { id: "3", firstName: "Charlie", lastName: "Brown", email: "charlie@example.com", role: "ATTORNEY", phone: "5553456789", status: "Inactive", joined: "Jan 3, 2026, 12:00 PM", createdAt: "2026-01-03T12:00:00Z", managingPartnerId: "2", attorneyId: "" },
  { id: "4", firstName: "Diana", lastName: "Prince", email: "diana@example.com", role: "PARALEGAL", phone: "5554567890", status: "Active", joined: "Jan 4, 2026, 01:00 PM", createdAt: "2026-01-04T13:00:00Z", managingPartnerId: "", attorneyId: "3" },
  { id: "5", firstName: "Eve", lastName: "Adams", email: "eve@example.com", role: "ATTORNEY", phone: "5555678901", status: "Active", joined: "Jan 5, 2026, 02:00 PM", createdAt: "2026-01-05T14:00:00Z", managingPartnerId: "2", attorneyId: "" },
  { id: "6", firstName: "Frank", lastName: "Castle", email: "frank@example.com", role: "PARALEGAL", phone: "5556789012", status: "Inactive", joined: "Jan 6, 2026, 03:00 PM", createdAt: "2026-01-06T15:00:00Z", managingPartnerId: "", attorneyId: "5" },
  { id: "7", firstName: "Grace", lastName: "Hopper", email: "grace@example.com", role: "ADMIN", phone: "5557890123", status: "Active", joined: "Jan 7, 2026, 04:00 PM", createdAt: "2026-01-07T16:00:00Z", managingPartnerId: "", attorneyId: "" },
  { id: "8", firstName: "Hank", lastName: "Pym", email: "hank@example.com", role: "MANAGING_PARTNER", phone: "5558901234", status: "Active", joined: "Jan 8, 2026, 05:00 PM", createdAt: "2026-01-08T17:00:00Z", managingPartnerId: "", attorneyId: "" },
  { id: "9", firstName: "Ivy", lastName: "Poison", email: "ivy@example.com", role: "ATTORNEY", phone: "5559012345", status: "Active", joined: "Jan 9, 2026, 06:00 PM", createdAt: "2026-01-09T18:00:00Z", managingPartnerId: "8", attorneyId: "" },
  { id: "10", firstName: "Jack", lastName: "Sparrow", email: "jack@example.com", role: "PARALEGAL", phone: "5550123456", status: "Active", joined: "Jan 10, 2026, 07:00 PM", createdAt: "2026-01-10T19:00:00Z", managingPartnerId: "", attorneyId: "9" },
  { id: "11", firstName: "Kevin", lastName: "Bacon", email: "kevin@example.com", role: "ATTORNEY", phone: "5551234567", status: "Active", joined: "Jan 11, 2026, 08:00 PM", createdAt: "2026-01-11T20:00:00Z", managingPartnerId: "8", attorneyId: "" },
  { id: "12", firstName: "Laura", lastName: "Croft", email: "laura@example.com", role: "PARALEGAL", phone: "5552345678", status: "Active", joined: "Jan 12, 2026, 09:00 PM", createdAt: "2026-01-12T21:00:00Z", managingPartnerId: "", attorneyId: "11" },
].map(u => ({ ...u, name: `${u.firstName} ${u.lastName}` }))

export function UsersClient({
  role,
  initialSearch,
  initialPage,
  initialRoleFilter,
  initialStatusFilter,
  initialFromDate,
  initialToDate
}: {
  role: string | null
  initialSearch: string
  initialPage: number
  initialRoleFilter: string
  initialStatusFilter: string
  initialFromDate: string
  initialToDate: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [allMockUsers, setAllMockUsers] = useState(initialMockUsers)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [roleFilter, setRoleFilter] = useState(initialRoleFilter)
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter)
  const [dateFilter, setDateFilter] = useState({ from: initialFromDate, to: initialToDate })
  const ITEMS_PER_PAGE = 10

  const updateUrl = useCallback((params: Record<string, string | number>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        current.set(key, String(value))
      } else {
        current.delete(key)
      }
    })
    const search = current.toString()
    const query = search ? `?${search}` : ""
    router.push(`${pathname}${query}`)
  }, [pathname, router, searchParams])

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery !== initialSearch) {
        updateUrl({ search: searchQuery, page: 1 })
        setCurrentPage(1)
      }
    }, 500)
    return () => clearTimeout(handler)
  }, [searchQuery, initialSearch, updateUrl])

  useEffect(() => {
    if (currentPage !== initialPage) updateUrl({ page: currentPage })
  }, [currentPage, initialPage, updateUrl])

  useEffect(() => {
    if (roleFilter !== initialRoleFilter) {
      updateUrl({ role: roleFilter, page: 1 })
      setCurrentPage(1)
    }
  }, [roleFilter, initialRoleFilter, updateUrl])

  useEffect(() => {
    if (statusFilter !== initialStatusFilter) {
      updateUrl({ status: statusFilter, page: 1 })
      setCurrentPage(1)
    }
  }, [statusFilter, initialStatusFilter, updateUrl])

  useEffect(() => {
    if (dateFilter.from !== initialFromDate || dateFilter.to !== initialToDate) {
      updateUrl({ fromDate: dateFilter.from, toDate: dateFilter.to, page: 1 })
      setCurrentPage(1)
    }
  }, [dateFilter, initialFromDate, initialToDate, updateUrl])

  const filteredUsers = useMemo(() => {
    return allMockUsers.filter(u => {
      if (searchQuery && !u.name.toLowerCase().includes(searchQuery.toLowerCase()) && !u.email.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (statusFilter !== 'All' && u.status !== statusFilter) return false;
      if (roleFilter !== 'All' && u.role !== roleFilter) return false;
      if (dateFilter.from && new Date(u.createdAt) < new Date(dateFilter.from)) return false;
      if (dateFilter.to) {
        const toD = new Date(dateFilter.to);
        toD.setHours(23, 59, 59, 999);
        if (new Date(u.createdAt) > toD) return false;
      }
      return true;
    });
  }, [allMockUsers, searchQuery, statusFilter, roleFilter, dateFilter]);

  const totalUsers = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalUsers / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const allUsersList = allMockUsers;

  const formatPhone = (phone: string | null | undefined) => {
    if (!phone) return "N/A"
    const cleaned = ('' + phone).replace(/\D/g, '')
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) return '(' + match[1] + ') ' + match[2] + '-' + match[3]
    return phone
  }

  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add')
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newUser, setNewUser] = useState({
    firstName: "", lastName: "", email: "", password: "", role: "PARALEGAL", phone: "", managingPartnerId: "", attorneyId: ""
  })

  const handleDeleteClick = (id: string) => {
    setUserToDelete(id)
  }

  const confirmDeleteUser = async () => {
    if (!userToDelete) return
    setIsDeleting(true)

    setTimeout(() => {
      setAllMockUsers(prev => prev.filter(u => u.id !== userToDelete))
      toast.success("User deleted successfully")
      setIsDeleting(false)
      setUserToDelete(null)
    }, 500)
  }

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const isActive = currentStatus !== "Active"
    const newStatus = isActive ? "Active" : "Inactive"
    setAllMockUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u))
    toast.success("Status updated successfully")
  }

  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

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

  return (
    <div className="w-full p-2.5 pb-[15px] font-sans relative flex flex-col gap-[15px]">

      {/* Main Container matching the dashboard theme */}
      <div className="bg-white rounded-2xl shadow-md shadow-slate-200/50 border border-slate-200/50 p-5 flex flex-col gap-[20px]">

        {/* Header Section */}
        <div className="flex flex-col min-[992px]:flex-row items-start min-[992px]:items-center justify-between gap-4 min-[992px]:gap-0">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Users Management</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Manage attorneys, paralegals and their access permissions.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full min-[992px]:w-auto">
            <div className="relative w-full sm:w-72">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                    {/* Status Filter */}
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Status</div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 bg-white cursor-pointer"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>

                    <div className="h-px bg-slate-100 my-4 w-full"></div>

                    {role !== 'ATTORNEY' && (
                      <>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Role</div>
                        <select
                          value={roleFilter}
                          onChange={(e) => setRoleFilter(e.target.value)}
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
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Joined Date</div>
                    <div className="flex flex-col min-[480px]:flex-row gap-4">
                      <div className="flex-1 flex flex-col gap-2">
                        <label className="text-[13px] font-semibold text-slate-600">From</label>
                        <CustomDatePicker type="date"
                          value={dateFilter.from}
                          onChange={(e) => setDateFilter(prev => ({ ...prev, from: e.target.value }))}
                          className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all cursor-pointer bg-white"
                        />
                      </div>
                      <div className="flex-1 flex flex-col gap-2">
                        <label className="text-[13px] font-semibold text-slate-600">To</label>
                        <CustomDatePicker type="date"
                          value={dateFilter.to}
                          onChange={(e) => setDateFilter(prev => ({ ...prev, to: e.target.value }))}
                          className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all cursor-pointer bg-white"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => {
                          setRoleFilter("All");
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

            {['ADMIN', 'MANAGING_PARTNER'].includes(role || '') && (
              <button onClick={() => {
                setModalMode('add');
                setSelectedUserId(null);
                setNewUser({
                  firstName: "", lastName: "", email: "", password: "", phone: "",
                  role: role === 'ADMIN' ? 'MANAGING_PARTNER' : role === 'MANAGING_PARTNER' ? 'ATTORNEY' : 'PARALEGAL',
                  managingPartnerId: "", attorneyId: ""
                });
                setIsAddUserOpen(true);
              }} className="w-full sm:w-auto h-12 flex justify-center items-center px-5 border border-transparent rounded-lg text-sm font-medium text-white bg-teal-900 hover:bg-teal-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-900 transition-all cursor-pointer group">
                Add User
                <Plus className="ml-2 h-4 w-4 group-hover:rotate-90 transition-transform" />
              </button>
            )}
          </div>
        </div>

        {/* Table Section */}
        <div className="mt-4 overflow-x-auto custom-scrollbar pb-2">
          <table className="w-full min-w-[900px] text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-200/60">
                <th className="py-4 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">User</th>
                <th className="py-4 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                <th className="py-4 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Phone</th>
                <th className="py-4 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Joined Date</th>
                <th className="py-4 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                <th className="py-4 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-4">
                        <User className="w-8 h-8 text-slate-300" />
                      </div>
                      <h3 className="text-base font-bold text-slate-800">No users found</h3>
                      <p className="text-sm font-medium text-slate-500 mt-1">We couldn&apos;t find any users matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentUsers.map((u) => (
                  <tr key={u.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors group cursor-pointer">
                    <td className="py-4 px-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800 group-hover:text-teal-600 transition-colors">{u.name}</span>
                        <span className="text-xs font-medium text-slate-500">{u.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
                        {u.role === 'ADMIN' && <Hexagon className="w-4 h-4 text-purple-500" />}
                        {u.role === 'MANAGING_PARTNER' && <Hexagon className="w-4 h-4 text-blue-500" />}
                        {u.role === 'ATTORNEY' && <Hexagon className="w-4 h-4 text-teal-500" />}
                        {u.role === 'PARALEGAL' && <Hexagon className="w-4 h-4 text-slate-400" />}
                        <span className="capitalize">{u.role.replace('_', ' ').toLowerCase()}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {formatPhone(u.phone)}
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-sm font-medium">{u.joined}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {['ADMIN', 'MANAGING_PARTNER'].includes(role || '') ? (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleStatus(u.id, u.status);
                              }}
                              className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${u.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`}
                            >
                              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${u.status === 'Active' ? 'translate-x-4.5' : 'translate-x-1'}`} />
                            </button>
                            <span className={`text-xs font-bold w-12 text-left ${u.status === 'Active' ? 'text-emerald-700' : 'text-slate-500'}`}>
                              {u.status}
                            </span>
                          </>
                        ) : (
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${u.status === 'Active' ? 'bg-emerald-100/60 text-emerald-700' : 'bg-slate-100/60 text-slate-700'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
                            {u.status}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={(e) => {
                          e.stopPropagation();
                          setModalMode('view');
                          setSelectedUserId(u.id);
                          const [firstName, ...lastNameParts] = u.name.split(' ');
                          setNewUser({
                            firstName, lastName: lastNameParts.join(' '), email: u.email, password: "", phone: u.phone || "",
                            role: u.role, managingPartnerId: u.managingPartnerId || "", attorneyId: u.attorneyId || ""
                          });
                          setIsAddUserOpen(true);
                        }} className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-full hover:bg-slate-50 shadow-sm transition-all cursor-pointer">
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                        {['ADMIN', 'MANAGING_PARTNER'].includes(role || '') && (
                          <>
                            <button onClick={(e) => {
                              e.stopPropagation();
                              setModalMode('edit');
                              setSelectedUserId(u.id);
                              const [firstName, ...lastNameParts] = u.name.split(' ');
                              setNewUser({
                                firstName, lastName: lastNameParts.join(' '), email: u.email, password: "", phone: u.phone || "",
                                role: u.role, managingPartnerId: u.managingPartnerId || "", attorneyId: u.attorneyId || ""
                              });
                              setIsAddUserOpen(true);
                            }} className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-teal-600 text-white text-xs font-bold rounded-full hover:bg-teal-700 shadow-sm transition-all cursor-pointer">
                              <Edit2 className="w-3.5 h-3.5" />
                              Edit
                            </button>
                            <button onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(u.id);
                            }} className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-red-50 text-red-600 border border-red-200 text-xs font-bold rounded-full hover:bg-red-100 shadow-sm transition-all cursor-pointer">
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </>
                        )}
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
            Showing {totalUsers > 0 ? startIndex + 1 : 0} to {totalUsers > 0 ? Math.min(startIndex + ITEMS_PER_PAGE, totalUsers) : 0} of {totalUsers} entries
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

      <UserFormModal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        modalMode={modalMode}
        isSubmitting={isSubmitting}
        newUser={newUser}
        setNewUser={setNewUser}
        role={role}
        allUsersList={allUsersList}
        onSubmit={async (e: React.FormEvent) => {
          e.preventDefault();
          if (modalMode === 'view') {
            setIsAddUserOpen(false);
            return;
          }
          const phoneClean = newUser.phone.replace(/[^\d]/g, '');
          if (phoneClean.length < 7) {
            toast.error("Please enter a valid phone number");
            return;
          }
          setIsSubmitting(true);
          
          setTimeout(() => {
            if (modalMode === 'edit') {
              setAllMockUsers(prev => prev.map(u => u.id === selectedUserId ? { 
                ...u, 
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                name: `${newUser.firstName} ${newUser.lastName}`,
                email: newUser.email,
                role: newUser.role,
                phone: newUser.phone,
                managingPartnerId: newUser.managingPartnerId,
                attorneyId: newUser.attorneyId
              } : u))
              toast.success("User updated successfully!");
            } else {
              setAllMockUsers(prev => [{
                id: Math.random().toString(),
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                name: `${newUser.firstName} ${newUser.lastName}`,
                email: newUser.email,
                role: newUser.role,
                phone: newUser.phone,
                managingPartnerId: newUser.managingPartnerId,
                attorneyId: newUser.attorneyId,
                status: "Active",
                joined: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                createdAt: new Date().toISOString()
              }, ...prev])
              toast.success("User created successfully!");
            }
            setIsAddUserOpen(false);
            setNewUser({ firstName: "", lastName: "", email: "", password: "", role: "PARALEGAL", phone: "", managingPartnerId: "", attorneyId: "" });
            setIsSubmitting(false);
          }, 500)
        }}
      />

      <DeleteUserModal
        isOpen={!!userToDelete}
        isDeleting={isDeleting}
        onClose={() => !isDeleting && setUserToDelete(null)}
        onConfirm={confirmDeleteUser}
      />

    </div>
  )
}
