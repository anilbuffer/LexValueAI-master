"use client";

import Link from "next/link";
import {
  Building2, CheckCircle2, XCircle, DollarSign, Activity, Users, FileText,
  ChevronRight, Award, Server
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

// --- MOCK DATA ---
const activityData = [
  { name: 'Jan', firms: 10, revenue: 15 },
  { name: 'Feb', firms: 10, revenue: 15 },
  { name: 'Mar', firms: 10, revenue: 15 },
  { name: 'Apr', firms: 10, revenue: 15 },
  { name: 'May', firms: 11, revenue: 16 },
  { name: 'Jun', firms: 12, revenue: 18 },
  { name: 'Jul', firms: 12, revenue: 18 },
  { name: 'Aug', firms: 15, revenue: 20 },
  { name: 'Sep', firms: 18, revenue: 24.5 },
  { name: 'Oct', firms: 0, revenue: 0 },
  { name: 'Nov', firms: 0, revenue: 0 },
  { name: 'Dec', firms: 0, revenue: 0 },
];


const topFirms = [
  { id: 1, initials: "SA", name: "Smith & Associates", plan: "Enterprise", metric: "342 Users" },
  { id: 2, initials: "JL", name: "Johnson Legal Group", plan: "Professional", metric: "156 Users" },
  { id: 3, initials: "MP", name: "Miller & Partners", plan: "Starter", metric: "89 Users" },
];

const liveQueue = [
  { id: 1, title: "Smith & Associates upgraded to Enterprise", time: "Completed 2h ago", type: "Billing", errors: 0, warnings: 0 },
  { id: 2, title: "New tenant firm registered: Davis & Co.", time: "Completed 1d ago", type: "Onboarding", errors: 0, warnings: 2 },
  { id: 3, title: "Platform-wide security patch deployed", time: "Completed 2d ago", type: "System", errors: 0, warnings: 0 },
  { id: 4, title: "Miller & Partners payment failed", time: "Failed 3d ago", type: "Billing", errors: 1, warnings: 0 },
];

export default function SuperadminDashboard() {
  return (
    <div className="p-6 space-y-6 w-full">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Overview</h1>
          <p className="text-slate-500 mt-1">A snapshot of platform-wide activity and metrics.</p>
        </div>
        <Link
          href="/superadmin/reports"
          className="flex items-center gap-2 bg-teal-50 hover:bg-teal-100 text-teal-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-teal-100"
        >
          View full report <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Top Metrics Grid (6 Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">

        {/* Card 1 */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm relative overflow-hidden">
          <Building2 className="absolute -bottom-4 -right-2 w-24 h-24 text-blue-500/5 -rotate-12" />
          <div className="flex justify-between items-start relative z-10">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Firms</p>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-blue-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-2 relative z-10">19</p>
          <p className="text-[10px] font-medium text-slate-500 mt-3 flex items-center gap-1.5 relative z-10">
            <span className="bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-bold">+3</span> this month
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm relative overflow-hidden">
          <Activity className="absolute -bottom-4 -right-2 w-24 h-24 text-amber-500/5 -rotate-12" />
          <div className="flex justify-between items-start relative z-10">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Firms</p>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <Activity className="w-4 h-4 text-amber-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-2 relative z-10">18</p>
          <p className="text-[10px] font-medium text-slate-500 mt-3 flex items-center gap-1.5 relative z-10">
            <span className="bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded font-bold">Operational</span> across platform
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm relative overflow-hidden">
          <DollarSign className="absolute -bottom-4 -right-2 w-24 h-24 text-purple-500/5 -rotate-12" />
          <div className="flex justify-between items-start relative z-10">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total MRR</p>
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-purple-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-2 relative z-10">$24k</p>
          <p className="text-[10px] font-medium text-slate-500 mt-3 flex items-center gap-1.5 relative z-10">
            <span className="bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded font-bold">+12%</span> vs last month
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm relative overflow-hidden">
          <CheckCircle2 className="absolute -bottom-4 -right-2 w-24 h-24 text-emerald-500/5 -rotate-12" />
          <div className="flex justify-between items-start relative z-10">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">New Users</p>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-2 relative z-10">342</p>
          <p className="text-[10px] font-medium text-slate-500 mt-3 flex items-center gap-1.5 relative z-10">
            <span className="bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-bold">+15</span> verified today
          </p>
        </div>

        {/* Card 5 */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm relative overflow-hidden">
          <XCircle className="absolute -bottom-4 -right-2 w-24 h-24 text-red-500/5 -rotate-12" />
          <div className="flex justify-between items-start relative z-10">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Suspended</p>
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
              <XCircle className="w-4 h-4 text-red-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-2 relative z-10">1</p>
          <p className="text-[10px] font-medium text-slate-500 mt-3 flex items-center gap-1.5 relative z-10">
            <span className="bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-bold">Action req</span> by superadmin
          </p>
        </div>

        {/* Card 6 */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm relative overflow-hidden">
          <Server className="absolute -bottom-4 -right-2 w-24 h-24 text-emerald-500/5 -rotate-12" />
          <div className="flex justify-between items-start relative z-10">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Server Uptime</p>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Server className="w-4 h-4 text-emerald-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-2 relative z-10">99.9%</p>
          <p className="text-[10px] font-medium text-slate-500 mt-3 flex items-center gap-1.5 relative z-10">
            <span className="bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-bold">+0</span> downtime
          </p>
        </div>

      </div>

      {/* Middle Section: Top Firms & Live Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Top Performing Firms */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-teal-600" /> Top Client Firms
            </h3>
            <span className="text-[10px] font-medium bg-blue-50 text-blue-600 px-2 py-1 rounded">This Month</span>
          </div>

          <div className="space-y-4">
            {topFirms.map((firm) => (
              <div key={firm.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:border-slate-200 transition-colors bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${firm.id === 1 ? 'bg-red-100 text-red-600' :
                    firm.id === 2 ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                    }`}>
                    {firm.initials}
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold flex items-center gap-1 text-slate-500 uppercase">
                      {firm.plan}
                    </p>
                    <p className="text-sm font-bold text-slate-900 leading-tight mt-0.5">{firm.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-slate-900 leading-none">{firm.metric.split(' ')[0]}</p>
                  <p className="text-[10px] text-slate-500 mt-1">{firm.metric.split(' ')[1]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live System Activity Queue */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Live System Queue
            </h3>
            <Link href="/superadmin/reports" className="text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
              View All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {liveQueue.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-slate-200 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${item.errors > 0 ? 'border-red-200 bg-red-50 text-red-500' : 'border-emerald-200 bg-emerald-50 text-emerald-500'
                    }`}>
                    {item.errors > 0 ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{item.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 flex gap-2">
                      <span>{item.time}</span> • <span>{item.type}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    {item.errors > 0 && (
                      <span className="flex items-center gap-1 text-[10px] font-bold bg-red-50 text-red-600 px-2 py-1 rounded">
                        {item.errors} Failed
                      </span>
                    )}
                    {item.warnings > 0 && (
                      <span className="flex items-center gap-1 text-[10px] font-bold bg-amber-50 text-amber-600 px-2 py-1 rounded">
                        {item.warnings} Action Req
                      </span>
                    )}
                  </div>
                  <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded hover:bg-slate-50 transition-colors">
                    <FileText className="w-3 h-3" /> View Log
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Section: Platform Growth Trends (Full Width) */}
      <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="font-semibold text-slate-900 text-lg">Platform Growth Trends</h3>
            <p className="text-xs text-slate-500 mt-1">Track firm onboarding and MRR growth over time across all tenants.</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
              <span className="text-slate-600 font-medium">Active Firms</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
              <span className="text-slate-600 font-medium">MRR ($k)</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorFirms" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ fontSize: '12px', fontWeight: 500 }}
                labelStyle={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}
              />
              <CartesianGrid vertical={false} stroke="#f1f5f9" strokeDasharray="3 3" />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              <Area type="monotone" dataKey="firms" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorFirms)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
