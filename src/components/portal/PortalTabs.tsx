"use client"

import { useState } from "react"
import { LayoutDashboard, FileText, User, ListTodo, Shield, ActivitySquare } from "lucide-react"
import { PortalDashboard } from "./PortalDashboard"
import { HIPAAAuthorizationCard } from "./HIPAAAuthorizationCard"
import { PortalDocumentUpload } from "./PortalDocumentUpload"
import { PortalDocumentRequests } from "./PortalDocumentRequests"
import { PortalMyDocuments } from "./PortalMyDocuments"
import { PortalUpdates } from "./PortalUpdates"

interface PortalTabsProps {
  caseData: any;
  documentRequests: any[];
  portalUpdates: any[];
  uploadedDocuments: any[];
}

export function PortalTabs({ caseData, documentRequests, portalUpdates, uploadedDocuments }: PortalTabsProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'timeline' | 'documents' | 'authorizations'>('dashboard');

  const pendingRequestsCount = documentRequests.filter(r => r.status === 'PENDING').length;
  const pendingAuthorizations = 1; // Assuming 1 pending for demo based on mock

  const handleNavigate = (tab: 'dashboard' | 'timeline' | 'documents' | 'authorizations') => {
    setActiveTab(tab);
  };

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
            onClick={() => setActiveTab('timeline')}
            className={`whitespace-nowrap flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'timeline'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <ActivitySquare className="w-4 h-4" />
            Timeline
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
                {pendingRequestsCount} Request{pendingRequestsCount > 1 ? 's' : ''}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('authorizations')}
            className={`whitespace-nowrap flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors relative ${
              activeTab === 'authorizations'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Shield className="w-4 h-4" />
            Authorizations
            {pendingAuthorizations > 0 && (
              <span className="ml-1 bg-rose-100 text-rose-700 w-4 h-4 flex items-center justify-center rounded-full text-[10px] font-bold">
                {pendingAuthorizations}
              </span>
            )}
          </button>

        </nav>
      </div>

      {/* Tab Content */}
      <div className="py-2">
        {activeTab === 'dashboard' && (
          <PortalDashboard 
            caseData={caseData} 
            documentRequests={documentRequests} 
            uploadedDocuments={uploadedDocuments}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'timeline' && (
          <div className="max-w-3xl">
            <PortalUpdates updates={portalUpdates} />
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-6 max-w-4xl">
            {documentRequests.length > 0 && <PortalDocumentRequests requests={documentRequests} />}
            <PortalDocumentUpload caseId={caseData.id} />
            <PortalMyDocuments documents={uploadedDocuments} />
          </div>
        )}
        
        {activeTab === 'authorizations' && (
          <div className="max-w-3xl">
            <HIPAAAuthorizationCard caseId={caseData.id} />
          </div>
        )}
      </div>
    </div>
  )
}
