import { FileText, Calendar, Scale, Activity } from "lucide-react"

interface CaseStatusCardProps {
  caseData: any;
}

export function CaseStatusCard({ caseData }: CaseStatusCardProps) {
  // Format dates safely
  const formattedDate = caseData.dateOfInjury 
    ? new Date(caseData.dateOfInjury).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "Unknown";

  // Map internal status to a more client-friendly status string
  const getClientFriendlyStatus = (status: string) => {
    switch (status) {
      case "ACTIVE":
      case "REVIEWING":
        return "In Progress - Gathering Medical Records";
      case "PENDING":
        return "Awaiting Review";
      default:
        return "In Progress";
    }
  }

  // Find assigned attorney
  const attorney = caseData.assignedUsers?.find((u: any) => u.role === "ATTORNEY" || u.role === "MANAGING_PARTNER");
  const paralegal = caseData.assignedUsers?.find((u: any) => u.role === "PARALEGAL");

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
        <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
          <FileText className="w-5 h-5 text-teal-600" />
          Case Overview
        </h2>
        <span className="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-wider rounded-full border border-teal-100">
          {caseData.referenceId}
        </span>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-slate-500 font-medium mb-1">Case Type</p>
          <div className="flex items-center gap-2 text-slate-900 font-semibold">
            <Scale className="w-4 h-4 text-slate-400" />
            {caseData.type || "Personal Injury"}
          </div>
        </div>

        <div>
          <p className="text-sm text-slate-500 font-medium mb-1">Date of Incident</p>
          <div className="flex items-center gap-2 text-slate-900 font-semibold">
            <Calendar className="w-4 h-4 text-slate-400" />
            {formattedDate}
          </div>
        </div>

        <div>
          <p className="text-sm text-slate-500 font-medium mb-1">Current Status</p>
          <div className="flex items-center gap-2 text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg w-fit border border-amber-100 font-semibold text-sm">
            <Activity className="w-4 h-4" />
            {getClientFriendlyStatus(caseData.status)}
          </div>
        </div>

        <div>
          <p className="text-sm text-slate-500 font-medium mb-1">Your Legal Team</p>
          <div className="text-slate-900 text-sm">
            {attorney && (
              <div className="font-semibold">{attorney.firstName} {attorney.lastName} <span className="text-slate-500 font-normal text-xs ml-1">(Attorney)</span></div>
            )}
            {paralegal && (
              <div className="font-medium mt-0.5">{paralegal.firstName} {paralegal.lastName} <span className="text-slate-500 font-normal text-xs ml-1">(Paralegal)</span></div>
            )}
            {!attorney && !paralegal && (
              <span className="text-slate-500 italic">Assigning team...</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
