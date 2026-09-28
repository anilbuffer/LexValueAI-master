"use client";

import { useState } from "react";
import { Save, User, Globe, ShieldCheck, Clock, Lock, CheckCircle2, Database, AlertTriangle, KeyRound, Eye, EyeOff, ShieldAlert } from "lucide-react";

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

  // Password Change State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswordChars, setShowPasswordChars] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast("Platform settings saved successfully.");
    }, 600);
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (!passwordData.currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    setIsChangingPassword(true);
    setTimeout(() => {
      setIsChangingPassword(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      showToast("Password updated successfully.");
    }, 700);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 bg-slate-50/50 min-h-screen w-full font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[9999] flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-800 text-sm animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Superadmin Settings</h1>
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
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 relative overflow-hidden">
          <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight tracking-tight">Superadmin Profile</h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">Master account identity and emergency contact credentials.</p>
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

        {/* 2. Change Password Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 relative overflow-hidden">
          <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center shrink-0">
              <KeyRound className="w-5 h-5 text-teal-700" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 leading-tight tracking-tight">Change Password</h2>
              <p className="text-sm text-slate-500 mt-1">Update your superadmin account security password.</p>
            </div>
          </div>

          <div className="space-y-4 max-w-xl">
            {passwordError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs text-rose-700 font-medium">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-900 block">
                Current Password <span className="text-rose-500">*</span>
              </label>
              <input
                type={showPasswordChars ? "text" : "password"}
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChangeInput}
                className="block w-full py-2.5 px-4 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-white transition-all text-sm"
                placeholder="Enter current password"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-900 block">
                New Password <span className="text-rose-500">*</span>
              </label>
              <input
                type={showPasswordChars ? "text" : "password"}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChangeInput}
                className="block w-full py-2.5 px-4 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-white transition-all text-sm"
                placeholder="Minimum 8 characters"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-900 block">
                Confirm New Password <span className="text-rose-500">*</span>
              </label>
              <input
                type={showPasswordChars ? "text" : "password"}
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChangeInput}
                className="block w-full py-2.5 px-4 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-white transition-all text-sm"
                placeholder="Re-enter new password"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={showPasswordChars}
                  onChange={(e) => setShowPasswordChars(e.target.checked)}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                Show password characters
              </label>

              <button
                type="button"
                onClick={handleChangePasswordSubmit}
                disabled={isChangingPassword}
                className="px-4 py-2 bg-[#124b4b] hover:bg-[#0d3636] text-white font-bold text-xs rounded-lg transition-all shadow-sm flex items-center gap-2"
              >
                {isChangingPassword ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" /> Update Password
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 3. Platform Identity & Operations */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 relative overflow-hidden">
          <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight tracking-tight">Platform Identity</h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">Global branding, legal entity, and operational contact endpoints.</p>
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
      </form>
    </div>
  );
}

