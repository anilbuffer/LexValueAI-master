"use client";

import { useState } from "react";
import { Download, Edit, CreditCard, Building2, CheckCircle2, AlertCircle, Settings, Search, Filter, Zap, ArrowUpRight, Plus, Trash2, ShieldCheck, Banknote, X } from "lucide-react";

const mockSubscriptions = [
  { id: 1, firm: "Smith & Associates", tier: "Enterprise", price: "$499.00/mo", status: "Active", users: "12/15", nextBilling: "Oct 1, 2026" },
  { id: 2, firm: "Johnson Legal Group", tier: "Professional", price: "$299.00/mo", status: "Active", users: "5/10", nextBilling: "Oct 5, 2026" },
  { id: 3, firm: "Miller & Partners", tier: "Starter", price: "$99.00/mo", status: "Past Due", users: "3/3", nextBilling: "Sep 20, 2026" },
  { id: 4, firm: "Davis & Davis", tier: "Enterprise", price: "$499.00/mo", status: "Active", users: "14/15", nextBilling: "Oct 12, 2026" },
];

const mockInvoices = [
  { id: "INV-2026-08", firm: "Smith & Associates", date: "Aug 01, 2026, 10:30 AM", plan: "Enterprise", amount: "$499.00", status: "Paid" },
  { id: "INV-2026-07", firm: "Johnson Legal Group", date: "Jul 05, 2026, 11:15 AM", plan: "Professional", amount: "$299.00", status: "Paid" },
  { id: "INV-2026-06", firm: "Miller & Partners", date: "Jun 20, 2026, 09:45 AM", plan: "Starter", amount: "$99.00", status: "Unpaid" },
  { id: "INV-2026-05", firm: "Davis & Davis", date: "May 01, 2026, 02:20 PM", plan: "Enterprise", amount: "$499.00", status: "Paid" },
];

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState("subscriptions");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  return (
    <div className="p-6 space-y-8 min-h-screen bg-slate-50/30 w-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Global Billing & Subscriptions</h1>
          <p className="text-slate-500 mt-2">Manage all tenant subscriptions, platform revenue, and global payment gateways.</p>
        </div>
        <button 
          onClick={() => { setModalTitle("Global Pricing Plans"); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0f766e] hover:bg-[#0d655e] text-white rounded-lg font-semibold transition-colors shadow-sm"
        >
          <Settings className="w-4 h-4" /> Global Pricing Plans
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-teal-200 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
              <Banknote className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
              <ArrowUpRight className="w-3 h-3" /> +12.5%
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Monthly Recurring Revenue</p>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-4xl font-bold text-slate-900">$24,500<span className="text-xl text-slate-400 font-medium">.00</span></p>
          </div>
          <p className="text-sm text-slate-500 mt-2">Expected next month: <span className="font-semibold text-slate-700">$26,100.00</span></p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-teal-200 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
              <ArrowUpRight className="w-3 h-3" /> +3 New
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Active Subscriptions</p>
          <p className="text-4xl font-bold text-slate-900 mt-2">142</p>
          <p className="text-sm text-slate-500 mt-2">Across <span className="font-semibold text-slate-700">3</span> pricing tiers</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-amber-200 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
              <AlertCircle className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
              Action Needed
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Pending Invoices</p>
          <p className="text-4xl font-bold text-slate-900 mt-2">8</p>
          <p className="text-sm text-slate-500 mt-2">Totalling <span className="font-semibold text-amber-600">$3,450.00</span> in arrears</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-8">
          <button 
            onClick={() => setActiveTab("subscriptions")}
            className={`pb-4 text-sm font-semibold border-b-2 transition-all ${activeTab === "subscriptions" ? "border-teal-600 text-teal-700" : "border-transparent text-slate-500 hover:text-slate-800"}`}
          >
            Tenant Subscriptions
          </button>
          <button 
            onClick={() => setActiveTab("invoices")}
            className={`pb-4 text-sm font-semibold border-b-2 transition-all ${activeTab === "invoices" ? "border-teal-600 text-teal-700" : "border-transparent text-slate-500 hover:text-slate-800"}`}
          >
            Global Invoice History
          </button>
          <button 
            onClick={() => setActiveTab("gateways")}
            className={`pb-4 text-sm font-semibold border-b-2 transition-all ${activeTab === "gateways" ? "border-teal-600 text-teal-700" : "border-transparent text-slate-500 hover:text-slate-800"}`}
          >
            Payment Gateways
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="pt-2 pb-24">
        
        {/* Subscription Management */}
        {activeTab === "subscriptions" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Firm Subscriptions</h2>
                <p className="text-sm text-slate-500 mt-1">Manage billing plans and monitor usage limits for all tenants.</p>
              </div>
              <div className="flex gap-3">
                <div className="relative w-72">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Search firms..." className="w-full pl-9 pr-4 py-2.5 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-sm" />
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-sm">
                  <Filter className="w-4 h-4 text-slate-400" /> Filter
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50/50 text-xs uppercase tracking-widest font-semibold text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-5">FIRM</th>
                      <th className="px-6 py-5">TIER LEVEL</th>
                      <th className="px-6 py-5">PRICING</th>
                      <th className="px-6 py-5">SEATS USED</th>
                      <th className="px-6 py-5">STATUS</th>
                      <th className="px-6 py-5">NEXT BILLING</th>
                      <th className="px-6 py-5 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {mockSubscriptions.map(sub => (
                      <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                              <Building2 className="w-4 h-4 text-slate-500" />
                            </div>
                            <span className="font-bold text-slate-900">{sub.firm}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                            {sub.tier === 'Enterprise' && <Zap className="w-3.5 h-3.5 text-teal-600" />}
                            {sub.tier}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-900">{sub.price}</td>
                        <td className="px-6 py-4">
                          <span className="text-slate-600 font-medium">{sub.users}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                            sub.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                          }`}>
                            {sub.status === 'Active' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                            {sub.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-600">{sub.nextBilling}</td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => { setModalTitle(`Manage Subscription: ${sub.firm}`); setIsModalOpen(true); }}
                            className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-bold text-[#0f766e] bg-teal-50 border border-teal-100 rounded-lg hover:bg-teal-100 transition-colors"
                          >
                            Manage
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

        {/* Invoice History */}
        {activeTab === "invoices" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Global Billing History</h2>
                <p className="text-sm text-slate-500 mt-1">View and download past invoices across all firms.</p>
              </div>
              <div className="flex gap-3">
                <div className="relative w-72">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Search invoices..." className="w-full pl-9 pr-4 py-2.5 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-sm" />
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-sm">
                  <Filter className="w-4 h-4 text-slate-400" /> Filter
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-white text-xs uppercase tracking-widest font-semibold text-slate-400 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-5">INVOICE ID</th>
                      <th className="px-6 py-5">FIRM</th>
                      <th className="px-6 py-5">DATE & TIME</th>
                      <th className="px-6 py-5">PLAN</th>
                      <th className="px-6 py-5">AMOUNT</th>
                      <th className="px-6 py-5">STATUS</th>
                      <th className="px-6 py-5 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/80">
                    {mockInvoices.map(invoice => (
                      <tr key={invoice.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-5 font-bold text-slate-900">{invoice.id}</td>
                        <td className="px-6 py-5 font-semibold text-slate-700">{invoice.firm}</td>
                        <td className="px-6 py-5 text-slate-500 font-medium">{invoice.date}</td>
                        <td className="px-6 py-5 font-medium text-slate-700">{invoice.plan}</td>
                        <td className="px-6 py-5 font-bold text-slate-900">{invoice.amount}</td>
                        <td className="px-6 py-5">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                            invoice.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                          }`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button className="inline-flex items-center justify-center w-8 h-8 text-slate-400 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-600 transition-colors shadow-sm">
                            <Download className="w-4 h-4" />
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

        {/* Payment Gateways */}
        {activeTab === "gateways" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Payment Gateway Integrations</h2>
              <p className="text-sm text-slate-500 mt-1">Manage API keys and webhooks for payment processors.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 relative">
                <div className="absolute top-6 right-6">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                    Active
                  </span>
                </div>
                
                <div className="flex items-start gap-4 mb-8">
                  <div className="w-14 h-14 bg-[#635BFF]/10 rounded-2xl flex items-center justify-center shrink-0 border border-[#635BFF]/20">
                    <CreditCard className="w-7 h-7 text-[#635BFF]" />
                  </div>
                  <div className="pt-1">
                    <h3 className="text-xl font-bold text-slate-900">Stripe</h3>
                    <p className="text-sm text-slate-500 mt-1">Primary payment gateway</p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-8 py-6 border-y border-slate-100">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Environment</span>
                    <span className="font-bold text-slate-900">Production</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Webhook Status</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Receiving</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2 bg-[#0f766e] hover:bg-[#0d655e] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm">
                    <Settings className="w-4 h-4" /> Configure
                  </button>
                  <button className="flex items-center justify-center px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                    View Logs
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 relative">
                <div className="absolute top-6 right-6">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    Inactive
                  </span>
                </div>
                
                <div className="flex items-start gap-4 mb-8">
                  <div className="w-14 h-14 bg-[#00457C]/10 rounded-2xl flex items-center justify-center shrink-0 border border-[#00457C]/20">
                    <CreditCard className="w-7 h-7 text-[#00457C]" />
                  </div>
                  <div className="pt-1">
                    <h3 className="text-xl font-bold text-slate-900">PayPal</h3>
                    <p className="text-sm text-slate-500 mt-1">Alternative gateway</p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-8 py-6 border-y border-slate-100">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Environment</span>
                    <span className="font-bold text-slate-400">Sandbox</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Webhook Status</span>
                    <span className="font-bold text-slate-400 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div> Not Configured</span>
                  </div>
                </div>

                <button className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm">
                  <Plus className="w-4 h-4" /> Connect Integration
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Slide-over Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-teal-600" /> {modalTitle}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 flex-1 overflow-y-auto">
              <p className="text-sm text-slate-600 uppercase font-bold tracking-wider mb-4">Configuration details</p>
              <p className="text-slate-600 text-sm leading-relaxed">This feature is currently under development. You will soon be able to manage these settings here.</p>
              
              <div className="mt-8 space-y-4">
                <div className="h-12 bg-slate-50 rounded-lg border border-slate-100/50"></div>
                <div className="h-32 bg-slate-50 rounded-lg border border-slate-100/50"></div>
                <div className="h-12 w-2/3 bg-slate-50 rounded-lg border border-slate-100/50"></div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50">
              <button onClick={() => setIsModalOpen(false)} className="w-full py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold shadow-sm hover:bg-slate-50 transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
