'use client'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Label } from 'recharts'

export function DashboardCharts() {
  const lineData = [
    { name: 'Jan', Approved: 0, Rejected: 0, Created: 0, Closed: 0 },
    { name: 'Feb', Approved: 0, Rejected: 0, Created: 0, Closed: 0 },
    { name: 'Mar', Approved: 0, Rejected: 0, Created: 0, Closed: 0 },
    { name: 'Apr', Approved: 0, Rejected: 0, Created: 0, Closed: 0 },
    { name: 'May', Approved: 0, Rejected: 0, Created: 0, Closed: 0 },
    { name: 'Jun', Approved: 0, Rejected: 0, Created: 0, Closed: 0 },
    { name: 'Jul', Approved: 0, Rejected: 0, Created: 0, Closed: 0 },
    { name: 'Aug', Approved: 0, Rejected: 0, Created: 4, Closed: 0 },
    { name: 'Sep', Approved: 0, Rejected: 0, Created: 0, Closed: 0 },
    { name: 'Oct', Approved: 0, Rejected: 0, Created: 0, Closed: 0 },
    { name: 'Nov', Approved: 0, Rejected: 0, Created: 0, Closed: 0 },
    { name: 'Dec', Approved: 0, Rejected: 0, Created: 0, Closed: 0 },
  ];

  const donutData = [
    { name: 'Medical Malpractice', value: 2, color: '#0ea5e9' },
    { name: 'Other', value: 1, color: '#10b981' },
    { name: 'Personal Injury', value: 1, color: '#f59e0b' },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-100 shadow-lg rounded-lg">
          <p className="font-bold text-slate-800 mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
              <span className="text-slate-600 font-medium">{entry.name}:</span>
              <span className="font-bold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <ul className="flex items-center justify-end gap-4 text-xs font-medium text-slate-600">
        {payload.map((entry: any, index: number) => (
          <li key={`item-${index}`} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
            {entry.value}
          </li>
        ))}
      </ul>
    );
  };

  const renderDonutLegend = (props: any) => {
    const { payload } = props;
    return (
      <ul className="flex flex-col justify-center gap-3 text-xs font-medium text-slate-600 ml-4">
        {payload.map((entry: any, index: number) => (
          <li key={`item-${index}`} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.payload.color }}></span>
            {entry.value}
          </li>
        ))}
      </ul>
    );
  };

  const renderCustomizedLabel = (props: any) => {
    const { cx, cy, viewBox } = props;
    const actualCx = cx || (viewBox && viewBox.cx) || "35%";
    const actualCy = cy || (viewBox && viewBox.cy) || "50%";
    return (
      <g>
        <text x={actualCx} y={actualCy} dy={-5} textAnchor="middle" dominantBaseline="middle" className="fill-slate-800 text-2xl font-bold">
          4
        </text>
        <text x={actualCx} y={actualCy} dy={15} textAnchor="middle" dominantBaseline="middle" className="fill-slate-400 text-[10px] font-bold tracking-wider">
          CASES
        </text>
      </g>
    );
  };

  return (
    <>
      {/* Chart 1 - Line Chart (Case Activity) */}
      <div className="grid-item-line bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Firm Case Activity</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Track case creation, approvals, and returns over time</p>
          </div>
          <div className="hidden sm:block">
            {/* Custom Legend placed here to match design */}
            <ul className="flex items-center justify-end gap-4 text-xs font-medium text-slate-600">
              <li className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#10b981]"></span>Approved</li>
              <li className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#ef4444]"></span>Rejected</li>
              <li className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#3b82f6]"></span>Created</li>
              <li className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#8b5cf6]"></span>Closed</li>
            </ul>
          </div>
        </div>
        <div className="h-64 w-full flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCreatedArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} tickCount={5} domain={[0, 4]} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="Created" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorCreatedArea)" activeDot={{ r: 4 }} />
              <Area type="monotone" dataKey="Approved" stroke="#10b981" strokeWidth={2} fill="none" />
              <Area type="monotone" dataKey="Rejected" stroke="#ef4444" strokeWidth={2} fill="none" />
              <Area type="monotone" dataKey="Closed" stroke="#8b5cf6" strokeWidth={2} fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2 - Donut Chart (Case Distribution) */}
      <div className="grid-item-donut bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Firm Case Distribution</h3>
          <p className="text-xs text-slate-500 font-medium mt-1">Volume of all firm cases by category</p>
        </div>
        <div className="flex-1 w-full flex items-center justify-center mt-6">
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="35%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <Label content={renderCustomizedLabel} position="center" />
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend layout="vertical" verticalAlign="middle" align="right" content={renderDonutLegend} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  )
}
