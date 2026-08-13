"use client"
import { CustomDatePicker } from '@/components/ui/CustomDatePicker'
import React, { useState, useRef, useEffect, Suspense, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import toast from "react-hot-toast"

import { ChevronLeft, ChevronRight, Search, Filter, Plus, Shield, User, Calendar, Edit2, Eye, X, Trash2, Mail, Lock, Phone, ArrowRight, Loader2, AlertTriangle } from "lucide-react"
import { getUserRole } from "@/app/actions/auth"
import useSWR from 'swr'
import { UserFormModal } from "@/components/users/UserFormModal"
import { DeleteUserModal } from "@/components/users/DeleteUserModal"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function UsersPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
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

  const apiUrl = `/api/users?page=${currentPage}&limit=${ITEMS_PER_PAGE}&search=${encodeURIComponent(debouncedSearch)}&status=${statusFilter}&role=${roleFilter}&fromDate=${dateFilter.from}&toDate=${dateFilter.to}`
  const { data, error, isLoading, mutate } = useSWR(apiUrl, fetcher, { keepPreviousData: true })

  const { data: allUsersData } = useSWR('/api/users?limit=1000', fetcher)
  const allUsersList: any[] = allUsersData?.success ? allUsersData.users : []

  const currentUsers: any[] = data?.success ? data.users : []
  const totalPages = data?.totalPages || 0
  const totalUsers = data?.total || 0

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

    try {
      const res = await fetch(`/api/users?id=${userToDelete}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        mutate()
        toast.success("User deleted successfully")
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to delete user')
      }
    } catch (e) {
      // Intentionally removed console.error to prevent PII/PHI leakage in browser logs
      toast.error('Error deleting user')
    } finally {
      setIsDeleting(false)
      setUserToDelete(null)
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const isActive = currentStatus !== "Active"
    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive })
      })
      if (res.ok) {
        mutate()
        toast.success("Status updated successfully")
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to update status')
      }
    } catch (e) {
      // Intentionally removed console.error to prevent PII/PHI leakage
      toast.error('Error updating status')
    }
  }


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
  const endIndex = startIndex + currentUsers.length

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
                    {/* Status Filter */}
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Status</div>
                    <select
                      value={statusFilter}
                      onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
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
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Joined Date</div>
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
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Loader2 className="w-8 h-8 text-teal-600 animate-spin mb-4" />
                      <h3 className="text-base font-bold text-slate-800">Loading users...</h3>
                    </div>
                  </td>
                </tr>
              ) : currentUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-4">
                        <User className="w-8 h-8 text-slate-300" />
                      </div>
                      <h3 className="text-base font-bold text-slate-800">No users found</h3>
                      <p className="text-sm font-medium text-slate-500 mt-1">We couldn&apos;t find any users matching your criteria.</p>
                      {data?.debug && (
                        <div className="mt-4 p-4 bg-red-50 text-red-600 text-xs text-left max-w-full overflow-auto">
                          <p>DEBUG INFO:</p>
                          <pre>{JSON.stringify(data.debug, null, 2)}</pre>
                        </div>
                      )}
                      {data?.error && (
                        <div className="mt-4 p-4 bg-red-50 text-red-600 text-xs text-left max-w-full overflow-auto">
                          <p className="font-bold">API ERROR: {data.error}</p>
                          <p>{data.details}</p>
                        </div>
                      )}
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
                        {u.role === 'ADMIN' && <Shield className="w-4 h-4 text-purple-500" />}
                        {u.role === 'MANAGING_PARTNER' && <Shield className="w-4 h-4 text-blue-500" />}
                        {u.role === 'ATTORNEY' && <Shield className="w-4 h-4 text-teal-500" />}
                        {u.role === 'PARALEGAL' && <Shield className="w-4 h-4 text-slate-400" />}
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
                        }} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-[8px] hover:bg-slate-50 shadow-sm transition-all cursor-pointer">
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
                            }} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 text-white text-xs font-bold rounded-[8px] hover:bg-teal-700 shadow-sm transition-all cursor-pointer">
                              <Edit2 className="w-3.5 h-3.5" />
                              Edit
                            </button>
                            <button onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(u.id);
                            }} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 text-xs font-bold rounded-[8px] hover:bg-red-100 shadow-sm transition-all cursor-pointer">
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
          try {
            const url = '/api/users';
            const method = modalMode === 'edit' ? 'PUT' : 'POST';
            const body = modalMode === 'edit' ? { ...newUser, id: selectedUserId } : newUser;
            const res = await fetch(url, {
              method,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body)
            });
            if (res.ok) {
              setIsAddUserOpen(false);
              mutate();
              setNewUser({ firstName: "", lastName: "", email: "", password: "", role: "PARALEGAL", phone: "", managingPartnerId: "", attorneyId: "" });
              toast.success(modalMode === 'edit' ? "User updated successfully!" : "User created successfully!");
            } else {
              const data = await res.json();
              toast.error(data.error || 'Failed to save user');
            }
          } catch (e: any) {
            toast.error('An unexpected error occurred');
          }
          setIsSubmitting(false);
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
