"use client"

import { useState } from "react"
import { LayoutDashboard, FileText, Clock, User } from "lucide-react"
import { CaseStatusCard } from "./CaseStatusCard"
import { HIPAAAuthorizationCard } from "./HIPAAAuthorizationCard"
import { PortalDocumentUpload } from "./PortalDocumentUpload"
import { PortalDocumentRequests } from "./PortalDocumentRequests"
import { PortalMyDocuments } from "./PortalMyDocuments"
import { PortalUpdates } from "./PortalUpdates"
import { PortalProfileSettings } from "./PortalProfileSettings"

interface PortalTabsProps {
  caseData: any;
  documentRequests: any[];
  portalUpdates: any[];
  uploadedDocuments: any[];
}

export function PortalTabs({ caseData, documentRequests, portalUpdates, uploadedDocuments }: PortalTabsProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'documents' | 'updates' | 'settings'>('dashboard');

  const pendingRequestsCount = documentRequests.filter(r => r.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      {/* Tabs Navigation */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`whitespace-nowrap flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'dashboard'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>
          
          <button
            onClick={() => setActiveTab('documents')}
            className={`whitespace-nowrap flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors relative ${
              activeTab === 'documents'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <FileText className="w-4 h-4" />
            Documents
            {pendingRequestsCount > 0 && (
              <span className="ml-1 bg-amber-100 text-amber-700 py-0.5 px-2 rounded-full text-[10px] font-bold">
                {pendingRequestsCount} Action{pendingRequestsCount > 1 ? 's' : ''}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('updates')}
            className={`whitespace-nowrap flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'updates'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Clock className="w-4 h-4" />
            Updates
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`whitespace-nowrap flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'settings'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <User className="w-4 h-4" />
            Profile
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="py-2">
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <CaseStatusCard caseData={caseData} />
            </div>
            <div className="space-y-6">
              <HIPAAAuthorizationCard caseId={caseData.id} />
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-6 max-w-4xl">
            <PortalDocumentRequests requests={documentRequests} />
            <PortalDocumentUpload caseId={caseData.id} />
            <PortalMyDocuments documents={uploadedDocuments} />
          </div>
        )}

        {activeTab === 'updates' && (
          <div className="max-w-3xl">
            <PortalUpdates updates={portalUpdates} />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-3xl">
            <PortalProfileSettings caseData={caseData} />
          </div>
        )}
      </div>
    </div>
  )
}
