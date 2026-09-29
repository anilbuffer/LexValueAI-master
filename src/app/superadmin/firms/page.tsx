"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Plus, Eye, Edit2, Trash2,
  Building2, ToggleRight, ToggleLeft, Bell, AlertTriangle, CheckCircle2,
  Clock, FileText, X, AlertCircle, Archive
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
  healthStatus: "Success" | "Stuck Docs (2)" | "Success(0 Errors)";
  healthSeverity: "Success" | "error" | "warning";
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
    healthStatus: "Success",
    healthSeverity: "Success",
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
    healthStatus: "Success(0 Errors)",
    healthSeverity: "Success",
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
    healthStatus: "Success",
    healthSeverity: "Success",
  },
];

export default function FirmsPage() {
  const [firms, setFirms] = useState<TenantFirm[]>(initialFirms);

  // Notification / Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Active item for Delete
  const [deletingFirm, setDeletingFirm] = useState<TenantFirm | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  useEffect(() => {
    try {
      const customFirms = localStorage.getItem("lexvalu_custom_firms");
      if (customFirms) {
        const parsed = JSON.parse(customFirms);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setFirms((prev) => {
            const existingIds = new Set(prev.map((f) => f.id));
            const newOnes = parsed.filter((f: TenantFirm) => !existingIds.has(f.id));
            return [...newOnes, ...prev];
          });
        }
      }
    } catch {
      // ignore
    }

    try {
      const edits = JSON.parse(localStorage.getItem("lexvalu_firms_edits") || "{}");
      if (Object.keys(edits).length > 0) {
        setFirms((prev) =>
          prev.map((f) => {
            if (edits[f.id]) {
              return {
                ...f,
                name: edits[f.id].name || f.name,
                adminName: edits[f.id].adminName || f.adminName,
                email: edits[f.id].email || f.email,
              };
            }
            return f;
          })
        );
      }
    } catch {
      // ignore
    }

    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get("created") === "true") {
        showToast("Tenant firm successfully created.");
        window.history.replaceState({}, "", "/superadmin/firms");
      } else if (searchParams.get("updated") === "true") {
        showToast("Firm details updated successfully.");
        window.history.replaceState({}, "", "/superadmin/firms");
      }
    }
  }, []);

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Multi-Firm Management
          </h1>
        </div>

        {/* Add Firm Button */}
        <Link
          href="/superadmin/firms/create"
          className="flex items-center gap-2 bg-[#124b4b] hover:bg-[#0d3636] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Firm
        </Link>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-[10.5px] uppercase tracking-wider font-bold text-slate-400 border-b border-slate-200 bg-slate-50/50">
              <tr>
                <th className="px-5 py-4 whitespace-nowrap">Firm & Admin</th>
                <th className="px-4 py-4 whitespace-nowrap">Cases Volume</th>
                <th className="px-4 py-4 whitespace-nowrap">Last Active</th>
                <th className="px-4 py-4 whitespace-nowrap">Health Status</th>
                <th className="px-4 py-4 whitespace-nowrap">Status</th>
                <th className="px-5 py-4 whitespace-nowrap text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {firms.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-400 text-sm">
                    No tenant firms registered yet.
                  </td>
                </tr>
              ) : (
                firms.map((firm) => (
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
                        </div>
                      </div>
                    </td>

                    {/* Cases Volume Col (Total & In-Progress) */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-teal-600" />
                          {firm.totalCases} Total Cases
                        </span>
                        {/* <span className="text-[11px] font-semibold text-amber-700 mt-0.5">
                          {firm.inProgressCases} In-Progress
                        </span> */}
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
                        {/* View Profile */}
                        <Link
                          href={`/superadmin/firms/${firm.id}`}
                          className="p-1.5 text-slate-600 hover:text-teal-700 hover:bg-teal-50 border border-slate-200 rounded-lg transition-colors"
                          title="View Firm Profile"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>

                        {/* Edit Button */}
                        <Link
                          href={`/superadmin/firms/${firm.id}/edit`}
                          className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 border border-slate-200 rounded-lg transition-colors inline-flex items-center justify-center"
                          title="Edit Firm Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>

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
          Showing {firms.length} registered tenant firms
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

