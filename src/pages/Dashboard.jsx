import { useStore } from '../store';
import { Link } from 'react-router-dom';
import {
  FileText, FileCheck, ShoppingCart, Truck, TrendingDown, Users,
  ArrowRight, FileText as FileTextIcon, Brain, CheckCircle, Ship, ChevronRight
} from 'lucide-react';
import clsx from 'clsx';
import { recentActivity } from '../data/activity';

const activityIcons = {
  'file-text': FileTextIcon,
  'brain': Brain,
  'arrow-right': ArrowRight,
  'check-circle': CheckCircle,
  'file-plus': FileCheck,
  'ship': Ship,
};

const activityColors = {
  'quotation_received': 'bg-blue-100 text-blue-600',
  'ai_extraction': 'bg-purple-100 text-purple-600',
  'rfq_update': 'bg-amber-100 text-amber-600',
  'supplier_selected': 'bg-emerald-100 text-emerald-600',
  'po_created': 'bg-indigo-100 text-indigo-600',
  'shipment': 'bg-cyan-100 text-cyan-600',
};

const pipeline = [
  { label: 'RFQ', count: 12 },
  { label: 'Quotations', count: 8 },
  { label: 'Comparison', count: 5 },
  { label: 'Supplier Selected', count: 3 },
  { label: 'PO', count: 6 },
  { label: 'Shipment', count: 4 },
];

export default function Dashboard() {
  const { rfqs, quotations, purchaseOrders, shipments, suppliers } = useStore();

  const stats = [
    { label: 'Active RFQs', value: '12', icon: FileText, color: 'bg-blue-500', change: '+2 this week' },
    { label: 'Pending Quotations', value: '8', icon: FileCheck, color: 'bg-amber-500', change: '+3 this week' },
    { label: 'Orders in Progress', value: '6', icon: ShoppingCart, color: 'bg-indigo-500', change: '2 shipping' },
    { label: 'Shipments', value: '4', icon: Truck, color: 'bg-cyan-500', change: '2 in transit' },
    { label: 'Potential Savings', value: '₦18.4M', icon: TrendingDown, color: 'bg-emerald-500', change: 'vs last quarter' },
    { label: 'Suppliers', value: '126', icon: Users, color: 'bg-purple-500', change: '+8 new' },
  ];

  return (
    <div className="animate-fade-in max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Procurement overview for Okey Manual Company</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-gray-900">September 2026</div>
          <div className="text-xs text-gray-500">Q3 Procurement Cycle</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center', stat.color)}>
                  <Icon size={20} className="text-white" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              <div className="text-[11px] text-gray-400 mt-1">{stat.change}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Procurement Pipeline</h2>
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
            {pipeline.map((stage, i) => (
              <div key={stage.label} className="flex items-center gap-2 min-w-0">
                <div className="flex-1 min-w-[100px]">
                  <div className="bg-navy-800 text-white rounded-lg px-4 py-3 text-center">
                    <div className="text-xl font-bold">{stage.count}</div>
                    <div className="text-[11px] text-navy-300 mt-1">{stage.label}</div>
                  </div>
                </div>
                {i < pipeline.length - 1 && (
                  <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3 max-h-[340px] overflow-y-auto scrollbar-thin">
            {recentActivity.map((activity) => {
              const Icon = activityIcons[activity.icon] || FileText;
              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={clsx('w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0', activityColors[activity.type] || 'bg-gray-100 text-gray-500')}>
                    <Icon size={14} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-700 leading-snug">{activity.message}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Active RFQs</h2>
            <Link to="/rfqs" className="text-sm text-accent hover:underline font-medium">View All</Link>
          </div>
          <div className="space-y-3">
            {rfqs.filter(r => r.status !== 'Completed').slice(0, 5).map((rfq) => (
              <Link
                key={rfq.id}
                to={`/rfqs/${rfq.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{rfq.product}</div>
                  <div className="text-xs text-gray-500">{rfq.id} · {rfq.destination}</div>
                </div>
                <span className={clsx(
                  'px-2 py-0.5 rounded-full text-[11px] font-medium flex-shrink-0',
                  rfq.status === 'Quotation Review' ? 'bg-amber-50 text-amber-700' :
                  rfq.status === 'Supplier Selected' ? 'bg-blue-50 text-blue-700' :
                  rfq.status === 'PO Created' ? 'bg-indigo-50 text-indigo-700' :
                  rfq.status === 'Shipment' ? 'bg-cyan-50 text-cyan-700' :
                  'bg-gray-50 text-gray-700'
                )}>
                  {rfq.status}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Shipments</h2>
            <Link to="/shipments" className="text-sm text-accent hover:underline font-medium">View All</Link>
          </div>
          <div className="space-y-3">
            {shipments.map((shipment) => (
              <div key={shipment.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{shipment.id}</div>
                  <div className="text-xs text-gray-500">{shipment.origin} → {shipment.destination}</div>
                </div>
                <span className={clsx(
                  'px-2 py-0.5 rounded-full text-[11px] font-medium flex-shrink-0',
                  shipment.status === 'In Transit' ? 'bg-cyan-50 text-cyan-700' :
                  shipment.status === 'Production' ? 'bg-amber-50 text-amber-700' :
                  'bg-gray-50 text-gray-700'
                )}>
                  {shipment.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
