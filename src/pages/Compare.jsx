import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import {
  CheckCircle, Star, Shield, Clock, AlertTriangle, TrendingUp,
  Award, Brain, ChevronDown
} from 'lucide-react';
import clsx from 'clsx';

export default function Compare() {
  const { rfqs, quotations, suppliers, addToast } = useStore();
  const navigate = useNavigate();
  const [selectedRfq, setSelectedRfq] = useState('RFQ-2026-014');

  const rfq = rfqs.find(r => r.id === selectedRfq);
  const rfqQuotations = quotations.filter(q => q.rfqId === selectedRfq && q.status !== 'Rejected');

  const bestPrice = Math.min(...rfqQuotations.map(q => q.total));
  const fastestDelivery = Math.min(...rfqQuotations.map(q => parseInt(q.leadTime) || 999));
  const bestWarranty = rfqQuotations.reduce((best, q) => {
    const years = parseInt(q.warranty) || 0;
    return years > best.years ? { years, id: q.id } : best;
  }, { years: 0, id: '' });
  const bestScore = Math.max(...rfqQuotations.map(q => {
    const supplier = suppliers.find(s => s.id === q.supplierId);
    return supplier?.performance.overall || 0;
  }));

  const selectSupplier = (quotation) => {
    addToast({
      type: 'success',
      message: `${quotation.supplierName} selected. Creating purchase order...`,
    });
    setTimeout(() => {
      navigate('/purchase-orders');
    }, 1500);
  };

  return (
    <div className="animate-fade-in max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quotation Comparison</h1>
        <p className="text-sm text-gray-500 mt-1">Compare supplier quotations side by side</p>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700">RFQ:</label>
        <select
          value={selectedRfq}
          onChange={(e) => setSelectedRfq(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
        >
          {rfqs.filter(r => r.quotations.length >= 2).map(r => (
            <option key={r.id} value={r.id}>{r.id} — {r.product}</option>
          ))}
        </select>
      </div>

      {rfq && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-gray-900">{rfq.id}</span>
            <span className="text-sm text-gray-700">{rfq.product}</span>
            <span className="text-xs text-gray-500">{rfq.quantity} {rfq.unit} · {rfq.destination}</span>
          </div>
        </div>
      )}

      {rfqQuotations.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">No quotations to compare for this RFQ.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <div className={clsx('grid gap-4', `grid-cols-${Math.min(rfqQuotations.length + 1, 4)}`)}>
                <div className="space-y-4">
                  <div className="bg-white rounded-xl border border-gray-200 p-4 h-[120px] flex items-end">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Criteria</span>
                  </div>
                  {[
                    { label: 'Unit Price', icon: TrendingUp },
                    { label: 'Total Price', icon: TrendingUp },
                    { label: 'Shipping Cost', icon: TrendingUp },
                    { label: 'Total Cost', icon: TrendingUp },
                    { label: 'Lead Time', icon: Clock },
                    { label: 'Payment Terms', icon: null },
                    { label: 'Warranty', icon: Shield },
                    { label: 'MOQ', icon: null },
                    { label: 'Incoterms', icon: null },
                    { label: 'Supplier Score', icon: Star },
                    { label: 'Risk Level', icon: AlertTriangle },
                  ].map((row) => (
                    <div key={row.label} className="bg-white rounded-xl border border-gray-200 p-4 h-[56px] flex items-center">
                      <div className="flex items-center gap-2">
                        {row.icon && <row.icon size={14} className="text-gray-400" />}
                        <span className="text-sm font-medium text-gray-700">{row.label}</span>
                      </div>
                    </div>
                  ))}
                  <div className="bg-white rounded-xl border border-gray-200 p-4 h-[56px] flex items-center">
                    <span className="text-sm font-semibold text-gray-900">Action</span>
                  </div>
                </div>

                {rfqQuotations.map((q) => {
                  const supplier = suppliers.find(s => s.id === q.supplierId);
                  const score = supplier?.performance.overall || 0;
                  const years = parseInt(q.warranty) || 0;
                  const isBestPrice = q.total === bestPrice;
                  const isFastest = parseInt(q.leadTime) === fastestDelivery;
                  const isBestWarranty = q.id === bestWarranty.id;
                  const isBestScore = score === bestScore;

                  return (
                    <div key={q.id} className="space-y-4">
                      <div className="bg-white rounded-xl border border-gray-200 p-4 h-[120px]">
                        <div className="text-sm font-semibold text-gray-900 mb-1">{q.supplierName}</div>
                        <div className="text-xs text-gray-500">{q.id}</div>
                        <div className="text-xs text-gray-500">{q.reference}</div>
                      </div>

                      <Cell value={`${q.currency} ${q.items[0]?.unit_price?.toLocaleString()}`} />
                      <Cell value={`${q.currency} ${q.items[0]?.subtotal?.toLocaleString()}`} />
                      <Cell value={`${q.currency} ${q.shippingCost.toLocaleString()}`} highlight={isBestPrice} />
                      <Cell value={`${q.currency} ${q.total.toLocaleString()}`} highlight={isBestPrice}>
                        {isBestPrice && <Badge text="Lowest Cost" color="emerald" />}
                      </Cell>
                      <Cell value={q.leadTime} highlight={isFastest}>
                        {isFastest && <Badge text="Fastest" color="blue" />}
                      </Cell>
                      <Cell value={q.paymentTerms} />
                      <Cell value={q.warranty} highlight={isBestWarranty}>
                        {isBestWarranty && <Badge text="Best Warranty" color="purple" />}
                      </Cell>
                      <Cell value={q.moq} />
                      <Cell value={q.incoterms} />
                      <Cell value={`${score}/100`} highlight={isBestScore}>
                        {isBestScore && <Badge text="Top Supplier" color="amber" />}
                      </Cell>
                      <Cell value={supplier?.riskLevel || 'Unknown'} />

                      <div className="bg-white rounded-xl border border-gray-200 p-4 h-[56px] flex items-center">
                        <button
                          onClick={() => selectSupplier(q)}
                          className="px-3 py-1.5 bg-accent text-white rounded-lg text-xs font-semibold hover:bg-emerald-600 transition-colors"
                        >
                          Select Supplier
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-xl p-6 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Brain size={18} className="text-accent" />
              <h3 className="text-sm font-semibold">AI Recommendation</h3>
            </div>
            <p className="text-sm text-navy-200 leading-relaxed">
              {rfqQuotations.length >= 2 ? (
                <>
                  <strong className="text-white">{rfqQuotations.find(q => q.total === bestPrice)?.supplierName}</strong> offers the lowest evaluated landed cost at <strong className="text-accent">${bestPrice.toLocaleString()}</strong> while maintaining an acceptable supplier reliability score.{' '}
                  {rfqQuotations.find(q => parseInt(q.leadTime) === fastestDelivery)?.supplierName !== rfqQuotations.find(q => q.total === bestPrice)?.supplierName && (
                    <><strong className="text-white">{rfqQuotations.find(q => parseInt(q.leadTime) === fastestDelivery)?.supplierName}</strong> has the fastest delivery time.{' '}</>
                  )}
                  For long-term value, consider the supplier with the best warranty coverage and overall performance score.
                </>
              ) : (
                'Select multiple quotations to compare and receive AI recommendations.'
              )}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function Cell({ value, highlight, children }) {
  return (
    <div className={clsx(
      'bg-white rounded-xl border p-4 h-[56px] flex items-center gap-2',
      highlight ? 'border-accent/30 bg-accent/5' : 'border-gray-200'
    )}>
      <span className="text-sm text-gray-700 truncate">{value}</span>
      {children}
    </div>
  );
}

function Badge({ text, color }) {
  const colors = {
    emerald: 'bg-emerald-100 text-emerald-700',
    blue: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
    amber: 'bg-amber-100 text-amber-700',
  };
  return (
    <span className={clsx('px-1.5 py-0.5 rounded text-[9px] font-semibold whitespace-nowrap', colors[color])}>
      {text}
    </span>
  );
}
