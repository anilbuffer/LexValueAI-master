import { getMockCaseById, getMockDocumentRequests, getMockClientUploadedDocuments } from "@/lib/mock-data"
import { notFound } from "next/navigation"
import { PortalDocumentRequests } from "@/components/portal/PortalDocumentRequests"
import { PortalDocumentUpload } from "@/components/portal/PortalDocumentUpload"
import { PortalMyDocuments } from "@/components/portal/PortalMyDocuments"
import { FileText } from "lucide-react"

export default async function PortalDocumentsPage() {
  const caseId = "case-1";
  const caseData = getMockCaseById(caseId);
  
  if (!caseData) {
    notFound();
  }

  const documentRequests = getMockDocumentRequests(caseData.firmId, caseId);
  const uploadedDocuments = getMockClientUploadedDocuments(caseData.firmId, caseId);

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <FileText className="w-6 h-6 text-teal-600" />
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Documents</h1>
      </div>
      
      <div className="space-y-6">
        {documentRequests.length > 0 && <PortalDocumentRequests requests={documentRequests} />}
        <PortalDocumentUpload caseId={caseData.id} />
        <PortalMyDocuments documents={uploadedDocuments} />
      </div>
    </div>
  )
}
