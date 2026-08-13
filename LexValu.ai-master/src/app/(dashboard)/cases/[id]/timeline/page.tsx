import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { TimelineTabs } from "./TimelineTabs"
import { CaseIntelligenceBlock } from "@/components/timeline/CaseIntelligenceBlock"
import { FileText, FileSpreadsheet, File, ArrowLeft, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { ExportDropdown } from "@/components/cases/ExportDropdown"
import { UploadDocumentButton } from "@/components/cases/UploadDocumentButton"
import { CaseApprovalButtons } from "@/components/cases/CaseApprovalButtons"
import { CloseCaseButton } from "@/components/cases/CloseCaseButton"

export default async function TimelinePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) redirect('/login')

  const { id: caseId } = await params

  let firmId: string | undefined | null = session.firmId
  if (!firmId) {
    const user = await prisma.user.findUnique({ where: { id: session.id } })
    firmId = user?.firmId
  }

  if (!firmId) {
    return <div className="p-6">Error: User has no firm assigned.</div>
  }

  // Now firmId is guaranteed to be a string
  const validFirmId = firmId as string

  let caseData = null
  try {
    caseData = await prisma.case.findFirst({
      where: {
        id: caseId,
        firmId: validFirmId
      },
      include: {
        documents: true,
        timelineEvents: {
          orderBy: { date: 'asc' }
        }
      }
    })
  } catch (error) {
    // Silently ignore Prisma validation errors
  }

  if (!caseData) {
    return (
      <div className="w-full p-20 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Case Not Found</h2>
        <p className="text-slate-500 mb-6">The case you are looking for does not exist or you do not have permission to view it.</p>
        <Link href="/cases" className="px-5 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors">
          Return to Cases
        </Link>
      </div>
    )
  }

  // Format date of injury using standard format
  const dateObj = new Date(caseData.dateOfInjury);
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC'
  }).format(dateObj);

  return (
    <div className="w-full p-2.5 pb-[15px] font-sans relative flex flex-col gap-[15px]">

      {caseData.approvalStatus === 'REJECTED' && caseData.rejectionReason && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 shadow-sm">
          <div className="text-[16px] text-rose-800 font-bold mb-2 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Reason for Rejection
          </div>
          <div className="text-[15px] font-medium text-rose-900 leading-relaxed">
            {caseData.rejectionReason}
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-md shadow-slate-200/50 border border-slate-200/50 p-6 flex flex-col gap-[20px]">
        <div className="flex flex-col min-[1200px]:flex-row min-[1200px]:items-center justify-between gap-6">
          <div className="flex flex-col">
            <Link href="/cases" className="mb-3 flex items-center gap-1.5 text-[12px] font-bold text-slate-400 hover:text-teal-600 transition-colors w-fit uppercase tracking-wider">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Cases
            </Link>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">{caseData.title}</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium flex flex-wrap items-center gap-x-2 gap-y-1">
              {caseData.referenceId}
              <span className="text-slate-300">•</span>
              {caseData.client}
              <span className="text-slate-300">•</span>
              {caseData.type}
              <span className="text-slate-300">•</span>
              Date of injury {formattedDate}
            </p>
          </div>

          <div className="flex max-[480px]:flex-col flex-wrap items-center max-[480px]:items-stretch gap-3">
            <CaseApprovalButtons caseId={caseData.id} currentApprovalStatus={caseData.approvalStatus} />
            <CloseCaseButton caseId={caseData.id} currentStatus={caseData.status} />
            <UploadDocumentButton caseId={caseData.id} role={session.role} />
            <ExportDropdown role={session.role} caseData={caseData} />
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <TimelineTabs caseData={caseData} />


    </div>
  )
}
