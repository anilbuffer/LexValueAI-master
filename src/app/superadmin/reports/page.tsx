"use client";

import { useState } from "react";
import { Download, Building2, Briefcase, DollarSign, Search, Filter, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";

const mockRevenueData = [
  { month: "Jan", revenue: 45000, cases: 120 },
  { month: "Feb", revenue: 52000, cases: 132 },
  { month: "Mar", revenue: 61000, cases: 145 },
  { month: "Apr", revenue: 58000, cases: 140 },
  { month: "May", revenue: 75000, cases: 180 },
  { month: "Jun", revenue: 82000, cases: 195 },
  { month: "Jul", revenue: 95000, cases: 210 },
];

const mockFirmStats = [
  { id: 1, firm: "Smith & Associates", cases: 345, revenue: "$145,000", status: "Active", users: 15, growth: "+12%" },
  { id: 2, firm: "Johnson Legal Group", cases: 128, revenue: "$42,500", status: "Active", users: 5, growth: "+5%" },
  { id: 3, firm: "Miller & Partners", cases: 210, revenue: "$85,000", status: "Warning", users: 10, growth: "-2%" },
  { id: 4, firm: "Davis & Davis", cases: 450, revenue: "$210,000", status: "Active", users: 24, growth: "+18%" },
];

export default function ReportsPage() {
  return (
    <div className="p-6 space-y-6 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Platform Analytics</h1>
          <p className="text-slate-500 mt-1">Superadmin overview of all firms, cases, and revenue.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-[#0f766e] hover:bg-[#0d655e] text-white rounded-lg font-semibold transition-colors shadow-sm">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4 hover:border-slate-300 transition-colors">
          <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Active Firms</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">142</p>
            <div className="flex items-center gap-1 mt-1 text-xs font-medium text-emerald-600">
              <TrendingUp className="w-3 h-3" /> 12 new this month
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4 hover:border-slate-300 transition-colors">
          <div className="w-12 h-12 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Cases Managed</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">12,450</p>
            <div className="flex items-center gap-1 mt-1 text-xs font-medium text-emerald-600">
              <TrendingUp className="w-3 h-3" /> +8.4% from last month
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4 hover:border-slate-300 transition-colors">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Platform Revenue</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">$468,000</p>
            <div className="flex items-center gap-1 mt-1 text-xs font-medium text-emerald-600">
              <TrendingUp className="w-3 h-3" /> +15.2% YoY
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Revenue Over Time</h3>
            <p className="text-sm text-slate-500">Monthly aggregate revenue across all firms.</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [`$${Number(value || 0).toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-900">New Cases Volume</h3>
            <p className="text-sm text-slate-500">Number of cases added per month globally.</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f1f5f9' }}
                />
                <Bar dataKey="cases" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={32} name="Cases Added" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Firm Performance Breakdown</h3>
            <p className="text-sm text-slate-500">Detailed metrics per tenant firm.</p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search firms..." className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
            </div>
            <button className="p-2 border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200 whitespace-nowrap">
              <tr>
                <th className="px-6 py-4">Firm Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Total Cases</th>
                <th className="px-6 py-4">Total Revenue</th>
                <th className="px-6 py-4">Total Users</th>
                <th className="px-6 py-4">MoM Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {mockFirmStats.map(stat => (
                <tr key={stat.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{stat.firm}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                      stat.status === "Active" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}>
                      {stat.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-700">{stat.cases}</td>
                  <td className="px-6 py-4 font-semibold text-emerald-700">{stat.revenue}</td>
                  <td className="px-6 py-4">{stat.users}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium ${stat.growth.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
                      {stat.growth}
                    </span>
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

