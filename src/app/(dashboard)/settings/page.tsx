"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  Database,
  Save,
  Lock,
  Clock,
  Briefcase,
  User,
  ShieldCheck,
  Eye,
  EyeOff
} from "lucide-react";
import toast from "react-hot-toast";
import { getFirmSettings, updateFirmSettings, getUserProfile, updateUserProfile, changePassword } from "@/app/actions/settings";

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    taxId: "",
    email: "",
    phone: "",
    address: "",
    require2fa: false,
    sessionTimeout: 30,
    dataRetention: "7",
    userFirstName: "",
    userLastName: "",
    userEmail: "",
    userPhone: "",
  });

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [formErrors, setFormErrors] = useState<Record<string, string | null>>({});
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string | null>>({});

  useEffect(() => {
    // Fetch real data from the database
    Promise.all([
      getFirmSettings(),
      getUserProfile()
    ]).then(([firmData, userData]) => {
      setFormData({
        name: firmData.name || "",
        taxId: firmData.taxId || "",
        email: firmData.email || "",
        phone: firmData.phone || "",
        address: firmData.address || "",
        require2fa: firmData.require2fa,
        sessionTimeout: firmData.sessionTimeout,
        dataRetention: firmData.dataRetention,
        userFirstName: userData.firstName || "",
        userLastName: userData.lastName || "",
        userEmail: userData.email || "",
        userPhone: userData.phone || "",
      });
      setUserRole((userData as any).role || "");
      setIsLoading(false);
    }).catch((err) => {
      console.error(err);
      toast.error("Failed to load settings");
      setIsLoading(false);
    });
  }, []);

  const formatPhoneInput = (value: string) => {
    let cleaned = value.replace(/\D/g, '');
    if (cleaned.startsWith('1')) {
      cleaned = cleaned.substring(1, 11);
    } else {
      cleaned = cleaned.substring(0, 10);
    }
    if (cleaned.length === 0) return '';
    let formatted = '+1';
    if (cleaned.length > 0) formatted += ' (' + cleaned.substring(0, 3);
    if (cleaned.length >= 4) formatted += ') ' + cleaned.substring(3, 6);
    if (cleaned.length >= 7) formatted += '-' + cleaned.substring(6, 10);
    return formatted;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;

    let finalValue: string | boolean = type === 'checkbox' ? checked : value;
    if (name === 'phone' || name === 'userPhone') {
      finalValue = formatPhoneInput(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string | null> = {};
    
    if (!formData.userFirstName.trim()) newErrors.userFirstName = "First name is required";
    if (!formData.userLastName.trim()) newErrors.userLastName = "Last name is required";
    
    const userPhoneClean = formData.userPhone.replace(/[^\d]/g, '');
    if (!formData.userPhone.trim()) {
      newErrors.userPhone = "Phone number is required";
    } else if (userPhoneClean.length < 7) {
      newErrors.userPhone = "Enter a valid phone number (min 7 digits)";
    }
    
    if (userRole === 'ADMIN') {
      if (!formData.name.trim()) newErrors.name = "Firm name is required";
      if (!formData.email.trim()) newErrors.email = "Support email is required";
      
      const firmPhoneClean = formData.phone.replace(/[^\d]/g, '');
      if (!formData.phone.trim()) {
        newErrors.phone = "Firm phone number is required";
      } else if (firmPhoneClean.length < 7) {
        newErrors.phone = "Enter a valid phone number (min 7 digits)";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }
    setFormErrors({});

    setIsSaving(true);

    try {
      const promises: Promise<any>[] = [
        updateUserProfile({
          firstName: formData.userFirstName,
          lastName: formData.userLastName,
          phone: formData.userPhone
        })
      ];

      if (userRole === 'ADMIN') {
        promises.push(
          updateFirmSettings({
            name: formData.name,
            taxId: formData.taxId,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            require2fa: formData.require2fa,
            sessionTimeout: parseInt(formData.sessionTimeout.toString()),
            dataRetention: formData.dataRetention
          })
        );
      }

      await Promise.all(promises);
      toast.success("Settings saved successfully.");
    } catch (err: any) {
      toast.error(err.message || "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string | null> = {};
    if (!passwordData.currentPassword) newErrors.currentPassword = "Required";
    if (!passwordData.newPassword) newErrors.newPassword = "Required";
    if (!passwordData.confirmPassword) newErrors.confirmPassword = "Required";

    if (passwordData.newPassword && passwordData.newPassword.length < 8) {
      newErrors.newPassword = "Must be at least 8 characters";
    } else if (passwordData.newPassword && passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setPasswordErrors(newErrors);
      return;
    }
    
    setPasswordErrors({});
    setIsChangingPassword(true);
    try {
      const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Password changed successfully.");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      toast.error("Failed to change password.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-teal-600/30 border-t-teal-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 animate-fade-in-up">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
              {userRole === 'ADMIN' ? 'Admin Settings' : 'Personal Settings'}
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              {userRole === 'ADMIN' 
                ? 'Manage firm details, security, and compliance preferences.' 
                : 'Manage your personal account details and preferences.'}
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="h-12 flex justify-center items-center px-5 border border-transparent rounded-lg text-sm font-medium text-white bg-teal-900 hover:bg-teal-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-900 transition-all cursor-pointer group disabled:opacity-70 disabled:cursor-not-allowed"
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

          {/* 0. Personal Profile */}
          <div className="bg-white rounded-2xl border border-slate-200/50 shadow-md shadow-slate-200/50 p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl group-hover:bg-teal-500/10 transition-colors duration-700 pointer-events-none"></div>

            <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4 relative z-10">
              <div className="p-3 bg-slate-50 text-slate-700 rounded-xl">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800 leading-tight tracking-tight">Personal Profile</h2>
                <p className="text-sm text-slate-500 mt-1">Manage your personal account details.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-900 block">First Name <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  name="userFirstName"
                  value={formData.userFirstName}
                  onChange={handleChange}
                  className={`block w-full h-auto py-3 px-4 border ${formErrors.userFirstName ? 'border-rose-300 focus:ring-rose-600 bg-rose-50' : 'border-slate-200 focus:ring-teal-600 focus:border-transparent bg-white'} rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all`}
                  placeholder="e.g. John"
                />
                {formErrors.userFirstName && <span className="text-xs text-rose-500 font-semibold">{formErrors.userFirstName}</span>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-900 block">Last Name <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  name="userLastName"
                  value={formData.userLastName}
                  onChange={handleChange}
                  className={`block w-full h-auto py-3 px-4 border ${formErrors.userLastName ? 'border-rose-300 focus:ring-rose-600 bg-rose-50' : 'border-slate-200 focus:ring-teal-600 focus:border-transparent bg-white'} rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all`}
                  placeholder="e.g. Doe"
                />
                {formErrors.userLastName && <span className="text-xs text-rose-500 font-semibold">{formErrors.userLastName}</span>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-900 block">Email Address</label>
                <input
                  type="email"
                  value={formData.userEmail}
                  readOnly
                  disabled
                  className="block w-full h-auto py-3 px-4 border border-slate-200 rounded-lg text-slate-500 bg-slate-50 cursor-not-allowed focus:outline-none transition-all"
                />
                <p className="text-xs text-slate-400 mt-1">Email address cannot be changed.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-900 block">Phone Number <span className="text-rose-500">*</span></label>
                <input
                  type="tel"
                  name="userPhone"
                  value={formData.userPhone}
                  onChange={handleChange}
                  className={`block w-full h-auto py-3 px-4 border ${formErrors.userPhone ? 'border-rose-300 focus:ring-rose-600 bg-rose-50' : 'border-slate-200 focus:ring-teal-600 focus:border-transparent bg-white'} rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all`}
                  placeholder="e.g. +1 (555) 123-4567"
                />
                {formErrors.userPhone && <span className="text-xs text-rose-500 font-semibold">{formErrors.userPhone}</span>}
              </div>
            </div>
          </div>


          {/* 2. Firm Information */}
          <div className="bg-white rounded-2xl border border-slate-200/50 shadow-md shadow-slate-200/50 p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl group-hover:bg-teal-500/10 transition-colors duration-700 pointer-events-none"></div>

            <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4 relative z-10">
              <div className="p-3 bg-slate-50 text-slate-700 rounded-xl">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800 leading-tight tracking-tight">Firm Information</h2>
                <p className="text-sm text-slate-500 mt-1">Basic identity and contact details.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-900 block">Firm Name <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  readOnly={userRole !== 'ADMIN'}
                  disabled={userRole !== 'ADMIN'}
                  className={`block w-full h-12 px-4 border rounded-lg focus:outline-none transition-all ${userRole !== 'ADMIN' ? 'bg-slate-50 text-slate-500 cursor-not-allowed border-slate-200' : formErrors.name ? 'border-rose-300 focus:ring-rose-600 bg-rose-50 text-slate-900' : 'border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-teal-600 focus:border-transparent'}`}
                />
                {formErrors.name && <span className="text-xs text-rose-500 font-semibold">{formErrors.name}</span>}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-900 block">Tax ID / EIN</label>
                <input
                  type="text"
                  name="taxId"
                  value={formData.taxId}
                  onChange={handleChange}
                  readOnly={userRole !== 'ADMIN'}
                  disabled={userRole !== 'ADMIN'}
                  className={`block w-full h-12 px-4 border border-slate-200 rounded-lg focus:outline-none transition-all ${userRole !== 'ADMIN' ? 'bg-slate-50 text-slate-500 cursor-not-allowed' : 'bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-teal-600 focus:border-transparent'}`}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-900 block">Support Email <span className="text-rose-500">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  readOnly={userRole !== 'ADMIN'}
                  disabled={userRole !== 'ADMIN'}
                  className={`block w-full h-12 px-4 border rounded-lg focus:outline-none transition-all ${userRole !== 'ADMIN' ? 'bg-slate-50 text-slate-500 cursor-not-allowed border-slate-200' : formErrors.email ? 'border-rose-300 focus:ring-rose-600 bg-rose-50 text-slate-900' : 'border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-teal-600 focus:border-transparent'}`}
                />
                {formErrors.email && <span className="text-xs text-rose-500 font-semibold">{formErrors.email}</span>}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-900 block">Phone Number <span className="text-rose-500">*</span></label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  readOnly={userRole !== 'ADMIN'}
                  disabled={userRole !== 'ADMIN'}
                  className={`block w-full h-12 px-4 border rounded-lg focus:outline-none transition-all ${userRole !== 'ADMIN' ? 'bg-slate-50 text-slate-500 cursor-not-allowed border-slate-200' : formErrors.phone ? 'border-rose-300 focus:ring-rose-600 bg-rose-50 text-slate-900' : 'border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-teal-600 focus:border-transparent'}`}
                />
                {formErrors.phone && <span className="text-xs text-rose-500 font-semibold">{formErrors.phone}</span>}
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-slate-900 block">Firm Address</label>
                <textarea
                  rows={3}
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  readOnly={userRole !== 'ADMIN'}
                  disabled={userRole !== 'ADMIN'}
                  className={`block w-full h-auto py-3 px-4 border border-slate-200 rounded-lg focus:outline-none transition-all resize-none ${userRole !== 'ADMIN' ? 'bg-slate-50 text-slate-500 cursor-not-allowed' : 'bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-teal-600 focus:border-transparent'}`}
                />
              </div>
            </div>
          </div>

          {/* 3. Security & Access */}
          {userRole === 'ADMIN' && (
          <div className="bg-white rounded-2xl border border-slate-200/50 shadow-md shadow-slate-200/50 p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-slate-500/5 rounded-full blur-3xl group-hover:bg-slate-500/10 transition-colors duration-700 pointer-events-none"></div>

            <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4 relative z-10">
              <div className="p-3 bg-slate-50 text-slate-700 rounded-xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800 leading-tight tracking-tight">Security & Access</h2>
                <p className="text-sm text-slate-500 mt-1">HIPAA compliance and authentication policies.</p>
              </div>
            </div>

            <div className="space-y-6 relative z-10">
              {/* Session Timeout */}
              <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl border border-slate-200">
                <div className="flex gap-3">
                  <div className="mt-0.5 text-slate-400"><Clock className="w-5 h-5" /></div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">Idle Session Timeout</h3>
                    <p className="text-sm text-slate-500 mt-0.5">Automatically log out users after inactivity.</p>
                  </div>
                </div>
                <select
                  name="sessionTimeout"
                  value={formData.sessionTimeout}
                  onChange={handleChange}
                  className="py-3 px-4 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all cursor-pointer"
                >
                  <option value="15">15 Minutes</option>
                  <option value="30">30 Minutes (Recommended)</option>
                  <option value="60">1 Hour</option>
                  <option value="240">4 Hours</option>
                </select>
              </div>
            </div>
          </div>
          )}

          {/* 4. Data Retention & AI */}
          {userRole === 'ADMIN' && (
          <div className="bg-white rounded-2xl border border-slate-200/50 shadow-md shadow-slate-200/50 p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl group-hover:bg-teal-500/10 transition-colors duration-700 pointer-events-none"></div>

            <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4 relative z-10">
              <div className="p-3 bg-slate-50 text-slate-700 rounded-xl">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800 leading-tight tracking-tight">Data Retention & AI Preferences</h2>
                <p className="text-sm text-slate-500 mt-1">Manage how case data is stored and processed.</p>
              </div>
            </div>

            <div className="space-y-6 relative z-10">
              {/* Data Retention */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50/50 rounded-xl border border-slate-200 gap-4">
                <div className="flex gap-3">
                  <div className="mt-0.5 text-slate-400"><Briefcase className="w-5 h-5" /></div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">Case Data Retention</h3>
                    <p className="text-sm text-slate-500 mt-0.5">How long to keep data after a case is closed.</p>
                  </div>
                </div>
                <select
                  name="dataRetention"
                  value={formData.dataRetention}
                  onChange={handleChange}
                  className="py-3 px-4 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all cursor-pointer"
                >
                  <option value="3">3 Years</option>
                  <option value="5">5 Years</option>
                  <option value="7">7 Years (Standard)</option>
                  <option value="indefinite">Indefinitely</option>
                </select>
              </div>

            </div>
          </div>
          )}

        </form>

        {/* Password Form completely separated */}
        <form onSubmit={handlePasswordChange} className="bg-white rounded-2xl border border-slate-200/50 shadow-md shadow-slate-200/50 p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl group-hover:bg-rose-500/10 transition-colors duration-700 pointer-events-none"></div>

          <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4 relative z-10">
            <div className="p-3 bg-slate-50 text-slate-700 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 leading-tight tracking-tight">Security & Password</h2>
              <p className="text-sm text-slate-500 mt-1">Update your password to keep your account secure.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            <div className="space-y-1.5 relative">
              <label className="text-sm font-semibold text-slate-900 block">Current Password <span className="text-rose-500">*</span></label>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => { setPasswordData(prev => ({ ...prev, currentPassword: e.target.value })); if (passwordErrors.currentPassword) setPasswordErrors(prev => ({ ...prev, currentPassword: null })) }}
                  className={`block w-full h-auto py-3 px-4 pr-12 border ${passwordErrors.currentPassword ? 'border-rose-300 focus:ring-rose-600 bg-rose-50' : 'border-slate-200 focus:ring-teal-600 focus:border-transparent bg-white'} rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all`}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => togglePasswordVisibility('current')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordErrors.currentPassword && <span className="text-xs text-rose-500 font-semibold">{passwordErrors.currentPassword}</span>}
            </div>

            <div className="space-y-1.5 relative">
              <label className="text-sm font-semibold text-slate-900 block">New Password <span className="text-rose-500">*</span></label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => { setPasswordData(prev => ({ ...prev, newPassword: e.target.value })); if (passwordErrors.newPassword) setPasswordErrors(prev => ({ ...prev, newPassword: null })) }}
                  className={`block w-full h-auto py-3 px-4 pr-12 border ${passwordErrors.newPassword ? 'border-rose-300 focus:ring-rose-600 bg-rose-50' : 'border-slate-200 focus:ring-teal-600 focus:border-transparent bg-white'} rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all`}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => togglePasswordVisibility('new')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordErrors.newPassword && <span className="text-xs text-rose-500 font-semibold">{passwordErrors.newPassword}</span>}
            </div>

            <div className="space-y-1.5 relative">
              <label className="text-sm font-semibold text-slate-900 block">Confirm New Password <span className="text-rose-500">*</span></label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => { setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value })); if (passwordErrors.confirmPassword) setPasswordErrors(prev => ({ ...prev, confirmPassword: null })) }}
                  className={`block w-full h-auto py-3 px-4 pr-12 border ${passwordErrors.confirmPassword ? 'border-rose-300 focus:ring-rose-600 bg-rose-50' : 'border-slate-200 focus:ring-teal-600 focus:border-transparent bg-white'} rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all`}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => togglePasswordVisibility('confirm')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordErrors.confirmPassword && <span className="text-xs text-rose-500 font-semibold">{passwordErrors.confirmPassword}</span>}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={isChangingPassword}
              className="h-12 flex justify-center items-center gap-2 px-5 border border-transparent rounded-lg text-sm font-medium text-white bg-teal-900 hover:bg-teal-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-900 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isChangingPassword ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Lock className="w-5 h-5" />
              )}
              Update Password
            </button>
          </div>
        </form>
      </div >
    </div >
  );
}
