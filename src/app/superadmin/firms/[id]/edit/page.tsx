"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { User, Building2, Save, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface MockFirm {
  id: string;
  name: string;
  adminName: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  supportEmail: string;
}

const defaultFirms: Record<string, MockFirm> = {
  "1": {
    id: "1",
    name: "Smith & Associates",
    adminName: "Harvey Specter",
    email: "admin@smithassociates.com",
    phone: "+1 (555) 123-4567",
    address: "123 Legal Way, Suite 500, New York, NY 10001",
    taxId: "XX-1234567",
    supportEmail: "admin@smithassociates.com",
  },
  "2": {
    id: "2",
    name: "Johnson Legal Group",
    adminName: "Robert Johnson",
    email: "admin@johnsonlegal.com",
    phone: "+1 (555) 234-5678",
    address: "456 Corporate Blvd, Chicago, IL 60601",
    taxId: "XX-2345678",
    supportEmail: "admin@johnsonlegal.com",
  },
  "3": {
    id: "3",
    name: "Miller & Partners",
    adminName: "Sarah Miller",
    email: "admin@millerpartners.com",
    phone: "+1 (555) 345-6789",
    address: "789 Justice Ave, Los Angeles, CA 90012",
    taxId: "XX-3456789",
    supportEmail: "admin@millerpartners.com",
  },
  "4": {
    id: "4",
    name: "Davis & Co. Law",
    adminName: "Michael Davis",
    email: "admin@daviscolaw.com",
    phone: "+1 (555) 456-7890",
    address: "101 Federal Plaza, Suite 800, San Francisco, CA 94102",
    taxId: "XX-4567890",
    supportEmail: "admin@daviscolaw.com",
  },
};

export default function EditFirmPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

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

  useEffect(() => {
    let firmData: MockFirm | null = null;

    try {
      const edits = JSON.parse(localStorage.getItem("lexvalu_firms_edits") || "{}");
      if (edits[id]) {
        firmData = edits[id];
      }
    } catch {
      // ignore
    }

    if (!firmData) {
      try {
        const customFirms = JSON.parse(localStorage.getItem("lexvalu_custom_firms") || "[]");
        const found = customFirms.find((f: any) => f.id === id);
        if (found) {
          firmData = {
            id: found.id,
            name: found.name,
            adminName: found.adminName,
            email: found.email,
            phone: found.phone || "+1 (555) 123-4567",
            address: found.address || "123 Legal Way, Suite 500, New York, NY 10001",
            taxId: found.taxId || "XX-1234567",
            supportEmail: found.supportEmail || found.email,
          };
        }
      } catch {
        // ignore
      }
    }

    if (!firmData && defaultFirms[id]) {
      firmData = defaultFirms[id];
    }

    if (!firmData) {
      firmData = {
        id,
        name: "Tenant Firm",
        adminName: "Firm Admin",
        email: "admin@firm.com",
        phone: "+1 (555) 123-4567",
        address: "123 Legal Way, Suite 500, New York, NY 10001",
        taxId: "XX-1234567",
        supportEmail: "admin@firm.com",
      };
    }

    const nameParts = (firmData.adminName || "").trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    setFormData({
      firstName,
      lastName,
      email: firmData.email || "",
      personalPhone: firmData.phone || "+1-555-0199",
      password: "••••••••",
      confirmPassword: "••••••••",
      firmName: firmData.name || "",
      taxId: firmData.taxId || "XX-1234567",
      supportEmail: firmData.supportEmail || firmData.email || "",
      firmPhone: firmData.phone || "+1 (555) 123-4567",
      firmAddress: firmData.address || "123 Legal Way, Suite 500, New York, NY 10001"
    });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const edits = JSON.parse(localStorage.getItem("lexvalu_firms_edits") || "{}");
      edits[id] = {
        id,
        name: formData.firmName,
        adminName: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.firmPhone,
        address: formData.firmAddress,
        taxId: formData.taxId,
        supportEmail: formData.supportEmail,
      };
      localStorage.setItem("lexvalu_firms_edits", JSON.stringify(edits));

      const customFirms = JSON.parse(localStorage.getItem("lexvalu_custom_firms") || "[]");
      const updatedCustomFirms = customFirms.map((f: any) => {
        if (f.id === id) {
          return {
            ...f,
            name: formData.firmName,
            adminName: `${formData.firstName} ${formData.lastName}`.trim(),
            email: formData.supportEmail || formData.email,
          };
        }
        return f;
      });
      localStorage.setItem("lexvalu_custom_firms", JSON.stringify(updatedCustomFirms));
    } catch {
      // ignore
    }

    router.push("/superadmin/firms?updated=true");
  };

  return (
    <div className="p-6 md:p-8 space-y-6 bg-slate-50/50 min-h-screen w-full font-sans">
      {/* Header */}
      <div>
        <Link 
          href="/superadmin/firms"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Firms
        </Link>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#111827] tracking-tight">Edit Firm Details</h1>
        <p className="text-slate-500 text-sm mt-1">Update isolated firm details and admin account settings.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Profile Section */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8">
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-11 h-11 bg-slate-50/80 border border-slate-200/60 rounded-xl flex items-center justify-center shrink-0 text-slate-700">
              <User className="w-5 h-5 stroke-[1.75]" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold text-slate-900 leading-tight">Personal Profile</h2>
              <p className="text-xs md:text-sm text-slate-500 mt-0.5">Manage your new personal account details.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs md:text-sm font-bold text-slate-900 mb-1.5">
                First Name <span className="text-rose-500">*</span>
              </label>
              <input 
                type="text"
                name="firstName"
                placeholder="e.g. John"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-all shadow-2xs"
                required
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-bold text-slate-900 mb-1.5">
                Last Name <span className="text-rose-500">*</span>
              </label>
              <input 
                type="text"
                name="lastName"
                placeholder="e.g. Doe"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-all shadow-2xs"
                required
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-bold text-slate-900 mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input 
                type="email"
                name="email"
                placeholder="e.g. johndoe@gmail.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-all shadow-2xs"
                required
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-bold text-slate-900 mb-1.5">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input 
                type="tel"
                name="personalPhone"
                placeholder="+1-555-0199"
                value={formData.personalPhone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-all shadow-2xs"
                required
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-bold text-slate-900 mb-1.5">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-all shadow-2xs pr-11"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs md:text-sm font-bold text-slate-900 mb-1.5">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-all shadow-2xs pr-11"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">Required to login as this admin.</p>
            </div>
          </div>
        </div>

        {/* Firm Information Section */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8">
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-11 h-11 bg-slate-50/80 border border-slate-200/60 rounded-xl flex items-center justify-center shrink-0 text-slate-700">
              <Building2 className="w-5 h-5 stroke-[1.75]" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold text-slate-900 leading-tight">Firm Information</h2>
              <p className="text-xs md:text-sm text-slate-500 mt-0.5">Basic identity and contact details.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs md:text-sm font-bold text-slate-900 mb-1.5">
                Firm Name <span className="text-rose-500">*</span>
              </label>
              <input 
                type="text"
                name="firmName"
                placeholder="e.g. LexValue Partners LLC"
                value={formData.firmName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-all shadow-2xs"
                required
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-bold text-slate-900 mb-1.5">
                Tax ID / EIN
              </label>
              <input 
                type="text"
                name="taxId"
                placeholder="XX-XXXXXXX"
                value={formData.taxId}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-all shadow-2xs"
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-bold text-slate-900 mb-1.5">
                Support Email <span className="text-rose-500">*</span>
              </label>
              <input 
                type="email"
                name="supportEmail"
                placeholder="e.g. admin@lexvaluepartners.com"
                value={formData.supportEmail}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-all shadow-2xs"
                required
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-bold text-slate-900 mb-1.5">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input 
                type="tel"
                name="firmPhone"
                placeholder="+1 (555) 123-4567"
                value={formData.firmPhone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-all shadow-2xs"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs md:text-sm font-bold text-slate-900 mb-1.5">
                Firm Address
              </label>
              <textarea 
                name="firmAddress"
                placeholder="123 Legal Way, Suite 500, New York, NY 10001"
                rows={4}
                value={formData.firmAddress}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-all shadow-2xs resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2 pb-12">
          <button 
            type="submit"
            className="flex items-center gap-2 bg-[#124b4b] hover:bg-[#0d3636] text-white px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all shadow-sm shrink-0"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
