"use client";

import { useState } from "react";
import { Search, Filter, Hexagon, Calendar } from "lucide-react";

// --- MOCK DATA ---
const auditLogs = [
  { id: 1, user: "Pawan Kumar", email: "pawan@lexvalue.ai", role: "Paralegal", action: "USER_LOGOUT", details: "User pawan@lexvalue.ai logged out successfully.", timestamp: "Sep 24, 2026 03:50 PM" },
  { id: 2, user: "Nabneet Kaur", email: "nabneet@lexvalue.ai", role: "Attorney", action: "USER_LOGOUT", details: "User nabneet@lexvalue.ai logged out successfully.", timestamp: "Sep 24, 2026 03:22 PM" },
  { id: 3, user: "Nabneet Kaur", email: "nabneet@lexvalue.ai", role: "Attorney", action: "USER_LOGIN", details: "User nabneet@lexvalue.ai logged in successfully", timestamp: "Sep 24, 2026 03:22 PM" },
  { id: 4, user: "Pawan Kumar", email: "pawan@lexvalue.ai", role: "Paralegal", action: "USER_LOGIN", details: "User pawan@lexvalue.ai logged in successfully", timestamp: "Sep 24, 2026 03:03 PM" },
  { id: 5, user: "Pawan Kumar", email: "pawan@lexvalue.ai", role: "Paralegal", action: "USER_LOGOUT", details: "User pawan@lexvalue.ai logged out successfully.", timestamp: "Sep 24, 2026 02:28 PM" },
  { id: 6, user: "Pawan Kumar", email: "pawan@lexvalue.ai", role: "Paralegal", action: "CASE_CREATED", details: "Case \"People of the State of New York v. Unknown Perpetrators\" created", timestamp: "Sep 24, 2026 12:26 PM" },
];

export default function AuditLogPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="p-6 space-y-6 w-full">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Audit Log</h1>
            <p className="text-sm text-slate-500 mt-1">Track user activity and system events.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-sm"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors whitespace-nowrap">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Action</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Details</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900">{log.user}</span>
                      <span className="text-[11px] text-slate-500 mt-0.5">{log.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Hexagon className={`w-4 h-4 ${log.role === 'Attorney' ? 'text-emerald-500' : 'text-slate-400'}`} />
                      {log.role}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold rounded">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">{log.details}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 text-sm text-slate-500">
                      <Calendar className="w-4 h-4" />
                      <span>{log.timestamp}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
      </div>
    </div>
  );
}
