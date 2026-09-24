"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, Search, Filter, Eye, Edit2, Trash2, Calendar, ShieldCheck, Mail, Building2, CreditCard, ToggleRight, ToggleLeft } from "lucide-react";

const mockFirms = [
  {
    id: "1",
    name: "Smith & Associates",
    email: "admin@smithassociates.com",
    adminName: "Harvey Specter",
    users: 12,
    plan: "Enterprise",
    joinedDate: "Sep 17, 2026",
    status: true
  },
  {
    id: "2",
    name: "Johnson Legal Group",
    email: "admin@johnsonlegal.com",
    adminName: "Robert Johnson",
    users: 5,
    plan: "Professional",
    joinedDate: "Aug 12, 2026",
    status: true
  },
  {
    id: "3",
    name: "Miller & Partners",
    email: "admin@millerpartners.com",
    adminName: "Sarah Miller",
    users: 8,
    plan: "Starter",
    joinedDate: "Jul 23, 2026",
    status: false
  },
  {
    id: "4",
    name: "Davis & Co. Law",
    email: "admin@daviscolaw.com",
    adminName: "Michael Davis",
    users: 24,
    plan: "Enterprise",
    joinedDate: "Jun 05, 2026",
    status: true
  },
];

export default function FirmsPage() {
  const [firms, setFirms] = useState(mockFirms);

  const handleToggleStatus = (id: string) => {
    setFirms(prev => prev.map(firm => firm.id === id ? { ...firm, status: !firm.status } : firm));
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50/30 min-h-screen w-full">

      {/* Header Section */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Firms Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage tenant firms, subscriptions and their access permissions.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <div className="relative flex-1 xl:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search firms..."
              className="w-full pl-9 pr-4 py-2.5 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4 text-slate-400" /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 transition-colors">
            <Building2 className="w-4 h-4 text-slate-400" /> Export CSV
          </button>
          <Link
            href="/superadmin/firms/create"
            className="flex items-center gap-2 bg-[#124b4b] hover:bg-[#0d3636] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Add Firm <Plus className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-[10.5px] uppercase tracking-wider font-bold text-slate-400 border-b border-slate-100 bg-white">
              <tr>
                <th className="px-6 py-5 whitespace-nowrap">Firm</th>
                <th className="px-6 py-5 whitespace-nowrap">Admin</th>
                <th className="px-6 py-5 whitespace-nowrap">Plan</th>
                <th className="px-6 py-5 whitespace-nowrap">Users</th>
                <th className="px-6 py-5 whitespace-nowrap">Joined Date</th>
                <th className="px-6 py-5 whitespace-nowrap">Status</th>
                <th className="px-6 py-5 whitespace-nowrap text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80 bg-white">
              {firms.map((firm) => (
                <tr key={firm.id} className="hover:bg-slate-50/50 transition-colors group">

                  {/* Firm Col */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <Link href={`/superadmin/firms/${firm.id}`} className="font-bold text-[#124b4b] text-[13px] hover:text-[#0d3636] transition-colors">
                        {firm.name}
                      </Link>
                      <span className="text-[11px] text-slate-500 mt-0.5">{firm.email}</span>
                    </div>
                  </td>

                  {/* Admin Col */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-500" strokeWidth={2.5} />
                      <span className="font-medium text-slate-700 text-xs">{firm.adminName}</span>
                    </div>
                  </td>

                  {/* Plan Col */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-600 text-xs">{firm.plan}</span>
                    </div>
                  </td>

                  {/* Users Col */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-semibold text-slate-700 text-xs">{firm.users}</span>
                  </td>

                  {/* Joined Date Col */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {firm.joinedDate}
                    </div>
                  </td>

                  {/* Status Col */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div 
                      className="flex items-center gap-2.5 cursor-pointer"
                      onClick={() => handleToggleStatus(firm.id)}
                    >
                      {firm.status ? (
                        <>
                          <div className="w-9 h-5 rounded-full bg-emerald-500 relative flex items-center px-0.5 shadow-inner">
                            <div className="w-4 h-4 rounded-full bg-white absolute right-0.5 shadow-sm"></div>
                          </div>
                          <span className="font-bold text-xs text-emerald-600 tracking-wide">Active</span>
                        </>
                      ) : (
                        <>
                          <div className="w-9 h-5 rounded-full bg-slate-200 relative flex items-center px-0.5 shadow-inner">
                            <div className="w-4 h-4 rounded-full bg-white absolute left-0.5 shadow-sm"></div>
                          </div>
                          <span className="font-medium text-xs text-slate-500 tracking-wide">Inactive</span>
                        </>
                      )}
                    </div>
                  </td>

                  {/* Action Col */}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/superadmin/firms/${firm.id}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all shadow-sm"
                      >
                        <Eye className="w-3 h-3 text-slate-500" /> View
                      </Link>

                      <button
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-white bg-[#008080] border border-[#008080] rounded-lg hover:bg-[#006666] transition-all shadow-sm"
                      >
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>

                      <button
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-red-600 border border-red-200 bg-red-50 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all shadow-sm"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500 mt-2 px-2">
        <div>
          Showing 1 to {firms.length} of {firms.length} entries
        </div>
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 hover:bg-slate-50 text-slate-400">
            &lt;
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded bg-teal-600 text-white font-medium">
            1
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 hover:bg-slate-50 text-slate-400">
            &gt;
          </button>
        </div>
      </div>

    </div>
  );
}
