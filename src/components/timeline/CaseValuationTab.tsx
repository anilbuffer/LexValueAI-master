"use client"
import React, { useEffect, useState } from 'react'
import {
  Target,
  Shield,
  TrendingUp,
  TrendingDown,
  Sliders,
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
  XCircle
} from 'lucide-react'
import { getMockCaseValuations } from '@/lib/mock-data'
import { useRouter, usePathname } from 'next/navigation'

export function CaseValuationTab({ caseData }: { caseData: any }) {
  const firmId = caseData?.firmId || 'firm-1';
  const caseId = caseData?.id || 'case-1';

  const router = useRouter();
  const pathname = usePathname();

  const [valuations, setValuations] = useState<any[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [expandedRebuttalId, setExpandedRebuttalId] = useState<string | null>("dp-1")

  // Interactive "What-If" Sensitivity Simulator State
  const [jurisdiction, setJurisdiction] = useState(50); // 0 = Highly Liberal, 100 = Highly Conservative, 50 = Neutral
  const [gapNeutralized, setGapNeutralized] = useState(false);
  const [eggshellBriefAttached, setEggshellBriefAttached] = useState(false);
  const [futureSurgery, setFutureSurgery] = useState(false);
  const [propertyDamageLevel, setPropertyDamageLevel] = useState<'low' | 'moderate' | 'high'>('low');

  useEffect(() => {
    if (firmId && caseId) {
      const data = getMockCaseValuations(firmId, caseId);
      setValuations(data);
    }
  }, [firmId, caseId])

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  if (!valuations.length) {
    return (
      <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-500 font-sans">
        <div className="bg-slate-50 p-5 border-b border-slate-200 shrink-0">
          <h2 className="text-2xl font-bold text-slate-800">Settlement Intelligence</h2>
          <p className="text-sm text-slate-500 mt-1">Qualitative case leverage and directional settlement intelligence</p>
        </div>
        <div className="flex flex-col items-center justify-center p-12 text-slate-400 flex-1">
          <Target className="w-12 h-12 mb-4 text-slate-300" />
          <p className="italic">No settlement intelligence data generated for this case yet.</p>
        </div>
      </div>
    )
  }

  const baseVal = valuations[0];
  const valueDrivers = baseVal.valueDrivers || [];
  const defensePressure = baseVal.defensePressure || [];
  const carrierModel = baseVal.carrierModel || {
    softwarePredictedName: "Colossus / Guidewire ClaimCenter",
    discountFactorsApplied: []
  };
  const strategy = baseVal.negotiationStrategy || {};

  // Directional Leverage Score
  let leverageScore = 78;
  if (jurisdiction < 35) leverageScore += 8;
  if (jurisdiction > 65) leverageScore -= 8;
  if (gapNeutralized) leverageScore += 7;
  if (eggshellBriefAttached) leverageScore += 8;
  if (futureSurgery) leverageScore += 12;
  if (propertyDamageLevel === 'moderate') leverageScore += 4;
  if (propertyDamageLevel === 'high') leverageScore += 10;
  leverageScore = Math.min(Math.max(leverageScore, 35), 98);

  const getLeverageRating = (score: number) => {
    if (score >= 88) return { label: "Dominant Favorable Leverage", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-300" };
    if (score >= 75) return { label: "Strong Favorable Leverage", color: "text-teal-700", bg: "bg-teal-50 border-teal-300" };
    if (score >= 60) return { label: "Moderate Leverage (Disputed Causation)", color: "text-amber-700", bg: "bg-amber-50 border-amber-300" };
    return { label: "Vulnerable Recovery Posture", color: "text-rose-700", bg: "bg-rose-50 border-rose-300" };
  };

  const leverageRating = getLeverageRating(leverageScore);

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-500 font-sans">

      {/* Top Header */}
      <div className="bg-slate-50/90 p-5 md:p-6 border-b border-slate-200 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-teal-900 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3 text-teal-400" /> Settlement Intelligence
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Case Valuation & Settlement Intelligence
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
            Qualitative case leverage evaluation covering Value Drivers, Defense Pressure, Carrier Arguments, Negotiation Strategy, and Directional Impact.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <span className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${leverageRating.bg} ${leverageRating.color}`}>
            Posture: {leverageRating.label}
          </span>
        </div>
      </div>

      {/* Main Content Scroll Area */}
      <div className="p-5 md:p-8 flex-1 overflow-y-auto space-y-6 bg-slate-50/30">

        {/* 1. DIRECTIONAL IMPACT & LEVERAGE SPECTRUM */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Scale className="w-4 h-4 text-teal-700" /> Directional Impact & Case Leverage Spectrum
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Directional posture mapping case multipliers vs defense discount vectors.
              </p>
            </div>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
              Target Corridor: $85,000 – $120,000
            </span>
          </div>

          <div className="relative pt-6 pb-2">
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex relative">
              <div className="w-[30%] bg-gradient-to-r from-rose-400 to-rose-500 opacity-80 h-full"></div>
              <div className="w-[20%] bg-amber-200 h-full"></div>
              <div className="w-[30%] bg-gradient-to-r from-teal-500 to-emerald-500 h-full relative">
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
              <div className="w-[20%] bg-indigo-600 opacity-90 h-full"></div>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center text-xs mt-3">
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-rose-600 block">Defense Resistant</span>
                <span className="font-medium text-slate-600">Disputed Causation</span>
              </div>
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-amber-700 block">Moderate Disputed</span>
                <span className="font-medium text-slate-600">Treatment Gaps</span>
              </div>
              <div className="text-center">
                <span className="text-[10px] uppercase font-bold text-teal-800 block">Strong Favorable (Current)</span>
                <span className="font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 inline-block">
                  Objective MRI + Injections
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-indigo-700 block">Dominant Leverage</span>
                <span className="font-medium text-indigo-900">Surgical Recommendation</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2 & 3. VALUE DRIVERS VS DEFENSE PRESSURE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Value Drivers */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Value Drivers</h4>
                    <p className="text-xs text-slate-500">What strengthens the case</p>
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
                        {driver.impact || 'High Positive'}
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
              <span>Positive value drivers support the $85k–$120k recovery target in settlement conferences.</span>
            </div>
          </div>

          {/* Defense Pressure */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700">
                    <TrendingDown className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Defense Pressure</h4>
                    <p className="text-xs text-slate-500">What weakens the case & carrier discount vectors</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full">
                  {defensePressure.length} Exposure Points
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
                                {pressure.riskLevel || 'High'} Risk
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{pressure.detail}</p>
                          </div>
                        </div>

                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-rose-50 text-rose-800 border border-rose-200 shrink-0">
                          {pressure.impact || 'Moderate Negative'}
                        </span>
                      </div>

                      {/* Rebuttal Toggle */}
                      <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                        <button
                          onClick={() => setExpandedRebuttalId(isExpanded ? null : pressure.id)}
                          className="flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-800 cursor-pointer"
                        >
                          <Zap className="w-3.5 h-3.5 text-teal-600" />
                          {isExpanded ? "Hide Tactical Rebuttal" : "View AI Legal Rebuttal"}
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
                              <Shield className="w-3 h-3 text-teal-600" /> Rebuttal Strategy:
                            </span>
                            <button
                              onClick={() => copyToClipboard(pressure.rebuttal, pressure.id)}
                              className="text-[10px] font-semibold text-teal-700 flex items-center gap-1 bg-teal-50 px-2 py-0.5 rounded border border-teal-200"
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
              <span>AI Legal Rebuttals prevent adjusters from applying duplicate deductions on prior medical notes.</span>
            </div>
          </div>

        </div>

        {/* 4. CARRIER ARGUMENTS & SOFTWARE ALGORITHM RULES */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-7 shadow-lg border border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Cpu className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Anticipated Carrier Arguments & Algorithm Rules
                </span>
              </div>
              <h4 className="text-lg font-bold text-white tracking-tight">
                What Defense / Insurance Carrier Will Argue
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Anticipated claim engine posture ({carrierModel.softwarePredictedName}) and strategic rebuttal countermoves
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Engine</span>
                <span className="text-xs font-bold text-teal-400">Colossus / Guidewire</span>
              </div>
              <div className="bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Adjuster Posture</span>
                <span className="text-xs font-bold text-rose-400">Disputed Causation</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
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
                  <Shield className="w-3 h-3 text-teal-400 shrink-0" /> Neutralizable via AI Rebuttal
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. NEGOTIATION STRATEGY PLAYBOOK */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">Negotiation Strategy Playbook</h4>
                <p className="text-xs text-slate-500">What to emphasize, what not to lead with, and how to respond to defense arguments</p>
              </div>
            </div>

            <button
              onClick={() => copyToClipboard(strategy.headline || "", "strategy-headline")}
              className="text-xs font-semibold text-slate-600 hover:text-teal-800 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-teal-50 transition-colors cursor-pointer"
            >
              {copiedId === "strategy-headline" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedId === "strategy-headline" ? "Copied Playbook!" : "Copy Strategy Directives"}
            </button>
          </div>

          {/* Master Strategic Directive Box */}
          <div className="bg-gradient-to-r from-teal-50 via-indigo-50 to-slate-50 border-2 border-teal-200/80 rounded-2xl p-5 mb-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-teal-900 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-sm">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                <span>What NOT to Lead With</span>
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

            {/* How to Respond to Defense Arguments */}
            <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 flex flex-col">
              <div className="flex items-center gap-2 mb-3 text-indigo-900 font-bold text-xs uppercase tracking-wider">
                <Shield className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>How to Respond to Defense</span>
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
            <div className="pt-6 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-teal-600" /> Key Leverage Points For Settlement Conference
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

        </div>

      </div>
    </div>
  )
}
