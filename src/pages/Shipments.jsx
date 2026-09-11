import { useState } from 'react';
import { useStore } from '../store';
import { Ship, CheckCircle, Clock, Circle, Truck } from 'lucide-react';
import clsx from 'clsx';

const statusColors = {
  'In Transit': 'bg-cyan-50 text-cyan-700 border-cyan-200',
  'Production': 'bg-amber-50 text-amber-700 border-amber-200',
  'Delivered': 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export default function Shipments() {
  const { shipments } = useStore();
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="animate-fade-in max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Shipment Tracking</h1>
        <p className="text-sm text-gray-500 mt-1">{shipments.length} active shipments</p>
      </div>

      <div className="space-y-4">
        {shipments.map((shipment) => (
          <div key={shipment.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === shipment.id ? null : shipment.id)}
              className="w-full p-5 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-navy-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Ship size={18} className="text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900">{shipment.id}</span>
                      <span className={clsx('px-2 py-0.5 rounded-full text-[10px] font-semibold border', statusColors[shipment.status])}>
                        {shipment.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{shipment.supplierName} · {shipment.product}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-xs text-gray-500">
                  <div>
                    <span className="text-gray-400">Route: </span>
                    <span className="font-medium text-gray-700">{shipment.origin} → {shipment.destination}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">ETA: </span>
                    <span className="font-medium text-gray-700">{shipment.estimatedArrival}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Carrier: </span>
                    <span className="font-medium text-gray-700">{shipment.carrier}</span>
                  </div>
                </div>
              </div>
            </button>

            {expanded === shipment.id && (
              <div className="px-5 pb-5 border-t border-gray-100 pt-4 animate-slide-in">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-[10px] text-gray-400 uppercase">Vessel</div>
                    <div className="text-sm font-medium text-gray-900 mt-0.5">{shipment.vessel}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-[10px] text-gray-400 uppercase">Tracking</div>
                    <div className="text-sm font-medium text-gray-900 mt-0.5">{shipment.trackingNumber}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-[10px] text-gray-400 uppercase">Weight / Container</div>
                    <div className="text-sm font-medium text-gray-900 mt-0.5">{shipment.weight} · {shipment.containers}</div>
                  </div>
                </div>

                <h4 className="text-sm font-semibold text-gray-900 mb-3">Tracking Timeline</h4>
                <div className="relative">
                  <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-gray-200" />
                  <div className="space-y-0">
                    {shipment.timeline.map((event, i) => (
                      <div key={i} className="relative flex items-start gap-4 pb-4">
                        <div className={clsx(
                          'w-[31px] h-[31px] rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2',
                          event.completed
                            ? i === shipment.timeline.filter(e => e.completed).length - 1 && shipment.status !== 'Delivered'
                              ? 'bg-accent border-accent text-white'
                              : 'bg-accent/10 border-accent text-accent'
                            : 'bg-white border-gray-200 text-gray-300'
                        )}>
                          {event.completed ? <CheckCircle size={14} /> : <Circle size={14} />}
                        </div>
                        <div className={clsx(
                          'pt-1',
                          event.completed ? 'text-gray-900' : 'text-gray-400'
                        )}>
                          <div className="text-sm font-medium">{event.event}</div>
                          {event.date && <div className="text-xs text-gray-500 mt-0.5">{event.date}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
