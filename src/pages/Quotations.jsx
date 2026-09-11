import { Link } from 'react-router-dom';
import { useStore } from '../store';
import { Plus } from 'lucide-react';
import clsx from 'clsx';

const statusStyles = {
  'Approved': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Shortlisted': 'bg-blue-50 text-blue-700 border-blue-200',
  'Needs Review': 'bg-amber-50 text-amber-700 border-amber-200',
  'Rejected': 'bg-red-50 text-red-700 border-red-200',
};

const aiStatusStyles = {
  'AI Extracted': 'bg-purple-50 text-purple-700',
  'Manually Entered': 'bg-gray-50 text-gray-600',
};

export default function Quotations() {
  const { quotations } = useStore();

  return (
    <div className="animate-fade-in max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quotations</h1>
          <p className="text-sm text-gray-500 mt-1">{quotations.length} quotations in system</p>
        </div>
        <Link
          to="/quotations/add"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent text-white rounded-lg text-sm font-semibold hover:bg-emerald-600 transition-colors"
        >
          <Plus size={16} /> Add Quotation
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Supplier</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">RFQ</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Currency</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Lead Time</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">AI Status</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {quotations.map((q) => (
                <tr key={q.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="text-sm font-medium text-gray-900">{q.supplierName}</div>
                    <div className="text-xs text-gray-500">{q.id}</div>
                  </td>
                  <td className="px-5 py-4">
                    <Link to={`/rfqs/${q.rfqId}`} className="text-sm text-accent hover:underline">{q.rfqId}</Link>
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-gray-900">{q.currency} {q.total.toLocaleString()}</td>
                  <td className="px-5 py-4 text-sm text-gray-700">{q.currency}</td>
                  <td className="px-5 py-4 text-sm text-gray-700">{q.leadTime}</td>
                  <td className="px-5 py-4 text-sm text-gray-700 max-w-[140px] truncate">{q.paymentTerms}</td>
                  <td className="px-5 py-4">
                    <span className={clsx('px-2 py-0.5 rounded-full text-[10px] font-medium', aiStatusStyles[q.aiStatus])}>
                      {q.aiStatus}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={clsx('px-2.5 py-0.5 rounded-full text-[11px] font-medium border', statusStyles[q.status])}>
                      {q.status}
                    </span>
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
