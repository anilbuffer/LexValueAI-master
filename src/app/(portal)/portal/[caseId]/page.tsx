import { getMockCaseById, getMockDocumentRequests, getMockPortalUpdates, getMockClientUploadedDocuments } from "@/lib/mock-data"
import { notFound } from "next/navigation"
import { PortalTabs } from "@/components/portal/PortalTabs"
import { MessageSquare } from "lucide-react"

export default async function PortalPage({ params }: { params: Promise<{ caseId: string }> }) {
  const { caseId } = await params;
  const caseData = getMockCaseById(caseId);

  if (!caseData) {
    notFound();
  }

  // Fetch the data scoped to this case
  // Normally we would also filter by the user's firmId or user session ID for security
  const documentRequests = getMockDocumentRequests(caseData.firmId, caseId);
  const portalUpdates = getMockPortalUpdates(caseData.firmId, caseId);
  const uploadedDocuments = getMockClientUploadedDocuments(caseData.firmId, caseId);

  return (
    <div className="space-y-6 max-w-5xl mx-auto w-full">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-900 to-teal-700 rounded-xl p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome, {caseData.client.split(' ')[0]}</h1>
            <p className="text-teal-100 text-lg max-w-2xl">
              This is your secure portal to track case progress, upload documents directly to your legal team, and sign necessary authorizations.
            </p>
          </div>
          <div className="shrink-0 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <h2 className="font-bold text-white flex items-center gap-2 mb-2 text-sm">
              <MessageSquare className="w-4 h-4 text-teal-200" />
              Need Assistance?
            </h2>
            <div className="space-y-1 text-xs">
              <p><span className="text-teal-200 font-medium">Email:</span> support@lawfirm.com</p>
              <p><span className="text-teal-200 font-medium">Phone:</span> (555) 555-0199</p>
            </div>
          </div>
        </div>
        
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 right-32 -mb-16 w-48 h-48 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      {/* Main Tabs Area */}
      <PortalTabs 
        caseData={caseData} 
        documentRequests={documentRequests} 
        portalUpdates={portalUpdates} 
        uploadedDocuments={uploadedDocuments} 
      />
      
      {/* Security Notice */}
      <div className="mt-8 pt-6 border-t border-slate-200 text-center">
        <p className="text-xs text-slate-500 font-medium">
          Your connection is secure and encrypted. Documents uploaded here are protected under Attorney-Client privilege.
        </p>
      </div>
    </div>
  )
}
