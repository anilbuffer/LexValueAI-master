"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft, Building2, Mail, Phone, MapPin, ShieldCheck, CreditCard, Activity, Edit2, Scale, FileText, Handshake,
  Search, Filter, CheckCircle2, ChevronDown, Trash2, Calendar, Zap, Download, Eye, X, User
} from "lucide-react";

const allMockFirmsDetails = [
  {
    id: "1",
    name: "Smith & Associates",
    taxId: "XX-1234567",
    supportEmail: "admin@smithassociates.com",
    phone: "+1 (555) 123-4567",
    address: "123 Legal Way, Suite 500, New York, NY 10001",
    plan: "Enterprise",
    status: "Active",
    createdAt: "Sep 17, 2026"
  },
  {
    id: "2",
    name: "Johnson Legal Group",
    taxId: "XX-2345678",
    supportEmail: "admin@johnsonlegal.com",
    phone: "+1 (555) 234-5678",
    address: "456 Corporate Blvd, Chicago, IL 60601",
    plan: "Professional",
    status: "Active",
    createdAt: "Aug 12, 2026"
  },
  {
    id: "3",
    name: "Miller & Partners",
    taxId: "XX-3456789",
    supportEmail: "admin@millerpartners.com",
    phone: "+1 (555) 345-6789",
    address: "789 Justice Ave, Los Angeles, CA 90012",
    plan: "Starter",
    status: "Inactive",
    createdAt: "Jul 23, 2026"
  },
  {
    id: "4",
    name: "Davis & Co. Law",
    taxId: "XX-4567890",
    supportEmail: "admin@daviscolaw.com",
    phone: "+1 (555) 456-7890",
    address: "321 Main St, Houston, TX 77002",
    plan: "Enterprise",
    status: "Active",
    createdAt: "Jun 05, 2026"
  }
];

const mockUsers = [
  { id: 1, name: "Harvey Specter", role: "Managing Partner", email: "harvey@smithassociates.com" },
  { id: 2, name: "Mike Ross", role: "Attorney", email: "mike@smithassociates.com" },
  { id: 3, name: "Rachel Zane", role: "Paralegal", email: "rachel@smithassociates.com" },
  { id: 4, name: "Donna Paulsen", role: "Admin", email: "donna@smithassociates.com" },
];

const mockActivity = [
  { id: 1, action: "User Login", user: "Mike Ross", time: "10 mins ago", details: "Logged in successfully" },
  { id: 2, action: "Case Created", user: "Harvey Specter", time: "2 hours ago", details: "Created case 'Pearson vs Hardman'" },
  { id: 3, action: "System Update", user: "Donna Paulsen", time: "1 day ago", details: "Updated firm billing settings" },
];

const mockCases = [
  {
    id: "TestCase-04",
    name: "People of the State of New York v. Unknown Perpetrators",
    client: "Marcus E. Carter",
    category: "Criminal",
    date: "Mar 03, 2026, 05:30 AM",
    scanStatus: "Scan Completed",
    assignees: ["Pawan Kumar (P)", "Nabneet Kaur (A)", "Alexandra Guidi (MP)"],
    status: "Pending Approval"
  },
  {
    id: "TestCase-03",
    name: "Hollowell v. Marcy Avenue Realty Corp.",
    client: "Denise R. Hollowell",
    category: "Personal Injury",
    date: "Mar 03, 2026, 05:30 AM",
    scanStatus: "Scan Completed",
    assignees: ["Pawan Kumar (P)", "Nabneet Kaur (A)", "Alexandra Guidi (MP)"],
    status: "Pending Approval"
  },
  {
    id: "TestCase-02",
    name: "Hollowell v. Marcy Avenue Realty Corp.",
    client: "Denise R. Hollowell",
    category: "Personal Injury",
    date: "Mar 03, 2026, 05:30 AM",
    scanStatus: "Scan Completed",
    assignees: ["Pawan Kumar (P)", "Nabneet Kaur (A)", "Alexandra Guidi (MP)"],
    status: "Approved"
  },
  {
    id: "TestCase-01",
    name: "Delgado v. Ridgeline Freight LLC",
    client: "Marcus A. Delgado",
    category: "Personal Injury",
    date: "Jan 15, 2026, 05:30 AM",
    scanStatus: "Scan Completed",
    assignees: ["Pawan Kumar (P)", "Nabneet Kaur (A)", "Alexandra Guidi (MP)"],
    status: "Pending Approval"
  }
];

export default function FirmDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const mockFirmDetails = allMockFirmsDetails.find(firm => firm.id === id) || allMockFirmsDetails[0];

  const [activeTab, setActiveTab] = useState("overview");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [viewUser, setViewUser] = useState<any | null>(null);
  const [viewCase, setViewCase] = useState<any | null>(null);

  return (
    <div className="p-6 space-y-6 min-h-screen bg-slate-50/30 w-full">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/superadmin/firms" className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{mockFirmDetails.name}</h1>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            Tax ID: {mockFirmDetails.taxId} • <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-teal-50 text-teal-700 border border-teal-200">Active</span>
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === "overview" ? "border-teal-600 text-teal-700" : "border-transparent text-slate-500 hover:text-slate-700"}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("cases")}
            className={`pb-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === "cases" ? "border-teal-600 text-teal-700" : "border-transparent text-slate-500 hover:text-slate-700"}`}
          >
            Cases & AI Analysis
          </button>
          <button
            onClick={() => setActiveTab("billing")}
            className={`pb-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === "billing" ? "border-teal-600 text-teal-700" : "border-transparent text-slate-500 hover:text-slate-700"}`}
          >
            Billing & Subscriptions
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`pb-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === "users" ? "border-teal-600 text-teal-700" : "border-transparent text-slate-500 hover:text-slate-700"}`}
          >
            Users & Roles
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`pb-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === "activity" ? "border-teal-600 text-teal-700" : "border-transparent text-slate-500 hover:text-slate-700"}`}
          >
            Activity Log
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="pt-4">

        {/* Cases & AI Analysis Tab */}
        {activeTab === "cases" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Cases & AI analysis</h2>
                <p className="text-sm text-slate-500 mt-1">Upload medical records, generate chronologies, review flags.</p>
              </div>
              <div className="flex gap-3">
                <div className="relative w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Search cases..." className="w-full pl-9 pr-4 py-2.5 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-sm" />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 transition-colors">
                  <Filter className="w-4 h-4 text-slate-400" /> Filter
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden pb-32">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="text-[10.5px] uppercase tracking-wider font-bold text-slate-400 bg-white border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-5 whitespace-nowrap">CASE ID</th>
                      <th className="px-6 py-5 whitespace-nowrap">CASE NAME</th>
                      <th className="px-6 py-5 whitespace-nowrap">CLIENT</th>
                      <th className="px-6 py-5 whitespace-nowrap">STATUS</th>
                      <th className="px-6 py-5 whitespace-nowrap text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/80">
                    {mockCases.map(c => (
                      <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-700 whitespace-nowrap">{c.id}</td>
                        <td className="px-6 py-4 font-bold text-slate-900 max-w-xs truncate">{c.name}</td>
                        <td className="px-6 py-4">{c.client}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${c.status === 'Approved' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                            }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${c.status === 'Approved' ? 'bg-blue-600' : 'bg-amber-500'}`}></div>
                            {c.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button 
                            onClick={() => setViewCase(c)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-[#008080] bg-teal-50 border border-teal-200 rounded-full hover:bg-teal-100 transition-all shadow-sm"
                          >
                            <Eye className="w-3 h-3" /> View Case Summary
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-teal-600" /> Firm Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Address</p>
                    <p className="text-sm text-slate-600 mt-1">{mockFirmDetails.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Support Email</p>
                    <p className="text-sm text-slate-600 mt-1">{mockFirmDetails.supportEmail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Phone</p>
                    <p className="text-sm text-slate-600 mt-1">{mockFirmDetails.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-teal-600" /> Subscription & Status
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-500">Billing Plan</span>
                  <span className="text-sm font-medium text-slate-900">{mockFirmDetails.plan}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-500">Member Since</span>
                  <span className="text-sm font-medium text-slate-900">{mockFirmDetails.createdAt}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-slate-500">Total Users</span>
                  <span className="text-sm font-medium text-slate-900">4 / 15 (Seats Used)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users & Roles Tab */}
        {activeTab === "users" && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-semibold text-slate-900">Accounts & Roles</h3>
            </div>
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-white text-[10.5px] uppercase tracking-wider font-bold text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-5 whitespace-nowrap">Name</th>
                  <th className="px-6 py-5 whitespace-nowrap">Role</th>
                  <th className="px-6 py-5 whitespace-nowrap">Email</th>
                  <th className="px-6 py-5 whitespace-nowrap text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80">
                {mockUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-[#124b4b] text-[13px]">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {user.role === 'Admin' && <ShieldCheck className="w-3.5 h-3.5 text-blue-500" strokeWidth={2.5} />}
                        {user.role === 'Managing Partner' && <Handshake className="w-3.5 h-3.5 text-blue-500" strokeWidth={2.5} />}
                        {user.role === 'Attorney' && <Scale className="w-3.5 h-3.5 text-blue-500" strokeWidth={2.5} />}
                        {user.role === 'Paralegal' && <FileText className="w-3.5 h-3.5 text-blue-500" strokeWidth={2.5} />}
                        <span className="font-medium text-slate-700 text-xs">{user.role}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button 
                        onClick={() => setViewUser(user)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-[#008080] bg-teal-50 border border-teal-200 rounded-full hover:bg-teal-100 transition-all shadow-sm"
                      >
                        <Eye className="w-3 h-3" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Activity Log Tab */}
        {activeTab === "activity" && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Recent Firm Activity</h3>
            <div className="space-y-6">
              {mockActivity.map(activity => (
                <div key={activity.id} className="flex gap-4">
                  <div className="mt-1">
                    <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                    <p className="text-sm text-slate-600 mt-0.5">{activity.details}</p>
                    <p className="text-xs text-slate-400 mt-1">{activity.user} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Billing & Subscriptions Tab */}
        {activeTab === "billing" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Billing & Subscriptions</h2>
                <p className="text-sm text-slate-500 mt-1">Manage this firm's subscription plan, payment methods, and billing history.</p>
              </div>
              <button className="px-5 py-2.5 bg-[#124b4b] hover:bg-[#0d3636] text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
                View Pricing Plans
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Enterprise Plan Card */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 border border-teal-100">
                        <Zap className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[#14233a]">Enterprise Plan</h3>
                        <p className="text-sm text-slate-500">Billed monthly</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50">
                      Active
                    </span>
                  </div>

                  <div className="mt-8 grid grid-cols-3 gap-6">
                    <div className="border-r border-slate-100 pr-6">
                      <p className="text-xs font-medium text-slate-500 mb-1">Current Usage</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-[#14233a]">12</span>
                        <span className="text-sm font-medium text-slate-500">/ 15 Users</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 mb-1">Next Billing Date</p>
                      <p className="text-lg font-bold text-[#14233a]">September 1, 2026</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-slate-500 mb-1">Monthly Cost</p>
                      <p className="text-xl font-bold text-[#14233a]">$499<span className="text-sm text-slate-500 font-medium">.00</span></p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Payment Method Card */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#14233a]">Payment Method</h3>
                  <p className="text-sm text-slate-500">Manage firm's credit cards.</p>

                  <div className="mt-6 flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <div className="bg-white px-3 py-1.5 border border-slate-200 rounded shadow-sm font-bold text-[#1434CB] italic text-sm">
                        VISA
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#14233a]">Visa ending in 4242</p>
                        <p className="text-xs text-slate-500">Expires 12/2025</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Default</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div className="mt-10">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#14233a]">Billing History</h3>
                  <p className="text-sm text-slate-500">View and download past invoices.</p>
                </div>
                <div className="flex gap-3">
                  <div className="relative w-72">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Search invoices..." className="w-full pl-9 pr-4 py-2.5 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-sm" />
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 transition-colors">
                    <Filter className="w-4 h-4 text-slate-400" /> Filter
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-white text-[10.5px] uppercase tracking-wider font-bold text-slate-400 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-5 whitespace-nowrap">INVOICE ID</th>
                        <th className="px-6 py-5 whitespace-nowrap">DATE & TIME</th>
                        <th className="px-6 py-5 whitespace-nowrap">PLAN</th>
                        <th className="px-6 py-5 whitespace-nowrap">AMOUNT</th>
                        <th className="px-6 py-5 whitespace-nowrap">STATUS</th>
                        <th className="px-6 py-5 whitespace-nowrap text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/80">
                      {[
                        { id: "INV-2023-08", date: "Aug 01, 2023, 10:30 AM", plan: "Enterprise", amount: "$499.00", status: "Paid" },
                        { id: "INV-2023-07", date: "Jul 01, 2023, 11:15 AM", plan: "Enterprise", amount: "$499.00", status: "Paid" },
                        { id: "INV-2023-06", date: "Jun 01, 2023, 09:45 AM", plan: "Enterprise", amount: "$499.00", status: "Paid" },
                        { id: "INV-2023-05", date: "May 01, 2023, 02:20 PM", plan: "Enterprise", amount: "$499.00", status: "Paid" },
                      ].map(inv => (
                        <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-5 whitespace-nowrap font-bold text-[#124b4b] text-xs">{inv.id}</td>
                          <td className="px-6 py-5 whitespace-nowrap text-slate-500 font-medium text-xs">{inv.date}</td>
                          <td className="px-6 py-5 whitespace-nowrap text-slate-500 font-medium text-xs">{inv.plan}</td>
                          <td className="px-6 py-5 whitespace-nowrap font-bold text-[#14233a] text-xs">{inv.amount}</td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide bg-emerald-50 text-emerald-600 border border-emerald-200">
                              {inv.status}
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-right">
                            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-slate-700 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-all shadow-sm">
                              <Download className="w-3 h-3 text-slate-500" /> Download
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* View User Modal */}
      {viewUser && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-white shadow-xl w-full max-w-md h-full flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-[#14233a]">View User Details</h2>
              <button 
                onClick={() => setViewUser(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-[#14233a]">First Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      readOnly 
                      value={viewUser.name.split(' ')[0] || ''} 
                      className="w-full pl-9 pr-4 py-2.5 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-sm" 
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-[#14233a]">Last Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      readOnly 
                      value={viewUser.name.split(' ').slice(1).join(' ') || ''} 
                      className="w-full pl-9 pr-4 py-2.5 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-sm" 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#14233a]">Email Address <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="email" 
                    readOnly 
                    value={viewUser.email} 
                    className="w-full pl-9 pr-4 py-2.5 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-sm" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#14233a]">Phone Number <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    readOnly 
                    value="+1 (555) 000-0000"
                    className="w-full pl-9 pr-4 py-2.5 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-sm" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#14233a]">Role <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select disabled className="w-full px-4 py-2.5 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-sm appearance-none">
                    <option>{viewUser.role}</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#14233a]">Assign to Managing Partner <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select disabled className="w-full px-4 py-2.5 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-sm appearance-none">
                    <option>Harvey Specter</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#14233a]">Assign to Attorney <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select disabled className="w-full px-4 py-2.5 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-sm appearance-none">
                    <option>Mike Ross</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-center mt-auto">
              <button 
                onClick={() => setViewUser(null)}
                className="w-full py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors shadow-sm text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Case Summary Modal */}
      {viewCase && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-white shadow-xl w-full max-w-md h-full flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-[#14233a]">Case Summary</h2>
              <button 
                onClick={() => setViewCase(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Case Name</p>
                  <p className="text-sm font-bold text-[#14233a]">{viewCase.name}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Case ID</p>
                    <p className="text-sm font-medium text-slate-700">{viewCase.id}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Client</p>
                    <p className="text-sm font-medium text-slate-700">{viewCase.client}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Category</p>
                    <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-semibold inline-block mt-0.5">
                      {viewCase.category}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Date of Incident</p>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mt-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> {viewCase.date}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Status & Assignment</p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-600">Scan Status</span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {viewCase.scanStatus}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-600">Case Status</span>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${viewCase.status === 'Approved' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${viewCase.status === 'Approved' ? 'bg-blue-600' : 'bg-amber-500'}`}></div>
                        {viewCase.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-600 block mb-2">Assigned To</span>
                      <div className="flex flex-wrap gap-2">
                        {viewCase.assignees.map((a: string) => (
                          <span key={a} className={`px-2.5 py-1 rounded-md text-xs font-medium border ${a.includes('(P)') ? "bg-slate-50 text-slate-600 border-slate-200" : a.includes('(A)') ? "bg-indigo-50 text-indigo-700 border-indigo-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}>
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-center mt-auto">
              <button 
                onClick={() => setViewCase(null)}
                className="w-full py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors shadow-sm text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
