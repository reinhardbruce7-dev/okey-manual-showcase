import { Link } from 'react-router-dom';
import { useStore } from '../store';
import { ChevronRight } from 'lucide-react';
import clsx from 'clsx';

const statusStyles = {
  'Quotation Review': 'bg-amber-50 text-amber-700 border-amber-200',
  'Supplier Selected': 'bg-blue-50 text-blue-700 border-blue-200',
  'PO Created': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Shipment': 'bg-cyan-50 text-cyan-700 border-cyan-200',
  'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const priorityStyles = {
  'High': 'bg-red-50 text-red-700',
  'Medium': 'bg-amber-50 text-amber-700',
  'Low': 'bg-gray-50 text-gray-600',
};

export default function RFQs() {
  const { rfqs } = useStore();

  return (
    <div className="animate-fade-in max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Request for Quotations</h1>
          <p className="text-sm text-gray-500 mt-1">{rfqs.length} active RFQs</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">RFQ ID</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Destination</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Deadline</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Suppliers</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Quotations</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rfqs.map((rfq) => (
                <tr key={rfq.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <Link to={`/rfqs/${rfq.id}`} className="text-sm font-semibold text-accent hover:underline">
                      {rfq.id}
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-sm font-medium text-gray-900">{rfq.product}</div>
                    <div className="text-xs text-gray-500 mt-0.5 max-w-[200px] truncate">{rfq.specification}</div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-700">{rfq.quantity} {rfq.unit}</td>
                  <td className="px-5 py-4 text-sm text-gray-700">{rfq.destination}</td>
                  <td className="px-5 py-4 text-sm text-gray-700">{rfq.deadline}</td>
                  <td className="px-5 py-4 text-sm text-gray-700">{rfq.suppliersInvited.length}</td>
                  <td className="px-5 py-4 text-sm text-gray-700">{rfq.quotations.length}</td>
                  <td className="px-5 py-4">
                    <span className={clsx('px-2 py-0.5 rounded-full text-[10px] font-semibold', priorityStyles[rfq.priority])}>
                      {rfq.priority}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={clsx('px-2.5 py-0.5 rounded-full text-[11px] font-medium border', statusStyles[rfq.status] || 'bg-gray-50 text-gray-600')}>
                      {rfq.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <Link to={`/rfqs/${rfq.id}`} className="text-gray-400 hover:text-accent">
                      <ChevronRight size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
