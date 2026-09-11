import { Search, Bell, User, Menu } from 'lucide-react';
import { useStore } from '../store';

export default function Topbar() {
  const { toggleSidebar } = useStore();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
        >
          <Menu size={20} />
        </button>
        <div className="relative hidden sm:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search suppliers, RFQs, quotations..."
            className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm w-64 md:w-80 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <span className="hidden md:inline-flex px-2.5 py-1 bg-amber-50 text-amber-700 text-[11px] font-semibold rounded-full border border-amber-200 uppercase tracking-wider">
          Demo Environment
        </span>

        <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-2 pl-2 md:pl-3 border-l border-gray-200">
          <div className="w-8 h-8 bg-navy-700 rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-medium text-gray-800">ABEDNEGO ANUJUOM</div>
            <div className="text-[11px] text-gray-500">Procurement Manager</div>
          </div>
        </div>
      </div>
    </header>
  );
}
