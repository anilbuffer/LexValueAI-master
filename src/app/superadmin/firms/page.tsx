"use client";

import Link from "next/link";
import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Plus, Eye, Edit2, Trash2,
  Building2, ToggleRight, ToggleLeft, Bell, AlertTriangle, CheckCircle2,
  Clock, FileText, X, AlertCircle, Archive, ShieldCheck, Check, Search,
  ShieldAlert, Mail, Phone, MapPin
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
  // Approval metadata
  isApproved?: boolean;
  phone?: string;
  location?: string;
  practiceArea?: string;
  complianceStatus?: string;
  taxId?: string;
  applicationNote?: string;
  submittedDate?: string;
}

export interface NotApprovedFirm {
  id: string;
  name: string;
  email: string;
  adminName: string;
  phone: string;
  location: string;
  plan: "Enterprise" | "Professional" | "Starter";
  seatLimit: number;
  submittedDate: string;
  submittedAgo: string;
  practiceArea: string;
  complianceStatus: string;
  taxId: string;
  applicationNote: string;
  baaSigned: boolean;
}

const initialActiveFirms: TenantFirm[] = [
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
    isApproved: true,
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
    isApproved: true,
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
    isApproved: true,
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
    isApproved: true,
  },
  {
    id: "5",
    name: "Apex Justice LLP",
    email: "arthur@apexjustice.com",
    adminName: "Arthur Pendelton",
    users: 18,
    seatLimit: 30,
    plan: "Enterprise",
    joinedDate: "May 19, 2026",
    status: true,
    totalCases: 210,
    inProgressCases: 8,
    lastActive: "Active 45 mins ago",
    isInactive: false,
    healthStatus: "Success",
    healthSeverity: "Success",
    isApproved: true,
  },
  {
    id: "6",
    name: "Sterling & Croft Legal",
    email: "eleanor@sterlingcroft.com",
    adminName: "Eleanor Sterling",
    users: 9,
    seatLimit: 20,
    plan: "Professional",
    joinedDate: "May 02, 2026",
    status: true,
    totalCases: 134,
    inProgressCases: 5,
    lastActive: "Active 3 hours ago",
    isInactive: false,
    healthStatus: "Success(0 Errors)",
    healthSeverity: "Success",
    isApproved: true,
  },
  {
    id: "7",
    name: "Vanguard Litigation Partners",
    email: "marcus@vanguardlit.com",
    adminName: "Marcus Vance",
    users: 15,
    seatLimit: 40,
    plan: "Enterprise",
    joinedDate: "Apr 14, 2026",
    status: true,
    totalCases: 178,
    inProgressCases: 11,
    lastActive: "Active 10 mins ago",
    isInactive: false,
    healthStatus: "Success",
    healthSeverity: "Success",
    isApproved: true,
  },
  {
    id: "8",
    name: "Beacon Hill Attorneys",
    email: "clara@beaconhilllaw.com",
    adminName: "Clara Oswald",
    users: 4,
    seatLimit: 10,
    plan: "Starter",
    joinedDate: "Mar 28, 2026",
    status: true,
    totalCases: 67,
    inProgressCases: 3,
    lastActive: "Active 1 day ago",
    isInactive: false,
    healthStatus: "Success",
    healthSeverity: "Success",
    isApproved: true,
  },
  {
    id: "9",
    name: "Nexus Injury Law",
    email: "dkim@nexusinjury.com",
    adminName: "David Kim",
    users: 7,
    seatLimit: 15,
    plan: "Professional",
    joinedDate: "Mar 10, 2026",
    status: true,
    totalCases: 98,
    inProgressCases: 4,
    lastActive: "Active 4 hours ago",
    isInactive: false,
    healthStatus: "Success(0 Errors)",
    healthSeverity: "Success",
    isApproved: true,
  },
  {
    id: "10",
    name: "Summit Legal Defense",
    email: "brian@summitlegal.com",
    adminName: "Brian O'Connor",
    users: 22,
    seatLimit: 50,
    plan: "Enterprise",
    joinedDate: "Feb 22, 2026",
    status: true,
    totalCases: 305,
    inProgressCases: 16,
    lastActive: "Active 30 mins ago",
    isInactive: false,
    healthStatus: "Success",
    healthSeverity: "Success",
    isApproved: true,
  },
  {
    id: "11",
    name: "Precision Legal Group",
    email: "rachel@precisionlegal.com",
    adminName: "Rachel Green",
    users: 6,
    seatLimit: 12,
    plan: "Professional",
    joinedDate: "Feb 08, 2026",
    status: true,
    totalCases: 82,
    inProgressCases: 2,
    lastActive: "Active 2 hours ago",
    isInactive: false,
    healthStatus: "Success",
    healthSeverity: "Success",
    isApproved: true,
  },
  {
    id: "12",
    name: "Liberty Trial Counsel",
    email: "thomas@libertytrial.com",
    adminName: "Thomas Wright",
    users: 3,
    seatLimit: 8,
    plan: "Starter",
    joinedDate: "Jan 29, 2026",
    status: true,
    totalCases: 45,
    inProgressCases: 1,
    lastActive: "Inactive for 3 days",
    isInactive: true,
    healthStatus: "Success",
    healthSeverity: "Success",
    isApproved: true,
  },
  {
    id: "13",
    name: "Veritas Law Partners",
    email: "vchase@veritaslaw.com",
    adminName: "Victoria Chase",
    users: 11,
    seatLimit: 20,
    plan: "Professional",
    joinedDate: "Jan 14, 2026",
    status: true,
    totalCases: 149,
    inProgressCases: 7,
    lastActive: "Active 1 hour ago",
    isInactive: false,
    healthStatus: "Success(0 Errors)",
    healthSeverity: "Success",
    isApproved: true,
  },
  {
    id: "14",
    name: "Blackstone Legal Services",
    email: "jwilson@blackstonelegal.com",
    adminName: "James Wilson",
    users: 20,
    seatLimit: 45,
    plan: "Enterprise",
    joinedDate: "Jan 05, 2026",
    status: true,
    totalCases: 275,
    inProgressCases: 9,
    lastActive: "Active 15 mins ago",
    isInactive: false,
    healthStatus: "Success",
    healthSeverity: "Success",
    isApproved: true,
  },
];

const initialNotApprovedFirms: NotApprovedFirm[] = [
  {
    id: "pending-1",
    name: "Apex Legal Defense LLP",
    email: "ghouse@apexlegal.org",
    adminName: "Gregory House, JD",
    phone: "+1 (555) 342-9901",
    location: "Los Angeles, CA",
    plan: "Enterprise",
    seatLimit: 50,
    submittedDate: "Sep 28, 2026",
    submittedAgo: "2 days ago",
    practiceArea: "Personal Injury & Medical Malpractice",
    complianceStatus: "Pending BAA Sign-off",
    taxId: "XX-9841203",
    applicationNote: "Expanding multi-partner personal injury litigation practice requiring HIPAA-compliant high-volume OCR & chronology indexing.",
    baaSigned: false,
  },
  {
    id: "pending-2",
    name: "Horizon Injury Law Group",
    email: "rvance@horizoninjury.com",
    adminName: "Rebecca Vance",
    phone: "+1 (555) 782-1144",
    location: "New York, NY",
    plan: "Professional",
    seatLimit: 20,
    submittedDate: "Sep 27, 2026",
    submittedAgo: "3 days ago",
    practiceArea: "Auto Accident Litigation",
    complianceStatus: "Tax ID Verified / BAA Pending",
    taxId: "XX-4419208",
    applicationNote: "Specialized in auto accident claims and medical records review with 6 trial attorneys.",
    baaSigned: false,
  },
  {
    id: "pending-3",
    name: "Vanguard Trial Advocates",
    email: "sterling@vanguardtrials.com",
    adminName: "Arthur Sterling",
    phone: "+1 (555) 901-4455",
    location: "Austin, TX",
    plan: "Professional",
    seatLimit: 15,
    submittedDate: "Sep 26, 2026",
    submittedAgo: "4 days ago",
    practiceArea: "Product Liability & Mass Torts",
    complianceStatus: "Under Compliance Review",
    taxId: "XX-7721839",
    applicationNote: "Seeking automated chronology extraction for pending multi-district litigation deposition transcripts.",
    baaSigned: true,
  },
  {
    id: "pending-4",
    name: "Keystone & Partners Legal",
    email: "elena@keystonelegal.com",
    adminName: "Elena Rostova",
    phone: "+1 (555) 612-8877",
    location: "Miami, FL",
    plan: "Starter",
    seatLimit: 5,
    submittedDate: "Sep 25, 2026",
    submittedAgo: "5 days ago",
    practiceArea: "Civil Defense & Arbitration",
    complianceStatus: "Pending Identity Check",
    taxId: "XX-3381902",
    applicationNote: "Solo practitioner scaling into boutique litigation firm with paralegal staff.",
    baaSigned: false,
  },
  {
    id: "pending-5",
    name: "Pinnacle Health & Injury Counsel",
    email: "mbrody@pinnacledefense.com",
    adminName: "Marcus Brody",
    phone: "+1 (555) 433-2211",
    location: "Chicago, IL",
    plan: "Enterprise",
    seatLimit: 40,
    submittedDate: "Sep 24, 2026",
    submittedAgo: "6 days ago",
    practiceArea: "Complex Medical Malpractice",
    complianceStatus: "Awaiting Superadmin Authorization",
    taxId: "XX-8830192",
    applicationNote: "High-volume hospital liability defense firm requiring HIPAA-certified data pipelines and settlement bracket calculators.",
    baaSigned: true,
  },
];

function FirmsContent() {
  const searchParams = useSearchParams();
  const [firms, setFirms] = useState<TenantFirm[]>(initialActiveFirms);
  const [notApprovedFirms, setNotApprovedFirms] = useState<NotApprovedFirm[]>(initialNotApprovedFirms);

  // Tab State: "active" | "not_approved" | "all"
  const [activeTab, setActiveTab] = useState<"active" | "not_approved" | "all">("active");

  // Filter & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [planFilter, setPlanFilter] = useState("all");

  // Notification / Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingFirm, setDeletingFirm] = useState<TenantFirm | null>(null);

  // Pending Review Modal States
  const [selectedPendingFirm, setSelectedPendingFirm] = useState<NotApprovedFirm | null>(null);
  const [isApproveConfirmModalOpen, setIsApproveConfirmModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  useEffect(() => {
    const statusParam = searchParams.get("status") || searchParams.get("tab");
    if (statusParam === "not_approved" || statusParam === "pending" || statusParam === "not-approved") {
      setActiveTab("not_approved");
    } else if (statusParam === "all") {
      setActiveTab("all");
    } else if (statusParam === "active" || statusParam === "approved") {
      setActiveTab("active");
    }

    if (searchParams.get("created") === "true") {
      showToast("Tenant firm successfully created.");
      window.history.replaceState({}, "", "/superadmin/firms");
    } else if (searchParams.get("updated") === "true") {
      showToast("Firm details updated successfully.");
      window.history.replaceState({}, "", "/superadmin/firms");
    }
  }, [searchParams]);

  useEffect(() => {
    try {
      const savedPending = localStorage.getItem("lexvalu_pending_firms");
      if (savedPending) {
        setNotApprovedFirms(JSON.parse(savedPending));
      }
    } catch {
      // ignore
    }

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
  }, []);

  // Status Toggle Quick Action for Active Firms
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

  // Approve Pending Firm Action
  const handleApprovePendingFirm = (firm: NotApprovedFirm) => {
    const newApprovedFirm: TenantFirm = {
      id: firm.id.replace("pending-", "app-") || String(Date.now()),
      name: firm.name,
      email: firm.email,
      adminName: firm.adminName,
      users: 1,
      seatLimit: firm.seatLimit,
      plan: firm.plan,
      joinedDate: "Today",
      status: true,
      totalCases: 0,
      inProgressCases: 0,
      lastActive: "Just now",
      isInactive: false,
      healthStatus: "Success(0 Errors)",
      healthSeverity: "Success",
      isApproved: true,
      phone: firm.phone,
      location: firm.location,
      taxId: firm.taxId,
      practiceArea: firm.practiceArea,
    };

    const updatedPending = notApprovedFirms.filter((p) => p.id !== firm.id);
    setNotApprovedFirms(updatedPending);

    const updatedApproved = [newApprovedFirm, ...firms];
    setFirms(updatedApproved);

    try {
      localStorage.setItem("lexvalu_pending_firms", JSON.stringify(updatedPending));
      localStorage.setItem("lexvalu_custom_firms", JSON.stringify(updatedApproved));
    } catch {
      // ignore
    }

    showToast(`✓ "${firm.name}" has been approved & activated successfully.`);
    setIsApproveConfirmModalOpen(false);
    setSelectedPendingFirm(null);
  };

  // Reject Pending Firm Action
  const handleRejectPendingFirm = () => {
    if (!selectedPendingFirm) return;

    const updatedPending = notApprovedFirms.filter((p) => p.id !== selectedPendingFirm.id);
    setNotApprovedFirms(updatedPending);

    try {
      localStorage.setItem("lexvalu_pending_firms", JSON.stringify(updatedPending));
    } catch {
      // ignore
    }

    showToast(`Application for "${selectedPendingFirm.name}" has been declined.`);
    setIsRejectModalOpen(false);
    setSelectedPendingFirm(null);
    setRejectReason("");
  };

  // Filtered Lists
  const filteredActiveFirms = useMemo(() => {
    return firms.filter((f) => {
      const matchSearch =
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchPlan = planFilter === "all" || f.plan.toLowerCase() === planFilter.toLowerCase();
      return matchSearch && matchPlan;
    });
  }, [firms, searchTerm, planFilter]);

  const filteredPendingFirms = useMemo(() => {
    return notApprovedFirms.filter((f) => {
      const matchSearch =
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.practiceArea.toLowerCase().includes(searchTerm.toLowerCase());
      const matchPlan = planFilter === "all" || f.plan.toLowerCase() === planFilter.toLowerCase();
      return matchSearch && matchPlan;
    });
  }, [notApprovedFirms, searchTerm, planFilter]);

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
          <p className="text-xs md:text-sm text-slate-500 mt-1 font-medium">
            Manage tenant law firm organizations, monitor access health, and review admission approvals.
          </p>
        </div>

        {/* Add Firm Button */}
        <Link
          href="/superadmin/firms/create"
          className="flex items-center gap-2 bg-[#124b4b] hover:bg-[#0d3636] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Firm
        </Link>
      </div>

      {/* Tabs & Controls Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 bg-slate-100/80 p-1.5 rounded-xl">
          <button
            onClick={() => setActiveTab("active")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "active"
                ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Active Firms</span>
            <span className="px-1.5 py-0.2 bg-blue-100 text-blue-700 text-[10px] font-black rounded-md">
              {firms.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("not_approved")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "not_approved"
                ? "bg-amber-600 text-white shadow-xs"
                : "text-amber-800 hover:bg-amber-100/60"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Not Approved Firms</span>
            <span
              className={`px-1.5 py-0.2 text-[10px] font-black rounded-md ${
                activeTab === "not_approved" ? "bg-amber-800 text-white" : "bg-amber-100 text-amber-800"
              }`}
            >
              {notApprovedFirms.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("all")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "all"
                ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
            }`}
          >
            <span>All ({firms.length + notApprovedFirms.length})</span>
          </button>
        </div>

        {/* Search & Filter Dropdown */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={activeTab === "not_approved" ? "Search pending firms..." : "Search tenant firms..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="relative shrink-0">
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 cursor-pointer"
            >
              <option value="all">All Plans</option>
              <option value="enterprise">Enterprise</option>
              <option value="professional">Professional</option>
              <option value="starter">Starter</option>
            </select>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: NOT APPROVED FIRMS TABLE */}
      {/* ========================================================================= */}
      {activeTab === "not_approved" && (
        <div className="space-y-4">
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 border border-amber-200">
                <AlertCircle className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h3 className="font-bold text-amber-950 text-sm">
                  Pending Admission & Verification Queue ({notApprovedFirms.length})
                </h3>
                <p className="text-xs text-amber-800/80">
                  These law firms have registered or requested access and require superadmin verification and BAA review before activation.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="text-[10.5px] uppercase tracking-wider font-bold text-slate-400 border-b border-slate-200 bg-slate-50/50">
                  <tr>
                    <th className="px-5 py-4 whitespace-nowrap">Firm & Applicant</th>
                    <th className="px-4 py-4 whitespace-nowrap">Practice Area</th>
                    <th className="px-4 py-4 whitespace-nowrap">Verification & BAA</th>
                    <th className="px-4 py-4 whitespace-nowrap">Submitted</th>
                    <th className="px-5 py-4 whitespace-nowrap text-right">Approval Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredPendingFirms.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm">
                        <div className="flex flex-col items-center justify-center">
                          <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2 opacity-70" />
                          <p className="font-semibold text-slate-700">No Not Approved Firms Found</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {searchTerm ? "No pending firms matched your search criteria." : "All registered tenant firms have been approved!"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredPendingFirms.map((firm) => (
                      <tr key={firm.id} className="hover:bg-amber-50/20 transition-colors group">
                        {/* Firm & Applicant */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-amber-600 shrink-0" />
                              <span className="font-bold text-slate-900 text-sm">{firm.name}</span>
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                              <span className="font-medium text-slate-700 flex items-center gap-1">
                                {firm.adminName}
                              </span>
                              <span>&bull;</span>
                              <span className="text-slate-500">{firm.email}</span>
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-slate-400" /> {firm.location}
                            </div>
                          </div>
                        </td>

                        {/* Practice Area */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex flex-col max-w-[200px]">
                            <span className="font-medium text-slate-800 text-xs truncate" title={firm.practiceArea}>
                              {firm.practiceArea}
                            </span>
                            <span className="text-[11px] text-slate-400 truncate mt-0.5" title={firm.applicationNote}>
                              {firm.applicationNote}
                            </span>
                          </div>
                        </td>

                        {/* Verification & BAA */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                              {firm.complianceStatus}
                            </span>
                            <span className="text-[10.5px] font-semibold text-slate-500 flex items-center gap-1">
                              Tax ID: <span className="font-mono text-slate-700">{firm.taxId}</span>
                            </span>
                          </div>
                        </td>

                        {/* Submitted */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <div>
                              <p className="font-medium text-slate-700">{firm.submittedDate}</p>
                              <p className="text-[10px] text-slate-400">{firm.submittedAgo}</p>
                            </div>
                          </div>
                        </td>

                        {/* Approval Actions */}
                        <td className="px-5 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Approve Button */}
                            <button
                              onClick={() => {
                                setSelectedPendingFirm(firm);
                                setIsApproveConfirmModalOpen(true);
                              }}
                              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs"
                              title="Approve Firm & Activate Workspace"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>

                            {/* View Details Button */}
                            <button
                              onClick={() => setSelectedPendingFirm(firm)}
                              className="p-1.5 text-slate-600 hover:text-teal-700 hover:bg-teal-50 border border-slate-200 rounded-lg transition-colors"
                              title="Review Application Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Decline / Reject Button */}
                            <button
                              onClick={() => {
                                setSelectedPendingFirm(firm);
                                setIsRejectModalOpen(true);
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 rounded-lg transition-colors"
                              title="Decline Application"
                            >
                              <X className="w-3.5 h-3.5" />
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: ACTIVE / APPROVED FIRMS TABLE */}
      {/* ========================================================================= */}
      {activeTab === "active" && (
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
                {filteredActiveFirms.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-slate-400 text-sm">
                      No tenant firms match the search filter.
                    </td>
                  </tr>
                ) : (
                  filteredActiveFirms.map((firm) => (
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
                            <span>&bull;</span>
                            <span className="text-slate-400">{firm.plan}</span>
                          </div>
                        </div>
                      </td>

                      {/* Cases Volume Col */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5 text-teal-600" />
                            {firm.totalCases} Total Cases
                          </span>
                          <span className="text-[11px] font-semibold text-slate-400 mt-0.5">
                            {firm.users}/{firm.seatLimit} Users
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
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: ALL FIRMS TABLE (COMBINED ACTIVE & PENDING) */}
      {/* ========================================================================= */}
      {activeTab === "all" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="text-[10.5px] uppercase tracking-wider font-bold text-slate-400 border-b border-slate-200 bg-slate-50/50">
                <tr>
                  <th className="px-5 py-4 whitespace-nowrap">Firm Name</th>
                  <th className="px-4 py-4 whitespace-nowrap">Primary Admin</th>
                  <th className="px-4 py-4 whitespace-nowrap">Plan & Seats</th>
                  <th className="px-4 py-4 whitespace-nowrap">Status</th>
                  <th className="px-4 py-4 whitespace-nowrap">Admission Stage</th>
                  <th className="px-5 py-4 whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {/* Pending Firms First */}
                {notApprovedFirms
                  .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.adminName.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((firm) => (
                    <tr key={firm.id} className="bg-amber-50/30 hover:bg-amber-50/50 transition-colors">
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-amber-600" />
                          <span className="font-bold text-slate-900 text-sm">{firm.name}</span>
                        </div>
                        <span className="text-[11px] text-slate-400 ml-6">{firm.location}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-xs">
                        <p className="font-semibold text-slate-800">{firm.adminName}</p>
                        <p className="text-slate-400">{firm.email}</p>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-xs">
                        <span className="font-bold text-slate-800">{firm.plan}</span>
                        <span className="text-slate-400 block text-[11px]">{firm.seatLimit} seats</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          <AlertCircle className="w-3 h-3 text-amber-600" /> Not Approved
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-500">
                        {firm.complianceStatus}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => {
                            setSelectedPendingFirm(firm);
                            setIsApproveConfirmModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                        >
                          Approve
                        </button>
                      </td>
                    </tr>
                  ))}

                {/* Active Firms */}
                {filteredActiveFirms.map((firm) => (
                  <tr key={firm.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-teal-700" />
                        <Link
                          href={`/superadmin/firms/${firm.id}`}
                          className="font-bold text-[#124b4b] text-sm hover:underline"
                        >
                          {firm.name}
                        </Link>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-xs">
                      <p className="font-semibold text-slate-800">{firm.adminName}</p>
                      <p className="text-slate-400">{firm.email}</p>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-xs">
                      <span className="font-bold text-slate-800">{firm.plan}</span>
                      <span className="text-slate-400 block text-[11px]">{firm.seatLimit} seats</span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {firm.status ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          <X className="w-3 h-3 text-rose-600" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-xs text-emerald-700 font-semibold">
                      Approved & Live
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <Link
                        href={`/superadmin/firms/${firm.id}`}
                        className="p-1.5 text-slate-600 hover:text-teal-700 hover:bg-teal-50 border border-slate-200 rounded-lg transition-colors inline-block"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 mt-2 px-2">
        <div>
          Showing {activeTab === "not_approved" ? notApprovedFirms.length : activeTab === "active" ? firms.length : firms.length + notApprovedFirms.length} registered organizations
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

      {/* ========================================================================= */}
      {/* MODAL 1: VIEW / REVIEW APPLICATION DETAILS MODAL */}
      {/* ========================================================================= */}
      {selectedPendingFirm && !isApproveConfirmModalOpen && !isRejectModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 p-6 sm:p-8 space-y-6 my-8">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-extrabold text-slate-900">{selectedPendingFirm.name}</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                      Pending Approval
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Admission application submitted {selectedPendingFirm.submittedAgo} ({selectedPendingFirm.submittedDate})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPendingFirm(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Application Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Primary Admin Contact</p>
                <div className="space-y-1 text-xs">
                  <p className="font-bold text-slate-900">{selectedPendingFirm.adminName}</p>
                  <p className="text-slate-600 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> {selectedPendingFirm.email}
                  </p>
                  <p className="text-slate-600 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> {selectedPendingFirm.phone}
                  </p>
                  <p className="text-slate-600 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {selectedPendingFirm.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Verification Checklist */}
            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 space-y-2.5">
              <p className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-700" /> HIPAA & Compliance Checkpoints
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-amber-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-slate-700 font-medium">State Bar Standing Verified</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-amber-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-slate-700 font-medium">Employer Tax ID Matched</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-amber-200">
                  {selectedPendingFirm.baaSigned ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  )}
                  <span className="text-slate-700 font-medium">
                    {selectedPendingFirm.baaSigned ? "BAA Agreement Executed" : "BAA Pending Superadmin Approval"}
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-amber-200">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="text-slate-700 font-medium">Tenant Isolation Key Ready</span>
                </div>
              </div>
            </div>

            {/* Application Note */}
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Litigation Focus & Purpose</p>
              <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                <strong className="text-slate-900">Practice Area:</strong> {selectedPendingFirm.practiceArea}
                <br />
                <strong className="text-slate-900">Application Note:</strong> &ldquo;{selectedPendingFirm.applicationNote}&rdquo;
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <button
                onClick={() => setIsRejectModalOpen(true)}
                className="px-4 py-2.5 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors"
              >
                Decline Application
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedPendingFirm(null)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => setIsApproveConfirmModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  <Check className="w-4 h-4" /> Approve & Activate Firm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: CONFIRM APPROVAL MODAL */}
      {/* ========================================================================= */}
      {isApproveConfirmModalOpen && selectedPendingFirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Approve Tenant Firm</h3>
                <p className="text-xs text-slate-500">
                  Confirm onboarding for <span className="font-bold text-slate-800">{selectedPendingFirm.name}</span>
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
              Approving this firm will provision their multi-tenant database workspace, enable user sign-ins for <strong className="text-slate-800">{selectedPendingFirm.adminName}</strong>, and notify the law firm via welcome email.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsApproveConfirmModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApprovePendingFirm(selectedPendingFirm)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: DECLINE / REJECT MODAL */}
      {/* ========================================================================= */}
      {isRejectModalOpen && selectedPendingFirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Decline Application</h3>
                <p className="text-xs text-slate-500">
                  Decline registration for <span className="font-bold text-slate-800">{selectedPendingFirm.name}</span>
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">Reason for Declining (Optional feedback)</label>
              <textarea
                rows={3}
                placeholder="e.g. Incomplete BAA documentation or unable to verify jurisdiction bar credentials..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectPendingFirm}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                Decline Firm Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: DELETE / DEACTIVATE MODAL (ACTIVE FIRMS) */}
      {/* ========================================================================= */}
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

export default function FirmsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-500">Loading firms...</div>}>
      <FirmsContent />
    </Suspense>
  );
}
