"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  Eye,
  Download,
  RefreshCw,
  FileText,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  XCircle,
  Info,
  Building2,
  Users,
  Key,
  Clock,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  X,
  Lock,
  Activity,
  Layers
} from "lucide-react";

// --- TYPES ---
export interface AuditLogItem {
  id: string;
  timestamp: string;
  firmId: string;
  firmName: string;
  user: {
    name: string;
    email: string;
    role: "Superadmin" | "Managing Partner" | "Attorney" | "Paralegal" | "Firm Admin" | "System Worker";
    avatarInitials: string;
    id: string;
  };
  action: string;
  category: "Authentication" | "Case Operations" | "HIPAA & PHI" | "Tenant Management" | "Security & Access" | "Billing";
  severity: "info" | "success" | "warning" | "critical";
  details: string;
  ipAddress: string;
  location: string;
  userAgent: string;
  phiAccessed: boolean;
  metadata?: Record<string, any>;
}

// --- MOCK ENTERPRISE AUDIT DATA ---
const INITIAL_LOGS: AuditLogItem[] = [
  {
    id: "LOG-2026-9841",
    timestamp: "2026-09-25T09:42:15Z",
    firmId: "firm-1",
    firmName: "Smith & Associates",
    user: {
      id: "usr-101",
      name: "Harvey Specter",
      email: "harvey@smithlaw.com",
      role: "Managing Partner",
      avatarInitials: "HS"
    },
    action: "PHI_EXPORT_GENERATED",
    category: "HIPAA & PHI",
    severity: "warning",
    details: "Exported HIPAA-protected Medical Chronology for Case #NY-2026-441 (Plaintiff: Eleanor Vance).",
    ipAddress: "198.51.100.42",
    location: "New York, NY, USA",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0",
    phiAccessed: true,
    metadata: {
      caseId: "case-NY-441",
      patientName: "Eleanor Vance",
      recordsCount: 42,
      exportFormat: "PDF_ENCRYPTED_AES256",
      verifiedBaa: true
    }
  },
  {
    id: "LOG-2026-9840",
    timestamp: "2026-09-25T09:28:04Z",
    firmId: "firm-4",
    firmName: "Davis & Co. Law",
    user: {
      id: "usr-402",
      name: "Michael Davis",
      email: "admin@daviscolaw.com",
      role: "Firm Admin",
      avatarInitials: "MD"
    },
    action: "FIRM_PLAN_UPGRADED",
    category: "Tenant Management",
    severity: "success",
    details: "Successfully upgraded tenant tier from Professional to Enterprise Plan (24 seats).",
    ipAddress: "172.56.21.90",
    location: "Chicago, IL, USA",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/17.4",
    phiAccessed: false,
    metadata: {
      previousPlan: "Professional",
      newPlan: "Enterprise",
      billedAnnual: true,
      stripeCustomerId: "cus_993hK28sL"
    }
  },
  {
    id: "LOG-2026-9839",
    timestamp: "2026-09-25T09:15:33Z",
    firmId: "platform-system",
    firmName: "LexValue Platform",
    user: {
      id: "sys-001",
      name: "Superadmin System",
      email: "security@lexvalue.ai",
      role: "Superadmin",
      avatarInitials: "SA"
    },
    action: "SECURITY_KEY_ROTATED",
    category: "Security & Access",
    severity: "info",
    details: "Automated quarterly KMS Master Key rotation verified compliant with HIPAA Security Rule CFR § 164.312.",
    ipAddress: "10.0.4.12 (VPC Private)",
    location: "AWS us-east-1 (N. Virginia)",
    userAgent: "LexValue-KMS-Worker/2.4.0",
    phiAccessed: false,
    metadata: {
      keyArn: "arn:aws:kms:us-east-1:38192837:key/hipaa-master-2026",
      rotationPeriodDays: 90,
      status: "COMPLIANT"
    }
  },
  {
    id: "LOG-2026-9838",
    timestamp: "2026-09-25T08:55:10Z",
    firmId: "firm-2",
    firmName: "Johnson Legal Group",
    user: {
      id: "usr-203",
      name: "Navneet Kaur",
      email: "nabneet@lexvalue.ai",
      role: "Attorney",
      avatarInitials: "NK"
    },
    action: "CASE_VALUATION_CALCULATED",
    category: "Case Operations",
    severity: "success",
    details: "Calculated multi-variable settlement valuation breakdown for Case #MVA-8812.",
    ipAddress: "108.26.114.71",
    location: "Los Angeles, CA, USA",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/128.0",
    phiAccessed: true,
    metadata: {
      caseId: "case-MVA-8812",
      totalMedicalBills: "$142,500.00",
      recommendedBracket: "$380,000 - $460,000",
      multiplierUsed: 3.2
    }
  },
  {
    id: "LOG-2026-9837",
    timestamp: "2026-09-25T08:40:22Z",
    firmId: "firm-3",
    firmName: "Miller & Partners",
    user: {
      id: "usr-301",
      name: "Sarah Miller",
      email: "admin@millerpartners.com",
      role: "Managing Partner",
      avatarInitials: "SM"
    },
    action: "SUSPICIOUS_LOGIN_ATTEMPT",
    category: "Authentication",
    severity: "critical",
    details: "Failed password attempts exceeded threshold (5 consecutive failed attempts) from unrecognized IP.",
    ipAddress: "45.154.255.89",
    location: "Frankfurt, Germany (Untrusted)",
    userAgent: "python-requests/2.31.0",
    phiAccessed: false,
    metadata: {
      attemptCount: 5,
      accountLocked: true,
      lockoutDurationMinutes: 30,
      mfaPrompted: false,
      blockedByFirewall: true
    }
  },
  {
    id: "LOG-2026-9836",
    timestamp: "2026-09-25T08:12:45Z",
    firmId: "firm-1",
    firmName: "Smith & Associates",
    user: {
      id: "usr-104",
      name: "Pawan Kumar",
      email: "pawan@lexvalue.ai",
      role: "Paralegal",
      avatarInitials: "PK"
    },
    action: "USER_LOGOUT",
    category: "Authentication",
    severity: "info",
    details: "User session terminated gracefully after 3 hours 20 minutes active session.",
    ipAddress: "198.51.100.44",
    location: "New York, NY, USA",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0",
    phiAccessed: false,
    metadata: {
      sessionDurationMinutes: 200,
      activeTabs: 1,
      logoutType: "USER_EXPLICIT"
    }
  },
  {
    id: "LOG-2026-9835",
    timestamp: "2026-09-25T07:49:19Z",
    firmId: "firm-1",
    firmName: "Smith & Associates",
    user: {
      id: "usr-104",
      name: "Pawan Kumar",
      email: "pawan@lexvalue.ai",
      role: "Paralegal",
      avatarInitials: "PK"
    },
    action: "CASE_DOCUMENT_UPLOADED",
    category: "Case Operations",
    severity: "info",
    details: "Uploaded 14-page radiology scan 'CT_LumbarSpine_Contrast.pdf' with automated OCR indexing.",
    ipAddress: "198.51.100.44",
    location: "New York, NY, USA",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0",
    phiAccessed: true,
    metadata: {
      caseId: "case-NY-441",
      fileName: "CT_LumbarSpine_Contrast.pdf",
      fileSizeBytes: 4892019,
      sha256Checksum: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      s3Encrypted: true
    }
  },
  {
    id: "LOG-2026-9834",
    timestamp: "2026-09-25T06:30:00Z",
    firmId: "platform-system",
    firmName: "LexValue Platform",
    user: {
      id: "sys-002",
      name: "Retention Worker",
      email: "retention-worker@lexvalue.ai",
      role: "System Worker",
      avatarInitials: "RW"
    },
    action: "DATA_RETENTION_AUDIT",
    category: "HIPAA & PHI",
    severity: "info",
    details: "Nightly automated retention policy executed: 0 records scheduled for deletion. All firm data retention active.",
    ipAddress: "10.0.2.18 (VPC Private)",
    location: "AWS us-east-1 (N. Virginia)",
    userAgent: "LexValue-Retention-Daemon/1.0",
    phiAccessed: false,
    metadata: {
      firmsChecked: 19,
      retentionPolicyYears: 7,
      status: "COMPLIANT"
    }
  },
  {
    id: "LOG-2026-9833",
    timestamp: "2026-09-24T18:22:11Z",
    firmId: "firm-2",
    firmName: "Johnson Legal Group",
    user: {
      id: "usr-201",
      name: "Robert Johnson",
      email: "admin@johnsonlegal.com",
      role: "Managing Partner",
      avatarInitials: "RJ"
    },
    action: "USER_INVITATION_SENT",
    category: "Tenant Management",
    severity: "info",
    details: "Invited new associate attorney 'emily.turner@johnsonlegal.com' with Attorney role.",
    ipAddress: "108.26.114.70",
    location: "Los Angeles, CA, USA",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0",
    phiAccessed: false,
    metadata: {
      inviteeEmail: "emily.turner@johnsonlegal.com",
      assignedRole: "ATTORNEY",
      expiresInDays: 7
    }
  },
  {
    id: "LOG-2026-9832",
    timestamp: "2026-09-24T16:15:00Z",
    firmId: "firm-4",
    firmName: "Davis & Co. Law",
    user: {
      id: "usr-405",
      name: "Jessica Pearson",
      email: "jessica@daviscolaw.com",
      role: "Attorney",
      avatarInitials: "JP"
    },
    action: "USER_LOGIN_2FA",
    category: "Authentication",
    severity: "success",
    details: "User successfully authenticated with TOTP 2FA hardware token.",
    ipAddress: "172.56.21.92",
    location: "Chicago, IL, USA",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/17.4",
    phiAccessed: false,
    metadata: {
      authMethod: "TOTP_HARDWARE",
      mfaVerified: true,
      deviceId: "dev-macbook-pro-2025"
    }
  },
  {
    id: "LOG-2026-9831",
    timestamp: "2026-09-24T14:50:33Z",
    firmId: "firm-1",
    firmName: "Smith & Associates",
    user: {
      id: "usr-101",
      name: "Harvey Specter",
      email: "harvey@smithlaw.com",
      role: "Managing Partner",
      avatarInitials: "HS"
    },
    action: "CASE_CREATED",
    category: "Case Operations",
    severity: "success",
    details: "Created new personal injury case 'Vance v. Metropolitan Transit Authority' (#NY-2026-441).",
    ipAddress: "198.51.100.42",
    location: "New York, NY, USA",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0",
    phiAccessed: true,
    metadata: {
      caseId: "case-NY-441",
      caseType: "Personal Injury - Auto",
      incidentDate: "2026-03-12"
    }
  },
  {
    id: "LOG-2026-9830",
    timestamp: "2026-09-24T13:10:05Z",
    firmId: "firm-3",
    firmName: "Miller & Partners",
    user: {
      id: "usr-302",
      name: "Daniel Miller",
      email: "daniel@millerpartners.com",
      role: "Paralegal",
      avatarInitials: "DM"
    },
    action: "MEDICAL_BILL_ADDED",
    category: "Case Operations",
    severity: "info",
    details: "Added emergency room facility lien from Cedars-Sinai Medical Center ($32,450.00).",
    ipAddress: "73.189.20.15",
    location: "Miami, FL, USA",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/130.0",
    phiAccessed: true,
    metadata: {
      caseId: "case-FL-902",
      provider: "Cedars-Sinai Medical Center",
      billAmount: 32450.00,
      lienNegotiated: false
    }
  }
];

export default function SuperadminAuditLogPage() {
  const [logs] = useState<AuditLogItem[]>(INITIAL_LOGS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFirm, setSelectedFirm] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState("all");
  const [phiOnly, setPhiOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isCopiedId, setIsCopiedId] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Available unique firms for dropdown
  const firmOptions = useMemo(() => {
    const map = new Map<string, string>();
    INITIAL_LOGS.forEach((l) => map.set(l.firmId, l.firmName));
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, []);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Search filter
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesUser = log.user.name.toLowerCase().includes(q) || log.user.email.toLowerCase().includes(q);
        const matchesFirm = log.firmName.toLowerCase().includes(q);
        const matchesAction = log.action.toLowerCase().includes(q);
        const matchesDetails = log.details.toLowerCase().includes(q);
        const matchesIp = log.ipAddress.toLowerCase().includes(q);
        const matchesId = log.id.toLowerCase().includes(q);
        if (!matchesUser && !matchesFirm && !matchesAction && !matchesDetails && !matchesIp && !matchesId) {
          return false;
        }
      }

      // Firm filter
      if (selectedFirm !== "all" && log.firmId !== selectedFirm) {
        return false;
      }

      // Category filter
      if (selectedCategory !== "all" && log.category !== selectedCategory) {
        return false;
      }

      // Severity filter
      if (selectedSeverity !== "all" && log.severity !== selectedSeverity) {
        return false;
      }

      // PHI Only filter
      if (phiOnly && !log.phiAccessed) {
        return false;
      }

      // Date range filter
      if (selectedDateRange !== "all") {
        const logDate = new Date(log.timestamp).getTime();
        const now = new Date("2026-09-25T10:15:00Z").getTime();
        if (selectedDateRange === "24h" && now - logDate > 24 * 60 * 60 * 1000) return false;
        if (selectedDateRange === "7d" && now - logDate > 7 * 24 * 60 * 60 * 1000) return false;
        if (selectedDateRange === "30d" && now - logDate > 30 * 24 * 60 * 60 * 1000) return false;
      }

      return true;
    });
  }, [logs, searchTerm, selectedFirm, selectedCategory, selectedSeverity, phiOnly, selectedDateRange]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(start, start + itemsPerPage);
  }, [filteredLogs, currentPage, itemsPerPage]);

  const activeFilterCount =
    (selectedFirm !== "all" ? 1 : 0) +
    (selectedCategory !== "all" ? 1 : 0) +
    (selectedSeverity !== "all" ? 1 : 0) +
    (selectedDateRange !== "all" ? 1 : 0) +
    (phiOnly ? 1 : 0) +
    (searchTerm.trim() ? 1 : 0);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedFirm("all");
    setSelectedCategory("all");
    setSelectedSeverity("all");
    setSelectedDateRange("all");
    setPhiOnly(false);
    setCurrentPage(1);
  };

  const handleCopyId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(id);
    setIsCopiedId(id);
    setTimeout(() => setIsCopiedId(null), 2000);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleExportCSV = () => {
    setIsExporting(true);
    try {
      const headers = [
        "Event ID",
        "Timestamp",
        "Firm ID",
        "Firm Name",
        "User Name",
        "User Email",
        "User Role",
        "Action",
        "Category",
        "Severity",
        "PHI Accessed",
        "IP Address",
        "Location",
        "Details"
      ];
      const rows = filteredLogs.map((log) => [
        log.id,
        log.timestamp,
        log.firmId,
        `"${log.firmName.replace(/"/g, '""')}"`,
        `"${log.user.name.replace(/"/g, '""')}"`,
        log.user.email,
        log.user.role,
        log.action,
        log.category,
        log.severity,
        log.phiAccessed ? "YES" : "NO",
        log.ipAddress,
        `"${log.location.replace(/"/g, '""')}"`,
        `"${log.details.replace(/"/g, '""')}"`
      ]);

      const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `Superadmin_AuditLog_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setExportNotice(`Exported ${filteredLogs.length} audit records successfully.`);
      setTimeout(() => setExportNotice(null), 4000);
    } catch {
      setExportNotice("Failed to generate CSV export.");
      setTimeout(() => setExportNotice(null), 4000);
    } finally {
      setIsExporting(false);
    }
  };

  // Severity badge helper
  const getSeverityBadge = (severity: AuditLogItem["severity"]) => {
    switch (severity) {
      case "critical":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" /> Critical
          </span>
        );
      case "warning":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Warning
          </span>
        );
      case "success":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Success
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Info className="w-3.5 h-3.5 text-blue-600" /> Info
          </span>
        );
    }
  };

  // Category badge helper
  const getCategoryBadge = (category: AuditLogItem["category"]) => {
    switch (category) {
      case "HIPAA & PHI":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <ShieldCheck className="w-3 h-3 text-emerald-600" /> HIPAA / PHI
          </span>
        );
      case "Authentication":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
            <Key className="w-3 h-3 text-indigo-600" /> Auth
          </span>
        );
      case "Tenant Management":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
            <Building2 className="w-3 h-3 text-purple-600" /> Tenant
          </span>
        );
      case "Security & Access":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
            <Lock className="w-3 h-3 text-rose-600" /> Security
          </span>
        );
      case "Billing":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            <Layers className="w-3 h-3 text-amber-600" /> Billing
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            <FileText className="w-3 h-3 text-slate-500" /> Case Ops
          </span>
        );
    }
  };

  const formatTimestamp = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="p-6 space-y-6 w-full max-w-[1600px] mx-auto min-h-screen">
      {/* Toast Notification */}
      {exportNotice && (
        <div className="fixed top-6 right-6 z-[9999] flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-800 text-sm animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">Platform Audit Log</h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live HIPAA Logging
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1 max-w-3xl">
            Immutable multi-tenant audit trail tracking all cross-firm access, authentication events, and HIPAA/PHI compliance interactions across LexValue.
          </p>
        </div>

        {/* Global Header Actions */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-60"
            title="Refresh logs"
          >
            <RefreshCw className={`w-4 h-4 text-slate-500 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCSV}
            disabled={isExporting || filteredLogs.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-sm font-semibold transition-all shadow-sm disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Events (24h)</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">3,482</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 flex items-center gap-1.5">
            <span className="font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">+14.2%</span>
            <span>vs previous period</span>
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">HIPAA & PHI Accesses</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">724</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 flex items-center gap-1.5">
            <span className="font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">100% Verified</span>
            <span>Zero PHI leaks</span>
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Auth & Sessions</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">1,890</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Key className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 flex items-center gap-1.5">
            <span className="font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">99.8% 2FA</span>
            <span>Hardware & TOTP</span>
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Security Alerts</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">1</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 flex items-center gap-1.5">
            <span className="font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">1 Blocked IP</span>
            <span>Auto-quarantined</span>
          </p>
        </div>
      </div>

      {/* Main Filter & Search Control Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by user, email, firm, action (e.g. PHI_EXPORT), IP, or event ID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 text-sm text-slate-700 bg-slate-50/70 border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white focus:ring-1 focus:ring-teal-500 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Firm Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50/70 border border-slate-200 rounded-lg px-3 py-2">
              <Building2 className="w-4 h-4 text-slate-400" />
              <select
                value={selectedFirm}
                onChange={(e) => {
                  setSelectedFirm(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-xs font-medium text-slate-700 bg-transparent outline-none cursor-pointer"
              >
                <option value="all">All Tenant Firms</option>
                {firmOptions.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50/70 border border-slate-200 rounded-lg px-3 py-2">
              <Layers className="w-4 h-4 text-slate-400" />
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-xs font-medium text-slate-700 bg-transparent outline-none cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="HIPAA & PHI">HIPAA & PHI</option>
                <option value="Authentication">Authentication</option>
                <option value="Case Operations">Case Operations</option>
                <option value="Tenant Management">Tenant Management</option>
                <option value="Security & Access">Security & Access</option>
              </select>
            </div>

            {/* Severity Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50/70 border border-slate-200 rounded-lg px-3 py-2">
              <AlertCircle className="w-4 h-4 text-slate-400" />
              <select
                value={selectedSeverity}
                onChange={(e) => {
                  setSelectedSeverity(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-xs font-medium text-slate-700 bg-transparent outline-none cursor-pointer"
              >
                <option value="all">All Severities</option>
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            {/* Time Period */}
            <div className="flex items-center gap-1.5 bg-slate-50/70 border border-slate-200 rounded-lg px-3 py-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <select
                value={selectedDateRange}
                onChange={(e) => {
                  setSelectedDateRange(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-xs font-medium text-slate-700 bg-transparent outline-none cursor-pointer"
              >
                <option value="all">All Time</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>

            {/* PHI Toggle */}
            <button
              onClick={() => {
                setPhiOnly(!phiOnly);
                setCurrentPage(1);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                phiOnly
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                  : "bg-slate-50/70 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>PHI Only</span>
            </button>
          </div>
        </div>

        {/* Filter Summary & Reset Bar */}
        {activeFilterCount > 0 && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>
              Showing <strong className="text-slate-900 font-semibold">{filteredLogs.length}</strong> matching events ({activeFilterCount} active filters)
            </span>
            <button
              onClick={handleResetFilters}
              className="text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1 hover:underline"
            >
              <X className="w-3.5 h-3.5" /> Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Main Audit Log Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80">
                <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tenant Firm</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">User / Actor</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Action & Category</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Details</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                        <Search className="w-6 h-6" />
                      </div>
                      <h4 className="text-base font-semibold text-slate-900">No audit logs found</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Try adjusting your search criteria, tenant firm selection, or clearing active filters.
                      </p>
                      <button
                        onClick={handleResetFilters}
                        className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                  >
                    {/* Timestamp & ID */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatTimestamp(log.timestamp)}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-[10px] font-mono text-slate-400">{log.id}</span>
                          <button
                            onClick={(e) => handleCopyId(log.id, e)}
                            className="text-slate-400 hover:text-slate-600 transition-colors p-0.5"
                            title="Copy Log ID"
                          >
                            {isCopiedId === log.id ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Tenant Firm */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                          <span className="text-sm font-semibold text-slate-900">{log.firmName}</span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-400 mt-0.5">{log.firmId}</span>
                      </div>
                    </td>

                    {/* User / Actor */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 text-teal-300 flex items-center justify-center text-xs font-bold shrink-0">
                          {log.user.avatarInitials}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-slate-900 truncate">{log.user.name}</span>
                            <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 font-medium rounded">
                              {log.user.role}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 truncate">{log.user.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Action & Category */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {log.action}
                        </span>
                        <div className="flex items-center gap-1">
                          {getCategoryBadge(log.category)}
                          {log.phiAccessed && (
                            <span className="inline-flex items-center text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                              PHI
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Details */}
                    <td className="px-5 py-4 max-w-xs xl:max-w-md">
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{log.details}</p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 font-mono">
                        <span>IP: {log.ipAddress}</span>
                        <span>•</span>
                        <span>{log.location}</span>
                      </div>
                    </td>

                    {/* Status / Severity */}
                    <td className="px-5 py-4 whitespace-nowrap">{getSeverityBadge(log.severity)}</td>

                    {/* Actions */}
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLog(log);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-teal-700 hover:bg-teal-50 border border-slate-200 hover:border-teal-200 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>
              Showing{" "}
              <strong className="text-slate-900 font-semibold">
                {filteredLogs.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
              </strong>{" "}
              to{" "}
              <strong className="text-slate-900 font-semibold">
                {Math.min(currentPage * itemsPerPage, filteredLogs.length)}
              </strong>{" "}
              of <strong className="text-slate-900 font-semibold">{filteredLogs.length}</strong> events
            </span>

            <div className="flex items-center gap-1.5 pl-3 border-l border-slate-200">
              <span>Per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-200 rounded px-2 py-1 text-xs font-medium text-slate-700 outline-none cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                  currentPage === page
                    ? "bg-teal-700 text-white shadow-sm"
                    : "text-slate-600 hover:bg-white border border-transparent hover:border-slate-200"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Log Inspection Slideover / Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-[1000] flex justify-end bg-slate-900/40 backdrop-blur-sm transition-opacity">
          <div
            className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 overflow-hidden animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Slideover Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {selectedLog.id}
                  </span>
                  {getSeverityBadge(selectedLog.severity)}
                  {selectedLog.phiAccessed && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-600" /> PHI Touched
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedLog.action}</h3>
                <p className="text-xs text-slate-500">{formatTimestamp(selectedLog.timestamp)}</p>
              </div>

              <button
                onClick={() => setSelectedLog(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Slideover Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Event Description */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Action Narrative</h4>
                <p className="text-sm font-medium text-slate-800 leading-relaxed">{selectedLog.details}</p>
              </div>

              {/* Actor & Tenant Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* User / Actor */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" /> Actor Details
                  </h4>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{selectedLog.user.name}</p>
                    <p className="text-xs text-slate-500">{selectedLog.user.email}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        Role: {selectedLog.user.role}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">ID: {selectedLog.user.id}</span>
                    </div>
                  </div>
                </div>

                {/* Tenant Firm */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" /> Tenant Firm
                  </h4>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{selectedLog.firmName}</p>
                    <p className="text-xs font-mono text-slate-500">{selectedLog.firmId}</p>
                    <div className="mt-2">
                      <span className="text-[11px] font-medium bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded">
                        Multi-tenant Isolated
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Network & Device Forensics */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" /> Network & Security Context
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block">IP Address</span>
                    <span className="font-mono font-semibold text-slate-800">{selectedLog.ipAddress}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Location</span>
                    <span className="font-semibold text-slate-800">{selectedLog.location}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block">User Agent</span>
                    <span className="font-mono text-[11px] text-slate-600 break-all">{selectedLog.userAgent}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Encryption Standard</span>
                    <span className="font-semibold text-emerald-600 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> TLS 1.3 / AES-256
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Firm Isolation Check</span>
                    <span className="font-semibold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> firmId Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Metadata Payload */}
              {selectedLog.metadata && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Event Metadata Payload
                    </h4>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(JSON.stringify(selectedLog.metadata, null, 2));
                        setExportNotice("Copied JSON payload to clipboard.");
                        setTimeout(() => setExportNotice(null), 3000);
                      }}
                      className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copy JSON
                    </button>
                  </div>
                  <pre className="bg-slate-900 text-slate-200 p-4 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Slideover Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">Status: Immutable WORM storage</span>
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

