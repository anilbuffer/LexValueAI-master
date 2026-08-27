"use client"
import React, { useEffect, useState, useRef } from 'react'
import {
  Target,
  Shield,
  TrendingUp,
  TrendingDown,
  FileText,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Scale,
  Sparkles,
  Cpu,
  Zap,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Database,
  Clock,
  DollarSign,
  Building2,
  ArrowUpRight,
  Handshake,
  Bot,
  Send,
  FileEdit,
  Sliders,
  ChevronRight,
  ArrowRight,
  User
} from 'lucide-react'
import {
  getMockCaseValuations,
  getMockSettlementOutcomes,
  getMockNegotiationLogs,
  getMockNegotiationChat,
  createMockNegotiationChatMessage
} from '@/lib/mock-data'
import { useRouter, usePathname } from 'next/navigation'

type SettlementFlowSection = 'all' | 'analysis' | 'drivers' | 'defense' | 'carrier' | 'strategy';

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

export function CaseValuationTab({ caseData }: { caseData: any }) {
  const firmId = caseData?.firmId || 'firm-1';
  const caseId = caseData?.id || 'case-1';

  const router = useRouter();
  const pathname = usePathname();

  const [activeSection, setActiveSection] = useState<SettlementFlowSection>('all');
  const [valuations, setValuations] = useState<any[]>([]);
  const [negotiationLogs, setNegotiationLogs] = useState<any[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedRebuttalId, setExpandedRebuttalId] = useState<string | null>("dp-1");
  const [showOutcomeDrawer, setShowOutcomeDrawer] = useState(false);
  const [settlementOutcomes, setSettlementOutcomes] = useState<any[]>([]);

  // AI Negotiation Assistant Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (firmId && caseId) {
      setValuations(getMockCaseValuations(firmId, caseId));
      setSettlementOutcomes(getMockSettlementOutcomes(firmId));
      setNegotiationLogs(getMockNegotiationLogs(firmId, caseId));
      setChatMessages(getMockNegotiationChat(firmId, caseId) as ChatMessage[]);
    }
  }, [firmId, caseId]);

  useEffect(() => {
    if (activeSection === 'strategy' && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isAiThinking, activeSection]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

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

    setTimeout(() => {
      let aiResponse = "";
      let citation = null;
      let letterSnippet = undefined;

      const lower = q.toLowerCase();

      if (lower.includes("counter") || lower.includes("next move") || lower.includes("range")) {
        aiResponse = `**Recommended Next Counter Range: $125,000 – $135,000**\n\n` +
          `• **Tactical Justification:** The carrier made an 81% jump from $32,000 to $58,000 in Round 2 upon receiving Dr. Grossman's fluoroscopic injection records. Moving down modestly to **$135,000** signals measured progress while strictly defending your $95,000–$115,000 settlement corridor.\n` +
          `• **Mathematical Bracketing:**\n` +
          `  - Plaintiff Round 2 Demand: $145,000 → Proposed Round 3: $135,000 (-$10k)\n` +
          `  - Expected Carrier Round 3 Counter: $78,000 – $84,000\n` +
          `  - Implied Settlement Midpoint: **$106,500 – $109,500** (Direct center of target zone).\n\n` +
          `• **Rule of Engagement:** Do NOT drop below $120,000 until Travelers breaks through the $80,000 barrier.`;
        citation = "Settlement Bracket Analysis & Round 2 Concession Velocity";
      } else if (lower.includes("gap") || lower.includes("17-day") || lower.includes("17 day")) {
        aiResponse = `**Preemptive Neutralization for the 17-Day Treatment Gap:**\n\n` +
          `1. **Discharge Compliance:** NYU ER discharge records (Page 3) explicitly instructed patient to self-isolate, rest, and use prescribed NSAIDs before presenting to orthopedic specialists.\n` +
          `2. **Spinal Biomechanics Latency:** Discogenic radiculopathy frequently presents with progressive 7–14 day chemical swelling as inflammatory cascades compress nerve roots post-impact.\n` +
          `3. **Zero Intervening Trauma:** Plaintiff maintained uninterrupted work absence and zero documented intervening trauma between June 8 and June 25.\n\n` +
          `*Legal Affirmation Draft:* "Debra's delay in orthopedic consultation was strictly compliant with ER discharge self-care instructions and mirrors established spinal biomechanics where cervical disc swelling compresses nerve roots over a 2-week crescendo."`;
        citation = "PD00302BDEAC13B19_Meds_Redacted.pdf (Page 15) & ER Discharge Summary";
      } else if (lower.includes("letter") || lower.includes("draft") || lower.includes("demand")) {
        aiResponse = `Here is the formal counter-demand response letter customized with verified MRI citations and the $135,000 anchor:`;
        letterSnippet = `RE: Espinoza v. Commercial Transport Inc.\nClaim No: TRV-2026-8841A\nCarrier: Travelers Commercial Insurance\nAdjuster: Sarah Jenkins\n\nDear Ms. Jenkins,\n\nWe acknowledge receipt of your Round 2 offer of $58,000. While this movement reflects progress, your valuation continues to substantially underestimate the objective surgical severity and unimpeached liability in this matter.\n\nSpecifically, cervical MRI imaging confirms focal disc herniations at C5-C6 and C6-C7 with nerve root impingement that failed conservative modalities and required fluoroscopically-guided epidural steroid injections. Our client has incurred $31,400 in verified economic specials.\n\nUnder New York law and the Eggshell Plaintiff Doctrine, pre-existing dormant degeneration does not discount traumatic herniations. In the spirit of resolving this matter without formal trial preparation, our client authorizes a reduced compromise demand of $135,000.\n\nThis offer remains open for twenty (20) days.\n\nSincerely,\nMike Ross, Esq.`;
        citation = "Formal Policy Demand Builder (firmId: " + firmId + ")";
      } else if (lower.includes("weakness") || lower.includes("carrier") || lower.includes("colossus")) {
        aiResponse = `**Anticipated Claims Algorithm (Colossus / Guidewire) Vulnerabilities:**\n\n` +
          `1. **Interventional Injection Value Unit:** Colossus assigns maximum bodily injury points when fluoroscopy-guided epidural steroid injections are paired with radiating radiculopathy.\n` +
          `2. **Zero Comparative Negligence:** Because the defendant commercial vehicle rear-ended our stopped client at a red light (MV-104), the adjuster cannot apply any comparative fault reduction.\n` +
          `3. **Itemized Wage Loss:** The $4,200 verified lost wage ledger forces the claims algorithm above the soft-tissue multiplier ceiling.`;
        citation = "Colossus / ClaimOutcome Decision Table Analysis";
      } else {
        aiResponse = `**Tactical Settlement Strategy Directive:**\n\n` +
          `Based on the indexed file (C5-C7 focal herniations, $31,400 itemized specials, Round 2 offer of $58,000 vs $145,000 demand):\n\n` +
          `• **Current Posture:** Strong Favorable. The carrier has raised authority by $26,000 (+81%) across 2 rounds.\n` +
          `• **Recommended Move:** Serve a formal counter-demand at **$135,000** emphasizing post-gap therapy compliance and the treating surgeon's causation affirmation.\n` +
          `• **Target Corridor:** Settle between **$95,000 and $115,000** (approx 3.0x – 3.6x specials).`;
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
    }, 1000);
  };

  const quickPrompts = [
    { label: "🎯 Recommend Next Counter", query: "What should our next counteroffer range be based on the carrier's $58k offer?" },
    { label: "🛡️ Rebut 17-Day Gap", query: "How do I refute the adjuster's 17-day treatment gap argument?" },
    { label: "📝 Draft Counter-Demand Letter", query: "Draft a formal counter-demand response letter for $135,000 citing MRI and injections." },
    { label: "🔍 Carrier Claims Model Weaknesses", query: "What are the carrier's algorithm discount weaknesses for this case?" },
    { label: "📊 Calculate Brackets & Midpoint", query: "Calculate expected settlement brackets, midpoint, and velocity across rounds." }
  ];

  if (!valuations.length) {
    return (
      <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-500 font-sans">
        <div className="bg-slate-50 p-5 border-b border-slate-200 shrink-0">
          <h2 className="text-2xl font-bold text-slate-800">Settlement & Negotiation Analysis</h2>
          <p className="text-sm text-slate-500 mt-1">Structured 5-part qualitative settlement intelligence and negotiation flow</p>
        </div>
        <div className="flex flex-col items-center justify-center p-12 text-slate-400 flex-1">
          <Target className="w-12 h-12 mb-4 text-slate-300" />
          <p className="italic">No settlement intelligence generated for this case yet.</p>
        </div>
      </div>
    );
  }

  const baseVal = valuations[0];
  const valueDrivers = baseVal.valueDrivers || [];
  const defensePressure = baseVal.defensePressure || [];
  const carrierModel = baseVal.carrierModel || {
    discountFactorsApplied: []
  };
  const strategy = baseVal.negotiationStrategy || {};

  // Metrics from Logs
  const demands = negotiationLogs.filter(l => l.type === 'DEMAND' || l.type === 'COUNTER_DEMAND');
  const offers = negotiationLogs.filter(l => l.type === 'OFFER' || l.type === 'COUNTER_OFFER');

  const latestDemand = demands.length > 0 ? demands[demands.length - 1].amount : 145000;
  const latestOffer = offers.length > 0 ? offers[offers.length - 1].amount : 58000;
  const currentSpread = latestDemand - latestOffer;
  const currentMidpoint = (latestDemand + latestOffer) / 2;

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-500 font-sans">

      {/* TOP MASTER HEADER & FLOW HIERARCHY */}
      <div className="bg-slate-50/95 p-5 md:p-6 border-b border-slate-200 shrink-0 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="bg-teal-900 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3 text-teal-300" /> Flagship Engine
              </span>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Handshake className="w-3 h-3 text-emerald-600" /> Settlement & Negotiation Analysis
              </span>
              <span className="bg-slate-200/80 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                Round {Math.max(1, Math.ceil(negotiationLogs.length / 2))} Active
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Settlement & Negotiation Analysis
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
              Complete qualitative valuation and strategic negotiation flow: Settlement Analysis → Value Drivers → Defense Pressure → Carrier Position → Negotiation Strategy.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => router.push(`${pathname}?tab=negotiation`)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200/80 shadow-sm transition-all cursor-pointer"
            >
              <Handshake className="w-3.5 h-3.5 text-teal-700" />
              <span>Negotiation Tracker</span>
            </button>
            <button
              onClick={() => setShowOutcomeDrawer(!showOutcomeDrawer)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200/80 shadow-sm transition-all cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-teal-700" />
              <span>Outcome Moat ({settlementOutcomes.length})</span>
            </button>
            <button
              onClick={() => copyToClipboard(strategy.headline || "", "headline-copy-top")}
              className="flex items-center gap-1.5 px-3 py-2 bg-teal-50 hover:bg-teal-100 text-teal-900 text-xs font-bold rounded-xl border border-teal-200/80 shadow-sm transition-all cursor-pointer"
            >
              {copiedId === "headline-copy-top" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-teal-700" />}
              <span>{copiedId === "headline-copy-top" ? "Copied Directives!" : "Copy Directives"}</span>
            </button>
          </div>
        </div>

        {/* Structured Flow Breadcrumb Banner (Tree Hierarchy Visualization) */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs">
          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-teal-700" />
            <span>Settlement Intelligence Flow Architecture:</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-700 overflow-x-auto no-scrollbar py-0.5">
            <span className="font-extrabold text-teal-950 px-2 py-1 bg-teal-50 rounded-lg border border-teal-200 shrink-0">
              Settlement Intelligence
            </span>
            <span className="text-slate-300 font-bold">└──</span>

            <button
              onClick={() => setActiveSection('analysis')}
              className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all shrink-0 cursor-pointer flex items-center gap-1 ${activeSection === 'analysis' ? 'bg-teal-900 text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                }`}
            >
              <Scale className="w-3 h-3" /> Settlement Analysis
            </button>

            <span className="text-slate-300 font-bold">└──</span>

            <button
              onClick={() => setActiveSection('drivers')}
              className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all shrink-0 cursor-pointer flex items-center gap-1 ${activeSection === 'drivers' ? 'bg-teal-900 text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                }`}
            >
              <TrendingUp className="w-3 h-3" /> Value Drivers
            </button>

            <span className="text-slate-300 font-bold">└──</span>

            <button
              onClick={() => setActiveSection('defense')}
              className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all shrink-0 cursor-pointer flex items-center gap-1 ${activeSection === 'defense' ? 'bg-teal-900 text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                }`}
            >
              <TrendingDown className="w-3 h-3" /> Defense Pressure
            </button>

            <span className="text-slate-300 font-bold">└──</span>

            <button
              onClick={() => setActiveSection('carrier')}
              className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all shrink-0 cursor-pointer flex items-center gap-1 ${activeSection === 'carrier' ? 'bg-teal-900 text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                }`}
            >
              <Cpu className="w-3 h-3" /> Carrier Position
            </button>

            <span className="text-slate-300 font-bold">└──</span>

            <button
              onClick={() => setActiveSection('strategy')}
              className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all shrink-0 cursor-pointer flex items-center gap-1 ${activeSection === 'strategy' ? 'bg-teal-900 text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                }`}
            >
              <Target className="w-3 h-3" /> Negotiation Strategy
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs Bar */}
      <div className="bg-white border-b border-slate-200 px-5 md:px-8 py-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        <button
          onClick={() => setActiveSection('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${activeSection === 'all'
            ? 'bg-teal-900 text-white shadow-sm'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
        >
          🌟 All Sections (Complete Flow)
        </button>

        <button
          onClick={() => setActiveSection('analysis')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${activeSection === 'analysis'
            ? 'bg-teal-900 text-white shadow-sm'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
        >
          <Scale className="w-3.5 h-3.5" />
          1. Settlement Analysis
        </button>

        <button
          onClick={() => setActiveSection('drivers')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${activeSection === 'drivers'
            ? 'bg-teal-900 text-white shadow-sm'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          2. Value Drivers ({valueDrivers.length})
        </button>

        <button
          onClick={() => setActiveSection('defense')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${activeSection === 'defense'
            ? 'bg-teal-900 text-white shadow-sm'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
        >
          <TrendingDown className="w-3.5 h-3.5" />
          3. Defense Pressure ({defensePressure.length})
        </button>

        <button
          onClick={() => setActiveSection('carrier')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${activeSection === 'carrier'
            ? 'bg-teal-900 text-white shadow-sm'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          4. Carrier Position
        </button>

        <button
          onClick={() => setActiveSection('strategy')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${activeSection === 'strategy'
            ? 'bg-teal-900 text-white shadow-sm'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
        >
          <Target className="w-3.5 h-3.5" />
          5. Negotiation Strategy
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="p-5 md:p-8 flex-1 overflow-y-auto space-y-8 bg-slate-50/30">

        {/* ========================================================================= */}
        {/* SECTION 1: SETTLEMENT ANALYSIS (└── Settlement Analysis) */}
        {/* ========================================================================= */}
        {(activeSection === 'all' || activeSection === 'analysis') && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-7 shadow-sm space-y-6">

            {/* Header / Flow Indicator */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-teal-100 text-teal-900">
                    Settlement Intelligence └── Section 1
                  </span>
                  <span className="text-xs font-semibold text-slate-400">Directional Weight Balance</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-teal-700" />
                  Settlement Analysis: Directional Leverage Spectrum
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  High upward surgical value drivers overpower secondary defense discount arguments.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-teal-50 text-teal-900 border border-teal-200 flex items-center gap-1.5 shadow-2xs">
                  <TrendingUp className="w-4 h-4 text-teal-700" /> Net Direction: Strong Positive Value
                </span>
              </div>
            </div>

            {/* Directional Spectrum Bar */}
            <div className="pt-2 pb-2">
              <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex relative shadow-inner">
                <div className="w-[15%] bg-rose-400 opacity-80 h-full" title="Defense Resistant"></div>
                <div className="w-[15%] bg-amber-300 h-full" title="Moderate Disputed"></div>
                <div className="w-[45%] bg-gradient-to-r from-teal-500 to-emerald-500 h-full relative" title="Strong Favorable (Current Posture)">
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
                <div className="w-[25%] bg-indigo-600 opacity-90 h-full" title="Dominant Surgical Leverage"></div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-xs mt-3">
                <div className="text-left">
                  <span className="text-[10px] uppercase font-bold text-rose-600 block">Defense Resistant</span>
                  <span className="font-medium text-slate-500 text-[11px]">Disputed Causation</span>
                </div>
                <div className="text-left md:text-center">
                  <span className="text-[10px] uppercase font-bold text-amber-700 block">Moderate Disputed</span>
                  <span className="font-medium text-slate-500 text-[11px]">Uncorroborated Gaps</span>
                </div>
                <div className="text-left md:text-center">
                  <span className="text-[10px] uppercase font-bold text-teal-800 block">Strong Favorable (Active)</span>
                  <span className="font-bold text-teal-900 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 inline-block text-[11px]">
                    Objective MRI + Injections
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-indigo-700 block">Dominant Leverage</span>
                  <span className="font-medium text-indigo-900 text-[11px]">Surgical Recommendation</span>
                </div>
              </div>
            </div>

            {/* Core Settlement Metric Scorecards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
                  Case Confidence Rating
                </span>
                <span className="text-xl font-black text-slate-900">94% Confidence</span>
                <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> High factual verification index
                </p>
              </div>

              <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
                  Economic Specials Base
                </span>
                <span className="text-xl font-black text-slate-900">$31,400 Itemized</span>
                <p className="text-[11px] text-slate-500 mt-1">
                  $27,200 Medicals + $4,200 Wages
                </p>
              </div>

              <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
                  Liability Assessment
                </span>
                <span className="text-lg font-black text-teal-800">The Evidence Supports Zero Comparative</span>
                <p className="text-[11px] text-slate-500 mt-1">
                  Stationary at red light (MV-104)
                </p>
              </div>

              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200">
                <span className="text-[10px] uppercase font-bold text-emerald-900 block mb-0.5">
                  Target Settlement Corridor
                </span>
                <span className="text-xl font-black text-emerald-950">$95,000 – $115,000</span>
                <p className="text-[11px] text-emerald-800 mt-1">
                  3.0x – 3.6x economic specials multiplier
                </p>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 2 & 3: VALUE DRIVERS & DEFENSE PRESSURE */}
        {/* ========================================================================= */}
        {(activeSection === 'all' || activeSection === 'drivers' || activeSection === 'defense') && (
          <div className={`grid grid-cols-1 ${activeSection === 'all' ? 'lg:grid-cols-2' : ''} gap-6`}>

            {/* VALUE DRIVERS (└── Value Drivers) */}
            {(activeSection === 'all' || activeSection === 'drivers') && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-teal-100 text-teal-900">
                          Settlement Intelligence └── Section 2
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-slate-900">Value Drivers</h4>
                          <p className="text-xs text-slate-500">Factors strengthening plaintiff posture with source citations</p>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-full">
                      {valueDrivers.length} Identified
                    </span>
                  </div>

                  <div className="space-y-3">
                    {valueDrivers.map((driver: any) => (
                      <div
                        key={driver.id}
                        className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/40 hover:bg-white hover:border-teal-300 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                              ✓
                            </span>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h5 className="text-sm font-bold text-slate-900">{driver.title}</h5>
                                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                                  {driver.category}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{driver.detail}</p>
                            </div>
                          </div>
                          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md shrink-0 ${driver.impactLevel === 'High' || driver.impact?.includes('High')
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold'
                            : 'bg-teal-50 text-teal-800 border border-teal-200'
                            }`}>
                            {driver.impactLevel ? `+${driver.impactLevel} Weight` : (driver.impact || '+High Weight')}
                          </span>
                        </div>

                        {driver.citation && (
                          <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                            <span className="text-slate-500 flex items-center gap-1 font-medium">
                              <FileText className="w-3 h-3 text-teal-600" /> Source Reference:
                            </span>
                            <button
                              onClick={() => router.push(`${pathname}?tab=chronology`)}
                              className="font-semibold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-2 py-0.5 rounded transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <span>{driver.citation}</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 p-3 bg-teal-50/60 rounded-xl border border-teal-100 flex items-center gap-2 text-xs text-teal-900 font-medium">
                  <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Positive value drivers provide the factual foundation for demand letters and negotiation posture.</span>
                </div>
              </div>
            )}

            {/* DEFENSE PRESSURE (└── Defense Pressure) */}
            {(activeSection === 'all' || activeSection === 'defense') && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-rose-100 text-rose-900">
                          Settlement Intelligence └── Section 3
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700">
                          <TrendingDown className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-slate-900">Defense Pressure</h4>
                          <p className="text-xs text-slate-500">Carrier exploit weaknesses ranked by exposure impact</p>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full">
                      {defensePressure.length} Ranked Vulnerabilities
                    </span>
                  </div>

                  <div className="space-y-3">
                    {defensePressure.map((pressure: any) => {
                      const isExpanded = expandedRebuttalId === pressure.id;
                      const isCopied = copiedId === pressure.id;

                      return (
                        <div
                          key={pressure.id}
                          className={`p-3.5 rounded-xl border transition-all ${isExpanded ? 'border-rose-300 bg-rose-50/20 shadow-md' : 'border-slate-200/80 bg-slate-50/40'
                            }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2.5">
                              <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                                !
                              </span>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h5 className="text-sm font-bold text-slate-900">{pressure.title}</h5>
                                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${pressure.riskLevel === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                                    }`}>
                                    Damage Rank: {pressure.riskLevel || 'Moderate'}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{pressure.detail}</p>
                              </div>
                            </div>

                            <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-rose-50 text-rose-800 border border-rose-200 shrink-0">
                              {pressure.impactLevel ? `-${pressure.impactLevel} Impact` : (pressure.impact || '-Moderate')}
                            </span>
                          </div>

                          {/* Rebuttal Toggle */}
                          <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                            <button
                              onClick={() => setExpandedRebuttalId(isExpanded ? null : pressure.id)}
                              className="flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-800 cursor-pointer"
                            >
                              <Zap className="w-3.5 h-3.5 text-teal-600" />
                              {isExpanded ? "Hide Preemptive Neutralization" : "View Preemptive Rebuttal"}
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>

                            {pressure.citation && (
                              <button
                                onClick={() => router.push(`${pathname}?tab=chronology`)}
                                className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                              >
                                <span>Ref: {pressure.citation}</span>
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          {/* Rebuttal text */}
                          {isExpanded && pressure.rebuttal && (
                            <div className="mt-2.5 p-3 bg-white border border-teal-200 rounded-xl">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-bold uppercase text-teal-800 flex items-center gap-1">
                                  <Shield className="w-3 h-3 text-teal-600" /> Tactical Neutralization Strategy:
                                </span>
                                <button
                                  onClick={() => copyToClipboard(pressure.rebuttal, pressure.id)}
                                  className="text-[10px] font-semibold text-teal-700 flex items-center gap-1 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 cursor-pointer"
                                >
                                  {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                  {isCopied ? "Copied!" : "Copy"}
                                </button>
                              </div>
                              <p className="text-xs text-slate-700 leading-relaxed font-normal">
                                {pressure.rebuttal}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 p-3 bg-rose-50/60 rounded-xl border border-rose-100 flex items-center gap-2 text-xs text-rose-900 font-medium">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Preemptive rebuttals prevent adjusters from applying compound deductions during negotiations.</span>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 4: CARRIER POSITION (└── Carrier Position) */}
        {/* ========================================================================= */}
        {(activeSection === 'all' || activeSection === 'carrier') && (
          <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-7 shadow-lg border border-slate-800 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                    Settlement Intelligence └── Section 4
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-indigo-400" />
                  <h4 className="text-lg font-bold text-white tracking-tight">
                    Anticipated Carrier Position
                  </h4>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Claims algorithm profile ({carrierModel.softwarePredictedName}) and specific discount arguments the adjuster will lead with.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Engine</span>
                  <span className="text-xs font-bold text-teal-400">{carrierModel.softwarePredictedName || "Colossus / Guidewire"}</span>
                </div>
                <div className="bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Adjuster Posture</span>
                  <span className="text-xs font-bold text-rose-400">Alternative Causation</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {carrierModel.discountFactorsApplied?.map((item: any, idx: number) => (
                <div key={idx} className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-xs font-bold text-white">{item.factor}</h5>
                      <span className="text-[10px] font-extrabold text-rose-400 bg-rose-950/60 border border-rose-800/50 px-2 py-0.5 rounded">
                        {item.impact}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.reason}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-700/50 text-[10px] text-teal-300 font-semibold flex items-center gap-1">
                    <Shield className="w-3 h-3 text-teal-400 shrink-0" /> Preempt in demand & round 1 counter
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 5: NEGOTIATION STRATEGY (└── Negotiation Strategy) */}
        {/* ========================================================================= */}
        {(activeSection === 'all' || activeSection === 'strategy') && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-teal-100 text-teal-900">
                    Settlement Intelligence └── Section 5
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">Negotiation Strategy Playbook & Execution</h4>
                    <p className="text-xs text-slate-500">Tactical playbook, round-by-round trajectory tracker, and live AI Negotiation Assistant</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(strategy.headline || "", "strategy-headline")}
                  className="text-xs font-semibold text-slate-600 hover:text-teal-800 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-teal-50 transition-colors cursor-pointer"
                >
                  {copiedId === "strategy-headline" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === "strategy-headline" ? "Copied!" : "Copy Directives"}
                </button>
              </div>
            </div>

            {/* Master Strategic Directive Box */}
            <div className="bg-gradient-to-r from-teal-50 via-indigo-50 to-slate-50 border-2 border-teal-200/80 rounded-2xl p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-teal-900 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-sm">
                  AI
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-950 block mb-1">
                    Master Settlement Strategy Directive
                  </span>
                  <p className="text-sm md:text-[15px] font-semibold text-slate-800 leading-relaxed">
                    "{strategy.headline || "Do not lead heavily with the MRI alone because degenerative findings give the carrier an alternative-causation argument. Emphasize symptom onset, treatment consistency after the gap, injections and functional limitations."}"
                  </p>
                </div>
              </div>
            </div>

            {/* 3 Pillars of Strategy */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* What to Emphasize */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 flex flex-col">
                <div className="flex items-center gap-2 mb-3 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>What to Emphasize</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-700 leading-relaxed flex-1">
                  {(strategy.whatToEmphasize || [
                    "Consistent treatment and strict compliance following the initial 17-day period.",
                    "Documented functional limitations: inability to lift overhead or perform occupational tasks.",
                    "Invasive interventional procedures: cervical epidural steroid injections.",
                    "Unimpeached liability: commercial vehicle striking stationary car at red light."
                  ]).map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 bg-white/80 p-2.5 rounded-lg border border-emerald-100">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What NOT to Lead With */}
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 flex flex-col">
                <div className="flex items-center gap-2 mb-3 text-amber-900 font-bold text-xs uppercase tracking-wider">
                  <XCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>What to Avoid Leading With</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-700 leading-relaxed flex-1">
                  {(strategy.whatNotToLeadWith || [
                    "Do not lead primarily with isolated MRI radiologist notes regarding spondylosis without immediately pairing with the Eggshell Plaintiff brief.",
                    "Avoid opening debates regarding vehicle bumper repair costs; pivot directly to occupant kinetic transfer physics."
                  ]).map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 bg-white/80 p-2.5 rounded-lg border border-amber-100">
                      <span className="text-amber-600 font-bold mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* How to Preempt Defense Arguments */}
              <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 flex flex-col">
                <div className="flex items-center gap-2 mb-3 text-indigo-900 font-bold text-xs uppercase tracking-wider">
                  <Shield className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>How to Preempt Defense</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-700 leading-relaxed flex-1">
                  {(strategy.howToRespondToDefense || [
                    "Counter the 17-day treatment gap by presenting the initial ER discharge instructions and treating physician onset timeline.",
                    "Counter pre-existing degeneration with proof of zero pre-collision cervical treatment across 8 years of primary care records.",
                    "Neutralize low property damage arguments using biomechanical bumper isolator elasticity mechanics."
                  ]).map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 bg-white/80 p-2.5 rounded-lg border border-indigo-100">
                      <span className="text-indigo-600 font-bold mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Key Leverage Points */}
            {strategy.keyLeveragePoints && (
              <div className="pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-teal-600" /> Key Leverage Points For Settlement Negotiations
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {strategy.keyLeveragePoints.map((point: string, i: number) => (
                    <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                      <span className="text-teal-600 font-bold text-sm shrink-0">✓</span>
                      <span className="text-xs text-slate-700 leading-relaxed font-medium">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-MODULE A: NEGOTIATION TRACKER & ROUND PROGRESSION */}
            <div className="pt-6 border-t border-slate-200 space-y-6">

              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Handshake className="w-4 h-4 text-teal-700" />
                    Round Progression & Trajectory Tracker
                  </h4>
                  <p className="text-xs text-slate-500">Live multi-round demands, offers, spread compression, and midpoint calculation</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-teal-50 text-teal-900 border border-teal-200 rounded-full w-fit">
                  Spread Narrowed by $56,000
                </span>
              </div>

              {/* 4 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4">
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

                <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4">
                  <span className="text-[10px] uppercase font-bold text-rose-700 tracking-wider block mb-1">
                    Latest Carrier Offer
                  </span>
                  <div className="text-2xl font-black text-rose-950">
                    ${latestOffer.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <TrendingDown className="w-3 h-3 text-rose-600" /> Adjuster authority (+$26k jump)
                  </p>
                </div>

                <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4">
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

                <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4">
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

              {/* Visual Corridor Bar */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-teal-700" /> Settlement Corridor Trajectory
                  </span>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full w-fit">
                    Target Corridor: $95,000 – $115,000
                  </span>
                </div>

                <div className="relative pt-5 pb-3 px-2">
                  <div className="h-3 bg-slate-200 rounded-full relative shadow-inner overflow-hidden">
                    <div className="absolute left-[20%] right-[25%] bg-gradient-to-r from-rose-400 via-amber-300 to-teal-500 h-full rounded-full opacity-40"></div>
                    <div className="absolute left-[40%] right-[35%] bg-emerald-500 h-full rounded-full" title="Target Settlement Corridor"></div>
                  </div>

                  <div className="relative flex justify-between text-xs mt-3 flex-wrap gap-2">
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
                        $95k – $115k
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

              {/* Round Progression List */}
              <div className="space-y-3">
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

            {/* SUB-MODULE B: LIVE AI NEGOTIATION ASSISTANT / COPILOT */}
            <div className="pt-6 border-t border-slate-200 space-y-4">

              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-teal-700" />
                    <h4 className="text-base font-bold text-slate-900">AI Negotiation Assistant & Live Copilot</h4>
                  </div>
                  <p className="text-xs text-slate-500">Ask strategic questions, calculate concession velocity, or generate formal counter-demand letters</p>
                </div>
                <span className="text-[10px] px-2.5 py-1 rounded-full font-extrabold bg-teal-50 text-teal-800 border border-teal-200 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse"></span>
                  Active Copilot
                </span>
              </div>

              {/* Quick Prompts */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
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

              {/* Chat Stream Box */}
              <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 md:p-5 max-h-[420px] overflow-y-auto space-y-4">
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

                        {/* Optional Letter Snippet */}
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

                        {/* Citations & Copy */}
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

              {/* Chat Input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSendChat(); }}
                  placeholder="Ask strategic question, request letter draft, or test adjuster rebuttal..."
                  className="flex-1 px-4 py-3 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 bg-white font-medium text-slate-800"
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

            </div>

          </div>
        )}

      </div>

      {/* DRAWER: SETTLEMENT OUTCOME LOG (DATA MOAT) */}
      {showOutcomeDrawer && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-end animate-in fade-in">
          <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-teal-700" />
                  <h3 className="text-lg font-bold text-slate-900">Settlement Outcome Log & Data Moat</h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Proprietary closed-case outcome dataset building real firm valuation intelligence
                </p>
              </div>
              <button
                onClick={() => setShowOutcomeDrawer(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="my-4 p-4 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 leading-relaxed">
              <span className="font-bold block mb-1">Your Firm's Settlement Data Moat</span>
              By logging every settled case, you accumulate proprietary settlement metrics (demands, offer curves, time-to-settle, and multiples over specials) that cannot be replicated from public records.
            </div>

            <div className="space-y-4 flex-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Closed Cases in Dataset ({settlementOutcomes.length})
              </h4>

              {settlementOutcomes.map((item: any) => (
                <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white transition-all shadow-sm">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h5 className="text-sm font-bold text-slate-900">{item.caseTitle}</h5>
                      <span className="text-xs text-slate-500">{item.injuryType} • {item.jurisdiction}</span>
                    </div>
                    <span className="text-sm font-extrabold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-lg">
                      ${item.finalSettlement.toLocaleString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 my-3 py-2.5 bg-white rounded-lg border border-slate-100 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Demand</span>
                      <span className="font-semibold text-slate-700">${item.openingDemand.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Specials</span>
                      <span className="font-semibold text-slate-700">${item.medicalSpecials.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Multiple / Time</span>
                      <span className="font-bold text-teal-700">{item.settlementRatio}x • {item.timeToSettleDays}d</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 italic">
                    "{item.notes}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
