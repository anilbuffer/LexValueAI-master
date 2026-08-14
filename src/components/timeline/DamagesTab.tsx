import React from 'react'

export function DamagesTab({ caseData }: { caseData?: any }) {
  const damages: any[] = []
  
  if (caseData?.documents) {
    caseData.documents.forEach((doc: any) => {
      if (doc.aiAnalysis?.damages && Array.isArray(doc.aiAnalysis.damages)) {
        doc.aiAnalysis.damages.forEach((damage: any) => {
          damages.push({
            ...damage,
            documentName: doc.fileName
          })
        })
      }
    })
  }

  const totalExpenses = damages.reduce((sum: any, damage: any) => sum + (Number(damage.amount) || 0), 0)

  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-slate-50 p-5 border-b border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800">Medical Billing & Damages</h2>
        <p className="text-sm text-slate-500 mt-1">Calculated totals for medical expenses extracted by AI.</p>
      </div>
      <div className="p-5 w-full">
        {damages.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
            <p className="text-slate-500">No damages or billing information extracted yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-emerald-900">Total Extracted Expenses</h4>
                <p className="text-sm text-emerald-700">Sum of all identified bills and invoices.</p>
              </div>
              <div className="text-2xl font-bold text-emerald-700">
                ${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {damages.map((item, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-slate-800">{item.provider || "Unknown Provider"}</h4>
                    <span className="font-bold text-slate-700">${Number(item.amount || 0).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{item.service || "Medical Services"}</p>
                  <p className="text-xs text-slate-400">Source: {item.documentName}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

