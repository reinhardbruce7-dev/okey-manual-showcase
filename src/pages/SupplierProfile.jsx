import { useParams, Link } from 'react-router-dom';
import { useStore } from '../store';
import {
  ArrowLeft, Star, Shield, Clock, MessageCircle, TrendingUp,
  AlertTriangle, FileText, Truck, Brain, CheckCircle
} from 'lucide-react';
import clsx from 'clsx';

const badgeStyles = {
  'Preferred': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Verified': 'bg-blue-50 text-blue-700 border-blue-200',
  'New': 'bg-purple-50 text-purple-700 border-purple-200',
  'Under Review': 'bg-amber-50 text-amber-700 border-amber-200',
};

export default function SupplierProfile() {
  const { id } = useParams();
  const { suppliers, quotations, purchaseOrders, shipments } = useStore();
  const supplier = suppliers.find(s => s.id === id);

  if (!supplier) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Supplier not found.</p>
        <Link to="/suppliers" className="text-accent hover:underline mt-2 inline-block">Back to Suppliers</Link>
      </div>
    );
  }

  const supplierQuotations = quotations.filter(q => q.supplierId === supplier.id);
  const supplierPOs = purchaseOrders.filter(po => po.supplierId === supplier.id);
  const supplierShipments = shipments.filter(sh => sh.supplierName === supplier.name);

  const perfMetrics = [
    { label: 'Quality', value: supplier.performance.quality, icon: Shield },
    { label: 'Pricing', value: supplier.performance.pricing, icon: TrendingUp },
    { label: 'Communication', value: supplier.performance.communication, icon: MessageCircle },
    { label: 'Delivery', value: supplier.performance.delivery, icon: Clock },
  ];

  return (
    <div className="animate-fade-in max-w-6xl mx-auto space-y-6">
      <Link to="/suppliers" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft size={16} /> Back to Suppliers
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{supplier.name}</h1>
              <span className={clsx('px-2.5 py-0.5 rounded-full text-xs font-semibold border', badgeStyles[supplier.badge])}>
                {supplier.badge}
              </span>
            </div>
            <p className="text-sm text-gray-500">{supplier.country} · {supplier.category} · {supplier.id}</p>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1">
                <Star size={14} className="text-amber-400 fill-amber-400" />
                <span className="text-sm font-semibold">{supplier.rating}</span>
              </div>
              <span className="text-sm text-gray-500">{supplier.reliability}% reliability</span>
              <span className="text-sm text-gray-500">{supplier.responseRate}% response rate</span>
              <span className="text-sm text-gray-500">{supplier.avgLeadTime} days avg lead time</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-accent">{supplier.performance.overall}</div>
            <div className="text-xs text-gray-500">Overall Score</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {perfMetrics.map((m) => {
                const Icon = m.icon;
                return (
                  <div key={m.label} className="text-center p-4 bg-gray-50 rounded-lg">
                    <Icon size={20} className="mx-auto text-gray-400 mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{m.value}</div>
                    <div className="text-xs text-gray-500 mt-1">{m.label}</div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                      <div
                        className={clsx(
                          'h-1.5 rounded-full',
                          m.value >= 90 ? 'bg-emerald-500' : m.value >= 80 ? 'bg-blue-500' : 'bg-amber-500'
                        )}
                        style={{ width: `${m.value}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Previous Quotations</h2>
            {supplierQuotations.length === 0 ? (
              <p className="text-sm text-gray-400">No quotations yet.</p>
            ) : (
              <div className="space-y-2">
                {supplierQuotations.map((q) => (
                  <div key={q.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-900">{q.id}</span>
                      <span className="text-xs text-gray-500 ml-2">{q.reference}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-900">{q.currency} {q.total.toLocaleString()}</span>
                      <span className={clsx(
                        'px-2 py-0.5 rounded-full text-[10px] font-medium',
                        q.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' :
                        q.status === 'Shortlisted' ? 'bg-blue-50 text-blue-700' :
                        q.status === 'Needs Review' ? 'bg-amber-50 text-amber-700' :
                        'bg-gray-50 text-gray-700'
                      )}>{q.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order History</h2>
            {supplierPOs.length === 0 ? (
              <p className="text-sm text-gray-400">No orders yet.</p>
            ) : (
              <div className="space-y-2">
                {supplierPOs.map((po) => (
                  <div key={po.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-900">{po.id}</span>
                      <span className="text-xs text-gray-500 ml-2">{po.product}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-900">{po.currency} {po.total.toLocaleString()}</span>
                      <span className={clsx(
                        'px-2 py-0.5 rounded-full text-[10px] font-medium',
                        po.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700' :
                        po.status === 'In Production' ? 'bg-amber-50 text-amber-700' :
                        po.status === 'Shipped' ? 'bg-cyan-50 text-cyan-700' :
                        'bg-gray-50 text-gray-700'
                      )}>{po.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact</h2>
            <div className="space-y-3 text-sm">
              <div><span className="text-gray-500">Contact:</span> <span className="font-medium text-gray-900">{supplier.contact}</span></div>
              <div><span className="text-gray-500">Email:</span> <span className="font-medium text-gray-900">{supplier.email}</span></div>
              <div><span className="text-gray-500">Phone:</span> <span className="font-medium text-gray-900">{supplier.phone}</span></div>
              <div><span className="text-gray-500">Address:</span> <span className="text-gray-700">{supplier.address}</span></div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Certifications</h2>
            <div className="flex flex-wrap gap-2">
              {supplier.certifications.map((cert) => (
                <span key={cert} className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg border border-blue-100">
                  {cert}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Risk Indicators</h2>
            <div className="space-y-2">
              {supplier.riskIndicators.map((risk, i) => (
                <div key={i} className="flex items-start gap-2">
                  <AlertTriangle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{risk}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-xl p-6 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Brain size={18} className="text-accent" />
              <h3 className="text-sm font-semibold">AI Supplier Insight</h3>
            </div>
            <p className="text-sm text-navy-200 leading-relaxed">{supplier.aiInsight}</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Summary</h2>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-gray-900">{supplier.previousQuotations}</div>
                <div className="text-[11px] text-gray-500">Quotations</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-gray-900">{supplier.previousOrders}</div>
                <div className="text-[11px] text-gray-500">Orders</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-gray-900">{supplier.shipments}</div>
                <div className="text-[11px] text-gray-500">Shipments</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-gray-900">{supplier.responseRate}%</div>
                <div className="text-[11px] text-gray-500">Response Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
