"use client";

import { useState } from "react";
import { Sliders, Server, Shield, Database, Save, User, Building2, Eye, EyeOff } from "lucide-react";

const mockPermissions = [
  { id: 1, feature: "Firm Settings", superadmin: true, admin: true, partner: false, attorney: false, paralegal: false },
  { id: 2, feature: "Billing & Invoices", superadmin: true, admin: true, partner: false, attorney: false, paralegal: false },
  { id: 3, feature: "Manage Users", superadmin: true, admin: true, partner: true, attorney: false, paralegal: false },
  { id: 4, feature: "Delete Cases", superadmin: true, admin: true, partner: true, attorney: false, paralegal: false },
  { id: 5, feature: "Create/Edit Cases", superadmin: true, admin: true, partner: true, attorney: true, paralegal: true },
  { id: 6, feature: "View All Firm Cases", superadmin: true, admin: true, partner: true, attorney: false, paralegal: false },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="p-6 space-y-8 min-h-screen bg-slate-50/30 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#14233a] tracking-tight">Global Platform Settings</h1>
          <p className="text-slate-500 mt-2">Manage superadmin configurations, platform security, and compliance preferences.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#0f766e] hover:bg-[#0d655e] text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-8 overflow-x-auto">
          <button 
            onClick={() => setActiveTab("general")}
            className={`pb-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${activeTab === "general" ? "border-teal-600 text-teal-700" : "border-transparent text-slate-500 hover:text-slate-800"}`}
          >
            General Profile & Settings
          </button>
          <button 
            onClick={() => setActiveTab("permissions")}
            className={`pb-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${activeTab === "permissions" ? "border-teal-600 text-teal-700" : "border-transparent text-slate-500 hover:text-slate-800"}`}
          >
            Role & Permission Matrix
          </button>
          <button 
            onClick={() => setActiveTab("security")}
            className={`pb-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${activeTab === "security" ? "border-teal-600 text-teal-700" : "border-transparent text-slate-500 hover:text-slate-800"}`}
          >
            Security & Compliance
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="pt-2 pb-24">
        
        {/* General Profile & Settings */}
        {activeTab === "general" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
              <div className="flex gap-4 mb-8">
                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center shrink-0">
                  <User className="w-6 h-6 text-slate-700" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#14233a]">Superadmin Profile Details</h3>
                  <p className="text-sm text-slate-500">Manage your personal credentials and contact information.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#14233a]">First Name</label>
                  <input type="text" defaultValue="Super" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#14233a]">Last Name</label>
                  <input type="text" defaultValue="Admin" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-sm" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-[#14233a]">Email Address</label>
                  <input type="email" defaultValue="admin@lexvalue.ai" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#14233a]">Update Password</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} placeholder="••••••••" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-sm pr-10" />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#14233a]">Confirm New Password</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} placeholder="••••••••" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-sm pr-10" />
                  </div>
                </div>
              </div>
            </div>

            {/* Global Firms Settings */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
              <div className="flex gap-4 mb-8">
                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6 text-slate-700" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#14233a]">Global Firms Settings</h3>
                  <p className="text-sm text-slate-500">Configure default limitations, integrations, and global toggles for all tenant firms.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#14233a]">Default Trial Period</label>
                  <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-sm appearance-none">
                    <option>7 Days</option>
                    <option>14 Days</option>
                    <option>30 Days</option>
                    <option>No Trial</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#14233a]">Default Plan Tier</label>
                  <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-sm appearance-none">
                    <option>Starter</option>
                    <option>Professional</option>
                    <option>Enterprise</option>
                  </select>
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-100 md:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-[#14233a]">Auto-suspend Overdue Firms</p>
                    <p className="text-xs text-slate-500 mt-1">Automatically restrict access to firms with overdue invoices exceeding 15 days.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0f766e]"></div>
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-100 md:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-[#14233a]">Allow Firm Self-Registration</p>
                    <p className="text-xs text-slate-500 mt-1">Enable public sign-up page for new firms to register themselves.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0f766e]"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Role & Permission Matrix */}
        {activeTab === "permissions" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex gap-4">
              <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center shrink-0">
                <Sliders className="w-6 h-6 text-slate-700" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#14233a]">Global Permission Matrix</h3>
                <p className="text-sm text-slate-500 mt-1">Configure default access control parameters universally across all tenant firms.</p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/50 text-xs uppercase tracking-widest font-semibold text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-8 py-5 border-r border-slate-100">FEATURE / ACTION</th>
                    <th className="px-4 py-5 text-center">SUPERADMIN</th>
                    <th className="px-4 py-5 text-center">FIRM ADMIN</th>
                    <th className="px-4 py-5 text-center">PARTNER</th>
                    <th className="px-4 py-5 text-center">ATTORNEY</th>
                    <th className="px-4 py-5 text-center">PARALEGAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mockPermissions.map(perm => (
                    <tr key={perm.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-4 font-bold text-[#14233a] border-r border-slate-100">{perm.feature}</td>
                      <td className="px-4 py-4 text-center">
                        <input type="checkbox" defaultChecked={perm.superadmin} className="w-4 h-4 text-[#0f766e] rounded border-slate-300 focus:ring-[#0f766e]" disabled />
                      </td>
                      <td className="px-4 py-4 text-center">
                        <input type="checkbox" defaultChecked={perm.admin} className="w-4 h-4 text-[#0f766e] rounded border-slate-300 focus:ring-[#0f766e]" />
                      </td>
                      <td className="px-4 py-4 text-center">
                        <input type="checkbox" defaultChecked={perm.partner} className="w-4 h-4 text-[#0f766e] rounded border-slate-300 focus:ring-[#0f766e]" />
                      </td>
                      <td className="px-4 py-4 text-center">
                        <input type="checkbox" defaultChecked={perm.attorney} className="w-4 h-4 text-[#0f766e] rounded border-slate-300 focus:ring-[#0f766e]" />
                      </td>
                      <td className="px-4 py-4 text-center">
                        <input type="checkbox" defaultChecked={perm.paralegal} className="w-4 h-4 text-[#0f766e] rounded border-slate-300 focus:ring-[#0f766e]" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Security & Compliance */}
        {activeTab === "security" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
              <div className="flex gap-4 mb-8">
                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center shrink-0">
                  <Shield className="w-6 h-6 text-slate-700" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#14233a]">Security & Access</h3>
                  <p className="text-sm text-slate-500">HIPAA compliance and authentication policies applied globally.</p>
                </div>
              </div>
              
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-[#14233a]">Enforce Two-Factor Authentication (2FA)</p>
                    <p className="text-xs text-slate-500 mt-1">Mandate 2FA for all users across all tenant firms to ensure platform security.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0f766e]"></div>
                  </label>
                </div>
                
                <hr className="border-slate-100" />
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-[#14233a]">Idle Session Timeout</p>
                    <p className="text-xs text-slate-500 mt-1">Automatically log out users after inactivity to maintain HIPAA compliance.</p>
                  </div>
                  <select className="w-full sm:w-64 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-sm appearance-none">
                    <option>15 Minutes</option>
                    <option>30 Minutes (Recommended)</option>
                    <option>1 Hour</option>
                    <option>2 Hours</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
              <div className="flex gap-4 mb-8">
                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center shrink-0">
                  <Database className="w-6 h-6 text-slate-700" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#14233a]">Data Retention & AI Preferences</h3>
                  <p className="text-sm text-slate-500">Manage how case data is globally stored and processed by AI.</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-[#14233a]">Case Data Retention</p>
                  <p className="text-xs text-slate-500 mt-1">How long to keep data globally after a case is closed.</p>
                </div>
                <select defaultValue="7 Years (Standard)" className="w-full sm:w-64 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-sm appearance-none">
                  <option>3 Years</option>
                  <option>5 Years</option>
                  <option>7 Years (Standard)</option>
                  <option>Indefinitely</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
              <div className="flex gap-4 mb-8">
                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center shrink-0">
                  <Server className="w-6 h-6 text-slate-700" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#14233a]">Network Restrictions</h3>
                  <p className="text-sm text-slate-500">Global firewall rules and IP constraints for the platform.</p>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#14233a]">Superadmin IP Whitelisting</label>
                <p className="text-xs text-slate-500 mb-2">Restrict superadmin portal access to specific IP addresses. One per line. Leave empty for open access.</p>
                <textarea 
                  rows={4}
                  defaultValue="192.168.1.1&#10;10.0.0.5"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-sm"
                  placeholder="e.g. 192.168.1.1"
                ></textarea>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
