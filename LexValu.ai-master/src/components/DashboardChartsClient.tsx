"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0ea5e9', '#14b8a6', '#f59e0b', '#ec4899', '#8b5cf6', '#94a3b8'];

interface DashboardChartsClientProps {
  lineData: { name: string; metric1: number; metric2: number; metric3?: number; metric4?: number }[];
  donutData: { name: string; value: number; approved?: number; returned?: number; closed?: number }[];
  totalMetric: number;
  isAttorney?: boolean;
  isManagingPartner?: boolean;
  isAdmin?: boolean;
}

const CustomDonutTooltip = ({ active, payload, isAttorney, isManagingPartner, isAdmin }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
        <p className="font-bold text-slate-800 mb-1">{data.name}</p>
        {isManagingPartner ? (
          <>
            <p className="text-sm text-slate-600 font-medium flex justify-between gap-4 mb-1">
              <span>Total Cases:</span> <span>{data.value}</span>
            </p>
            <p className="text-sm text-purple-600 font-medium flex justify-between gap-4 mb-1">
              <span>Closed:</span> <span>{data.closed || 0}</span>
            </p>
            <p className="text-sm text-emerald-600 font-medium flex justify-between gap-4">
              <span>Approved:</span> <span>{data.approved}</span>
            </p>
            <p className="text-sm text-rose-600 font-medium flex justify-between gap-4">
              <span>Rejected:</span> <span>{data.returned}</span>
            </p>
          </>
        ) : isAttorney ? (
          <>
            <p className="text-sm text-emerald-600 font-medium flex justify-between gap-4 mb-1">
              <span>Approved:</span> <span>{data.approved}</span>
            </p>
            <p className="text-sm text-rose-600 font-medium flex justify-between gap-4">
              <span>Returned:</span> <span>{data.returned}</span>
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-slate-600 font-medium flex justify-between gap-4 mb-1">
              <span>Created:</span> <span>{data.value}</span>
            </p>
            <p className="text-sm text-emerald-600 font-medium flex justify-between gap-4">
              <span>Approved:</span> <span>{data.approved || 0}</span>
            </p>
            <p className="text-sm text-rose-600 font-medium flex justify-between gap-4">
              <span>Rejected:</span> <span>{data.returned || 0}</span>
            </p>
          </>
        )}
      </div>
    );
  }
  return null;
};

export function DashboardChartsClient({ lineData, donutData, totalMetric, isAttorney = false, isManagingPartner = false, isAdmin = false }: DashboardChartsClientProps) {
  
  const metric1Label = 'Approved';
  const metric2Label = isAttorney && !isManagingPartner && !isAdmin ? 'Returned' : 'Rejected';
  const metric3Label = (!isAttorney || isManagingPartner || isAdmin) ? 'Created' : undefined;
  const metric4Label = (isAdmin || isManagingPartner) ? 'Closed' : undefined;
  
  let donutTitle = 'Case Distribution';
  let donutSubtitle = 'Volume of cases by category';
  
  if (isAdmin) {
    donutTitle = 'Firm Case Distribution';
    donutSubtitle = 'Volume of all firm cases by category';
  } else if (isManagingPartner) {
    donutTitle = 'Team Case Distribution';
    donutSubtitle = 'Volume of all team cases by category';
  } else if (isAttorney) {
    donutTitle = 'Approval Activity';
    donutSubtitle = 'Approvals by case type';
  }

  let lineTitle = 'Processing Activity';
  let lineSubtitle = 'Track cases processed and risk flags detected';
  
  if (isAdmin) {
    lineTitle = 'Firm Case Activity';
    lineSubtitle = 'Track case creation, approvals, and returns over time';
  } else if (isManagingPartner) {
    lineTitle = 'Team Case Activity';
    lineSubtitle = 'Track case creation, approvals, and returns over time';
  } else if (isAttorney) {
    lineTitle = 'Performance Trends';
    lineSubtitle = 'Track your approval rates over time';
  }

  return (
    <>
      {/* Line Chart: Processing Trend */}
      <div className="grid-item-line bg-white rounded-2xl border border-slate-200/50 shadow-md shadow-slate-200/50 p-6 flex flex-col h-full">
        <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 relative z-10">
          <div>
            <h3 className="text-lg font-bold text-slate-800">{lineTitle}</h3>
            <p className="text-sm text-slate-500 mt-0.5">{lineSubtitle}</p>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
              <span className="text-xs font-semibold text-slate-600">{metric1Label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="text-xs font-semibold text-slate-600">{metric2Label}</span>
            </div>
            {((!isAttorney || isManagingPartner || isAdmin)) && (
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span className="text-xs font-semibold text-slate-600">{metric3Label}</span>
              </div>
            )}
            {(isAdmin || isManagingPartner) && (
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                <span className="text-xs font-semibold text-slate-600">{metric4Label}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-grow w-full relative z-10 min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMetric1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorMetric2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
                {((!isAttorney || isManagingPartner || isAdmin)) && (
                  <linearGradient id="colorMetric3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                )}
                {(isAdmin || isManagingPartner) && (
                  <linearGradient id="colorMetric4" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                )}
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <RechartsTooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ fontWeight: 600 }}
              />
              <Area type="monotone" dataKey="metric1" name={metric1Label} stroke="#0d9488" strokeWidth={2} fillOpacity={1} fill="url(#colorMetric1)" />
              <Area type="monotone" dataKey="metric2" name={metric2Label} stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorMetric2)" />
              {((!isAttorney || isManagingPartner || isAdmin)) && (
                <Area type="monotone" dataKey="metric3" name={metric3Label} stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorMetric3)" />
              )}
              {(isAdmin || isManagingPartner) && (
                <Area type="monotone" dataKey="metric4" name={metric4Label} stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorMetric4)" />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Donut Chart */}
      <div className={`grid-item-donut bg-white rounded-2xl border border-slate-200/50 shadow-md shadow-slate-200/50 p-6 flex flex-col relative overflow-hidden group ${
        isAttorney ? 'hover:shadow-emerald-100/50' : 'hover:shadow-teal-100/50'
      } transition-all`}>
        {/* Decorative background circle */}
        <div className={`absolute -right-16 -top-16 w-48 h-48 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none ${
          isAttorney ? 'bg-emerald-100' : 'bg-teal-100'
        }`}></div>

        <div className="mb-2 relative z-10">
          <h3 className="text-lg font-bold text-slate-800">{donutTitle}</h3>
          <p className="text-sm text-slate-500 mt-0.5">{donutSubtitle}</p>
        </div>
        
        {donutData.length > 0 ? (
          <div className="h-auto md:h-[300px] w-full relative z-10 flex flex-col md:flex-row items-center justify-between mt-4 gap-6 md:gap-0">
            {/* Chart Area */}
            <div className="relative w-full md:w-[55%] h-[250px] md:h-full flex items-center justify-center">
              <>
                {/* Placed before ResponsiveContainer so the Tooltip renders ON TOP of this text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
                  <span className="text-4xl font-bold text-slate-800 leading-none">{totalMetric}</span>
                  <span className="text-[12px] font-semibold text-slate-400 uppercase tracking-widest mt-1.5">{isAttorney && !isManagingPartner ? 'Total' : 'Cases'}</span>
                </div>
                <ResponsiveContainer width="100%" height="100%" className="z-10 relative">
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={115}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {donutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      content={<CustomDonutTooltip isAttorney={isAttorney} isManagingPartner={isManagingPartner} isAdmin={isAdmin} />}
                      cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3' }}
                      wrapperStyle={{ zIndex: 50 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </>
            </div>

            {/* Custom Legend Area */}
            <div className="w-full md:w-[40%] flex flex-row md:flex-col flex-wrap justify-center gap-3.5 md:pl-4 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0">
              {donutData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2.5">
                  <div 
                    className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-[13px] font-medium text-slate-600 truncate" title={entry.name}>
                    {entry.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-[250px] w-full relative z-10 flex flex-col items-center justify-center mt-2">
            <div className="w-28 h-28 rounded-full border-4 border-dashed border-slate-200 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-slate-300">0</span>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{isAttorney && !isManagingPartner ? 'Total' : 'Cases'}</span>
            </div>
            <p className="text-xs font-medium text-slate-400 mt-4">No categories data yet</p>
          </div>
        )}
      </div>
    </>
  )
}
