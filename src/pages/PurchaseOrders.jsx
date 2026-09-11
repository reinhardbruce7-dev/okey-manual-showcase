import { useStore } from '../store';
import { FileText, Download, Printer, Eye } from 'lucide-react';
import clsx from 'clsx';

const statusStyles = {
  'Awaiting Confirmation': 'bg-amber-50 text-amber-700 border-amber-200',
  'Confirmed': 'bg-blue-50 text-blue-700 border-blue-200',
  'In Production': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Shipped': 'bg-cyan-50 text-cyan-700 border-cyan-200',
  'Delivered': 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export default function PurchaseOrders() {
  const { purchaseOrders } = useStore();

  return (
    <div className="animate-fade-in max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Purchase Orders</h1>
        <p className="text-sm text-gray-500 mt-1">{purchaseOrders.length} purchase orders</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {purchaseOrders.map((po) => (
          <div key={po.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FileText size={16} className="text-gray-400" />
                  <h3 className="text-sm font-bold text-gray-900">{po.id}</h3>
                  <span className={clsx('px-2 py-0.5 rounded-full text-[10px] font-semibold border', statusStyles[po.status])}>
                    {po.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500">Created {po.createdAt}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider">Supplier</div>
                <div className="text-xs font-medium text-gray-900 mt-0.5">{po.supplierName}</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider">Product</div>
                <div className="text-xs font-medium text-gray-900 mt-0.5">{po.product}</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider">Quantity</div>
                <div className="text-xs font-medium text-gray-900 mt-0.5">{po.quantity} {po.unit}</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider">Total</div>
                <div className="text-xs font-bold text-gray-900 mt-0.5">{po.currency} {po.total.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider">Payment</div>
                <div className="text-xs text-gray-700 mt-0.5">{po.paymentTerms}</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider">Incoterms</div>
                <div className="text-xs text-gray-700 mt-0.5">{po.incoterms}</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider">Expected Delivery</div>
                <div className="text-xs text-gray-700 mt-0.5">{po.expectedDelivery}</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider">RFQ</div>
                <div className="text-xs text-gray-700 mt-0.5">{po.rfqId}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <Download size={12} /> Download PO
              </button>
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <Printer size={12} /> Print
              </button>
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-accent bg-accent/5 rounded-lg hover:bg-accent/10 transition-colors">
                <Eye size={12} /> View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
