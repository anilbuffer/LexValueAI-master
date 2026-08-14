import { getMockCaseById, getMockPortalUpdates } from "@/lib/mock-data"
import { notFound } from "next/navigation"
import { PortalUpdates } from "@/components/portal/PortalUpdates"
import { ActivitySquare } from "lucide-react"

export default async function PortalTimelinePage() {
  const caseId = "case-1";
  const caseData = getMockCaseById(caseId);
  if (!caseData) notFound();

  const portalUpdates = getMockPortalUpdates(caseData.firmId, caseId);

  return (
    <div className="space-y-6 max-w-3xl mx-auto w-full">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <ActivitySquare className="w-6 h-6 text-teal-600" />
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Case Timeline</h1>
      </div>
      <PortalUpdates updates={portalUpdates} />
    </div>
  );
}
