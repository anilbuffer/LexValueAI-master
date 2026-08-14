import { getMockCaseById } from "@/lib/mock-data"
import { notFound } from "next/navigation"
import { HIPAAAuthorizationCard } from "@/components/portal/HIPAAAuthorizationCard"
import { Shield } from "lucide-react"

export default async function PortalAuthorizationsPage() {
  const caseId = "case-1";
  const caseData = getMockCaseById(caseId);
  if (!caseData) notFound();

  return (
    <div className="space-y-6 max-w-3xl mx-auto w-full">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <Shield className="w-6 h-6 text-teal-600" />
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Authorizations</h1>
      </div>
      <HIPAAAuthorizationCard caseId={caseData.id} />
    </div>
  );
}
