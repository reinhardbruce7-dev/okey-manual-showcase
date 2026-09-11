import { useParams, Link } from 'react-router-dom';
import { useStore } from '../store';
import { ArrowLeft, Plus, FileText, CheckCircle, Clock, Star } from 'lucide-react';
import clsx from 'clsx';

export default function RFQDetail() {
  const { id } = useParams();
  const { rfqs, suppliers, quotations } = useStore();
  const rfq = rfqs.find(r => r.id === id);

  if (!rfq) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">RFQ not found.</p>
        <Link to="/rfqs" className="text-accent hover:underline mt-2 inline-block">Back to RFQs</Link>
      </div>
    );
  }

  const invitedSuppliers = rfq.suppliersInvited.map(sid => suppliers.find(s => s.id === sid)).filter(Boolean);
  const rfqQuotations = rfq.quotations.map(qid => quotations.find(q => q.id === qid)).filter(Boolean);

  const statusStyles = {
    'Quotation Review': 'bg-amber-50 text-amber-700 border-amber-200',
    'Supplier Selected': 'bg-blue-50 text-blue-700 border-blue-200',
    'PO Created': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'Shipment': 'bg-cyan-50 text-cyan-700 border-cyan-200',
    'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  return (
    <div className="animate-fade-in max-w-6xl mx-auto space-y-6">
      <Link to="/rfqs" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft size={16} /> Back to RFQs
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{rfq.id}</h1>
              <span className={clsx('px-2.5 py-0.5 rounded-full text-xs font-semibold border', statusStyles[rfq.status])}>
                {rfq.status}
              </span>
            </div>
            <h2 className="text-lg text-gray-700">{rfq.product}</h2>
          </div>
          <Link
            to={`/quotations/add?rfqId=${rfq.id}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent text-white rounded-lg text-sm font-semibold hover:bg-emerald-600 transition-colors"
          >
            <Plus size={16} /> Add Quotation
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 p-4 bg-gray-50 rounded-lg">
          <div>
            <div className="text-[11px] text-gray-400 uppercase tracking-wider">Quantity</div>
            <div className="text-sm font-semibold text-gray-900 mt-1">{rfq.quantity} {rfq.unit}</div>
          </div>
          <div>
            <div className="text-[11px] text-gray-400 uppercase tracking-wider">Destination</div>
            <div className="text-sm font-semibold text-gray-900 mt-1">{rfq.destination}</div>
          </div>
          <div>
            <div className="text-[11px] text-gray-400 uppercase tracking-wider">Deadline</div>
            <div className="text-sm font-semibold text-gray-900 mt-1">{rfq.deadline}</div>
          </div>
          <div>
            <div className="text-[11px] text-gray-400 uppercase tracking-wider">Budget</div>
            <div className="text-sm font-semibold text-gray-900 mt-1">${rfq.budget?.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Specifications</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-700 leading-relaxed">{rfq.specification}</p>
        </div>
        {rfq.notes && (
          <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
            <span className="text-xs font-semibold text-amber-700">Note:</span>
            <span className="text-sm text-amber-800 ml-2">{rfq.notes}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Invited Suppliers ({invitedSuppliers.length})</h3>
          <div className="space-y-3">
            {invitedSuppliers.map((supplier) => (
              <div key={supplier.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="min-w-0">
                  <Link to={`/suppliers/${supplier.id}`} className="text-sm font-medium text-gray-900 hover:text-accent truncate block">
                    {supplier.name}
                  </Link>
                  <div className="text-xs text-gray-500">{supplier.country} · {supplier.category}</div>
                </div>
                <div className="flex items-center gap-1 ml-3">
                  <Star size={12} className="text-amber-400 fill-amber-400" />
                  <span className="text-xs font-semibold text-gray-700">{supplier.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Received Quotations ({rfqQuotations.length})</h3>
            <Link
              to={`/quotations/add?rfqId=${rfq.id}`}
              className="text-xs text-accent hover:underline font-medium"
            >
              + Add
            </Link>
          </div>
          {rfqQuotations.length === 0 ? (
            <div className="text-center py-8">
              <FileText size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-400">No quotations received yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rfqQuotations.map((q) => (
                <div key={q.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{q.supplierName}</div>
                    <div className="text-xs text-gray-500">{q.id} · {q.reference}</div>
                  </div>
                  <div className="flex items-center gap-3 ml-3">
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">{q.currency} {q.total.toLocaleString()}</div>
                      <div className="text-[10px] text-gray-500">{q.leadTime}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={clsx(
                        'px-2 py-0.5 rounded-full text-[10px] font-medium',
                        q.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' :
                        q.status === 'Shortlisted' ? 'bg-blue-50 text-blue-700' :
                        q.status === 'Needs Review' ? 'bg-amber-50 text-amber-700' :
                        'bg-gray-50 text-gray-700'
                      )}>{q.status}</span>
                      {q.aiStatus === 'AI Extracted' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-50 text-purple-700">
                          AI Extracted
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
