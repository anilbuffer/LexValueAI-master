"use client"
import React, { useEffect, useState, useRef } from 'react'
import {
  Handshake,
  TrendingDown,
  Sparkles,
  Bot,
  User,
  Send,
  Shield,
  FileText,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react'
import { getMockCaseValuations } from '@/lib/mock-data'
import { useRouter, usePathname } from 'next/navigation'

interface ChatMessage {
  id: string
  sender: 'user' | 'ai'
  text: string
  citation?: string
  timestamp: string
}

export function NegotiationTab({ caseData }: { caseData: any }) {
  const firmId = caseData?.firmId || 'firm-1';
  const caseId = caseData?.id || 'case-1';

  const router = useRouter();
  const pathname = usePathname();

  const [valuations, setValuations] = useState<any[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const [chatInput, setChatInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatScrollRef = useRef<HTMLDivElement>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: "Hello! I am your AI Negotiation Assistant. Based on this case's medical records, chronology, and specials ledger ($31,400 confirmed), I can generate evidence-backed counterarguments to overcome defense discounts. Click a suggested prompt below or type your question.",
      timestamp: '10:00 AM'
    }
  ])

  useEffect(() => {
    if (firmId && caseId) {
      setValuations(getMockCaseValuations(firmId, caseId));
    }
  }, [firmId, caseId])

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isTyping])

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const valuation = valuations[0] || {};
  const defensePressure = valuation.defensePressure || [];

  const latestDemand = 175000;
  const latestCounter = 45000;
  const currentSpread = latestDemand - latestCounter;
  const currentMidpoint = (latestDemand + latestCounter) / 2;

  const suggestedPrompts = [
    {
      label: "Counter the 17-Day Gap",
      query: "How should I counter the adjuster's claim that the 17-day gap in treatment breaks causation?",
      response: "Emphasize that the plaintiff reported acute neck pain at the scene and in the ER discharge notes. The 17-day period before physical therapy was due to primary physician referral lag and delayed scheduling, during which the plaintiff strictly followed conservative rest orders. This is supported by Dr. Robert Chen's onset timeline declaration (Page 14).",
      citation: "Dr. Chen Causation Declaration, Page 14"
    },
    {
      label: "Defeat Pre-Existing Degeneration",
      query: "What evidence defeats the defense argument that C5-C6 herniation is pre-existing degeneration?",
      response: "Under NY's Eggshell Plaintiff Doctrine, the defendant takes the plaintiff as they find them. Prior to the collision, the plaintiff was 100% asymptomatic with zero cervical medical visits in 8 years of primary care records. The collision transformed latent spondylosis into an acute, permanent thecal-sac compressing herniation.",
      citation: "Radiology Addendum, Page 4 & Dr. Chen Initial Exam, Page 12"
    },
    {
      label: "Counter Low Property Damage",
      query: "How do we neutralize the defense's low property damage ($1,800 bumper repair) defense?",
      response: "Property damage metrics do not correlate with occupant kinetic energy transfer. Modern polymer bumper fascias are designed to rebound elastically, absorbing external visible damage while transmitting significant G-forces directly to the occupant's cervical spine.",
      citation: "Biomechanical Impact Evaluation Report, Page 6"
    }
  ];

  const handleSendChatMessage = (textToSend?: string) => {
    const query = textToSend || chatInput.trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    if (!textToSend) setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      let aiReply = "Based on the case chronology and verified medical specials, plaintiff counsel holds strong leverage. Emphasize consistent treatment following the gap, fluoroscopy-guided injections, and unimpeached liability against the commercial carrier.";
      let citation = "Case Medical Chronology & Specials Ledger";

      const matched = suggestedPrompts.find(p => p.query.toLowerCase() === query.toLowerCase() || query.toLowerCase().includes(p.label.toLowerCase()));
      if (matched) {
        aiReply = matched.response;
        citation = matched.citation;
      } else if (query.toLowerCase().includes('gap') || query.toLowerCase().includes('17-day')) {
        aiReply = "Counter the treatment gap using Dr. Chen's initial intake notes showing continuous pain since the collision date, attributing the delay to referral authorization rather than symptom resolution.";
        citation = "Initial Physical Therapy Evaluation, Page 18";
      } else if (query.toLowerCase().includes('mri') || query.toLowerCase().includes('herniation') || query.toLowerCase().includes('degeneration')) {
        aiReply = "The cervical MRI objectively confirms 3mm disc herniation with thecal sac impingement at C5-C6 and C6-C7. Pair this with Dr. Chen's causation report to establish objective injury.";
        citation = "Cervical Spine MRI Report, Page 4";
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

      {/* Top Header */}
      <div className="bg-slate-50 p-5 md:p-6 border-b border-slate-200 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-teal-900 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
              <Handshake className="w-3 h-3" /> Case Negotiations
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
            AI Negotiation Assistant & Strategy Command
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Active defense arguments, AI counter-rebuttals, settlement target corridors, and evidentiary chat assistant.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800">
            Posture: Strong Favorable Leverage
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="p-5 md:p-8 flex-1 overflow-y-auto space-y-6 bg-slate-50/30">

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-4 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <Handshake className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Current Negotiation Summary</h3>
              <p className="text-xs text-slate-500">Live posture analysis based on 3 exchanged rounds</p>
            </div>
          </div>
          <div className="text-base font-bold text-slate-800">
            <span className="text-teal-700">${latestDemand.toLocaleString()}</span> vs <span className="text-rose-700">${latestCounter.toLocaleString()}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Spread: ${currentSpread.toLocaleString()} | Midpoint: ${Math.round(currentMidpoint).toLocaleString()}</p>
        </div>

        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-4 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">Evidence-Backed Rebuttals</h4>
              <p className="text-xs text-slate-500">Click to copy evidence-grounded responses</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {defensePressure.map((dp: any) => {
              const isCopied = copiedId === dp.id;
              return (
                <div key={dp.id} className="p-3.5 rounded-xl border border-teal-100 bg-teal-50/30">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-teal-900">{dp.title} Rebuttal</span>
                    <button
                      onClick={() => copyToClipboard(dp.rebuttal || dp.counterStrategy || "", dp.id)}
                      className="text-[10px] font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-teal-200 cursor-pointer"
                    >
                      {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      {isCopied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-normal">{dp.rebuttal || dp.counterStrategy}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[500px]">
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Bot className="w-5 h-5 text-teal-400" />
            <div>
              <h4 className="text-sm font-bold text-white">AI Negotiation Chat Assistant</h4>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 border-b border-slate-200 p-2.5 flex items-center gap-2 overflow-x-auto">
          {suggestedPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendChatMessage(p.query)}
              className="text-xs bg-white hover:bg-teal-50 border border-slate-200 text-slate-700 font-semibold px-3 py-1 rounded-full shrink-0 transition-colors cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>
        <div ref={chatScrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/40">
          {chatMessages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 max-w-[88%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-teal-700 text-white' : 'bg-slate-900 text-teal-300'}`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`p-4 rounded-2xl text-xs leading-relaxed ${msg.sender === 'user' ? 'bg-teal-900 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'}`}>
                <p>{msg.text}</p>
                {msg.citation && <div className="mt-2.5 pt-2 border-t text-[11px] font-semibold flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Source: {msg.citation}</div>}
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSendChatMessage(); }}
            placeholder="Ask AI for strategy or rebuttal..."
            className="flex-1 text-xs px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-slate-50"
          />
          <button
            onClick={() => handleSendChatMessage()}
            className="px-4 py-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 flex items-center justify-center cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
  )
}
