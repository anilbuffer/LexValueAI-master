import React, { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, Info, Shield, Target } from 'lucide-react'
import { getMockCaseValuations } from '@/lib/mock-data'

export function CaseValuationTab({ caseData }: { caseData: any }) {
  const firmId = caseData?.firmId;
  const caseId = caseData?.id;

  const [valuations, setValuations] = useState<any[]>([])

  useEffect(() => {
    if (firmId && caseId) {
      setValuations(getMockCaseValuations(firmId, caseId));
    }
  }, [firmId, caseId])

  if (!valuations.length) {
    return (
      <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="bg-slate-50 p-5 border-b border-slate-200 shrink-0">
          <h2 className="text-2xl font-bold text-slate-800">Predictive Case Valuation</h2>
          <p className="text-sm text-slate-500 mt-1">AI-driven settlement range prediction based on case data</p>
        </div>
        <div className="flex flex-col items-center justify-center p-12 text-slate-400 flex-1">
          <Target className="w-12 h-12 mb-4 text-slate-300" />
          <p className="italic">No valuation data generated for this case yet.</p>
        </div>
      </div>
    )
  }

  const valuation = valuations[0]; // Display the primary/latest valuation

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-slate-50 p-5 border-b border-slate-200 shrink-0 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Predictive Case Valuation</h2>
          <p className="text-sm text-slate-500 mt-1">AI-driven settlement range prediction</p>
        </div>
        <div className="bg-teal-100 text-teal-800 px-3 py-1.5 rounded-md font-bold text-sm flex items-center gap-1.5 shadow-sm">
          <Shield className="w-4 h-4" /> 
          {valuation.confidence}% Confidence
        </div>
      </div>

      <div className="p-6 md:p-8 flex-1 overflow-y-auto">
        <div className="flex flex-col gap-6">
          
          {/* Top Banner - The Estimate */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 text-white shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500 rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
            
            <h3 className="text-slate-300 font-semibold mb-2 uppercase tracking-wider text-sm flex items-center gap-2">
              <Target className="w-4 h-4" /> Predicted Settlement Range
            </h3>
            <div className="flex items-end gap-3 font-serif">
              <span className="text-5xl font-bold tracking-tight text-white">
                ${valuation.minEstimate?.toLocaleString()}
              </span>
              <span className="text-3xl text-slate-400 mb-1 font-sans">—</span>
              <span className="text-5xl font-bold tracking-tight text-white">
                ${valuation.maxEstimate?.toLocaleString()}
              </span>
            </div>
            <p className="text-slate-400 mt-4 text-sm max-w-xl leading-relaxed">
              Based on historical firm data, jurisdiction trends, and case-specific medical findings including surgical interventions and documented causation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-2">
            {/* Driving Factors (Up) */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h4 className="text-[15px] font-bold text-teal-700 mb-4 flex items-center gap-2 uppercase tracking-wide">
                <TrendingUp className="w-5 h-5" /> Value Drivers (Positive)
              </h4>
              <ul className="flex flex-col gap-3">
                {valuation.factorsUp?.map((factor: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-teal-500 mt-0.5">+</span>
                    <span className="text-slate-700 font-medium">{factor}</span>
                  </li>
                ))}
                {!valuation.factorsUp?.length && (
                  <li className="text-slate-400 italic text-sm">No positive drivers identified.</li>
                )}
              </ul>
            </div>

            {/* Driving Factors (Down) */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h4 className="text-[15px] font-bold text-rose-700 mb-4 flex items-center gap-2 uppercase tracking-wide">
                <TrendingDown className="w-5 h-5" /> Exposure Risks (Negative)
              </h4>
              <ul className="flex flex-col gap-3">
                {valuation.factorsDown?.map((factor: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-500 mt-0.5">-</span>
                    <span className="text-slate-700 font-medium">{factor}</span>
                  </li>
                ))}
                {!valuation.factorsDown?.length && (
                  <li className="text-slate-400 italic text-sm">No exposure risks identified.</li>
                )}
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mt-2 flex gap-3 text-blue-800 text-sm">
            <Info className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Note:</strong> Predictive valuation is generated by analyzing similar closed cases within your firm's historical dataset. It should be used as a strategic tool for negotiation preparation and not as a guaranteed outcome.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
