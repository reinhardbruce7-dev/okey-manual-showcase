import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useStore } from '../store';
import {
  ArrowLeft, CheckCircle, AlertTriangle, Brain, Edit3, Eye, FileText
} from 'lucide-react';
import clsx from 'clsx';

export default function AIReview() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addQuotation, addToast } = useStore();

  const extractedData = location.state?.extractedData;
  const rfqId = location.state?.rfqId || 'RFQ-2026-014';
  const fileName = location.state?.fileName || 'quotation.pdf';

  const [form, setForm] = useState({
    supplier_name: extractedData?.supplier_name || '',
    supplier_contact: extractedData?.supplier_contact || '',
    quotation_reference: extractedData?.quotation_reference || '',
    quotation_date: extractedData?.quotation_date || '',
    valid_until: extractedData?.valid_until || '',
    currency: extractedData?.currency || 'USD',
    product_name: extractedData?.items?.[0]?.product_name || '',
    specification: extractedData?.items?.[0]?.specification || '',
    quantity: extractedData?.items?.[0]?.quantity || 0,
    unit: extractedData?.items?.[0]?.unit || 'units',
    unit_price: extractedData?.items?.[0]?.unit_price || 0,
    discount: extractedData?.discount || 0,
    tax: extractedData?.tax || 0,
    shipping_cost: extractedData?.shipping_cost || 0,
    freight_method: extractedData?.freight_method || '',
    incoterms: extractedData?.incoterms || '',
    lead_time: extractedData?.lead_time || '',
    estimated_delivery: extractedData?.estimated_delivery || '',
    payment_terms: extractedData?.payment_terms || '',
    warranty: extractedData?.warranty || '',
    moq: extractedData?.moq || '',
    notes: extractedData?.notes || '',
  });

  const [fieldConfidence, setFieldConfidence] = useState(() => {
    const conf = {};
    Object.keys(form).forEach(key => {
      const val = form[key];
      if (val === '' || val === 0 || val === 'Not found') {
        conf[key] = 'low';
      } else if (typeof val === 'string' && val.length > 20) {
        conf[key] = 'medium';
      } else {
        conf[key] = 'high';
      }
    });
    return conf;
  });

  const subtotal = form.quantity * form.unit_price;
  const total = subtotal - form.discount + form.tax + form.shipping_cost;

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleApprove = () => {
    addQuotation({
      rfqId,
      supplierName: form.supplier_name,
      reference: form.quotation_reference,
      date: form.quotation_date,
      validUntil: form.valid_until,
      currency: form.currency,
      items: [{
        product_name: form.product_name,
        specification: form.specification,
        quantity: form.quantity,
        unit: form.unit,
        unit_price: form.unit_price,
        subtotal,
      }],
      discount: form.discount,
      tax: form.tax,
      shippingCost: form.shipping_cost,
      total,
      freightMethod: form.freight_method,
      incoterms: form.incoterms,
      leadTime: form.lead_time,
      estimatedDelivery: form.estimated_delivery,
      paymentTerms: form.payment_terms,
      warranty: form.warranty,
      moq: form.moq,
      notes: form.notes,
      aiStatus: 'AI Extracted',
      status: 'Approved',
    });

    addToast({ type: 'success', message: `Quotation successfully added to ${rfqId}.` });
    navigate(`/rfqs/${rfqId}`);
  };

  if (!extractedData && !location.state) {
    return (
      <div className="animate-fade-in max-w-3xl mx-auto text-center py-20">
        <Brain size={48} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">No extraction data</h2>
        <p className="text-sm text-gray-500 mb-4">Please upload a document first to extract quotation data.</p>
        <Link to="/quotations/add" className="text-sm text-accent hover:underline">Go to Add Quotation</Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-7xl mx-auto space-y-6">
      <Link to="/quotations/add" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft size={16} /> Back to Upload
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-1">
          <Brain size={20} className="text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-900">Review AI Extraction</h1>
        </div>
        <p className="text-sm text-gray-500 ml-8">
          Review and edit the extracted information before approving. All fields are editable.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={18} className="text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-900">Source Document</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-8 text-center border border-dashed border-gray-200">
              <FileText size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-sm font-medium text-gray-700">{fileName}</p>
              <p className="text-xs text-gray-400 mt-1">Original quotation document</p>
            </div>
            <div className="mt-4 p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Brain size={14} className="text-purple-600" />
                <span className="text-xs font-semibold text-purple-700">AI Extraction Confidence</span>
              </div>
              <div className="space-y-1.5">
                <ConfidenceRow label="Supplier" confidence={fieldConfidence.supplier_name} />
                <ConfidenceRow label="Pricing" confidence={fieldConfidence.unit_price} />
                <ConfidenceRow label="Terms" confidence={fieldConfidence.payment_terms} />
                <ConfidenceRow label="Products" confidence={fieldConfidence.product_name} />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Supplier Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ReviewField label="Supplier Name" value={form.supplier_name} field="supplier_name" confidence={fieldConfidence.supplier_name} onChange={updateField} />
              <ReviewField label="Supplier Contact" value={form.supplier_contact} field="supplier_contact" confidence={fieldConfidence.supplier_contact} onChange={updateField} />
              <ReviewField label="Quotation Reference" value={form.quotation_reference} field="quotation_reference" confidence={fieldConfidence.quotation_reference} onChange={updateField} />
              <ReviewField label="Quotation Date" value={form.quotation_date} field="quotation_date" confidence={fieldConfidence.quotation_date} onChange={updateField} />
              <ReviewField label="Valid Until" value={form.valid_until} field="valid_until" confidence={fieldConfidence.valid_until} onChange={updateField} />
              <ReviewField label="Currency" value={form.currency} field="currency" confidence={fieldConfidence.currency} onChange={updateField} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Product & Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ReviewField label="Product Name" value={form.product_name} field="product_name" confidence={fieldConfidence.product_name} onChange={updateField} full />
              <ReviewField label="Specification" value={form.specification} field="specification" confidence={fieldConfidence.specification} onChange={updateField} full textarea />
              <ReviewField label="Quantity" value={form.quantity} field="quantity" confidence={fieldConfidence.quantity} onChange={updateField} type="number" />
              <ReviewField label="Unit" value={form.unit} field="unit" confidence={fieldConfidence.unit} onChange={updateField} />
              <ReviewField label="Unit Price" value={form.unit_price} field="unit_price" confidence={fieldConfidence.unit_price} onChange={updateField} type="number" prefix="$" />
              <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-600 mb-1.5">Subtotal</label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-900">
                  ${subtotal.toLocaleString()}
                </div>
              </div>
              <ReviewField label="Discount" value={form.discount} field="discount" confidence={fieldConfidence.discount} onChange={updateField} type="number" prefix="$" />
              <ReviewField label="Tax" value={form.tax} field="tax" confidence={fieldConfidence.tax} onChange={updateField} type="number" prefix="$" />
              <ReviewField label="Shipping Cost" value={form.shipping_cost} field="shipping_cost" confidence={fieldConfidence.shipping_cost} onChange={updateField} type="number" prefix="$" />
              <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-600 mb-1.5">Total</label>
                <div className="px-3 py-2 bg-accent/5 border-2 border-accent rounded-lg text-sm font-bold text-accent">
                  ${total.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Commercial Terms</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ReviewField label="Freight Method" value={form.freight_method} field="freight_method" confidence={fieldConfidence.freight_method} onChange={updateField} />
              <ReviewField label="Incoterms" value={form.incoterms} field="incoterms" confidence={fieldConfidence.incoterms} onChange={updateField} />
              <ReviewField label="Lead Time" value={form.lead_time} field="lead_time" confidence={fieldConfidence.lead_time} onChange={updateField} />
              <ReviewField label="Estimated Delivery" value={form.estimated_delivery} field="estimated_delivery" confidence={fieldConfidence.estimated_delivery} onChange={updateField} />
              <ReviewField label="Payment Terms" value={form.payment_terms} field="payment_terms" confidence={fieldConfidence.payment_terms} onChange={updateField} full />
              <ReviewField label="Warranty" value={form.warranty} field="warranty" confidence={fieldConfidence.warranty} onChange={updateField} />
              <ReviewField label="MOQ" value={form.moq} field="moq" confidence={fieldConfidence.moq} onChange={updateField} />
              <ReviewField label="Notes" value={form.notes} field="notes" confidence={fieldConfidence.notes} onChange={updateField} full textarea />
            </div>
          </div>

          <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl border border-gray-200">
            <button
              onClick={() => navigate('/quotations/add')}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Discard
            </button>
            <button
              onClick={handleApprove}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-white rounded-lg text-sm font-semibold hover:bg-emerald-600 transition-colors"
            >
              <CheckCircle size={16} /> Approve Quotation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewField({ label, value, field, confidence, onChange, type = 'text', prefix, full, textarea }) {
  const isMissing = value === '' || value === 'Not found' || value === 0;

  return (
    <div className={full ? 'md:col-span-2' : ''}>
      <div className="flex items-center gap-2 mb-1.5">
        <label className="text-xs font-medium text-gray-600">{label}</label>
        {confidence === 'low' && (
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded text-[10px] font-medium">
            <AlertTriangle size={10} /> Needs verification
          </span>
        )}
        {confidence === 'high' && !isMissing && (
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[10px] font-medium">
            <CheckCircle size={10} /> High confidence
          </span>
        )}
      </div>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">{prefix}</span>
        )}
        {textarea ? (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(field, e.target.value)}
            className={clsx(
              'w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors min-h-[80px]',
              isMissing ? 'border-amber-300 bg-amber-50' : 'border-gray-200'
            )}
          />
        ) : (
          <input
            type={type}
            value={value || ''}
            onChange={(e) => onChange(field, type === 'number' ? Number(e.target.value) : e.target.value)}
            className={clsx(
              'w-full py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors',
              prefix ? 'pl-7 pr-3' : 'px-3',
              isMissing ? 'border-amber-300 bg-amber-50' : 'border-gray-200'
            )}
          />
        )}
      </div>
    </div>
  );
}

function ConfidenceRow({ label, confidence }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-purple-700">{label}</span>
      <span className={clsx(
        'text-[10px] font-medium',
        confidence === 'high' ? 'text-emerald-600' :
        confidence === 'medium' ? 'text-amber-600' : 'text-red-500'
      )}>
        {confidence === 'high' ? '✓ High' : confidence === 'medium' ? '⚠ Medium' : '✗ Low'}
      </span>
    </div>
  );
}
