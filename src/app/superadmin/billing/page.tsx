"use client";
import { useState } from "react";
import { ShieldCheck, Zap, Building2, CheckCircle2, AlertCircle, Settings, Search, Filter, ArrowUpRight, Banknote, X, Send, Check, Mail } from "lucide-react";

const mockSubscriptions = [
  { id: 1, firm: "Smith & Associates", tier: "Enterprise", price: "$499.00/mo", status: "Active", users: "12/15", nextBilling: "Oct 1, 2026" },
  { id: 2, firm: "Johnson Legal Group", tier: "Professional", price: "$299.00/mo", status: "Active", users: "5/10", nextBilling: "Oct 5, 2026" },
  { id: 3, firm: "Miller & Partners", tier: "Starter", price: "$99.00/mo", status: "Past Due", users: "3/3", nextBilling: "Sep 20, 2026" },
  { id: 4, firm: "Davis & Davis", tier: "Enterprise", price: "$499.00/mo", status: "Active", users: "14/15", nextBilling: "Oct 12, 2026" },
];

export default function BillingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [billingToast, setBillingToast] = useState<string | null>(null);
  const [paymentRequestModal, setPaymentRequestModal] = useState<any | null>(null);
  const [requestNote, setRequestNote] = useState("");
  const [subscriptions, setSubscriptions] = useState(mockSubscriptions);
  const [subscriptionSearch, setSubscriptionSearch] = useState("");

  const safeSubscriptionSearch = typeof subscriptionSearch === "string" ? subscriptionSearch : "";
  const safeSubscriptions = Array.isArray(subscriptions) ? subscriptions : mockSubscriptions;

  const handleOpenSubPaymentRequest = (sub: any) => {
    setRequestNote(`Your subscription for ${sub.firm} (${sub.price}) on the ${sub.tier} tier is currently past due (Next Billing was ${sub.nextBilling}). Please process payment immediately to maintain uninterrupted tenant access.`);
    setPaymentRequestModal({
      id: sub.id,
      firm: sub.firm,
      plan: sub.tier,
      amount: sub.price,
      dueInfo: sub.nextBilling,
    });
  };

  const handleConfirmSendRequest = () => {
    if (!paymentRequestModal) return;
    setSubscriptions(prev =>
      (Array.isArray(prev) ? prev : mockSubscriptions).map(s => s.id === paymentRequestModal.id ? { ...s, status: "Notice Sent" } : s)
    );
    setBillingToast(`Payment notice sent to ${paymentRequestModal.firm} for ${paymentRequestModal.amount}.`);
    setPaymentRequestModal(null);
    setTimeout(() => setBillingToast(null), 3500);
  };

  const handleMarkSubAsPaid = (id: number, firmName: string) => {
    setSubscriptions(prev =>
      (Array.isArray(prev) ? prev : mockSubscriptions).map(s => s.id === id ? { ...s, status: "Active", nextBilling: "Oct 20, 2026" } : s)
    );
    setBillingToast(`Subscription for ${firmName} has been marked as Paid & Active.`);
    setTimeout(() => setBillingToast(null), 3500);
  };

  return (
    <div className="p-6 space-y-8 min-h-screen bg-slate-50/30 w-full">
      {/* Toast Notification */}
      {billingToast && (
        <div className="fixed top-6 right-6 z-[9999] flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-800 text-sm animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{billingToast}</span>
        </div>
      )}
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Global Billing & Subscriptions</h1>
          <p className="text-slate-500 mt-2">Manage all tenant subscriptions and revenue metrics.</p>
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

      {/* Subscription Management */}
      <div className="space-y-6 pb-24">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Firm Subscriptions</h2>
            <p className="text-sm text-slate-500 mt-1">Manage billing plans and monitor usage limits for all tenants.</p>
          </div>
          <div className="flex gap-3">
            <div className="relative w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search firms..."
                value={safeSubscriptionSearch}
                onChange={(e) => setSubscriptionSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-sm"
              />
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
                  <th className="px-6 py-5">NEXT BILLING</th>
                  <th className="px-6 py-5 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {safeSubscriptions
                  .filter((sub) => {
                    if (!safeSubscriptionSearch.trim()) return true;
                    const q = safeSubscriptionSearch.toLowerCase();
                    return (
                      (sub.firm && sub.firm.toLowerCase().includes(q)) ||
                      (sub.tier && sub.tier.toLowerCase().includes(q)) ||
                      (sub.status && sub.status.toLowerCase().includes(q))
                    );
                  })
                  .map((sub) => (
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
                          {sub.tier === "Enterprise" && <Zap className="w-3.5 h-3.5 text-teal-600" />}
                          {sub.tier}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900">{sub.price}</td>
                      <td className="px-6 py-4">
                        <span className="text-slate-600 font-medium">{sub.users}</span>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-600">
                        <div>
                          <div>{sub.nextBilling}</div>
                          {sub.status === "Past Due" && (
                            <div className="text-[11px] font-semibold text-red-500">Overdue</div>
                          )}
                          {(sub.status === "Notice Sent" || sub.status === "Requested") && (
                            <div className="text-[11px] font-semibold text-amber-600">Notice Sent</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {sub.status !== "Active" && (
                            <>
                              <button
                                onClick={() => handleOpenSubPaymentRequest(sub)}
                                title="Send payment request to firm"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors shadow-sm"
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>
                                  {sub.status === "Notice Sent" || sub.status === "Requested"
                                    ? "Resend Notice"
                                    : "Request Payment"}
                                </span>
                              </button>
                              <button
                                onClick={() => handleMarkSubAsPaid(sub.id, sub.firm)}
                                title="Mark subscription as Paid & Active"
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Mark Paid</span>
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => {
                              setModalTitle(`Manage Subscription: ${sub.firm}`);
                              setIsModalOpen(true);
                            }}
                            className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-bold text-[#0f766e] bg-teal-50 border border-teal-100 rounded-lg hover:bg-teal-100 transition-colors"
                          >
                            Manage
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
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
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-sm transition-colors shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Request Modal */}
      {paymentRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700 border border-teal-100">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Request Subscription Payment
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Send past due payment notice to firm billing contact.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPaymentRequestModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block">Firm Name</span>
                  <span className="font-bold text-slate-900">{paymentRequestModal.firm}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Due Date</span>
                  <span className="font-bold text-slate-900">
                    {paymentRequestModal.dueInfo}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Plan / Tier</span>
                  <span className="font-medium text-slate-700">{paymentRequestModal.plan}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Amount Due</span>
                  <span className="font-bold text-rose-600 text-sm">{paymentRequestModal.amount}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Payment Request Notice</label>
                <textarea
                  rows={4}
                  value={requestNote}
                  onChange={(e) => setRequestNote(e.target.value)}
                  className="w-full p-3 text-xs text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all resize-none leading-relaxed"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <span>An automated payment link with invoice receipt will be delivered directly to the tenant's primary billing email.</span>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setPaymentRequestModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSendRequest}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Payment Notice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

