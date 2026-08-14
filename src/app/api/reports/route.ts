import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { mockCases, mockAuditLogs, mockDocuments, mockUsers } from '@/lib/mock-data';

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const url = new URL(req.url);
    const fromDateStr = url.searchParams.get('fromDate');
    const toDateStr = url.searchParams.get('toDate');

    // Simulate basic mock numbers since full DB analytics are mocked
    
    let metricsData = [
      {
        id: 'my_cases',
        metric: session.role === 'ATTORNEY' ? 'Assigned Cases' : (session.role === 'MANAGING_PARTNER' ? 'Team Cases' : (session.role === 'ADMIN' ? 'Firm Cases' : 'My Cases')),
        count: mockCases.length,
        statusText: `+1 this month`,
        statusType: 'positive',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'analyzed',
        metric: 'Analyzed',
        count: mockCases.filter(c => c.scanStage === 'COMPLETED').length,
        statusText: `+100% vs last month`,
        statusType: 'positive',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'missing_docs',
        metric: 'Missing Documents',
        count: 0,
        statusText: 'No action required',
        statusType: 'neutral',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'returned',
        metric: session.role === 'ATTORNEY' ? 'Returned Cases' : (session.role === 'MANAGING_PARTNER' ? 'Rejected Cases' : 'Returned by Attorney'),
        count: mockCases.filter(c => c.approvalStatus === 'REJECTED').length,
        statusText: 'No returns this month',
        statusType: 'neutral',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'approved',
        metric: 'Approved Cases',
        count: mockCases.filter(c => c.approvalStatus === 'APPROVED').length,
        statusText: `+1 this month`,
        statusType: 'positive',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'pending',
        metric: session.role === 'ATTORNEY' ? 'Needs Review' : 'Pending Approval',
        count: mockCases.filter(c => c.approvalStatus === 'PENDING').length,
        statusText: 'Awaiting review',
        statusType: 'neutral',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'closed_cases',
        metric: 'Closed Cases',
        count: mockCases.filter(c => c.status === 'Closed').length,
        statusText: `+0 this month`,
        statusType: 'positive',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'total_flags',
        metric: 'Total Flags',
        count: 0,
        statusText: 'No flags active',
        statusType: 'neutral',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'top_category',
        metric: 'Top Case Category',
        count: 5,
        statusText: 'Personal Injury',
        statusType: 'neutral',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'top_approved_category',
        metric: 'Top Approved Case Category',
        count: 3,
        statusText: 'Personal Injury',
        statusType: 'positive',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'top_rejected_category',
        metric: 'Top Rejected Case Category',
        count: 0,
        statusText: 'N/A',
        statusType: 'negative',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'top_closed_category',
        metric: 'Top Closed Case Category',
        count: 1,
        statusText: 'Medical Malpractice',
        statusType: 'positive',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'ai_usage',
        metric: 'AI Usage (Pages)',
        count: mockDocuments.length * 10,
        statusText: 'Pages analyzed by AI',
        statusType: 'positive',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'turnaround_time',
        metric: 'Turnaround Time',
        count: 4,
        statusText: 'Average to close cases (days)',
        statusType: 'warning',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'top_attorney',
        metric: 'Top Attorney',
        count: 10,
        statusText: 'Jane Smith',
        statusType: 'positive',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'top_paralegal',
        metric: 'Top Paralegal',
        count: 15,
        statusText: 'Emily Davis',
        statusType: 'positive',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'top_managing_partner',
        metric: 'Top Managing Partner',
        count: 5,
        statusText: 'Sarah Lee',
        statusType: 'positive',
        lastUpdated: new Date().toISOString()
      }
    ];

    if (session.role === 'ATTORNEY') {
      const allowedAttorneyMetrics = ['my_cases', 'pending', 'approved', 'returned', 'top_approved_category', 'top_rejected_category'];
      metricsData = metricsData.filter((m: any) => allowedAttorneyMetrics.includes(m.id));
    } else if (session.role === 'ADMIN') {
      const allowedAdminMetrics = [
        'my_cases', 'pending', 'closed_cases', 'approved', 'returned', 
        'ai_usage', 'turnaround_time',
        'top_category', 'top_approved_category', 'top_rejected_category', 'top_closed_category',
        'top_managing_partner', 'top_attorney', 'top_paralegal'
      ];
      metricsData = metricsData.filter((m: any) => allowedAdminMetrics.includes(m.id));
    } else if (session.role === 'MANAGING_PARTNER') {
      const allowedManagingPartnerMetrics = ['my_cases', 'pending', 'closed_cases', 'approved', 'returned', 'top_attorney', 'top_paralegal', 'top_category', 'top_approved_category', 'top_rejected_category', 'top_closed_category'];
      metricsData = metricsData.filter((m: any) => allowedManagingPartnerMetrics.includes(m.id));
    } else {
      // Paralegal role
      const allowedParalegalMetrics = ['my_cases', 'analyzed', 'missing_docs', 'returned', 'approved', 'pending', 'top_category', 'top_approved_category', 'top_rejected_category'];
      metricsData = metricsData.filter((m: any) => allowedParalegalMetrics.includes(m.id));
    }

    return NextResponse.json({ success: true, data: metricsData });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
