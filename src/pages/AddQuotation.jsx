import { useState, useCallback } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useStore } from '../store';
import {
  ArrowLeft, FileText, Brain, Upload, X, File,
  CheckCircle, AlertCircle
} from 'lucide-react';
import clsx from 'clsx';

export default function AddQuotation() {
  const [searchParams] = useSearchParams();
  const preselectedRfqId = searchParams.get('rfqId') || '';
  const navigate = useNavigate();
  const { rfqs, suppliers, addQuotation, addToast } = useStore();
  const [mode, setMode] = useState(null);

  if (!mode) {
    return (
      <div className="animate-fade-in max-w-3xl mx-auto space-y-6">
        <Link to={preselectedRfqId ? `/rfqs/${preselectedRfqId}` : '/quotations'} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft size={16} /> Back
        </Link>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Add Quotation</h1>
          <p className="text-sm text-gray-500 mt-2">
            {preselectedRfqId ? `Adding quotation for ${preselectedRfqId}` : 'Choose how to add the quotation'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <button
            onClick={() => setMode('manual')}
            className="bg-white rounded-xl border-2 border-gray-200 p-8 text-left hover:border-accent hover:shadow-lg transition-all group"
          >
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
              <FileText size={28} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Manual Entry</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Enter quotation information manually using our structured procurement form.
            </p>
          </button>

          <button
            onClick={() => setMode('ai')}
            className="bg-white rounded-xl border-2 border-gray-200 p-8 text-left hover:border-accent hover:shadow-lg transition-all group"
          >
            <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors">
              <Brain size={28} className="text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Extract from Document</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Upload a supplier quotation and let Okey Manual AI extract the information automatically.
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 rounded-full">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full pulse-dot" />
              <span className="text-[11px] font-medium text-purple-700">Powered by Gemini AI</span>
            </div>
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'ai') {
    return <AIExtractionFlow rfqId={preselectedRfqId} onBack={() => setMode(null)} onSwitchToManual={() => setMode('manual')} />;
  }

  return <ManualEntryFlow rfqId={preselectedRfqId} onBack={() => setMode(null)} />;
}

function AIExtractionFlow({ rfqId, onBack, onSwitchToManual }) {
  const navigate = useNavigate();
  const { rfqs, addQuotation, addToast } = useStore();
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('');
  const [error, setError] = useState(null);

  const stages = [
    'Reading document',
    'Identifying supplier',
    'Extracting products',
    'Analyzing pricing',
    'Extracting commercial terms',
    'Preparing structured quotation',
  ];

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) setFile(selectedFile);
  };

  const extractWithAI = async () => {
    if (!file) return;
    setExtracting(true);
    setError(null);
    setProgress(0);

    for (let i = 0; i < stages.length; i++) {
      setStage(stages[i]);
      setProgress(Math.round(((i + 1) / stages.length) * 90));
      await new Promise(r => setTimeout(r, 800));
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (rfqId) formData.append('rfqId', rfqId);

      const response = await fetch('/api/extract-quotation', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      setProgress(100);
      setStage('Extraction Complete');

      await new Promise(r => setTimeout(r, 600));

      navigate('/quotations/ai-review', {
        state: { extractedData: data, rfqId, fileName: file.name },
      });
    } catch (err) {
      setError(err.message || 'AI extraction failed. Please try again or enter the quotation manually.');
      setExtracting(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-6">
      <button onClick={onBack} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Brain size={32} className="text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">AI Quotation Extraction</h1>
          <p className="text-sm text-gray-500 mt-2 max-w-lg mx-auto">
            Upload a supplier quotation and Okey Manual AI will extract the commercial information into a structured procurement record.
          </p>
        </div>

        {!extracting && !error && (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            className={clsx(
              'border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer',
              dragOver ? 'border-accent bg-accent/5' : file ? 'border-accent bg-accent/5' : 'border-gray-300 hover:border-gray-400'
            )}
            onClick={() => document.getElementById('file-input').click()}
          >
            <input
              id="file-input"
              type="file"
              accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              className="hidden"
            />

            {file ? (
              <div className="space-y-3">
                <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mx-auto">
                  <File size={28} className="text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatFileSize(file.size)}</p>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-accent">
                  <CheckCircle size={14} />
                  <span>File ready for extraction</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-red-500"
                >
                  <X size={12} /> Remove
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload size={40} className="mx-auto text-gray-300" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Drag and drop your quotation here</p>
                  <p className="text-xs text-gray-400 mt-1">or click to browse</p>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                  <span>PDF</span>
                  <span>·</span>
                  <span>DOCX</span>
                  <span>·</span>
                  <span>XLSX</span>
                  <span>·</span>
                  <span>Images</span>
                </div>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 rounded-lg border border-red-200 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">Extraction Failed</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => { setError(null); setFile(null); }}
                    className="text-sm text-red-700 underline hover:no-underline"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={onSwitchToManual}
                    className="text-sm text-accent underline hover:no-underline cursor-pointer"
                  >
                    Enter Manually
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {extracting && (
          <div className="mt-8">
            <div className="text-center mb-6">
              <div className="text-sm font-semibold text-gray-900">{stage}</div>
              <div className="text-xs text-gray-500 mt-1">Analyzing quotation...</div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
              <div
                className="bg-accent h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="space-y-2">
              {stages.map((s, i) => (
                <div key={s} className="flex items-center gap-3">
                  {progress > ((i + 1) / stages.length) * 90 ? (
                    <CheckCircle size={16} className="text-accent flex-shrink-0" />
                  ) : stage === s ? (
                    <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-gray-200 flex-shrink-0" />
                  )}
                  <span className={clsx(
                    'text-sm',
                    progress > ((i + 1) / stages.length) * 90 ? 'text-gray-900 font-medium' :
                    stage === s ? 'text-accent font-medium' : 'text-gray-400'
                  )}>
                    {s}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!extracting && file && !error && (
          <div className="mt-6 text-center">
            <button
              onClick={extractWithAI}
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg text-sm font-semibold hover:bg-emerald-600 transition-colors"
            >
              <Brain size={18} /> Extract with AI
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            Supported formats: PDF, DOCX, XLSX, PNG, JPG. Max file size: 10MB.
          </p>
        </div>
      </div>
    </div>
  );
}

function ManualEntryFlow({ rfqId, onBack }) {
  const navigate = useNavigate();
  const { rfqs, suppliers, addQuotation, addToast } = useStore();
  const selectedRfq = rfqs.find(r => r.id === rfqId);

  const [form, setForm] = useState({
    supplierId: '',
    supplierContact: '',
    quotationReference: '',
    quotationDate: '',
    validUntil: '',
    currency: 'USD',
    productName: '',
    specification: '',
    quantity: 500,
    unit: 'units',
    unitPrice: 0,
    discount: 0,
    tax: 0,
    shippingCost: 0,
    freightMethod: 'Sea Freight',
    incoterms: 'CIF Lagos',
    leadTime: '',
    estimatedDelivery: '',
    paymentTerms: '',
    warranty: '',
    moq: '',
    notes: '',
  });

  const subtotal = form.quantity * form.unitPrice;
  const total = subtotal - form.discount + form.tax + form.shippingCost;

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    const supplier = suppliers.find(s => s.id === form.supplierId);
    if (!supplier) {
      addToast({ type: 'error', message: 'Please select a supplier.' });
      return;
    }

    addQuotation({
      rfqId: rfqId || form.rfqId,
      supplierId: form.supplierId,
      supplierName: supplier.name,
      reference: form.quotationReference,
      date: form.quotationDate,
      validUntil: form.validUntil,
      currency: form.currency,
      items: [{
        product_name: form.productName,
        specification: form.specification,
        quantity: form.quantity,
        unit: form.unit,
        unit_price: form.unitPrice,
        subtotal,
      }],
      discount: form.discount,
      tax: form.tax,
      shippingCost: form.shippingCost,
      total,
      freightMethod: form.freightMethod,
      incoterms: form.incoterms,
      leadTime: form.leadTime,
      estimatedDelivery: form.estimatedDelivery,
      paymentTerms: form.paymentTerms,
      warranty: form.warranty,
      moq: form.moq,
      notes: form.notes,
      aiStatus: 'Manually Entered',
      status: 'Needs Review',
    });

    addToast({ type: 'success', message: `Quotation added${rfqId ? ` to ${rfqId}` : ''} successfully.` });
    navigate(rfqId ? `/rfqs/${rfqId}` : '/quotations');
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto space-y-6">
      <button onClick={onBack} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Manual Quotation Entry</h1>
        <p className="text-sm text-gray-500 mb-6">{rfqId ? `Adding to ${rfqId}` : 'Enter quotation details'}</p>

        <div className="space-y-8">
          <Section title="Supplier Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Supplier">
                <select value={form.supplierId} onChange={(e) => updateField('supplierId', e.target.value)} className="input-field">
                  <option value="">Select supplier...</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </Field>
              <Field label="Supplier Contact">
                <input type="text" value={form.supplierContact} onChange={(e) => updateField('supplierContact', e.target.value)} className="input-field" placeholder="Contact name" />
              </Field>
              <Field label="Quotation Reference">
                <input type="text" value={form.quotationReference} onChange={(e) => updateField('quotationReference', e.target.value)} className="input-field" placeholder="e.g. QT-88421" />
              </Field>
              <Field label="Quotation Date">
                <input type="date" value={form.quotationDate} onChange={(e) => updateField('quotationDate', e.target.value)} className="input-field" />
              </Field>
              <Field label="Valid Until">
                <input type="date" value={form.validUntil} onChange={(e) => updateField('validUntil', e.target.value)} className="input-field" />
              </Field>
              <Field label="Currency">
                <select value={form.currency} onChange={(e) => updateField('currency', e.target.value)} className="input-field">
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CNY">CNY - Chinese Yuan</option>
                  <option value="NGN">NGN - Nigerian Naira</option>
                </select>
              </Field>
            </div>
          </Section>

          <Section title="Product Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Product Name" full>
                <input type="text" value={form.productName} onChange={(e) => updateField('productName', e.target.value)} className="input-field" placeholder="e.g. 550W Monocrystalline Solar Panel" />
              </Field>
              <Field label="Specification" full>
                <textarea value={form.specification} onChange={(e) => updateField('specification', e.target.value)} className="input-field min-h-[80px]" placeholder="Detailed specifications..." />
              </Field>
              <Field label="Quantity">
                <input type="number" value={form.quantity} onChange={(e) => updateField('quantity', Number(e.target.value))} className="input-field" />
              </Field>
              <Field label="Unit">
                <select value={form.unit} onChange={(e) => updateField('unit', e.target.value)} className="input-field">
                  <option value="units">units</option>
                  <option value="pieces">pieces</option>
                  <option value="sets">sets</option>
                  <option value="kg">kg</option>
                  <option value="tons">tons</option>
                </select>
              </Field>
            </div>
          </Section>

          <Section title="Pricing">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Unit Price">
                <input type="number" step="0.01" value={form.unitPrice} onChange={(e) => updateField('unitPrice', Number(e.target.value))} className="input-field" />
              </Field>
              <Field label="Subtotal">
                <div className="input-field bg-gray-50 font-semibold">${subtotal.toLocaleString()}</div>
              </Field>
              <Field label="Discount">
                <input type="number" step="0.01" value={form.discount} onChange={(e) => updateField('discount', Number(e.target.value))} className="input-field" />
              </Field>
              <Field label="Tax">
                <input type="number" step="0.01" value={form.tax} onChange={(e) => updateField('tax', Number(e.target.value))} className="input-field" />
              </Field>
              <Field label="Shipping Cost">
                <input type="number" step="0.01" value={form.shippingCost} onChange={(e) => updateField('shippingCost', Number(e.target.value))} className="input-field" />
              </Field>
              <Field label="Total">
                <div className="input-field bg-accent/5 border-accent font-bold text-accent">${total.toLocaleString()}</div>
              </Field>
            </div>
          </Section>

          <Section title="Commercial Terms">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Freight Method">
                <select value={form.freightMethod} onChange={(e) => updateField('freightMethod', e.target.value)} className="input-field">
                  <option value="Sea Freight">Sea Freight</option>
                  <option value="Air Freight">Air Freight</option>
                  <option value="Rail Freight">Rail Freight</option>
                  <option value="Road Freight">Road Freight</option>
                </select>
              </Field>
              <Field label="Incoterms">
                <select value={form.incoterms} onChange={(e) => updateField('incoterms', e.target.value)} className="input-field">
                  <option value="CIF Lagos">CIF Lagos</option>
                  <option value="FOB Guangzhou">FOB Guangzhou</option>
                  <option value="FOB Shenzhen">FOB Shenzhen</option>
                  <option value="DAP Lagos">DAP Lagos</option>
                  <option value="EXW">EXW</option>
                </select>
              </Field>
              <Field label="Lead Time">
                <input type="text" value={form.leadTime} onChange={(e) => updateField('leadTime', e.target.value)} className="input-field" placeholder="e.g. 30 days" />
              </Field>
              <Field label="Estimated Delivery">
                <input type="date" value={form.estimatedDelivery} onChange={(e) => updateField('estimatedDelivery', e.target.value)} className="input-field" />
              </Field>
              <Field label="Payment Terms">
                <input type="text" value={form.paymentTerms} onChange={(e) => updateField('paymentTerms', e.target.value)} className="input-field" placeholder="e.g. 30% deposit / 70% before shipment" />
              </Field>
              <Field label="Warranty">
                <input type="text" value={form.warranty} onChange={(e) => updateField('warranty', e.target.value)} className="input-field" placeholder="e.g. 25 years performance" />
              </Field>
              <Field label="MOQ">
                <input type="text" value={form.moq} onChange={(e) => updateField('moq', e.target.value)} className="input-field" placeholder="e.g. 100 units" />
              </Field>
              <Field label="Notes">
                <textarea value={form.notes} onChange={(e) => updateField('notes', e.target.value)} className="input-field min-h-[60px]" placeholder="Additional notes..." />
              </Field>
            </div>
          </Section>
        </div>

        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
          <button onClick={onBack} className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-6 py-2.5 bg-accent text-white rounded-lg text-sm font-semibold hover:bg-emerald-600 transition-colors">
            Save Quotation
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, children, full }) {
  return (
    <div className={full ? 'md:col-span-2' : ''}>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
