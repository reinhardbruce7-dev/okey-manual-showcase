import { create } from 'zustand';
import { suppliers as initialSuppliers } from './data/suppliers';
import { rfqs as initialRfqs } from './data/rfqs';
import { quotations as initialQuotations } from './data/quotations';
import { purchaseOrders as initialPOs } from './data/purchaseOrders';
import { shipments as initialShipments } from './data/shipments';

export const useStore = create((set, get) => ({
  suppliers: initialSuppliers,
  rfqs: initialRfqs,
  quotations: initialQuotations,
  purchaseOrders: initialPOs,
  shipments: initialShipments,
  toasts: [],
  sidebarOpen: true,

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  addQuotation: (quotation) => set((s) => {
    const newQuotation = {
      ...quotation,
      id: `QT-${String(s.quotations.length + 1).padStart(3, '0')}`,
      confidence: quotation.confidence || { supplier: 95, pricing: 90, terms: 88 },
    };
    const updatedRfqs = s.rfqs.map((rfq) => {
      if (rfq.id === newQuotation.rfqId) {
        return {
          ...rfq,
          quotations: [...rfq.quotations, newQuotation.id],
          status: rfq.quotations.length === 0 ? 'Quotation Review' : rfq.status,
        };
      }
      return rfq;
    });
    return {
      quotations: [...s.quotations, newQuotation],
      rfqs: updatedRfqs,
    };
  }),

  updateQuotation: (id, updates) => set((s) => ({
    quotations: s.quotations.map((q) => (q.id === id ? { ...q, ...updates } : q)),
  })),

  approveQuotation: (id) => set((s) => ({
    quotations: s.quotations.map((q) => (q.id === id ? { ...q, status: 'Approved' } : q)),
  })),

  selectSupplier: (rfqId, quotationId) => set((s) => ({
    quotations: s.quotations.map((q) =>
      q.rfqId === rfqId
        ? { ...q, status: q.id === quotationId ? 'Approved' : q.status === 'Approved' ? 'Shortlisted' : q.status }
        : q
    ),
  })),

  createPO: (po) => set((s) => ({
    purchaseOrders: [...s.purchaseOrders, {
      ...po,
      id: `PO-2026-${String(s.purchaseOrders.length + 83).padStart(4, '0')}`,
      createdAt: new Date().toISOString().split('T')[0],
    }],
  })),

  addToast: (toast) => set((s) => ({
    toasts: [...s.toasts, { ...toast, id: Date.now() }],
  })),

  removeToast: (id) => set((s) => ({
    toasts: s.toasts.filter((t) => t.id !== id),
  })),

  getSupplierById: (id) => get().suppliers.find((s) => s.id === id),
  getRfqById: (id) => get().rfqs.find((r) => r.id === id),
  getQuotationById: (id) => get().quotations.find((q) => q.id === id),
  getQuotationsByRfq: (rfqId) => get().quotations.filter((q) => q.rfqId === rfqId),
}));
