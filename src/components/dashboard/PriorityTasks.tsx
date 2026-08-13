import React from 'react'
import { ListTodo, FileWarning, AlertTriangle, XCircle, FileOutput, CheckCircle } from 'lucide-react'
import { getSession } from '@/lib/auth'
import { getMockCases } from '@/lib/mock-data'
import Link from 'next/link'

export async function PriorityTasks() {
  const session = await getSession();
  if (!session) return null;

  const mockCases = getMockCases();
  const tasks: any[] = [];

  if (session.role === 'PARALEGAL') {
    // 1. Rejected Cases
    const rejectedCases = mockCases.filter(c => c.approvalStatus === 'REJECTED');
    rejectedCases.forEach(c => {
      tasks.push({
        id: `rej-${c.id}`,
        type: 'REJECTED',
        title: 'Action Required: Returned by Attorney',
        description: `Case: ${c.title} needs your review and fixes`,
        icon: FileOutput,
        iconColor: 'text-rose-600',
        iconBg: 'bg-rose-100/50',
        link: `/cases/${c.id}/timeline`
      });
    });

    // 2. Scan Failures
    const failedScans = mockCases.filter(c => c.scanStage === 'FAILED');
    failedScans.forEach(c => {
      tasks.push({
        id: `fail-${c.id}`,
        type: 'FAILED_SCAN',
        title: 'Scan Failed',
        description: `Processing failed for Case: ${c.title}. Please retry.`,
        icon: XCircle,
        iconColor: 'text-rose-600',
        iconBg: 'bg-rose-100/50',
        link: `/cases/${c.id}/timeline`
      });
    });

    // 3. Missing Records Mock
    tasks.push({
      id: `miss-mock`,
      type: 'MISSING_RECORDS',
      title: 'Missing Medical Records',
      description: `Case: ${mockCases[0]?.title || 'Mock Case'} - 2 documents missing`,
      icon: FileWarning,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-100/50',
      link: `/cases/${mockCases[0]?.id || '1'}/timeline?tab=gaps`
    });

  } else {
    // For ATTORNEY or MANAGING_PARTNER
    const pendingCases = mockCases.filter(c => c.approvalStatus === 'PENDING' && c.scanStage === 'COMPLETED');
    pendingCases.forEach(c => {
      tasks.push({
        id: `pend-${c.id}`,
        type: 'PENDING_APPROVAL',
        title: c.title,
        description: `Prepared by your team - Ready for approval`,
        icon: AlertTriangle,
        iconColor: 'text-indigo-600',
        iconBg: 'bg-indigo-100/50',
        link: `/cases/${c.id}/timeline`
      });
    });
  }

  const widgetTitle = session.role === 'PARALEGAL' ? 'Priority Tasks & Alerts' : 'Needs Your Review';

  return (
    <div className="grid-item-priority bg-white rounded-2xl border border-slate-200/50 shadow-md shadow-slate-200/50 p-6 flex flex-col h-full max-h-[480px]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-50 text-teal-600 rounded-lg border border-teal-100/50">
            <ListTodo className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">{widgetTitle}</h3>
        </div>
        {tasks.length > 0 && (
          <span className="flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded">
            {tasks.length} Action{tasks.length > 1 ? 's' : ''} Required
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-3">
        {tasks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <CheckCircle className="w-10 h-10 text-emerald-400 mb-2" />
            <p className="font-medium text-slate-500">All caught up!</p>
            <p className="text-sm">No priority tasks at the moment.</p>
          </div>
        ) : (
          tasks.map((task) => {
            const IconComponent = task.icon;
            return (
              <Link href={task.link} key={task.id}>
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-sm hover:border-slate-200 transition-all cursor-pointer group">
                  <div className="flex items-start gap-3">
                    <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${task.iconBg} ${task.iconColor}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-800 group-hover:text-teal-600 transition-colors">{task.title}</h4>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">{task.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })
        )}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}} />
    </div>
  )
}
