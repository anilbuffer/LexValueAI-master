"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft, Building2, Mail, Phone, MapPin, ShieldCheck, CreditCard, Hexagon, Edit2, Scale, FileText, Handshake,
  Search, Filter, CheckCircle2, ChevronDown, Trash2, Calendar, Zap, Download, Eye, X, User, Activity, AlertTriangle, Users,
  Bell, Clock, Save, ShieldAlert
} from "lucide-react";

export interface FirmDetails {
  id: string;
  name: string;
  adminName: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  supportEmail: string;
  users: number;
  seatLimit: number;
  plan: string;
  status: boolean;
  createdAt: string;
  totalCases: number;
  inProgressCases: number;
  lastActive: string;
  isInactive: boolean;
  healthStatus: string;
  healthSeverity: "healthy" | "warning" | "error";
}

const allMockFirmsDetails: FirmDetails[] = [
  {
    id: "1",
    name: "Smith & Associates",
    adminName: "Harvey Specter",
    email: "admin@smithassociates.com",
    phone: "+1 (555) 123-4567",
    address: "123 Legal Way, Suite 500, New York, NY 10001",
    taxId: "XX-1234567",
    supportEmail: "admin@smithassociates.com",
    users: 12,
    seatLimit: 25,
    plan: "Enterprise",
    status: true,
    createdAt: "Sep 17, 2026",
    totalCases: 342,
    inProgressCases: 14,
    lastActive: "Active 20 mins ago",
    isInactive: false,
    healthStatus: "Healthy (0 Errors)",
    healthSeverity: "healthy",
  },
  {
    id: "2",
    name: "Johnson Legal Group",
    adminName: "Robert Johnson",
    email: "admin@johnsonlegal.com",
    phone: "+1 (555) 234-5678",
    address: "456 Corporate Blvd, Chicago, IL 60601",
    taxId: "XX-2345678",
    supportEmail: "admin@johnsonlegal.com",
    users: 5,
    seatLimit: 10,
    plan: "Professional",
    status: true,
    createdAt: "Aug 12, 2026",
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
    adminName: "Sarah Miller",
    email: "admin@millerpartners.com",
    phone: "+1 (555) 345-6789",
    address: "789 Justice Ave, Los Angeles, CA 90012",
    taxId: "XX-3456789",
    supportEmail: "admin@millerpartners.com",
    users: 8,
    seatLimit: 15,
    plan: "Starter",
    status: true,
    createdAt: "Jul 23, 2026",
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
    adminName: "Michael Davis",
    email: "admin@daviscolaw.com",
    phone: "+1 (555) 456-7890",
    address: "321 Main St, Houston, TX 77002",
    taxId: "XX-4567890",
    supportEmail: "admin@daviscolaw.com",
    users: 24,
    seatLimit: 50,
    plan: "Enterprise",
    status: false,
    createdAt: "Jun 05, 2026",
    totalCases: 412,
    inProgressCases: 0,
    lastActive: "Inactive for 12 days",
    isInactive: true,
    healthStatus: "OCR Timeout (1)",
    healthSeverity: "warning",
  }
];

const mockUsers = [
  { id: 1, name: "Harvey Specter", role: "Managing Partner", email: "harvey@smithassociates.com" },
  { id: 2, name: "Mike Ross", role: "Attorney", email: "mike@smithassociates.com" },
  { id: 3, name: "Rachel Zane", role: "Paralegal", email: "rachel@smithassociates.com" },
  { id: 4, name: "Donna Paulsen", role: "Admin", email: "donna@smithassociates.com" },
];

const firmAuditLogs = [
  { id: 1, user: "Pawan Kumar", email: "pawan@lexvalue.ai", role: "Paralegal", action: "USER_LOGOUT", details: "User pawan@lexvalue.ai logged out successfully.", timestamp: "Sep 24, 2026 03:50 PM" },
  { id: 2, user: "Nabneet Kaur", email: "nabneet@lexvalue.ai", role: "Attorney", action: "USER_LOGOUT", details: "User nabneet@lexvalue.ai logged out successfully.", timestamp: "Sep 24, 2026 03:22 PM" },
  { id: 3, user: "Nabneet Kaur", email: "nabneet@lexvalue.ai", role: "Attorney", action: "USER_LOGIN", details: "User nabneet@lexvalue.ai logged in successfully", timestamp: "Sep 24, 2026 03:22 PM" },
  { id: 4, user: "Pawan Kumar", email: "pawan@lexvalue.ai", role: "Paralegal", action: "USER_LOGIN", details: "User pawan@lexvalue.ai logged in successfully", timestamp: "Sep 24, 2026 03:03 PM" },
  { id: 5, user: "Pawan Kumar", email: "pawan@lexvalue.ai", role: "Paralegal", action: "USER_LOGOUT", details: "User pawan@lexvalue.ai logged out successfully.", timestamp: "Sep 24, 2026 02:28 PM" },
  { id: 6, user: "Pawan Kumar", email: "pawan@lexvalue.ai", role: "Paralegal", action: "CASE_CREATED", details: 'Case "People of the State of New York v. Unknown Perpetrators" created', timestamp: "Sep 24, 2026 12:26 PM" },
  { id: 7, user: "Harvey Specter", email: "harvey@smithassociates.com", role: "Managing Partner", action: "PHI_EXPORT_GENERATED", details: "Exported HIPAA-protected Medical Chronology for Case #NY-2026-441", timestamp: "Sep 24, 2026 10:14 AM" },
  { id: 8, user: "Mike Ross", email: "mike@smithassociates.com", role: "Attorney", action: "CASE_VALUATION_CALCULATED", details: "Generated settlement valuation bracket for Case #MVA-8812", timestamp: "Sep 23, 2026 04:45 PM" },
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
  
  const initialFirm = allMockFirmsDetails.find(firm => firm.id === id) || allMockFirmsDetails[0];
  const [firm, setFirm] = useState<FirmDetails>(initialFirm);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: initialFirm.name,
    adminName: initialFirm.adminName,
    email: initialFirm.email,
    seatLimit: initialFirm.seatLimit,
    plan: initialFirm.plan,
  });

  const [activeTab, setActiveTab] = useState("overview");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [viewUser, setViewUser] = useState<any | null>(null);
  const [viewCase, setViewCase] = useState<any | null>(null);
  const [auditSearchTerm, setAuditSearchTerm] = useState("");
  const [auditRoleFilter, setAuditRoleFilter] = useState("all");
  const [isAuditFilterOpen, setIsAuditFilterOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Nudge Action Button handler (from Firm Listing Table)
  const handleNudgeFirm = () => {
    showToast(`Nudge reminder email sent to ${firm.adminName} (${firm.email}) for ${firm.name}.`);
  };

  // Status Toggle handler (from Firm Listing Table)
  const handleToggleStatus = () => {
    const updatedStatus = !firm.status;
    setFirm((prev) => ({ ...prev, status: updatedStatus }));
    showToast(`Firm status changed to ${updatedStatus ? "Active" : "Suspended"}.`);
  };

  // Edit Firm handler
  const handleUpdateFirm = (e: React.FormEvent) => {
    e.preventDefault();
    setFirm((prev) => ({
      ...prev,
      name: editFormData.name,
      adminName: editFormData.adminName,
      email: editFormData.email,
      seatLimit: Number(editFormData.seatLimit) || prev.seatLimit,
      plan: editFormData.plan,
    }));
    setIsEditModalOpen(false);
    showToast(`Updated firm profile for "${editFormData.name}".`);
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

      {/* Header Section (with Health Status Badge, Last Active, Status Toggle, Nudge & Edit) */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/superadmin/firms"
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                {firm.name}
              </h1>

              {/* Status Badge */}
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  firm.status
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    firm.status ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                />
                {firm.status ? "Active Tenant" : "Suspended"}
              </span>

              {/* Health Status Badge (from Firm Listing Table) */}
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  firm.healthSeverity === "healthy"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : firm.healthSeverity === "warning"
                    ? "bg-amber-50 text-amber-800 border border-amber-200"
                    : "bg-rose-50 text-rose-700 border border-rose-200 animate-pulse"
                }`}
              >
                {firm.healthSeverity === "healthy" ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5" />
                )}
                {firm.healthStatus}
              </span>
            </div>

            <p className="text-slate-500 text-xs md:text-sm mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>Admin: <strong className="text-slate-800 font-semibold">{firm.adminName}</strong> ({firm.email})</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {firm.lastActive}
              </span>
              <span>•</span>
              <span>Plan: <strong className="text-slate-800 font-semibold">{firm.plan}</strong></span>
              <span>•</span>
              <span>Tax ID: {firm.taxId}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons: Nudge, Status Toggle, Edit Firm */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Nudge Button (from Firm Listing Table) */}
          <button
            onClick={handleNudgeFirm}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
              firm.isInactive || firm.healthSeverity !== "healthy"
                ? "bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-amber-600" />
            Nudge Admin
          </button>

          {/* Status Toggle Button (from Firm Listing Table) */}
          <button
            onClick={handleToggleStatus}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all shadow-xs ${
              firm.status
                ? "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                : "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {firm.status ? "Deactivate Firm" : "Activate Firm"}
          </button>

          {/* Edit Firm Button */}
          <button
            onClick={() => {
              setEditFormData({
                name: firm.name,
                adminName: firm.adminName,
                email: firm.email,
                seatLimit: firm.seatLimit,
                plan: firm.plan,
              });
              setIsEditModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#124b4b] hover:bg-[#0d3636] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit Firm
          </button>
        </div>
      </div>

      {/* Operational Metrics Cards (Exact Shared Style from Screenshot) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Active Users */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs relative overflow-hidden group hover:border-slate-300 transition-all">
          <Building2 className="absolute -bottom-4 -right-2 w-28 h-28 text-blue-500/5 -rotate-12 group-hover:scale-105 transition-transform pointer-events-none" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Users & Seats</p>
              <h3 className="text-3xl font-black text-slate-900 mt-2 tracking-tight">{firm.users}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between text-xs relative z-10">
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
              {firm.users} / {firm.seatLimit} seats ({Math.round((firm.users / firm.seatLimit) * 100)}%)
            </span>
            <span className="text-slate-500 font-medium text-[11px]">{firm.plan} Tier</span>
          </div>
        </div>

        {/* Card 2: Cases Volume (from Firm Listing Table) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs relative overflow-hidden group hover:border-slate-300 transition-all">
          <FileText className="absolute -bottom-4 -right-2 w-28 h-28 text-teal-500/5 -rotate-12 group-hover:scale-105 transition-transform pointer-events-none" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Cases Volume</p>
              <h3 className="text-3xl font-black text-slate-900 mt-2 tracking-tight">{firm.totalCases.toLocaleString()}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center border border-teal-100 shrink-0">
              <FileText className="w-5 h-5 text-teal-600" />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between text-xs relative z-10">
            <span className="text-teal-700 font-bold bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">
              {firm.inProgressCases} In-Progress
            </span>
            <span className="text-slate-500 font-medium text-[11px]">{firm.totalCases - firm.inProgressCases} completed</span>
          </div>
        </div>

        {/* Card 3: Processing Health (from Firm Listing Table) */}
        <div className={`bg-white rounded-2xl p-6 shadow-xs relative overflow-hidden group transition-all ${
          firm.healthSeverity === "error"
            ? "border border-rose-200/80 hover:border-rose-300"
            : firm.healthSeverity === "warning"
            ? "border border-amber-200/80 hover:border-amber-300"
            : "border border-slate-200/80 hover:border-slate-300"
        }`}>
          {firm.healthSeverity === "healthy" ? (
            <ShieldCheck className="absolute -bottom-4 -right-2 w-28 h-28 text-emerald-500/5 -rotate-12 group-hover:scale-105 transition-transform pointer-events-none" />
          ) : (
            <AlertTriangle className="absolute -bottom-4 -right-2 w-28 h-28 text-rose-500/5 -rotate-12 group-hover:scale-105 transition-transform pointer-events-none" />
          )}
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className={`text-[11px] font-bold uppercase tracking-wider ${
                firm.healthSeverity === "error"
                  ? "text-rose-600"
                  : firm.healthSeverity === "warning"
                  ? "text-amber-700"
                  : "text-slate-500"
              }`}>
                System & Document Health
              </p>
              <h3 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">
                {firm.healthStatus}
              </h3>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${
              firm.healthSeverity === "error"
                ? "bg-rose-50 border-rose-100 text-rose-600"
                : firm.healthSeverity === "warning"
                ? "bg-amber-50 border-amber-100 text-amber-700"
                : "bg-emerald-50 border-emerald-100 text-emerald-600"
            }`}>
              {firm.healthSeverity === "healthy" ? (
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between text-xs relative z-10">
            <span className={`font-bold px-2.5 py-0.5 rounded-full border ${
              firm.healthSeverity === "error"
                ? "text-rose-700 bg-rose-50 border-rose-100"
                : firm.healthSeverity === "warning"
                ? "text-amber-700 bg-amber-50 border-amber-100"
                : "text-emerald-700 bg-emerald-50 border-emerald-100"
            }`}>
              {firm.healthSeverity === "healthy" ? "0 Pipeline Errors" : "Attention Required"}
            </span>
            <span className="text-slate-500 font-medium text-[11px]">
              {firm.healthSeverity === "healthy" ? "HIPAA compliant" : "Auto-retry scheduled"}
            </span>
          </div>
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
            onClick={() => setActiveTab("audit")}
            className={`pb-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === "audit" ? "border-teal-600 text-teal-700" : "border-transparent text-slate-500 hover:text-slate-700"}`}
          >
            Audit Log
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

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden pb-12">
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
            {/* Card 1: Firm Information */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-teal-600" /> Firm Information
              </h3>
              <div className="space-y-3.5 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Address</p>
                    <p className="text-sm font-medium text-slate-800 mt-0.5">{firm.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Support Email</p>
                    <p className="text-sm font-medium text-slate-800 mt-0.5">{firm.supportEmail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone</p>
                    <p className="text-sm font-medium text-slate-800 mt-0.5">{firm.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Member Since</p>
                    <p className="text-sm font-medium text-slate-800 mt-0.5">{firm.createdAt}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Administrator & Activity (from Firm Listing Table) */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" /> Administrator & Access
                  </h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${firm.status ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                    {firm.status ? "Active Admin" : "Suspended"}
                  </span>
                </div>
                <div className="space-y-3.5 mt-4 text-sm">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Primary Admin Name</p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{firm.adminName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Admin Email</p>
                    <p className="text-sm font-medium text-slate-700 mt-0.5">{firm.email}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Platform Activity</p>
                    <p className="text-sm font-medium text-slate-800 mt-0.5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {firm.lastActive}
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">Need to remind administrator?</span>
                <button
                  onClick={handleNudgeFirm}
                  className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-lg border border-amber-200 transition-colors shadow-2xs"
                >
                  <Bell className="w-3.5 h-3.5 text-amber-600" /> Nudge Admin
                </button>
              </div>
            </div>

            {/* Card 3: Cases Volume & Platform Performance (from Firm Listing Table) */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600" /> Cases Volume Breakdown
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Uploaded</span>
                  <span className="text-sm font-bold text-slate-900">{firm.totalCases.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">In-Progress Cases</span>
                  <span className="text-sm font-bold text-teal-700">{firm.inProgressCases}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed Chronologies</span>
                  <span className="text-sm font-bold text-emerald-700">{firm.totalCases - firm.inProgressCases}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Document Pipeline Status</span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    firm.healthSeverity === "healthy" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"
                  }`}>
                    {firm.healthStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 4: Subscription & Limits */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-indigo-600" /> Subscription & Capacity
                </h3>
                <div className="space-y-3 mt-4">
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Tier</span>
                    <span className="text-sm font-bold text-slate-900">{firm.plan} Plan</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Seats Assigned / Limit</span>
                    <span className="text-sm font-bold text-slate-900">{firm.users} / {firm.seatLimit} seats</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Capacity Utilization</span>
                    <span className="text-sm font-bold text-slate-900">{Math.round((firm.users / firm.seatLimit) * 100)}%</span>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">Tenant status: {firm.status ? "Active" : "Suspended"}</span>
                <button
                  onClick={handleToggleStatus}
                  className={`px-3 py-1.5 font-bold text-xs rounded-lg transition-colors shadow-2xs ${
                    firm.status ? "bg-slate-100 text-slate-700 hover:bg-slate-200" : "bg-emerald-600 text-white hover:bg-emerald-700"
                  }`}
                >
                  {firm.status ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users & Roles Tab */}
        {activeTab === "users" && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
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

        {/* Audit Log Tab */}
        {activeTab === "audit" && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Audit Log</h2>
                <p className="text-sm text-slate-500 mt-1">Track user activity and system events.</p>
              </div>
              
              <div className="flex items-center gap-3 w-full md:w-auto relative">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search logs..."
                    value={auditSearchTerm}
                    onChange={(e) => setAuditSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-sm"
                  />
                </div>
                <div className="relative">
                  <button 
                    onClick={() => setIsAuditFilterOpen(!isAuditFilterOpen)}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      auditRoleFilter !== 'all' 
                        ? 'border-teal-500 bg-teal-50 text-teal-700' 
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Filter className="w-4 h-4" /> Filter {auditRoleFilter !== 'all' && `(${auditRoleFilter})`}
                  </button>

                  {isAuditFilterOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-slate-200 shadow-lg py-1.5 z-20">
                      <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                        Filter By Role
                      </div>
                      {["all", "Managing Partner", "Attorney", "Paralegal", "Admin"].map((r) => (
                        <button
                          key={r}
                          onClick={() => {
                            setAuditRoleFilter(r);
                            setIsAuditFilterOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-slate-50 transition-colors flex items-center justify-between ${
                            auditRoleFilter === r ? 'text-teal-700 bg-teal-50/60 font-semibold' : 'text-slate-700'
                          }`}
                        >
                          <span>{r === 'all' ? 'All Roles' : r}</span>
                          {auditRoleFilter === r && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">USER</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">ROLE</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">ACTION</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">DETAILS</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">TIMESTAMP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {firmAuditLogs
                    .filter((log) => {
                      if (auditRoleFilter !== "all" && log.role !== auditRoleFilter) return false;
                      if (auditSearchTerm.trim()) {
                        const q = auditSearchTerm.toLowerCase();
                        const matchUser = log.user.toLowerCase().includes(q) || log.email.toLowerCase().includes(q);
                        const matchAction = log.action.toLowerCase().includes(q);
                        const matchDetails = log.details.toLowerCase().includes(q);
                        if (!matchUser && !matchAction && !matchDetails) return false;
                      }
                      return true;
                    })
                    .map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-900">{log.user}</span>
                            <span className="text-[11px] text-slate-500 mt-0.5">{log.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Hexagon className={`w-4 h-4 ${log.role === 'Attorney' ? 'text-emerald-500' : 'text-slate-400'}`} />
                            {log.role}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold rounded">
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-600">{log.details}</span>
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
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
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between">
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
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between">
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

              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
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

      {/* Edit Firm Modal (from Firm Listing Table) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Edit Firm Profile</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update firm identity, administrator contact, and plan capacity.
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateFirm} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Firm Name
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Admin Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.adminName}
                    onChange={(e) => setEditFormData({ ...editFormData, adminName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 focus:bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    required
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Seat Limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editFormData.seatLimit}
                    onChange={(e) => setEditFormData({ ...editFormData, seatLimit: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 focus:bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Subscription Tier
                  </label>
                  <select
                    value={editFormData.plan}
                    onChange={(e) => setEditFormData({ ...editFormData, plan: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 focus:bg-white"
                  >
                    <option value="Enterprise">Enterprise</option>
                    <option value="Professional">Professional</option>
                    <option value="Starter">Starter</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#124b4b] hover:bg-[#0d3636] rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
