"use client"
import React, { useEffect, useState, useRef } from 'react'
import {
  Handshake,
  TrendingDown,
  TrendingUp,
  Sparkles,
  Shield,
  FileText,
  Copy,
  Check,
  Clock,
  ArrowRight,
  User,
  Building2,
  DollarSign,
  ExternalLink,
  Bot,
  Send,
  Scale,
  Zap,
  RotateCcw,
  Target,
  FileEdit,
  Sliders,
  ChevronRight
} from 'lucide-react'
import {
  getMockCaseValuations,
  getMockNegotiationLogs,
  getMockNegotiationChat,
  createMockNegotiationChatMessage
} from '@/lib/mock-data'
import { useRouter, usePathname } from 'next/navigation'

type NegotiationSubView = 'tracker' | 'assistant';

interface ChatMessage {
  id: string;
  caseId: string;
  firmId: string;
  sender: 'ai' | 'user';
  content: string;
  citation?: string | null;
  letterSnippet?: string;
  createdAt: Date;
}

export function NegotiationTab({ caseData }: { caseData: any }) {
  const firmId = caseData?.firmId || 'firm-1';
  const caseId = caseData?.id || 'case-1';

  const router = useRouter();
  const pathname = usePathname();

  const [activeView, setActiveView] = useState<NegotiationSubView>('tracker');
  const [valuations, setValuations] = useState<any[]>([]);
  const [negotiationLogs, setNegotiationLogs] = useState<any[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (firmId && caseId) {
      setValuations(getMockCaseValuations(firmId, caseId));
      setNegotiationLogs(getMockNegotiationLogs(firmId, caseId));
      setChatMessages(getMockNegotiationChat(firmId, caseId) as ChatMessage[]);
    }
  }, [firmId, caseId]);

  useEffect(() => {
    if (activeView === 'assistant' && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isAiThinking, activeView]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const valuation = valuations[0] || {};
  const defensePressure = valuation.defensePressure || [];
  const strategy = valuation.negotiationStrategy || {};

  // Metrics from Logs
  const demands = negotiationLogs.filter(l => l.type === 'DEMAND' || l.type === 'COUNTER_DEMAND');
  const offers = negotiationLogs.filter(l => l.type === 'OFFER' || l.type === 'COUNTER_OFFER');

  const latestDemand = demands.length > 0 ? demands[demands.length - 1].amount : 145000;
  const latestOffer = offers.length > 0 ? offers[offers.length - 1].amount : 58000;
  const currentSpread = latestDemand - latestOffer;
  const currentMidpoint = (latestDemand + latestOffer) / 2;

  const handleSendChat = (queryText?: string) => {
    const q = (queryText || inputQuery).trim();
    if (!q) return;

    const userMsg: ChatMessage = {
      id: `chat-usr-${Date.now()}`,
      caseId,
      firmId,
      sender: 'user',
      content: q,
      createdAt: new Date()
    };

    createMockNegotiationChatMessage(userMsg);
    setChatMessages(prev => [...prev, userMsg]);
    setInputQuery("");
    setIsAiThinking(true);

    // Dynamic AI response generator based on query intent
    setTimeout(() => {
      let aiResponse = "";
      let citation = null;
      let letterSnippet = undefined;

      const lower = q.toLowerCase();

      if (lower.includes("counter") || lower.includes("next move") || lower.includes("range")) {
        aiResponse = `**Recommended Next Counter Range: $125,000 – $135,000**\n\n` +
          `• **Tactical Justification:** The carrier made a significant jump from $32k to $58k (+81%) in Round 2 after receiving Dr. Grossman's injection records. Moving down modestly to **$135,000** signals reasonable movement while protecting your $95k–$115k target settlement corridor.\n` +
          `• **Mathematical Bracketing:**\n` +
          `  - Plaintiff Round 2: $145,000 → Proposed Round 3: $135,000 (-$10k)\n` +
          `  - Expected Carrier Round 3: $75,000 – $80,000\n` +
          `  - Resulting Midpoint: **$105,000 – $107,500** (Directly in your target zone).\n\n` +
          `• **Direct Instruction:** Do NOT drop below $120,000 until the carrier breaks $80,000.`;
        citation = "Settlement Bracket Model & Round 2 Velocity";
      } else if (lower.includes("gap") || lower.includes("17-day") || lower.includes("17 day")) {
        aiResponse = `**Preemptive Rebuttal for the 17-Day Treatment Gap:**\n\n` +
          `1. **Discharge Instructions:** The NYU Emergency Room discharge note (Page 3) explicitly prescribed bed rest, NSAIDs, and conservative observation before presenting to an orthopedic specialist.\n` +
          `2. **Symptom Latency:** Discogenic radiculopathy frequently exhibits a 7–14 day latency as progressive chemical nerve root inflammation builds post-collision.\n` +
          `3. **Zero Intervening Trauma:** The plaintiff had uninterrupted work absence and zero documented trauma between June 8 and June 25.\n\n` +
          `*Legal Affirmation Draft:* "Debra's delay in orthopedic consultation was strictly compliant with ER discharge self-care instructions and mirrors established spinal biomechanics where cervical disc swelling compresses nerve roots over a 2-week crescendo."`;
        citation = "PD00302BDEAC13B19_Meds_Redacted.pdf (Page 15) & ER Discharge Summary";
      } else if (lower.includes("letter") || lower.includes("draft") || lower.includes("demand")) {
        aiResponse = `Here is a formal counter-demand letter draft customized with this case's objective medical citations and $135,000 anchor:`;
        letterSnippet = `RE: Espinoza v. Commercial Transport Inc.\nClaim No: TRV-2026-8841A\nCarrier: Travelers Commercial Insurance\nAdjuster: Sarah Jenkins\n\nDear Ms. Jenkins,\n\nWe acknowledge receipt of your Round 2 offer of $58,000. While this movement reflects progress, your valuation continues to substantially underestimate the objective surgical severity and unimpeached liability in this matter.\n\nSpecifically, cervical MRI imaging confirms focal disc herniations at C5-C6 and C6-C7 with nerve root impingement that failed conservative modalities and required fluoroscopically-guided epidural steroid injections. Our client has incurred $31,400 in verified economic specials.\n\nUnder New York law and the Eggshell Plaintiff Doctrine, pre-existing dormant degeneration does not discount traumatic herniations. In the spirit of resolving this matter without formal trial preparation, our client authorizes a reduced compromise demand of $135,000.\n\nThis offer remains open for twenty (20) days.\n\nSincerely,\nMike Ross, Esq.`;
        citation = "Formal Policy Demand Builder (firmId: " + firmId + ")";
      } else if (lower.includes("weakness") || lower.includes("carrier") || lower.includes("colossus")) {
        aiResponse = `**Anticipated Claims Algorithm (Colossus / Guidewire) Vulnerabilities:**\n\n` +
          `1. **Interventional Injection Value Unit:** Colossus assigns maximum bodily injury points when fluoroscopy-guided epidural steroid injections are paired with radiating radiculopathy.\n` +
          `2. **Zero Comparative Negligence:** Because the defendant commercial vehicle rear-ended our stopped client at a red light (MV-104), the adjuster cannot apply any comparative fault reduction.\n` +
          `3. **Itemized Wage Loss:** The $4,200 verified lost wage ledger forces the claims algorithm above the soft-tissue multiplier ceiling.`;
        citation = "Colossus / ClaimOutcome Decision Table Analysis";
      } else {
        aiResponse = `**Tactical Settlement Strategy Analysis:**\n\n` +
          `Based on the case file (C5-C7 herniation, $31.4k confirmed specials, Round 2 offer of $58k against $145k demand):\n\n` +
          `• **Current Posture:** Strong Favorable. The carrier has raised authority by $26,000 (+81%) across 2 rounds.\n` +
          `• **Recommended Move:** Serve a formal counter-demand at **$135,000** emphasizing post-gap therapy compliance and the treating surgeon's causation affirmation.\n` +
          `• **Target Outcome:** Settle between **$95,000 and $115,000** (approx 3.0x – 3.6x specials).`;
        citation = "Settlement Intelligence Engine (Active Round 2)";
      }

      const aiMsg: ChatMessage = {
        id: `chat-ai-${Date.now()}`,
        caseId,
        firmId,
        sender: 'ai',
        content: aiResponse,
        citation,
        letterSnippet,
        createdAt: new Date()
      };

      createMockNegotiationChatMessage(aiMsg);
      setChatMessages(prev => [...prev, aiMsg]);
      setIsAiThinking(false);
    }, 1100);
  };

  const quickPrompts = [
    { label: "🎯 Recommend Next Counter", query: "What should our next counteroffer range be based on the carrier's $58k offer?" },
    { label: "🛡️ Rebut 17-Day Gap", query: "How do I refute the adjuster's 17-day treatment gap argument?" },
    { label: "📝 Draft Counter-Demand Letter", query: "Draft a formal counter-demand response letter for $135,000 citing MRI and injections." },
    { label: "🔍 Carrier Claims Model Weaknesses", query: "What are the carrier's algorithm discount weaknesses for this case?" },
    { label: "📊 Calculate Brackets & Midpoint", query: "Calculate expected settlement brackets, midpoint, and velocity across rounds." }
  ];

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-500 font-sans">

      {/* Top Header */}
      <div className="bg-slate-50/90 p-5 md:p-6 border-b border-slate-200 shrink-0 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="bg-teal-900 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <Handshake className="w-3 h-3 text-teal-300" /> Negotiations Tab
              </span>
              <span className="bg-teal-50 text-teal-800 border border-teal-200 text-[11px] font-bold px-2 py-0.5 rounded-full">
                Round {Math.max(1, Math.ceil(negotiationLogs.length / 2))} Active
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Negotiation & Offer Progression
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
              Multi-round offer tracking, statistical bracket analysis, and an AI Negotiation Assistant powered by your case records and carrier claim models.
            </p>
          </div>
        </div>

        {/* Structured Flow Tree Breadcrumb Banner */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs">
          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            <Handshake className="w-3.5 h-3.5 text-teal-700" />
            <span>Negotiations Architecture:</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-700 overflow-x-auto no-scrollbar py-0.5 font-mono">
            <span className="font-extrabold font-sans text-teal-950 px-2.5 py-1 bg-teal-50 rounded-lg border border-teal-200 shrink-0 flex items-center gap-1.5">
              <Handshake className="w-3.5 h-3.5 text-teal-700" />
              Negotiations
            </span>
            <span className="text-slate-400 font-bold">│&nbsp;&nbsp;├──</span>

            <button
              onClick={() => setActiveView('tracker')}
              className={`px-3 py-1 font-sans rounded-lg font-bold text-xs transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${activeView === 'tracker' ? 'bg-teal-900 text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                }`}
            >
              <Sliders className="w-3.5 h-3.5" /> Negotiation Tracker
            </button>

            <span className="text-slate-400 font-bold">└──</span>

            <button
              onClick={() => setActiveView('assistant')}
              className={`px-3 py-1 font-sans rounded-lg font-bold text-xs transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${activeView === 'assistant' ? 'bg-teal-900 text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                }`}
            >
              <Bot className="w-3.5 h-3.5 text-teal-400" /> AI Negotiation Assistant / Chat
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-extrabold ${activeView === 'assistant' ? 'bg-teal-800 text-teal-200' : 'bg-teal-50 text-teal-700 border border-teal-200'}`}>
                Live
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Switcher */}
      <div className="bg-white border-b border-slate-200 px-5 md:px-8 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
        <button
          onClick={() => setActiveView('tracker')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeView === 'tracker'
            ? 'bg-teal-900 text-white shadow-md'
            : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
            }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Negotiation Tracker</span>
        </button>

        <button
          onClick={() => setActiveView('assistant')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeView === 'assistant'
            ? 'bg-teal-900 text-white shadow-md'
            : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
            }`}
        >
          <Bot className="w-4 h-4 text-teal-400" />
          <span>AI Negotiation Assistant / Chat</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${activeView === 'assistant' ? 'bg-teal-800 text-teal-200' : 'bg-teal-50 text-teal-700 border border-teal-200'}`}>
            Live Copilot
          </span>
        </button>
      </div>

      {/* VIEW 1: NEGOTIATION TRACKER */}
      {activeView === 'tracker' && (
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
                <TrendingUp className="w-3 h-3 text-teal-600" /> Active plaintiff anchor (Round 2)
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
                <TrendingDown className="w-3 h-3 text-rose-600" /> Current adjuster authority (+$26k jump)
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
                Narrowed from $143,000 opening spread
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

          {/* 2. Visual Negotiation Bracket & Corridor Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-teal-700" /> Negotiation Trajectory & Target Settlement Corridor
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Visual spread compression across Rounds 1 and 2
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full">
                  Target Zone: $85k – $120k
                </span>
              </div>
            </div>

            <div className="relative pt-6 pb-4 px-2">
              <div className="h-3 bg-slate-100 rounded-full relative shadow-inner overflow-hidden">
                {/* Visual progression bar */}
                <div className="absolute left-[20%] right-[25%] bg-gradient-to-r from-rose-400 via-amber-300 to-teal-500 h-full rounded-full opacity-40"></div>
                <div className="absolute left-[40%] right-[35%] bg-emerald-500 h-full rounded-full" title="Target Settlement Corridor ($85k - $120k)"></div>
              </div>

              {/* Pin markers */}
              <div className="relative flex justify-between text-xs mt-3">
                <div className="text-left">
                  <span className="text-[10px] uppercase font-bold text-rose-600 block">Round 1 Offer</span>
                  <span className="font-extrabold text-slate-800">$32,000</span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] uppercase font-bold text-rose-700 block">Current Offer</span>
                  <span className="font-extrabold text-rose-800">$58,000</span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 block">Target Settlement</span>
                  <span className="font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
                    $95,000 – $115,000
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] uppercase font-bold text-teal-800 block">Current Demand</span>
                  <span className="font-extrabold text-teal-900">$145,000</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Opening Demand</span>
                  <span className="font-extrabold text-slate-700">$175,000</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Round-by-Round Log & Strategy Guidance */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Chronological Negotiation Log (2 Cols) */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Negotiation Round Progression</h3>
                    <p className="text-xs text-slate-500">Demands, carrier counteroffers, and tactical justifications</p>
                  </div>
                </div>
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
                            {log.status === 'ACTIVE' && (
                              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                                Active Position
                              </span>
                            )}
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
                        <span className="font-semibold text-slate-900 shrink-0">Tactical Rationale:</span>
                        <span>{log.notes}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: AI Assistant Connection & Rebuttals */}
            <div className="space-y-6">

              {/* AI Copilot Prompt Card */}
              <div className="bg-gradient-to-br from-teal-900 via-slate-900 to-slate-950 text-white rounded-2xl p-5 shadow-md border border-teal-800/40 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-teal-300 uppercase tracking-wider mb-1">
                    <Bot className="w-4 h-4 text-teal-400" /> AI Strategic Copilot
                  </div>
                  <h4 className="text-base font-bold text-white">
                    Need Advice for Round 3?
                  </h4>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    Ask our AI Negotiation Assistant to calculate concession velocity, draft formal response letters, or generate rebuttals against Travelers' claims algorithms.
                  </p>
                </div>

                <button
                  onClick={() => setActiveView('assistant')}
                  className="mt-4 w-full py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                  <span>Open AI Negotiation Assistant</span>
                </button>
              </div>

              {/* Recommended Next Counter Range */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
                  <Target className="w-4 h-4 text-teal-700" />
                  <span>Recommended Next Move</span>
                </div>
                <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-xl space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-900 block">
                    Target Round 3 Counter
                  </span>
                  <p className="font-black text-xl text-teal-950">
                    $125,000 – $135,000
                  </p>
                  <p className="text-[11px] text-teal-800 leading-relaxed pt-1 border-t border-teal-200/60">
                    Countering at $135k maintains high upward pressure while acknowledging the carrier's $58k movement.
                  </p>
                </div>
              </div>

              {/* Quick Defense Rebuttals */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
                    <Shield className="w-4 h-4 text-teal-700" />
                    <span>Quick Rebuttals</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {defensePressure.slice(0, 2).map((dp: any) => {
                    const isCopied = copiedId === dp.id;
                    return (
                      <div key={dp.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-900">{dp.title}</span>
                          <button
                            onClick={() => copyToClipboard(dp.rebuttal || "", dp.id)}
                            className="text-[10px] font-semibold text-teal-700 flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-teal-200 cursor-pointer hover:bg-teal-50"
                          >
                            {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            {isCopied ? "Copied" : "Copy"}
                          </button>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-2">
                          {dp.rebuttal}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* VIEW 2: AI NEGOTIATION ASSISTANT / CHAT */}
      {activeView === 'assistant' && (
        <div className="flex flex-col flex-1 overflow-hidden bg-slate-50/50">

          {/* Quick Prompts Bar */}
          <div className="bg-white border-b border-slate-200 px-5 md:px-8 py-3 shrink-0 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" /> Quick Prompts:
            </span>
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendChat(p.query)}
                className="px-3 py-1.5 bg-slate-50 hover:bg-teal-50 hover:border-teal-300 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:text-teal-900 transition-all shrink-0 whitespace-nowrap cursor-pointer shadow-2xs"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-4">
            {chatMessages.map((msg) => {
              const isAi = msg.sender === 'ai';
              const isCopied = copiedId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 max-w-4xl ${isAi ? '' : 'ml-auto justify-end'}`}
                >
                  {isAi && (
                    <div className="w-8 h-8 rounded-xl bg-teal-900 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-sm">
                      <Bot className="w-4 h-4 text-teal-300" />
                    </div>
                  )}

                  <div className={`p-4 md:p-5 rounded-2xl shadow-sm text-xs leading-relaxed ${isAi
                    ? 'bg-white border border-slate-200 text-slate-800'
                    : 'bg-teal-900 text-white font-medium max-w-xl'
                    }`}>
                    <div className="whitespace-pre-wrap font-sans">
                      {msg.content}
                    </div>

                    {/* Optional Formal Letter Snippet Block */}
                    {msg.letterSnippet && (
                      <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] text-slate-700 whitespace-pre-wrap relative group">
                        <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-200 font-sans font-bold text-xs text-slate-900">
                          <span className="flex items-center gap-1">
                            <FileEdit className="w-3.5 h-3.5 text-teal-700" /> Formal Policy Demand Letter Draft
                          </span>
                          <button
                            onClick={() => copyToClipboard(msg.letterSnippet || "", `letter-${msg.id}`)}
                            className="text-[10px] font-bold text-teal-800 bg-white hover:bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                          >
                            {copiedId === `letter-${msg.id}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            {copiedId === `letter-${msg.id}` ? "Copied Letter!" : "Copy Letter Text"}
                          </button>
                        </div>
                        {msg.letterSnippet}
                      </div>
                    )}

                    {/* Citation & Copy Actions */}
                    {isAi && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                        {msg.citation ? (
                          <span className="flex items-center gap-1 text-slate-500 font-medium">
                            <FileText className="w-3 h-3 text-teal-600" /> Ref: {msg.citation}
                          </span>
                        ) : <span></span>}

                        <button
                          onClick={() => copyToClipboard(msg.content, msg.id)}
                          className="font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer bg-teal-50 hover:bg-teal-100 px-2 py-0.5 rounded transition-colors"
                        >
                          {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          {isCopied ? "Copied" : "Copy"}
                        </button>
                      </div>
                    )}
                  </div>

                  {!isAi && (
                    <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isAiThinking && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-teal-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  <Bot className="w-4 h-4 text-teal-300" />
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm text-xs text-slate-500 flex items-center gap-2">
                  <span className="w-2 h-2 bg-teal-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-teal-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-teal-600 rounded-full animate-bounce"></span>
                  <span className="font-semibold text-slate-700 ml-1">Analyzing case valuation & drafting negotiation response...</span>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Input Box */}
          <div className="bg-white border-t border-slate-200 p-4 md:p-5 shrink-0">
            <div className="max-w-4xl mx-auto flex items-center gap-2">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSendChat(); }}
                placeholder="Ask strategic question, request letter draft, or test adjuster rebuttal..."
                className="flex-1 px-4 py-3 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 bg-slate-50 font-medium text-slate-800"
              />
              <button
                onClick={() => handleSendChat()}
                disabled={!inputQuery.trim() || isAiThinking}
                className="px-5 py-3 bg-teal-900 hover:bg-teal-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-2">
              AI Negotiation Assistant strictly isolated to firmId: {firmId}. HIPAA compliant zero-breach policy.
            </p>
          </div>

        </div>
      )}

    </div>
  )
}

