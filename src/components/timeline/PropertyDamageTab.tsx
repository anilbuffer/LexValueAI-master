import React, { useEffect, useState } from 'react'
import { Car, Camera, AlertCircle, FileText, Image as ImageIcon } from 'lucide-react'
import { getMockPropertyDamage } from '@/lib/mock-data'

export function PropertyDamageTab({ caseData }: { caseData: any }) {
  const firmId = caseData?.firmId;
  const caseId = caseData?.id;

  const [damageRecords, setDamageRecords] = useState<any[]>([])

  useEffect(() => {
    if (firmId && caseId) {
      setDamageRecords(getMockPropertyDamage(firmId, caseId));
    }
  }, [firmId, caseId])

  if (!damageRecords.length) {
    return (
      <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="bg-slate-50 p-5 border-b border-slate-200 shrink-0">
          <h2 className="text-2xl font-bold text-slate-800">Property Damage</h2>
          <p className="text-sm text-slate-500 mt-1">Vehicle and property damage documentation</p>
        </div>
        <div className="flex flex-col items-center justify-center p-12 text-slate-400 flex-1">
          <Car className="w-12 h-12 mb-4 text-slate-300" />
          <p className="italic">No property damage records found for this case.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-slate-50 p-5 border-b border-slate-200 shrink-0 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Property Damage</h2>
          <p className="text-sm text-slate-500 mt-1">Vehicle and property damage documentation</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-semibold transition-all shadow-sm">
          <Camera className="w-4 h-4" /> Upload Photos
        </button>
      </div>

      <div className="p-6 md:p-8 flex-1 overflow-y-auto">
        <div className="flex flex-col gap-8">
          {damageRecords.map((record) => (
            <div key={record.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-teal-100 text-teal-700 p-2 rounded-lg">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{record.vehicleInfo}</h3>
                    <p className="text-sm text-slate-500">Added {new Date(record.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500 font-medium">Repair Estimate</p>
                  <p className="text-lg font-bold text-slate-800">
                    ${record.repairEstimate?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              <div className="p-5 flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-1.5 uppercase tracking-wide">
                    <AlertCircle className="w-4 h-4" /> Damage Description
                  </h4>
                  <p className="text-slate-700 leading-relaxed text-[15px]">
                    {record.description}
                  </p>
                </div>
                
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-1.5 uppercase tracking-wide">
                    <ImageIcon className="w-4 h-4" /> Photos ({record.photos?.length || 0})
                  </h4>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {record.photos?.map((photo: string, index: number) => (
                      <div key={index} className="w-32 h-24 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center shrink-0 group relative overflow-hidden cursor-pointer">
                        {/* Placeholder for mock photos */}
                        <Camera className="w-6 h-6 text-slate-300" />
                        <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <span className="text-white text-xs font-semibold">View</span>
                        </div>
                      </div>
                    ))}
                    {!record.photos?.length && (
                      <p className="text-slate-400 text-sm italic">No photos uploaded.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
