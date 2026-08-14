import React, { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, Info, Shield, Target, Sliders, Activity } from 'lucide-react'
import { getMockCaseValuations } from '@/lib/mock-data'

export function CaseValuationTab({ caseData }: { caseData: any }) {
  const firmId = caseData?.firmId;
  const caseId = caseData?.id;

  const [valuations, setValuations] = useState<any[]>([])
  
  // Interactive "What-If" Variables
  const [jurisdiction, setJurisdiction] = useState(50); // 0 = Liberal, 100 = Conservative, 50 = Neutral
  const [futureSurgery, setFutureSurgery] = useState(false);

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

  const baseValuation = valuations[0]; // Display the primary/latest valuation

  // Dynamic calculation based on "What-If" sliders
  const jurisdictionMultiplier = 1 + (50 - jurisdiction) * 0.005; // 0 -> 1.25, 100 -> 0.75
  
  let dynamicMin = baseValuation.minEstimate * jurisdictionMultiplier;
  let dynamicMax = baseValuation.maxEstimate * jurisdictionMultiplier;

  if (futureSurgery) {
    dynamicMin += 50000;
    dynamicMax += 85000;
  }

  const dynamicFactorsUp = [...(baseValuation.factorsUp || [])];
  const dynamicFactorsDown = [...(baseValuation.factorsDown || [])];

  if (jurisdiction < 40) {
    dynamicFactorsUp.push("Favorable Plaintiff Venue (Liberal Jury Pool)");
  } else if (jurisdiction > 60) {
    dynamicFactorsDown.push("Conservative Venue (Historically lower jury awards)");
  }

  if (futureSurgery) {
    dynamicFactorsUp.push("Future Surgical Recommendation (Lumbar Fusion)");
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-slate-50 p-5 border-b border-slate-200 shrink-0 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Predictive Case Valuation</h2>
          <p className="text-sm text-slate-500 mt-1">Using the structured case data, AI flags, verdict dataset, and attorney correction history, the platform generates a predicted settlement range for each case.</p>
        </div>
        <div className="bg-teal-100 text-teal-800 px-3 py-1.5 rounded-md font-bold text-sm flex items-center gap-1.5 shadow-sm">
          <Shield className="w-4 h-4" /> 
          {baseValuation.confidence}% Confidence
        </div>
      </div>

      <div className="p-6 md:p-8 flex-1 overflow-y-auto">
        <div className="flex flex-col gap-6">
          
          {/* Top Banner - The Estimate */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 text-white shadow-md relative overflow-hidden transition-all duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500 rounded-full blur-3xl opacity-20 -mr-20 -mt-20 transition-all duration-500"></div>
            
            <h3 className="text-slate-300 font-semibold mb-2 uppercase tracking-wider text-sm flex items-center gap-2">
              <Target className="w-4 h-4" /> Predicted Settlement Range
            </h3>
            <div className="flex items-end gap-3 font-serif">
              <span className="text-5xl font-bold tracking-tight text-white transition-all duration-300">
                ${Math.round(dynamicMin).toLocaleString()}
              </span>
              <span className="text-3xl text-slate-400 mb-1 font-sans">—</span>
              <span className="text-5xl font-bold tracking-tight text-white transition-all duration-300">
                ${Math.round(dynamicMax).toLocaleString()}
              </span>
            </div>
            <p className="text-slate-400 mt-4 text-sm max-w-xl leading-relaxed">
              The prediction is presented with a confidence level and a breakdown of the key factors driving the estimate upward or downward such as surgical recommendation, permanency finding, treatment gap, or strong causation language. This is the EvenUp-level intelligence layer that transforms LexValue AI from a documentation tool into a true strategic platform.
            </p>
          </div>

          {/* Interactive What-If Section */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-inner">
            <h4 className="text-[15px] font-bold text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-wide">
              <Sliders className="w-5 h-5 text-indigo-600" /> Interactive "What-If" Sensitivity Sliders
            </h4>
            <p className="text-sm text-slate-500 mb-6">Adjust key case variables in real-time to model value shifts.</p>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Jurisdiction Slider */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-sm font-medium text-slate-700">
                  <span>Jurisdiction Conservatism</span>
                  <span className="text-indigo-600 font-bold">
                    {jurisdiction < 40 ? "Liberal" : jurisdiction > 60 ? "Conservative" : "Neutral"}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={jurisdiction} 
                  onChange={(e) => setJurisdiction(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-slate-400 font-semibold uppercase">
                  <span>Liberal Venue</span>
                  <span>Conservative Venue</span>
                </div>
              </div>

              {/* Future Surgery Toggle */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-sm font-medium text-slate-700">
                  <span>Future Surgical Recommendation</span>
                  <span className={futureSurgery ? "text-teal-600 font-bold" : "text-slate-400 font-bold"}>
                    {futureSurgery ? "Recommended" : "None"}
                  </span>
                </div>
                
                <label className="relative inline-flex items-center cursor-pointer mt-1">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={futureSurgery}
                    onChange={() => setFutureSurgery(!futureSurgery)}
                  />
                  <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-teal-600"></div>
                  <span className="ml-3 text-sm font-medium text-slate-600">
                    Model value increase if lumbar surgery is performed
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-2">
            {/* Driving Factors (Up) */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h4 className="text-[15px] font-bold text-teal-700 mb-4 flex items-center gap-2 uppercase tracking-wide">
                <TrendingUp className="w-5 h-5" /> Value Drivers (Positive)
              </h4>
              <ul className="flex flex-col gap-3">
                {dynamicFactorsUp.map((factor: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                    <span className="text-teal-500 mt-0.5">+</span>
                    <span className="text-slate-700 font-medium">{factor}</span>
                  </li>
                ))}
                {!dynamicFactorsUp.length && (
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
                {dynamicFactorsDown.map((factor: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                    <span className="text-rose-500 mt-0.5">-</span>
                    <span className="text-slate-700 font-medium">{factor}</span>
                  </li>
                ))}
                {!dynamicFactorsDown.length && (
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
