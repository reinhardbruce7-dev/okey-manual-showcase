import {
  Brain, Upload, Users, Shield, TrendingUp, Lightbulb,
  FileText, Truck, Lock, ArrowRight
} from 'lucide-react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

const capabilities = [
  {
    title: 'AI Quotation Extraction',
    description: 'Upload supplier quotations and extract structured procurement data using OKEY AI.',
    icon: Upload,
    status: 'live',
    link: '/quotations/add',
  },
  {
    title: 'Supplier Matching',
    description: 'Automatically match RFQs to the most suitable suppliers based on capability, pricing, and reliability.',
    icon: Users,
    status: 'coming',
  },
  {
    title: 'Supplier Risk Scoring',
    description: 'Real-time risk assessment of suppliers using AI analysis of multiple data sources.',
    icon: Shield,
    status: 'coming',
  },
  {
    title: 'Demand Forecasting',
    description: 'Predict future procurement needs based on historical patterns and market trends.',
    icon: TrendingUp,
    status: 'coming',
  },
  {
    title: 'Procurement Recommendations',
    description: 'AI-driven recommendations for optimal sourcing strategies and cost reduction.',
    icon: Lightbulb,
    status: 'coming',
  },
  {
    title: 'Automated RFQ Intelligence',
    description: 'Generate and distribute RFQs with AI-optimized specifications and supplier targeting.',
    icon: FileText,
    status: 'coming',
  },
  {
    title: 'Shipment Risk Prediction',
    description: 'Predict shipment delays and risks using AI analysis of logistics patterns.',
    icon: Truck,
    status: 'coming',
  },
];

export default function AIIntelligence() {
  return (
    <div className="animate-fade-in max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Intelligence</h1>
        <p className="text-sm text-gray-500 mt-1">AI-powered procurement capabilities</p>
      </div>

      <div className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Brain size={24} className="text-accent" />
          <div>
            <h2 className="text-lg font-bold">Okey Manual AI Engine</h2>
            <p className="text-sm text-navy-300">The intelligence layer for African international procurement</p>
          </div>
        </div>
        <p className="text-sm text-navy-200 leading-relaxed max-w-2xl">
          Our AI capabilities are built to transform procurement operations across Africa.
          Currently available: AI Quotation Extraction. More capabilities coming soon.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {capabilities.map((cap) => {
          const Icon = cap.icon;
          const isLive = cap.status === 'live';

          return (
            <div
              key={cap.title}
              className={clsx(
                'rounded-xl border p-5 transition-all',
                isLive
                  ? 'bg-white border-accent/30 hover:shadow-md'
                  : 'bg-gray-50 border-gray-200 opacity-75'
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={clsx(
                  'w-10 h-10 rounded-lg flex items-center justify-center',
                  isLive ? 'bg-accent/10' : 'bg-gray-200'
                )}>
                  <Icon size={20} className={isLive ? 'text-accent' : 'text-gray-400'} />
                </div>
                {isLive ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-semibold rounded-full border border-emerald-200">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full pulse-dot" />
                    LIVE DEMO
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-500 text-[11px] font-semibold rounded-full border border-gray-200">
                    <Lock size={10} />
                    COMING SOON
                  </span>
                )}
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{cap.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">{cap.description}</p>
              {isLive && cap.link && (
                <Link
                  to={cap.link}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline"
                >
                  Try Now <ArrowRight size={12} />
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
