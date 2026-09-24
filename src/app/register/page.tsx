"use client";

import { useState } from "react";
import { User, Building2, Save, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/app/actions/auth";

export default function RegisterFirmPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call and login
    const formDataObj = new FormData();
    formDataObj.append('email', formData.email || 'admin@lexvalue.com');
    await loginUser(null, formDataObj);
    
    // Redirect to main dashboard after successful registration
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create New Firm</h1>
          <p className="text-slate-500 mt-2">Register your firm and create your admin account.</p>
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
                <label className="text-sm font-semibold text-slate-900">First Name <span className="text-red-500">*</span></label>
                <input 
                  type="text"
                  name="firstName"
                  placeholder="e.g. John"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-900 placeholder:text-slate-400 bg-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">Last Name <span className="text-red-500">*</span></label>
                <input 
                  type="text"
                  name="lastName"
                  placeholder="e.g. Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-900 placeholder:text-slate-400 bg-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">Email Address <span className="text-red-500">*</span></label>
                <input 
                  type="email"
                  name="email"
                  placeholder="e.g. johndoe@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-900 placeholder:text-slate-400 bg-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">Phone Number <span className="text-red-500">*</span></label>
                <input 
                  type="tel"
                  name="personalPhone"
                  placeholder="+1-555-0199"
                  value={formData.personalPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-900 placeholder:text-slate-400 bg-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-900 placeholder:text-slate-400 bg-white pr-10"
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
                <label className="text-sm font-semibold text-slate-900">Confirm Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-900 placeholder:text-slate-400 bg-white pr-10"
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
                <label className="text-sm font-semibold text-slate-900">Firm Name <span className="text-red-500">*</span></label>
                <input 
                  type="text"
                  name="firmName"
                  placeholder="e.g. LexValue Partners LLC"
                  value={formData.firmName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-900 placeholder:text-slate-400 bg-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">Tax ID / EIN</label>
                <input 
                  type="text"
                  name="taxId"
                  placeholder="XX-XXXXXXX"
                  value={formData.taxId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-900 placeholder:text-slate-400 bg-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">Support Email <span className="text-red-500">*</span></label>
                <input 
                  type="email"
                  name="supportEmail"
                  placeholder="e.g. admin@lexvaluepartners.com"
                  value={formData.supportEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-900 placeholder:text-slate-400 bg-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">Phone Number <span className="text-red-500">*</span></label>
                <input 
                  type="tel"
                  name="firmPhone"
                  placeholder="+1 (555) 123-4567"
                  value={formData.firmPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-900 placeholder:text-slate-400 bg-white"
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-slate-900">Firm Address</label>
                <textarea 
                  name="firmAddress"
                  placeholder="123 Legal Way, Suite 500, New York, NY 10001"
                  rows={3}
                  value={formData.firmAddress}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-900 placeholder:text-slate-400 bg-white resize-y"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 w-full sm:w-auto bg-teal-800 hover:bg-teal-900 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-70"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              Register & Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
