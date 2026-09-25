"use client";

import { useState } from "react";
import { Save, User, Globe, ShieldCheck, Clock, Lock, CheckCircle2, Database, AlertTriangle } from "lucide-react";

export default function SuperadminSettingsPage() {
  const [formData, setFormData] = useState({
    // Superadmin Profile
    adminFirstName: "Pawan",
    adminLastName: "Kumar",
    adminEmail: "admin@lexvalue.ai",
    adminPhone: "+1 (555) 912-3840",
    roleTitle: "Master Superadmin",

    // Platform Identity
    platformName: "LexValue.ai",
    companyEntity: "LexValue AI Technologies Inc.",
    supportEmail: "support@lexvalue.ai",
    complianceEmail: "compliance@lexvalue.ai",
    headquarters: "One World Trade Center, Suite 8500, New York, NY 10007",
    primaryCurrency: "USD ($)",

    // Global Tenant & Platform Security
    sessionTimeout: "30",
    enforceMfaAllTenants: true,
    strictHipaaLogging: true,
    autoBackupDaily: true,
    requireTenantApproval: false,
    maintenanceMode: false
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    }, 600);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 min-h-screen bg-slate-50/30 w-full max-w-5xl mx-auto">
      {/* Toast Notification */}
      {showSuccessToast && (
        <div className="fixed top-6 right-6 z-[9999] flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-800 text-sm animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Platform settings saved successfully.</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Superadmin Settings</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Manage global platform identity, master credentials, security rules, and tenant compliance policies.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="h-11 flex justify-center items-center px-5 border border-transparent rounded-lg text-sm font-medium text-white bg-[#0f3d3e] hover:bg-[#0b2e2f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-900 transition-all cursor-pointer group disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
        >
          {isSaving ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </span>
          )}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Superadmin Profile */}
        <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-6 relative overflow-hidden">
          <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4">
            <div className="p-3 bg-slate-50 text-slate-700 rounded-xl border border-slate-100">
              <User className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 leading-tight tracking-tight">Superadmin Profile</h2>
              <p className="text-sm text-slate-500 mt-1">Master account identity and emergency contact credentials.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-900 block">
                First Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="adminFirstName"
                value={formData.adminFirstName}
                onChange={handleChange}
                className="block w-full py-2.5 px-4 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-white transition-all text-sm"
                placeholder="e.g. Super"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-900 block">
                Last Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="adminLastName"
                value={formData.adminLastName}
                onChange={handleChange}
                className="block w-full py-2.5 px-4 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-white transition-all text-sm"
                placeholder="e.g. Admin"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-900 block">Master Admin Email</label>
              <input
                type="email"
                value={formData.adminEmail}
                readOnly
                disabled
                className="block w-full py-2.5 px-4 border border-slate-200 rounded-lg text-slate-500 bg-slate-50/70 cursor-not-allowed focus:outline-none transition-all text-sm"
              />
              <p className="text-xs text-slate-400 mt-1">Master superadmin email cannot be altered directly.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-900 block">
                Emergency Admin Phone <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                name="adminPhone"
                value={formData.adminPhone}
                onChange={handleChange}
                className="block w-full py-2.5 px-4 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-white transition-all text-sm"
                placeholder="+1 (555) 912-3840"
                required
              />
            </div>
          </div>
        </div>

        {/* 2. Platform Identity & Operations */}
        <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-6 relative overflow-hidden">
          <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4">
            <div className="p-3 bg-slate-50 text-slate-700 rounded-xl border border-slate-100">
              <Globe className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 leading-tight tracking-tight">Platform Identity</h2>
              <p className="text-sm text-slate-500 mt-1">Global branding, legal entity, and operational contact endpoints.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-900 block">
                Platform Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="platformName"
                value={formData.platformName}
                onChange={handleChange}
                className="block w-full py-2.5 px-4 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-white transition-all text-sm"
                placeholder="LexValue.ai"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-900 block">Legal Operating Entity</label>
              <input
                type="text"
                name="companyEntity"
                value={formData.companyEntity}
                onChange={handleChange}
                className="block w-full py-2.5 px-4 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-white transition-all text-sm"
                placeholder="LexValue AI Technologies Inc."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-900 block">
                Platform Support Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                name="supportEmail"
                value={formData.supportEmail}
                onChange={handleChange}
                className="block w-full py-2.5 px-4 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-white transition-all text-sm"
                placeholder="support@lexvalue.ai"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-900 block">
                HIPAA & Compliance Contact Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                name="complianceEmail"
                value={formData.complianceEmail}
                onChange={handleChange}
                className="block w-full py-2.5 px-4 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-white transition-all text-sm"
                placeholder="compliance@lexvalue.ai"
                required
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-semibold text-slate-900 block">Corporate Headquarters</label>
              <textarea
                rows={2}
                name="headquarters"
                value={formData.headquarters}
                onChange={handleChange}
                className="block w-full py-2.5 px-4 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-white transition-all text-sm resize-none"
                placeholder="One World Trade Center, Suite 8500, New York, NY 10007"
              />
            </div>
          </div>
        </div>

        {/* 3. Global Security & Multi-Tenant Compliance */}
        <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-6 relative overflow-hidden">
          <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4">
            <div className="p-3 bg-slate-50 text-slate-700 rounded-xl border border-slate-100">
              <ShieldCheck className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 leading-tight tracking-tight">Global Security & Tenant Compliance</h2>
              <p className="text-sm text-slate-500 mt-1">Platform-wide HIPAA Security Rule policies and tenant isolation controls.</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Global Idle Session Timeout */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50/60 rounded-xl border border-slate-200/70 gap-4">
              <div className="flex gap-3">
                <Clock className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Platform Idle Session Timeout</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Universal logout duration across all tenant accounts for HIPAA Security Rule CFR § 164.312.
                  </p>
                </div>
              </div>
              <select
                name="sessionTimeout"
                value={formData.sessionTimeout}
                onChange={handleChange}
                className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-teal-500 shadow-sm cursor-pointer"
              >
                <option value="15">15 Minutes (Strict HIPAA)</option>
                <option value="30">30 Minutes (Recommended)</option>
                <option value="60">60 Minutes</option>
              </select>
            </div>

            {/* Mandatory 2FA for all firms */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50/60 rounded-xl border border-slate-200/70 gap-4">
              <div className="flex gap-3">
                <Lock className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Enforce Mandatory 2FA for All Tenant Admins</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Require two-factor authentication (TOTP hardware/app) across all registered tenant law firms.
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enforceMfaAllTenants}
                  onChange={(e) => setFormData((prev) => ({ ...prev, enforceMfaAllTenants: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-700"></div>
              </label>
            </div>

            {/* Immutable HIPAA Audit Logging */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50/60 rounded-xl border border-slate-200/70 gap-4">
              <div className="flex gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Immutable 7-Year HIPAA Audit Log Retention</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Enforce WORM (Write Once, Read Many) tamper-evident storage for all medical chronology views.
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full">
                Active & Enforced
              </span>
            </div>

            {/* Automated Daily Snapshots */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50/60 rounded-xl border border-slate-200/70 gap-4">
              <div className="flex gap-3">
                <Database className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Automated Daily Database Snapshots</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Encrypted daily RDS PostgreSQL snapshots with multi-region disaster recovery replication.
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.autoBackupDaily}
                  onChange={(e) => setFormData((prev) => ({ ...prev, autoBackupDaily: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-700"></div>
              </label>
            </div>

            {/* Maintenance Mode */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-amber-50/50 rounded-xl border border-amber-200/70 gap-4">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Platform Maintenance Mode</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Temporarily restrict tenant user logins for critical database upgrades or infrastructure patches.
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.maintenanceMode}
                  onChange={(e) => setFormData((prev) => ({ ...prev, maintenanceMode: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
