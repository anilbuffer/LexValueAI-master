"use client"
import React, { useEffect, useState } from 'react'
import {
  Handshake,
  TrendingDown,
  TrendingUp,
  Sparkles,
  Shield,
  FileText,
  Copy,
  Check,
  PlusCircle,
  Clock,
  ArrowRight,
  User,
  Building2,
  DollarSign,
  CheckCircle2,
  Database,
  ExternalLink
} from 'lucide-react'
import { getMockCaseValuations, getMockNegotiationLogs, createMockNegotiationLog } from '@/lib/mock-data'
import { useRouter, usePathname } from 'next/navigation'

export function NegotiationTab({ caseData }: { caseData: any }) {
  const firmId = caseData?.firmId || 'firm-1';
  const caseId = caseData?.id || 'case-1';

  const router = useRouter();
  const pathname = usePathname();

  const [valuations, setValuations] = useState<any[]>([])
  const [negotiationLogs, setNegotiationLogs] = useState<any[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showLogModal, setShowLogModal] = useState(false)

  // New Round Form
  const [logForm, setLogForm] = useState({
    type: 'COUNTER_DEMAND',
    amount: '',
    author: 'Attorney Mike Ross',
    recipient: 'Travelers Adjuster Sarah Jenkins',
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (firmId && caseId) {
      setValuations(getMockCaseValuations(firmId, caseId));
      setNegotiationLogs(getMockNegotiationLogs(firmId, caseId));
    }
  }, [firmId, caseId])

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const valuation = valuations[0] || {};
  const defensePressure = valuation.defensePressure || [];
  const strategy = valuation.negotiationStrategy || {};

  // Compute Active Negotiation Metrics from Logs
  const demands = negotiationLogs.filter(l => l.type === 'DEMAND' || l.type === 'COUNTER_DEMAND');
  const offers = negotiationLogs.filter(l => l.type === 'OFFER' || l.type === 'COUNTER_OFFER');

  const latestDemand = demands.length > 0 ? demands[demands.length - 1].amount : 175000;
  const latestOffer = offers.length > 0 ? offers[offers.length - 1].amount : 58000;
  const currentSpread = latestDemand - latestOffer;
  const currentMidpoint = (latestDemand + latestOffer) / 2;

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logForm.amount) return;

    setIsSubmitting(true);
    const amountNum = parseFloat(logForm.amount);
    const newLog = {
      id: `neg-${Date.now()}`,
      firmId,
      caseId,
      roundNumber: Math.floor(negotiationLogs.length / 2) + 1,
      date: new Date(),
      type: logForm.type,
      amount: amountNum,
      author: logForm.author,
      recipient: logForm.recipient,
      notes: logForm.notes || (logForm.type.includes('DEMAND') ? "Plaintiff tactical counter-demand served." : "Carrier updated position."),
      status: "ACTIVE"
    };

    createMockNegotiationLog(newLog);
    setNegotiationLogs(getMockNegotiationLogs(firmId, caseId));
    setIsSubmitting(false);
    setShowLogModal(false);
    setLogForm({
      type: 'COUNTER_DEMAND',
      amount: '',
      author: 'Attorney Mike Ross',
      recipient: 'Travelers Adjuster Sarah Jenkins',
      notes: ''
    });
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-500 font-sans">

      {/* Top Header */}
      <div className="bg-slate-50/90 p-5 md:p-6 border-b border-slate-200 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-teal-900 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
              <Handshake className="w-3 h-3 text-teal-300" /> Negotiation Tracker
            </span>
            <span className="bg-teal-50 text-teal-800 border border-teal-200 text-[11px] font-bold px-2 py-0.5 rounded-full">
              Round {Math.max(1, Math.ceil(negotiationLogs.length / 2))} in Progress
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Negotiation & Offer Progression
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
            Logs each demand and counteroffer so negotiation strategy stays connected to real-world carrier movements.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => router.push(`${pathname}?tab=valuation`)}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-sm transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-700" />
            <span>Settlement Intelligence Playbook</span>
          </button>

          <button
            onClick={() => setShowLogModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-900 hover:bg-teal-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-teal-300" />
            <span>Log Offer / Counter</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5 md:p-8 flex-1 overflow-y-auto space-y-6 bg-slate-50/30">

        {/* 1. Live Progression Metrics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-teal-800 tracking-wider block mb-1">
              Latest Plaintiff Demand
            </span>
            <div className="text-2xl font-black text-teal-950">
              ${latestDemand.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-teal-600" /> Active plaintiff anchor
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-rose-700 tracking-wider block mb-1">
              Latest Carrier Offer
            </span>
            <div className="text-2xl font-black text-rose-950">
              ${latestOffer.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <TrendingDown className="w-3 h-3 text-rose-600" /> Current adjuster authority
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-700 tracking-wider block mb-1">
              Active Spread
            </span>
            <div className="text-2xl font-black text-slate-900">
              ${currentSpread.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Gap between positions
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-indigo-700 tracking-wider block mb-1">
              Statistical Midpoint
            </span>
            <div className="text-2xl font-black text-indigo-950">
              ${Math.round(currentMidpoint).toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Current mathematical median
            </p>
          </div>
        </div>

        {/* 2. Round-by-Round Timeline & Strategic Connection */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left 2 Cols: Chronological Negotiation Log */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Negotiation Round Progression</h3>
                  <p className="text-xs text-slate-500">Chronological history of demands and carrier counteroffers</p>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                {negotiationLogs.length} Entries Logged
              </span>
            </div>

            <div className="space-y-4">
              {negotiationLogs.map((log: any, idx: number) => {
                const isDemand = log.type === 'DEMAND' || log.type === 'COUNTER_DEMAND';
                const formattedDate = new Date(log.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });

                return (
                  <div
                    key={log.id || idx}
                    className={`p-4 rounded-xl border transition-all ${isDemand
                      ? 'bg-teal-50/30 border-teal-200 hover:border-teal-300'
                      : 'bg-rose-50/30 border-rose-200 hover:border-rose-300'
                      }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${isDemand ? 'bg-teal-900 text-white' : 'bg-rose-800 text-white'
                            }`}>
                            Round {log.roundNumber} • {isDemand ? 'Plaintiff Demand' : 'Carrier Offer'}
                          </span>
                          <span className="text-xs font-semibold text-slate-500">
                            {formattedDate}
                          </span>
                        </div>
                        <h4 className="text-lg font-extrabold text-slate-900 mt-1.5">
                          ${log.amount.toLocaleString()}
                        </h4>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] font-semibold text-slate-600 block">
                          From: {log.author}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          To: {log.recipient}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 text-xs text-slate-700 leading-relaxed flex items-start gap-1.5">
                      <span className="font-semibold text-slate-900 shrink-0">Notes:</span>
                      <span>{log.notes}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Col: Active Strategy Guidance & Rebuttal Preemption */}
          <div className="space-y-6">

            {/* Next Recommended Tactical Move */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-slate-900 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-teal-700" />
                <span>Strategy Connection</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Based on the carrier's last offer of <strong>${latestOffer.toLocaleString()}</strong>, maintain pressure by anchoring firmly to confirmed objective findings.
              </p>

              <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-xl space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-900 block">
                  Recommended Next Counter Range
                </span>
                <p className="font-extrabold text-base text-teal-950">
                  $125,000 – $135,000
                </p>
                <p className="text-[11px] text-teal-800 leading-relaxed">
                  Avoid conceding below $100k until carrier reviews the Eggshell Plaintiff brief and physician causation affirmation.
                </p>
              </div>
            </div>

            {/* Quick Evidence Rebuttals */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Shield className="w-4 h-4 text-teal-700" />
                  <span>Defense Counter-Points</span>
                </div>
                <button
                  onClick={() => router.push(`${pathname}?tab=valuation`)}
                  className="text-[11px] font-bold text-teal-700 hover:text-teal-900 cursor-pointer flex items-center gap-0.5"
                >
                  <span>All 4 Parts</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-3">
                {defensePressure.slice(0, 2).map((dp: any) => {
                  const isCopied = copiedId === dp.id;
                  return (
                    <div key={dp.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900">{dp.title}</span>
                        <button
                          onClick={() => copyToClipboard(dp.rebuttal || "", dp.id)}
                          className="text-[10px] font-semibold text-teal-700 flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-teal-200 cursor-pointer"
                        >
                          {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          {isCopied ? "Copied" : "Copy Rebuttal"}
                        </button>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        {dp.rebuttal}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Direct Link to Log Final Settlement in Moat */}
            <div className="p-5 bg-gradient-to-br from-slate-900 to-teal-950 text-white rounded-2xl shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-teal-400 uppercase tracking-wider mb-1">
                  <Database className="w-3.5 h-3.5" /> Outcome Dataset Moat
                </div>
                <h4 className="text-sm font-bold text-white">
                  Settled this Case?
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Record the final agreed number, offers count, and days to settle to feed your firm's settlement intelligence dataset.
                </p>
              </div>
              <button
                onClick={() => router.push(`${pathname}?tab=valuation`)}
                className="mt-4 w-full py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Log Final Settlement Outcome
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* MODAL: LOG NEW OFFER OR DEMAND */}
      {showLogModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="bg-slate-50 p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Log Negotiation Entry</h3>
                <p className="text-xs text-slate-500 mt-0.5">Record a demand or carrier counteroffer</p>
              </div>
              <button
                onClick={() => setShowLogModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddLog} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Entry Type</label>
                <select
                  value={logForm.type}
                  onChange={(e) => setLogForm({ ...logForm, type: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-teal-600 font-semibold"
                >
                  <option value="COUNTER_DEMAND">Plaintiff Counter-Demand</option>
                  <option value="COUNTER_OFFER">Carrier Counteroffer</option>
                  <option value="DEMAND">Formal Initial Demand</option>
                  <option value="OFFER">Initial Carrier Offer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Amount ($)</label>
                <input
                  type="number"
                  value={logForm.amount}
                  onChange={(e) => setLogForm({ ...logForm, amount: e.target.value })}
                  required
                  placeholder="e.g. 135000"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-teal-600 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Author / Maker</label>
                  <input
                    type="text"
                    value={logForm.author}
                    onChange={(e) => setLogForm({ ...logForm, author: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Recipient</label>
                  <input
                    type="text"
                    value={logForm.recipient}
                    onChange={(e) => setLogForm({ ...logForm, recipient: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tactical Notes & Adjuster Justification</label>
                <textarea
                  rows={2}
                  value={logForm.notes}
                  onChange={(e) => setLogForm({ ...logForm, notes: e.target.value })}
                  placeholder="e.g. Carrier raised authority after reviewing Dr. Chen's surgical causation report."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-teal-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-teal-900 hover:bg-teal-800 text-white rounded-lg text-xs font-bold shadow-sm transition-colors cursor-pointer"
                >
                  {isSubmitting ? "Logging..." : "Log Negotiation Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

