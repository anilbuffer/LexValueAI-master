"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Plus, Search, Filter, Eye, Edit2, Trash2, Calendar, ShieldCheck, Mail,
  Building2, CreditCard, ToggleRight, ToggleLeft, Bell, AlertTriangle, CheckCircle2,
  Activity, Clock, FileText, Send, X, AlertCircle, RefreshCw, Archive
} from "lucide-react";

export interface TenantFirm {
  id: string;
  name: string;
  email: string;
  adminName: string;
  users: number;
  seatLimit: number;
  plan: "Enterprise" | "Professional" | "Starter";
  joinedDate: string;
  status: boolean; // active/deactivated
  totalCases: number;
  inProgressCases: number;
  lastActive: string;
  isInactive: boolean;
  healthStatus: "Healthy" | "Stuck Docs (2)" | "OCR Timeout (1)" | "Healthy (0 Errors)";
  healthSeverity: "healthy" | "error" | "warning";
}

const initialFirms: TenantFirm[] = [
  {
    id: "1",
    name: "Smith & Associates",
    email: "admin@smithassociates.com",
    adminName: "Harvey Specter",
    users: 12,
    seatLimit: 25,
    plan: "Enterprise",
    joinedDate: "Sep 17, 2026",
    status: true,
    totalCases: 342,
    inProgressCases: 14,
    lastActive: "Active 20 mins ago",
    isInactive: false,
    healthStatus: "Healthy",
    healthSeverity: "healthy",
  },
  {
    id: "2",
    name: "Johnson Legal Group",
    email: "admin@johnsonlegal.com",
    adminName: "Robert Johnson",
    users: 5,
    seatLimit: 10,
    plan: "Professional",
    joinedDate: "Aug 12, 2026",
    status: true,
    totalCases: 156,
    inProgressCases: 6,
    lastActive: "Active 1 hour ago",
    isInactive: false,
    healthStatus: "Healthy (0 Errors)",
    healthSeverity: "healthy",
  },
  {
    id: "3",
    name: "Miller & Partners",
    email: "admin@millerpartners.com",
    adminName: "Sarah Miller",
    users: 8,
    seatLimit: 15,
    plan: "Starter",
    joinedDate: "Jul 23, 2026",
    status: true,
    totalCases: 89,
    inProgressCases: 2,
    lastActive: "Inactive for 5 days",
    isInactive: true,
    healthStatus: "Stuck Docs (2)",
    healthSeverity: "error",
  },
  {
    id: "4",
    name: "Davis & Co. Law",
    email: "admin@daviscolaw.com",
    adminName: "Michael Davis",
    users: 24,
    seatLimit: 50,
    plan: "Enterprise",
    joinedDate: "Jun 05, 2026",
    status: false,
    totalCases: 412,
    inProgressCases: 0,
    lastActive: "Inactive for 12 days",
    isInactive: true,
    healthStatus: "OCR Timeout (1)",
    healthSeverity: "warning",
  },
];

export default function FirmsPage() {
  const [firms, setFirms] = useState<TenantFirm[]>(initialFirms);
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState<string>("ALL");
  const [healthFilter, setHealthFilter] = useState<string>("ALL");

  // Notification / Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Active item for Edit/Delete
  const [editingFirm, setEditingFirm] = useState<TenantFirm | null>(null);
  const [deletingFirm, setDeletingFirm] = useState<TenantFirm | null>(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    name: "",
    adminName: "",
    email: "",
    seatLimit: 10,
    plan: "Professional" as "Enterprise" | "Professional" | "Starter",
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Status Toggle Quick Action
  const handleToggleStatus = (id: string) => {
    setFirms((prev) =>
      prev.map((firm) => {
        if (firm.id === id) {
          const nextStatus = !firm.status;
          showToast(
            `${firm.name} has been ${nextStatus ? "Activated" : "Deactivated"}.`
          );
          return { ...firm, status: nextStatus };
        }
        return firm;
      })
    );
  };

  // Nudge Action Button handler
  const handleNudgeFirm = (firm: TenantFirm) => {
    showToast(
      `Nudge email sent to ${firm.adminName} (${firm.email}) for ${firm.name}.`
    );
  };

  // Open Create Modal
  const openAddModal = () => {
    setFormData({
      name: "",
      adminName: "",
      email: "",
      seatLimit: 10,
      plan: "Professional",
    });
    setIsAddModalOpen(true);
  };

  // Submit Create Firm
  const handleCreateFirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.adminName) return;

    const newFirm: TenantFirm = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      adminName: formData.adminName,
      users: 1,
      seatLimit: Number(formData.seatLimit) || 10,
      plan: formData.plan,
      joinedDate: "Today",
      status: true,
      totalCases: 0,
      inProgressCases: 0,
      lastActive: "Active just now",
      isInactive: false,
      healthStatus: "Healthy",
      healthSeverity: "healthy",
    };

    setFirms((prev) => [newFirm, ...prev]);
    setIsAddModalOpen(false);
    showToast(`Tenant firm "${newFirm.name}" successfully created.`);
  };

  // Open Edit Modal
  const openEditModal = (firm: TenantFirm) => {
    setEditingFirm(firm);
    setFormData({
      name: firm.name,
      adminName: firm.adminName,
      email: firm.email,
      seatLimit: firm.seatLimit,
      plan: firm.plan,
    });
    setIsEditModalOpen(true);
  };

  // Submit Edit Firm
  const handleUpdateFirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFirm) return;

    setFirms((prev) =>
      prev.map((f) =>
        f.id === editingFirm.id
          ? {
              ...f,
              name: formData.name,
              adminName: formData.adminName,
              email: formData.email,
              seatLimit: Number(formData.seatLimit) || f.seatLimit,
              plan: formData.plan,
            }
          : f
      )
    );
    setIsEditModalOpen(false);
    setEditingFirm(null);
    showToast(`Updated firm profile for "${formData.name}".`);
  };

  // Open Delete Modal
  const openDeleteModal = (firm: TenantFirm) => {
    setDeletingFirm(firm);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete / Deactivate / Archive
  const handleConfirmDelete = (actionType: "deactivate" | "archive" | "delete") => {
    if (!deletingFirm) return;

    if (actionType === "delete") {
      setFirms((prev) => prev.filter((f) => f.id !== deletingFirm.id));
      showToast(`Firm "${deletingFirm.name}" permanently deleted.`);
    } else if (actionType === "deactivate") {
      setFirms((prev) =>
        prev.map((f) => (f.id === deletingFirm.id ? { ...f, status: false } : f))
      );
      showToast(`Firm "${deletingFirm.name}" deactivated.`);
    } else {
      setFirms((prev) =>
        prev.map((f) => (f.id === deletingFirm.id ? { ...f, status: false } : f))
      );
      showToast(`Firm "${deletingFirm.name}" archived.`);
    }
    setIsDeleteModalOpen(false);
    setDeletingFirm(null);
  };

  // Filtering Logic
  const filteredFirms = firms.filter((firm) => {
    const matchesSearch =
      firm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      firm.adminName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      firm.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPlan = planFilter === "ALL" || firm.plan === planFilter;

    const matchesHealth =
      healthFilter === "ALL" ||
      (healthFilter === "ERROR" && firm.healthSeverity === "error") ||
      (healthFilter === "HEALTHY" && firm.healthSeverity === "healthy");

    return matchesSearch && matchesPlan && matchesHealth;
  });

  return (
    <div className="p-6 md:p-8 space-y-6 bg-slate-50/50 min-h-screen w-full font-sans">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-top-4">
          <Bell className="w-4 h-4 text-teal-400 shrink-0" />
          <span className="text-xs font-medium">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Multi-Firm Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor tenant firms, document health, cases volume, and active user limits.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          {/* Search */}
          <div className="relative flex-1 xl:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search firm, admin, or email..."
              className="w-full pl-9 pr-4 py-2.5 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-sm"
            />
          </div>

          {/* Plan Filter */}
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 shadow-sm focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Plans</option>
            <option value="Enterprise">Enterprise</option>
            <option value="Professional">Professional</option>
            <option value="Starter">Starter</option>
          </select>

          {/* Health Filter */}
          <select
            value={healthFilter}
            onChange={(e) => setHealthFilter(e.target.value)}
            className="px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 shadow-sm focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Health</option>
            <option value="HEALTHY">Healthy Only</option>
            <option value="ERROR">Stuck / Errors</option>
          </select>

          {/* Add Firm Button */}
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-[#124b4b] hover:bg-[#0d3636] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Firm
          </button>
        </div>
      </div>

      {/* Operational Metrics Cards (3 Cards Grid - Exact Shared Style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Active Firms Today */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs relative overflow-hidden group hover:border-slate-300 transition-all">
          <Activity className="absolute -bottom-4 -right-2 w-28 h-28 text-blue-500/5 -rotate-12 group-hover:scale-105 transition-transform pointer-events-none" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Firms Today</p>
              <h3 className="text-3xl font-black text-slate-900 mt-2 tracking-tight">14</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between text-xs relative z-10">
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">+2 vs yesterday</span>
            <span className="text-slate-500 font-medium text-[11px]">19 total registered</span>
          </div>
        </div>

        {/* Card 2: Cases Uploaded Today */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs relative overflow-hidden group hover:border-slate-300 transition-all">
          <FileText className="absolute -bottom-4 -right-2 w-28 h-28 text-teal-500/5 -rotate-12 group-hover:scale-105 transition-transform pointer-events-none" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Cases Uploaded Today</p>
              <h3 className="text-3xl font-black text-slate-900 mt-2 tracking-tight">1,284</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center border border-teal-100 shrink-0">
              <FileText className="w-5 h-5 text-teal-600" />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between text-xs relative z-10">
            <span className="text-teal-700 font-bold bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">+18% this week</span>
            <span className="text-slate-500 font-medium text-[11px]">1,277 processed</span>
          </div>
        </div>

        {/* Card 3: Total Stuck Cases */}
        <div className="bg-white rounded-2xl border border-rose-200/80 p-6 shadow-xs relative overflow-hidden group hover:border-rose-300 transition-all">
          <AlertTriangle className="absolute -bottom-4 -right-2 w-28 h-28 text-rose-500/5 -rotate-12 group-hover:scale-105 transition-transform pointer-events-none" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">Total Stuck Cases</p>
              <h3 className="text-3xl font-black text-slate-900 mt-2 tracking-tight">7</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center border border-rose-100 shrink-0">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between text-xs relative z-10">
            <span className="text-rose-700 font-bold bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">2 High Severity</span>
            <span className="text-slate-500 font-medium text-[11px]">Requires investigation</span>
          </div>
        </div>

      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-[10.5px] uppercase tracking-wider font-bold text-slate-400 border-b border-slate-200 bg-slate-50/50">
              <tr>
                <th className="px-5 py-4 whitespace-nowrap">Firm & Admin</th>
                <th className="px-4 py-4 whitespace-nowrap">Subscription & Seats</th>
                <th className="px-4 py-4 whitespace-nowrap">Cases Volume</th>
                <th className="px-4 py-4 whitespace-nowrap">Last Active</th>
                <th className="px-4 py-4 whitespace-nowrap">Health Status</th>
                <th className="px-4 py-4 whitespace-nowrap">Status</th>
                <th className="px-5 py-4 whitespace-nowrap text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredFirms.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-400 text-sm">
                    No tenant firms match your search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredFirms.map((firm) => (
                  <tr
                    key={firm.id}
                    className="hover:bg-slate-50/60 transition-colors group"
                  >
                    {/* Firm & Admin Col */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <Link
                          href={`/superadmin/firms/${firm.id}`}
                          className="font-bold text-[#124b4b] text-sm hover:underline transition-colors flex items-center gap-1.5"
                        >
                          <Building2 className="w-3.5 h-3.5 text-teal-700" />
                          {firm.name}
                        </Link>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                          <span className="font-medium text-slate-700">
                            Admin: {firm.adminName}
                          </span>
                          <span>•</span>
                          <span className="text-slate-400">{firm.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Plan & Seats Col */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="inline-flex items-center gap-1 font-bold text-xs text-slate-800">
                          <CreditCard className="w-3 h-3 text-slate-400" />
                          {firm.plan}
                        </span>
                        <span className="text-[11px] text-slate-500 mt-0.5">
                          {firm.users} / {firm.seatLimit} Seats
                        </span>
                      </div>
                    </td>

                    {/* Cases Volume Col (Total & In-Progress) */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-teal-600" />
                          {firm.totalCases} Total Cases
                        </span>
                        <span className="text-[11px] font-semibold text-amber-700 mt-0.5">
                          {firm.inProgressCases} In-Progress
                        </span>
                      </div>
                    </td>

                    {/* Last Active Col */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span
                          className={
                            firm.isInactive
                              ? "text-rose-600 font-semibold"
                              : "text-slate-700 font-medium"
                          }
                        >
                          {firm.lastActive}
                        </span>
                      </div>
                    </td>

                    {/* Health Status Badge */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      {firm.healthSeverity === "error" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200 animate-pulse">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          {firm.healthStatus}
                        </span>
                      ) : firm.healthSeverity === "warning" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          {firm.healthStatus}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          {firm.healthStatus}
                        </span>
                      )}
                    </td>

                    {/* Quick Status Toggle Switch */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(firm.id)}
                        className="flex items-center gap-2 text-xs font-bold transition-all focus:outline-none"
                        title="Click to toggle active access status"
                      >
                        {firm.status ? (
                          <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 hover:bg-emerald-100">
                            <ToggleRight className="w-4 h-4 text-emerald-600" /> Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200 hover:bg-rose-100">
                            <ToggleLeft className="w-4 h-4 text-rose-500" /> Inactive
                          </span>
                        )}
                      </button>
                    </td>

                    {/* Actions Col */}
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Nudge Button */}
                        <button
                          onClick={() => handleNudgeFirm(firm)}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-all shadow-xs"
                          title="Send reminder email to firm admin"
                        >
                          <Send className="w-3 h-3 text-amber-600" /> Nudge
                        </button>

                        {/* View Profile */}
                        <Link
                          href={`/superadmin/firms/${firm.id}`}
                          className="p-1.5 text-slate-600 hover:text-teal-700 hover:bg-teal-50 border border-slate-200 rounded-lg transition-colors"
                          title="View Firm Profile"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>

                        {/* Edit Button */}
                        <button
                          onClick={() => openEditModal(firm)}
                          className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 border border-slate-200 rounded-lg transition-colors"
                          title="Edit Firm Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete/Deactivate Button */}
                        <button
                          onClick={() => openDeleteModal(firm)}
                          className="p-1.5 text-slate-600 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 rounded-lg transition-colors"
                          title="Deactivate / Delete Firm"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 mt-2 px-2">
        <div>
          Showing {filteredFirms.length} of {firms.length} registered tenant firms
        </div>
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 hover:bg-slate-50 text-slate-400">
            &lt;
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded bg-[#124b4b] text-white font-bold">
            1
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 hover:bg-slate-50 text-slate-400">
            &gt;
          </button>
        </div>
      </div>

      {/* --- CREATE FIRM MODAL --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Building2 className="w-5 h-5 text-teal-700" /> Add New Tenant Firm
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFirm} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Firm Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Miller & Partners"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Admin Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Harvey Specter"
                  value={formData.adminName}
                  onChange={(e) =>
                    setFormData({ ...formData, adminName: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Admin Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="admin@firm.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Seat Limit
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.seatLimit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seatLimit: parseInt(e.target.value) || 10,
                      })
                    }
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Subscription Tier
                  </label>
                  <select
                    value={formData.plan}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        plan: e.target.value as any,
                      })
                    }
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 bg-white"
                  >
                    <option value="Enterprise">Enterprise</option>
                    <option value="Professional">Professional</option>
                    <option value="Starter">Starter</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-[#124b4b] hover:bg-[#0d3636] text-white rounded-lg shadow-sm"
                >
                  Create Firm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT FIRM MODAL --- */}
      {isEditModalOpen && editingFirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-blue-600" /> Edit Firm Details
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateFirm} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Firm Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Admin Name (Contact Person)
                </label>
                <input
                  type="text"
                  required
                  value={formData.adminName}
                  onChange={(e) =>
                    setFormData({ ...formData, adminName: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Admin Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Seat Limit
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.seatLimit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seatLimit: parseInt(e.target.value) || 10,
                      })
                    }
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Subscription Tier
                  </label>
                  <select
                    value={formData.plan}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        plan: e.target.value as any,
                      })
                    }
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="Enterprise">Enterprise</option>
                    <option value="Professional">Professional</option>
                    <option value="Starter">Starter</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DELETE / DEACTIVATE MODAL --- */}
      {isDeleteModalOpen && deletingFirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">
                  Manage Tenant Access
                </h3>
                <p className="text-xs text-slate-500">
                  Select action for <span className="font-bold text-slate-800">{deletingFirm.name}</span>
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
              Deactivating will block firm users from logging in without deleting records. Archiving will retain history. Permanently deleting removes all tenant data.
            </p>

            <div className="space-y-2.5">
              <button
                onClick={() => handleConfirmDelete("deactivate")}
                className="w-full flex items-center justify-between p-3 border border-amber-200 bg-amber-50 hover:bg-amber-100/80 rounded-xl text-xs font-bold text-amber-900 transition-colors"
              >
                <span>Deactivate Access Only</span>
                <ToggleLeft className="w-4 h-4 text-amber-700" />
              </button>

              <button
                onClick={() => handleConfirmDelete("archive")}
                className="w-full flex items-center justify-between p-3 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-800 transition-colors"
              >
                <span>Archive Firm Data</span>
                <Archive className="w-4 h-4 text-slate-600" />
              </button>

              <button
                onClick={() => handleConfirmDelete("delete")}
                className="w-full flex items-center justify-between p-3 border border-rose-200 bg-rose-50 hover:bg-rose-100/80 rounded-xl text-xs font-bold text-rose-800 transition-colors"
              >
                <span>Permanently Delete Firm</span>
                <Trash2 className="w-4 h-4 text-rose-600" />
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

