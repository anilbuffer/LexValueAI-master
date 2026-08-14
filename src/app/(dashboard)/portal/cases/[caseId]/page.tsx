import { getMockCaseById } from "@/lib/mock-data"
import { notFound } from "next/navigation"
import { CaseStatusCard } from "@/components/portal/CaseStatusCard"
import { HIPAAAuthorizationCard } from "@/components/portal/HIPAAAuthorizationCard"
import { PortalDocumentUpload } from "@/components/portal/PortalDocumentUpload"
import { MessageSquare } from "lucide-react"

export default async function PortalPage({ params }: { params: Promise<{ caseId: string }> }) {
  const { caseId } = await params;
  const caseData = getMockCaseById(caseId);

  if (!caseData) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-900 to-teal-700 rounded-xl p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome, {caseData.client.split(' ')[0]}</h1>
          <p className="text-teal-100 text-lg max-w-2xl">
            This is your secure portal to track case progress, upload documents directly to your legal team, and sign necessary authorizations.
          </p>
        </div>
        
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 right-32 -mb-16 w-48 h-48 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Main Tasks) */}
        <div className="lg:col-span-2 space-y-6">
          <CaseStatusCard caseData={caseData} />
          <HIPAAAuthorizationCard caseId={caseData.id} />
          <PortalDocumentUpload caseId={caseData.id} />
        </div>

        {/* Right Column (Info & Help) */}
        <div className="space-y-6">
          {/* Help Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-teal-600" />
                Need Assistance?
              </h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-600 mb-4">
                If you have questions about what documents to upload or need help with this portal, please contact your paralegal.
              </p>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</p>
                  <a href="mailto:support@lawfirm.com" className="text-sm font-medium text-teal-700 hover:underline">support@lawfirm.com</a>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone</p>
                  <a href="tel:5550199" className="text-sm font-medium text-teal-700 hover:underline">(555) 555-0199</a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Security Notice */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-center">
            <p className="text-xs text-slate-500 font-medium">
              Your connection is secure and encrypted. Documents uploaded here are protected under Attorney-Client privilege.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
