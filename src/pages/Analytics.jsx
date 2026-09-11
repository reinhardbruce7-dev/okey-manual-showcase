import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { analyticsData } from '../data/activity';
import { TrendingUp, Clock, DollarSign, Percent, Target, BarChart3 } from 'lucide-react';
import clsx from 'clsx';

const COLORS = ['#1a2840', '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#06b6d4'];

const kpis = [
  { label: 'Total Procurement Spend', value: '$1.24M', change: '+12%', icon: DollarSign, color: 'bg-blue-500' },
  { label: 'Average Lead Time', value: '31 days', change: '-3 days', icon: Clock, color: 'bg-emerald-500' },
  { label: 'Total Savings', value: '$142K', change: '+18%', icon: TrendingUp, color: 'bg-purple-500' },
  { label: 'RFQ Conversion Rate', value: '78%', change: '+5%', icon: Target, color: 'bg-amber-500' },
  { label: 'Quotation Response Rate', value: '92%', change: '+2%', icon: BarChart3, color: 'bg-cyan-500' },
  { label: 'On-Time Delivery', value: '89%', change: '+4%', icon: Percent, color: 'bg-indigo-500' },
];

export default function Analytics() {
  return (
    <div className="animate-fade-in max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Procurement performance insights</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center mb-2', kpi.color)}>
                <Icon size={16} className="text-white" />
              </div>
              <div className="text-lg font-bold text-gray-900">{kpi.value}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">{kpi.label}</div>
              <div className="text-[11px] text-emerald-600 font-medium mt-1">{kpi.change}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Monthly Procurement Spend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={analyticsData.monthlySpend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v) => [`$${v.toLocaleString()}`, 'Spend']} />
              <Bar dataKey="spend" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Category Spend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={analyticsData.categorySpend}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="amount"
                nameKey="category"
              >
                {analyticsData.categorySpend.map((entry, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`$${v.toLocaleString()}`]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            {analyticsData.categorySpend.map((cat, i) => (
              <div key={cat.category} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-[10px] text-gray-600">{cat.category}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Supplier Performance</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={analyticsData.supplierPerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={90} />
              <Tooltip />
              <Bar dataKey="score" fill="#1a2840" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Savings Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={[
              { month: 'Apr', savings: 18000 },
              { month: 'May', savings: 24000 },
              { month: 'Jun', savings: 21000 },
              { month: 'Jul', savings: 32000 },
              { month: 'Aug', savings: 28000 },
              { month: 'Sep', savings: 19000 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v) => [`$${v.toLocaleString()}`, 'Savings']} />
              <Line type="monotone" dataKey="savings" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
