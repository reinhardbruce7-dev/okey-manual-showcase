import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';
import { Star, Search, Filter, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

const badgeStyles = {
  'Preferred': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Verified': 'bg-blue-50 text-blue-700 border-blue-200',
  'New': 'bg-purple-50 text-purple-700 border-purple-200',
  'Under Review': 'bg-amber-50 text-amber-700 border-amber-200',
};

const riskColors = {
  'Low': 'text-emerald-600',
  'Medium': 'text-amber-600',
  'High': 'text-red-600',
};

export default function Suppliers() {
  const { suppliers } = useStore();
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const categories = ['All', ...new Set(suppliers.map(s => s.category))];
  
  const filtered = suppliers.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.country.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === 'All' || s.category === filterCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="animate-fade-in max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
          <p className="text-sm text-gray-500 mt-1">{suppliers.length} suppliers in directory</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search suppliers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                filterCategory === cat ? 'bg-navy-800 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((supplier) => (
          <Link
            key={supplier.id}
            to={`/suppliers/${supplier.id}`}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-accent transition-colors truncate">
                  {supplier.name}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">{supplier.country} · {supplier.category}</p>
              </div>
              <ChevronRight size={16} className="text-gray-300 group-hover:text-accent transition-colors flex-shrink-0 mt-1" />
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className={clsx('px-2 py-0.5 rounded-full text-[10px] font-semibold border', badgeStyles[supplier.badge])}>
                {supplier.badge}
              </span>
              <span className={clsx('text-[11px] font-medium', riskColors[supplier.riskLevel])}>
                {supplier.riskLevel} Risk
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <div className="text-[11px] text-gray-400 uppercase tracking-wider">Rating</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star size={12} className="text-amber-400 fill-amber-400" />
                  <span className="text-sm font-semibold text-gray-900">{supplier.rating}</span>
                </div>
              </div>
              <div>
                <div className="text-[11px] text-gray-400 uppercase tracking-wider">Reliability</div>
                <div className="text-sm font-semibold text-gray-900 mt-0.5">{supplier.reliability}%</div>
              </div>
              <div>
                <div className="text-[11px] text-gray-400 uppercase tracking-wider">Lead Time</div>
                <div className="text-sm font-semibold text-gray-900 mt-0.5">{supplier.avgLeadTime} days</div>
              </div>
              <div>
                <div className="text-[11px] text-gray-400 uppercase tracking-wider">Orders</div>
                <div className="text-sm font-semibold text-gray-900 mt-0.5">{supplier.ordersCompleted}</div>
              </div>
            </div>

            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className="bg-accent h-1.5 rounded-full transition-all"
                style={{ width: `${supplier.reliability}%` }}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
