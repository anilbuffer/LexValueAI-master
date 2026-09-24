"use client";

import { useState } from "react";
import { User, Building2, Save, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreateFirmPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    personalPhone: "",
    password: "",
    confirmPassword: "",
    firmName: "",
    taxId: "",
    supportEmail: "",
    firmPhone: "",
    firmAddress: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission for now
    router.push("/superadmin/firms");
  };

  return (
    <div className="p-6 w-full">
      <div className="mb-8">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-4 w-fit"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Firms
        </button>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create New Firm</h1>
        <p className="text-slate-500 mt-2">Create a new isolated firm and an admin account for testing purposes.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Profile Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none opacity-60"></div>
          
          <div className="flex items-center gap-4 mb-8 relative">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center shrink-0 border border-slate-200">
              <User className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Personal Profile</h2>
              <p className="text-sm text-slate-500">Manage your new personal account details.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#14233a]">First Name <span className="text-red-500">*</span></label>
              <input 
                type="text"
                name="firstName"
                placeholder="e.g. John"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-sm"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#14233a]">Last Name <span className="text-red-500">*</span></label>
              <input 
                type="text"
                name="lastName"
                placeholder="e.g. Doe"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-sm"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#14233a]">Email Address <span className="text-red-500">*</span></label>
              <input 
                type="email"
                name="email"
                placeholder="e.g. johndoe@gmail.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-sm"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#14233a]">Phone Number <span className="text-red-500">*</span></label>
              <input 
                type="tel"
                name="personalPhone"
                placeholder="+1-555-0199"
                value={formData.personalPhone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-sm"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#14233a]">Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-sm pr-10"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#14233a]">Confirm Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-sm pr-10"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-1">Required to login as this admin.</p>
            </div>
          </div>
        </div>

        {/* Firm Information Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none opacity-60"></div>
          
          <div className="flex items-center gap-4 mb-8 relative">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center shrink-0 border border-slate-200">
              <Building2 className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Firm Information</h2>
              <p className="text-sm text-slate-500">Basic identity and contact details.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#14233a]">Firm Name <span className="text-red-500">*</span></label>
              <input 
                type="text"
                name="firmName"
                placeholder="e.g. LexValue Partners LLC"
                value={formData.firmName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-sm"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#14233a]">Tax ID / EIN</label>
              <input 
                type="text"
                name="taxId"
                placeholder="XX-XXXXXXX"
                value={formData.taxId}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#14233a]">Support Email <span className="text-red-500">*</span></label>
              <input 
                type="email"
                name="supportEmail"
                placeholder="e.g. admin@lexvaluepartners.com"
                value={formData.supportEmail}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-sm"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#14233a]">Phone Number <span className="text-red-500">*</span></label>
              <input 
                type="tel"
                name="firmPhone"
                placeholder="+1 (555) 123-4567"
                value={formData.firmPhone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-sm"
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-[#14233a]">Firm Address</label>
              <textarea 
                name="firmAddress"
                placeholder="123 Legal Way, Suite 500, New York, NY 10001"
                rows={3}
                value={formData.firmAddress}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-sm resize-y"
              ></textarea>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit"
            className="flex items-center gap-2 bg-[#124b4b] hover:bg-[#0d3636] text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
          >
            <Save className="w-5 h-5" />
            Create Firm & Admin
          </button>
        </div>
      </form>
    </div>
  );
}
