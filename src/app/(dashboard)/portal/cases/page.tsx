import { getMockCases } from "@/lib/mock-data"
import Link from "next/link"
import { FolderOpen, ArrowRight, Calendar, Activity } from "lucide-react"

export default async function PortalCasesPage() {
  const cases = getMockCases();

  // Map internal status to a more client-friendly status string
  const getClientFriendlyStatus = (status: string) => {
    switch (status) {
      case "ACTIVE":
      case "REVIEWING":
        return "In Progress - Gathering Records";
      case "PENDING":
        return "Awaiting Review";
      default:
        return "In Progress";
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-teal-600" />
            My Cases
          </h1>
          <p className="text-slate-500 text-sm mt-1">Select a case to view status, sign authorizations, and upload documents.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cases.map((c: any) => (
          <Link key={c.id} href={`/portal/cases/${c.id}`} className="group block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:border-teal-500 hover:shadow-md transition-all">
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-slate-800 group-hover:text-teal-700 transition-colors line-clamp-1">{c.title}</h3>
                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded border border-slate-200">
                  {c.referenceId}
                </span>
              </div>

              <div className="space-y-2 mt-4 text-sm">
                <div className="flex items-center gap-2 text-slate-500">
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span>Incident Date: {c.dateOfInjury ? new Date(c.dateOfInjury).toLocaleDateString() : 'Unknown'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Activity className="w-4 h-4 shrink-0" />
                  <span>Status: <span className="font-medium text-slate-700">{getClientFriendlyStatus(c.status)}</span></span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex justify-end">
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-teal-600 group-hover:text-teal-700 transition-colors">
                  View Case <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
