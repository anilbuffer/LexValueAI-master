import React from 'react'
import { Hospital, Stethoscope } from 'lucide-react'

export function NetworkTab({ caseData }: { caseData?: any }) {
  const networks: any[] = []
  
  if (caseData?.documents) {
    caseData.documents.forEach((doc: any) => {
      if (doc.aiAnalysis?.network && Array.isArray(doc.aiAnalysis.network)) {
        doc.aiAnalysis.network.forEach((networkText: string) => {
          networks.push({
            text: networkText,
            documentName: doc.fileName
          })
        })
      }
    })
  }

  // Deduplicate strings just in case
  const uniqueNetworksMap = new Map()
  networks.forEach(net => {
    if (!uniqueNetworksMap.has(net.text)) {
      uniqueNetworksMap.set(net.text, net)
    }
  })
  const uniqueNetworks = Array.from(uniqueNetworksMap.values())

  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-slate-50 p-5 border-b border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800">Provider Network</h2>
        <p className="text-sm text-slate-500 mt-1">Key medical providers and institutions identified by AI.</p>
      </div>
      <div className="p-5 w-full">
        {uniqueNetworks.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
            <p className="text-slate-500">No providers identified yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {uniqueNetworks.map((net, i) => (
              <div key={i} className="border border-slate-200 p-4 rounded-xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{net.text}</h4>
                  <p className="text-xs text-slate-400 mt-1">Source: {net.documentName}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

