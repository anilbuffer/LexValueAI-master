"use client"
import React, { useEffect, useState, useRef } from 'react'
import {
  Handshake,
  Plus,
  Clock,
  Target,
  Sparkles,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Shield,
  Zap,
  CheckCircle2,
  X,
  Scale,
  MessageSquare,
  Send,
  FileText,
  ExternalLink,
  Bot,
  User,
  AlertCircle
} from 'lucide-react'
import { getMockNegotiationLogs, createMockNegotiationLog, getMockCaseValuations } from '@/lib/mock-data'
import { useRouter, usePathname } from 'next/navigation'

type NegotiationView = 'tracker' | 'ai_assistant'

type ChatMessage = {
  id: string
  sender: 'ai' | 'user'
  text: string
  citation?: string
  timestamp: string
}

export function NegotiationTab({ caseData }: { caseData: any }) {
  const firmId = caseData?.firmId || 'firm-1';
  const caseId = caseData?.id || 'case-1';

  const router = useRouter();
  const pathname = usePathname();

  const [activeView, setActiveView] = useState<NegotiationView>('tracker')
  const [logs, setLogs] = useState<any[]>([])
  const [valuations, setValuations] = useState<any[]>([])
  const [isAddingOffer, setIsAddingOffer] = useState(false)
  const [newParty, setNewParty] = useState<'Plaintiff Counsel' | 'Defense Counsel'>('Plaintiff Counsel')
  const [newAmount, setNewAmount] = useState('')
  const [newNotes, setNewNotes] = useState('')

  // Negotiation AI Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'neg-chat-1',
      sender: 'ai',
      text: "Hello! I am your AI Negotiation Assistant. I analyze case chronology, medical records, and defense exposure to help you craft evidence-backed counterarguments for active adjuster negotiations.",
      citation: "Medical Chronology & Records",
      timestamp: "Just now"
    }
  ])
  const [chatInput, setChatInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (firmId && caseId) {
      setLogs(getMockNegotiationLogs(firmId, caseId));
      setValuations(getMockCaseValuations(firmId, caseId));
    }
  }, [firmId, caseId])

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isTyping])

  const val = valuations[0] || {};
  const defensePressure = val.defensePressure || [];
  const valueDrivers = val.valueDrivers || [];
  const strategy = val.negotiationStrategy || {};

  // Derive latest figures
  const latestDemandLog = logs.find(l => l.demandAmount);
  const latestCounterLog = logs.find(l => l.counterOffer);
  const latestDemand = latestDemandLog?.demandAmount || 325000;
  const latestCounter = latestCounterLog?.counterOffer || 175000;
  const currentSpread = Math.abs(latestDemand - latestCounter);
  const currentMidpoint = (latestDemand + latestCounter) / 2;

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(newAmount.replace(/[^0-9.]/g, ''));
    if (!parsedAmount || isNaN(parsedAmount)) return;

    const newLog = {
      id: `neg-${Date.now()}`,
      caseId,
      firmId,
      demandAmount: newParty === 'Plaintiff Counsel' ? parsedAmount : (logs[0]?.demandAmount || null),
      counterOffer: newParty === 'Defense Counsel' ? parsedAmount : (logs[0]?.counterOffer || null),
      party: newParty,
      responseDays: 1,
      date: new Date(),
      notes: newNotes
    };

    createMockNegotiationLog(newLog);
    setLogs([newLog, ...logs]);
    setNewAmount('');
    setNewNotes('');
    setIsAddingOffer(false);
  };

  const handleSendChatMessage = (queryText?: string) => {
    const textToSend = queryText || chatInput.trim();
    if (!textToSend) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    if (!queryText) setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      let aiReply = "Based on the documented records, Debra's subsequent treatment consistently documents functional deficits and persistent cervical radiculopathy.";
      let citation = "PD00302BDEAC13B19_Meds_Redacted.pdf (Page 15, 85)";

      const lower = textToSend.toLowerCase();
      if (lower.includes('gap') || lower.includes('17-day') || lower.includes('treatment gap')) {
        aiReply = "The patient initially attempted conservative bed rest believing the symptoms were a temporary sprain. When radicular pain intensified to her left arm, she sought specialist care on June 25 (Page 15). The subsequent records document 4 months of continuous 3x/week physical therapy and surgical intervention. Zero intervening trauma occurred during the 17 days.";
        citation = "PD00302BDEAC13B19_Meds_Redacted.pdf (Page 15, Page 70-82)";
      } else if (lower.includes('degeneration') || lower.includes('spondylosis') || lower.includes('pre-existing')) {
        aiReply = "Under New York's Eggshell Plaintiff Doctrine, the defendant is liable for the full aggravation of dormant conditions. Prior to June 8, 2018, Debra had zero documented cervical complaints or radicular symptoms across 8 years of primary care records. The trauma transformed an asymptomatic degenerative state into an acute, permanent thecal sac compression.";
        citation = "PD00302BDEAC13B19_Meds_Redacted.pdf (Page 15, Page 85)";
      } else if (lower.includes('property damage') || lower.includes('low impact') || lower.includes('bumper')) {
        aiReply = "Energy-absorbing bumper isolators prevent exterior vehicle crushing by transferring collision kinetic energy through the chassis directly into the driver's spine. Police Report MV-104 confirms the commercial vehicle struck plaintiff at ~35 MPH at a steady red light, causing immediate onset of cervical symptoms.";
        citation = "NYPD_Police_Report_MV104.pdf (Section 2-1)";
      } else if (lower.includes('offer') || lower.includes('response') || lower.includes('counter')) {
        aiReply = "Recommend acknowledging the carrier's movement while firmly rejecting their deduction for pre-existing conditions. Emphasize that the $31,400 in verified economic specials and documented permanent lifting restrictions make lower offers unsustainable in front of a Kings County jury.";
        citation = "Negotiation Playbook & Verified Bills";
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiReply,
        citation,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-500 font-sans">

      {/* Header with Navigation Switcher */}
      <div className="bg-slate-50 p-5 border-b border-slate-200 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-teal-900 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
              <Handshake className="w-3 h-3" /> Case Negotiations
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
            Negotiation Command & AI Assistant
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track active settlement exchange rounds, explore defense arguments, and generate evidence-backed negotiation countermoves.
          </p>
        </div>

        {/* View Switcher & Action Button */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <div className="bg-slate-200/80 p-1 rounded-xl flex items-center">
            <button
              onClick={() => setActiveView('tracker')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${activeView === 'tracker'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              Negotiation Tracker
            </button>
            <button
              onClick={() => setActiveView('ai_assistant')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${activeView === 'ai_assistant'
                ? 'bg-teal-900 text-white shadow-sm'
                : 'text-teal-800 hover:text-teal-950 font-bold'
                }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-400" /> AI Negotiation Assistant
            </button>
          </div>

          {/* <button
            onClick={() => setIsAddingOffer(true)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" /> Log Offer / Demand
          </button> */}
        </div>
      </div>

      {/* Main Container */}
      <div className="p-5 md:p-8 flex-1 overflow-y-auto space-y-6 bg-slate-50/30">

        {/* ================= VIEW 1: NEGOTIATION TRACKER ================= */}
        {activeView === 'tracker' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* 1. Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-teal-700 tracking-wider block mb-1">
                  Target Settlement Corridor
                </span>
                <div className="text-xl font-extrabold text-teal-950">
                  $85,000 – $120,000
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Fair recovery target zone</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-indigo-700 tracking-wider block mb-1">
                  Latest Plaintiff Demand
                </span>
                <div className="text-xl font-extrabold text-indigo-950">
                  ${latestDemand.toLocaleString()}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Active plaintiff anchor</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-rose-600 tracking-wider block mb-1">
                  Latest Carrier Counteroffer
                </span>
                <div className="text-xl font-extrabold text-rose-950">
                  ${latestCounter.toLocaleString()}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Current adjuster offer</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-700 tracking-wider block mb-1">
                  Active Spread / Midpoint
                </span>
                <div className="text-xl font-extrabold text-slate-900">
                  ${currentSpread.toLocaleString()}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Midpoint: ${Math.round(currentMidpoint).toLocaleString()}</p>
              </div>
            </div>

            {/* AI Recommendation Banner */}
            <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-slate-950 text-white rounded-2xl p-6 shadow-md border border-teal-800/40">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300 shrink-0 mt-0.5">
                  <Zap className="w-5 h-5 text-teal-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> AI Recommended Next Move
                    </span>
                    <span className="text-[10px] bg-teal-500/20 text-teal-300 font-semibold px-2 py-0.5 rounded-full">
                      High Leverage
                    </span>
                  </div>
                  <h4 className="text-base md:text-lg font-bold text-white mb-1.5">
                    Maintain Firm Position on Specials & Deploy the 17-Day Gap Rebuttal
                  </h4>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-4xl">
                    The defense's current offer is testing resolve on the 17-day initial treatment gap. Responding with the treating physician's acute symptom onset declaration forces the adjuster to escalate authority to their supervisor.
                  </p>
                </div>
              </div>
            </div>

            {/* Negotiation Exchange History Log */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" /> Complete Negotiation Exchange History
              </h3>

              {!logs.length ? (
                <div className="flex flex-col items-center justify-center p-8 text-slate-400">
                  <Handshake className="w-10 h-10 mb-3 text-slate-300" />
                  <p className="italic text-sm">No negotiation history logged yet.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4 relative">
                  <div className="absolute left-[19px] top-6 bottom-6 w-0.5 bg-slate-200 z-0"></div>

                  {logs.map((log, i) => (
                    <div key={log.id} className="relative z-10 flex gap-4 items-start">
                      <div className={`w-10 h-10 shrink-0 bg-white border-2 ${log.party === 'Plaintiff Counsel' ? 'border-teal-600 text-teal-700' : 'border-rose-500 text-rose-600'
                        } rounded-full flex items-center justify-center font-bold text-xs shadow-sm`}>
                        {logs.length - i}
                      </div>

                      <div className="flex-1 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:border-slate-300 transition-all">
                        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${log.party === 'Plaintiff Counsel' ? 'bg-teal-50 text-teal-800 border border-teal-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                              }`}>
                              {log.party}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">
                              {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>

                          {log.responseDays > 0 && (
                            <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" /> {log.responseDays} days turnaround
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {log.demandAmount && (
                            <div className="p-3 rounded-xl bg-teal-50/50 border border-teal-100">
                              <p className="text-[10px] font-bold text-teal-700 uppercase tracking-wider mb-0.5">Plaintiff Demand</p>
                              <p className="text-lg font-extrabold text-teal-950">
                                ${log.demandAmount.toLocaleString()}
                              </p>
                            </div>
                          )}

                          {log.counterOffer && (
                            <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-100">
                              <p className="text-[10px] font-bold text-rose-700 uppercase tracking-wider mb-0.5">Defense Counteroffer</p>
                              <p className="text-lg font-extrabold text-rose-950">
                                ${log.counterOffer.toLocaleString()}
                              </p>
                            </div>
                          )}
                        </div>

                        {log.notes && (
                          <p className="text-xs text-slate-600 mt-3 pt-2.5 border-t border-slate-100 italic">
                            "{log.notes}"
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= VIEW 2: AI NEGOTIATION ASSISTANT ⭐ ================= */}
        {activeView === 'ai_assistant' && (
          <div className="space-y-6 animate-in fade-in duration-300">

            {/* 1. Current Negotiation Summary */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2.5 mb-4 border-b border-slate-100 pb-3">
                <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                  <Handshake className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Current Negotiation Summary</h3>
                  <p className="text-xs text-slate-500">Live posture analysis based on {logs.length} exchanged rounds</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Current Demand vs. Offer
                  </span>
                  <div className="text-base font-bold text-slate-800">
                    <span className="text-teal-700">${latestDemand.toLocaleString()}</span> vs <span className="text-rose-700">${latestCounter.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Spread: ${currentSpread.toLocaleString()}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Exchange Velocity
                  </span>
                  <div className="text-base font-bold text-slate-800">
                    ~10 Days Average Turnaround
                  </div>
                  <p className="text-xs text-emerald-700 font-medium mt-1">Adjuster actively responding</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Plaintiff Recovery Posture
                  </span>
                  <div className="text-base font-bold text-teal-700">
                    High Favorable Leverage
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Protected by $31.4k confirmed specials</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-teal-50/50 p-3.5 rounded-xl border border-teal-100">
                <strong>AI Posture Assessment:</strong> The defense is testing plaintiff resolve on causation. The AI does not set settlement dollar amounts, but equips counsel with medical evidence to overcome defense discounts.
              </p>
            </div>

            {/* 2. Defense Arguments vs Recommended Response & Supporting Evidence */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Defense Arguments */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 mb-4 border-b border-slate-100 pb-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700">
                      <TrendingDown className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">Active Defense Arguments</h4>
                      <p className="text-xs text-slate-500">Points carrier is raising to justify discounts</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {defensePressure.map((dp: any) => (
                      <div key={dp.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/40">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-slate-800">{dp.title}</span>
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                            {dp.riskLevel} Risk
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {dp.carrierArgument || dp.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommended Response & Supporting Evidence */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 mb-4 border-b border-slate-100 pb-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">Recommended Response & Evidence</h4>
                      <p className="text-xs text-slate-500">Tactical rebuttal points backed by records</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {defensePressure.map((dp: any) => (
                      <div key={dp.id} className="p-3.5 rounded-xl border border-teal-200 bg-teal-50/30">
                        <span className="text-xs font-bold text-teal-900 block mb-1">
                          Countering: {dp.title}
                        </span>
                        <p className="text-xs text-slate-700 leading-relaxed mb-2">
                          {dp.rebuttal}
                        </p>
                        {dp.citation && (
                          <div className="flex items-center justify-between pt-2 border-t border-teal-100 text-[11px]">
                            <span className="text-slate-500 font-medium flex items-center gap-1">
                              <FileText className="w-3 h-3 text-teal-600" /> Supporting Evidence:
                            </span>
                            <button
                              onClick={() => router.push(`${pathname}?tab=chronology`)}
                              className="text-teal-700 font-bold hover:underline flex items-center gap-1"
                            >
                              <span>{dp.citation}</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* 3. Embedded Interactive AI Negotiation Assistant Chat */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[500px]">

              {/* Chat Header */}
              <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">AI Active Negotiation Chat</h4>
                    <p className="text-[11px] text-slate-400">Ask strategic questions and generate evidence-backed countermoves</p>
                  </div>
                </div>
                <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full border border-teal-500/30 font-semibold">
                  Live Case Intelligence
                </span>
              </div>

              {/* Prompt Suggestions Pills */}
              <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
                <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap">Suggested Prompts:</span>
                <button
                  onClick={() => handleSendChatMessage("What can I use to counter the carrier's argument about the treatment gap?")}
                  className="px-3 py-1 bg-white border border-slate-200 hover:border-teal-400 text-slate-700 hover:text-teal-800 rounded-lg text-xs font-medium whitespace-nowrap transition-colors shadow-2xs"
                >
                  "Counter the treatment gap"
                </button>
                <button
                  onClick={() => handleSendChatMessage("What evidence defeats the pre-existing degeneration claim?")}
                  className="px-3 py-1 bg-white border border-slate-200 hover:border-teal-400 text-slate-700 hover:text-teal-800 rounded-lg text-xs font-medium whitespace-nowrap transition-colors shadow-2xs"
                >
                  "Defeat pre-existing claim"
                </button>
                <button
                  onClick={() => handleSendChatMessage("How should we counter low property damage arguments?")}
                  className="px-3 py-1 bg-white border border-slate-200 hover:border-teal-400 text-slate-700 hover:text-teal-800 rounded-lg text-xs font-medium whitespace-nowrap transition-colors shadow-2xs"
                >
                  "Counter low property damage"
                </button>
              </div>

              {/* Chat Message Scroll Window */}
              <div ref={chatScrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/40">
                {chatMessages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 max-w-[88%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-teal-700 text-white' : 'bg-slate-900 text-teal-300'
                      }`}>
                      {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>

                    <div className={`p-4 rounded-2xl text-xs leading-relaxed ${msg.sender === 'user'
                      ? 'bg-teal-900 text-white rounded-tr-none shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                      }`}>
                      <p>{msg.text}</p>

                      {msg.citation && (
                        <div className={`mt-2.5 pt-2 border-t text-[11px] flex items-center gap-1.5 ${msg.sender === 'user' ? 'border-teal-800 text-teal-200' : 'border-slate-100 text-teal-700 font-semibold'
                          }`}>
                          <FileText className="w-3.5 h-3.5" />
                          <span>Source: {msg.citation}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-3 max-w-[80%]">
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-teal-300 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="p-3 bg-white border border-slate-200 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                      <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSendChatMessage(); }}
                  placeholder="Ask AI for negotiation counterarguments and cited evidence..."
                  className="flex-1 text-xs px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-slate-50"
                />
                <button
                  onClick={() => handleSendChatMessage()}
                  disabled={!chatInput.trim() || isTyping}
                  className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl transition-colors shadow-sm flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        )}

        {/* Add Offer Modal */}
        {isAddingOffer && (
          <div className="bg-white border-2 border-teal-500 rounded-2xl p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Handshake className="w-4 h-4 text-teal-600" /> Log Negotiation Move
              </h3>
              <button onClick={() => setIsAddingOffer(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOffer} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Submitting Party
                  </label>
                  <select
                    value={newParty}
                    onChange={(e: any) => setNewParty(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="Plaintiff Counsel">Plaintiff Counsel (Demand)</option>
                    <option value="Defense Counsel">Defense Counsel / Carrier (Offer)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Amount ($ USD)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 300000"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Tactical Notes / Conditions
                </label>
                <input
                  type="text"
                  placeholder="e.g. Demand conditioned on 14-day policy limit disclosure response."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingOffer(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm"
                >
                  Record Move
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  )
}
