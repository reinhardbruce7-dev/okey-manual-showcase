import { NavLink, useLocation } from 'react-router-dom';
import { useStore } from '../store';
import {
  LayoutDashboard, Users, FileText, FileCheck, GitCompare,
  ShoppingCart, Truck, BarChart3, Brain, Settings, ChevronLeft,
  ChevronRight, Package, X
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/suppliers', icon: Users, label: 'Suppliers' },
  { to: '/rfqs', icon: FileText, label: 'RFQs' },
  { to: '/quotations', icon: FileCheck, label: 'Quotations' },
  { to: '/compare', icon: GitCompare, label: 'Compare' },
  { to: '/purchase-orders', icon: ShoppingCart, label: 'Purchase Orders' },
  { to: '/shipments', icon: Truck, label: 'Shipments' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/ai-intelligence', icon: Brain, label: 'AI Intelligence' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useStore();
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={clsx(
          'fixed left-0 top-0 z-40 h-screen bg-navy-900 text-white transition-all duration-300 flex flex-col',
          sidebarOpen ? 'w-64' : 'w-[72px]'
        )}
      >
        <div className="flex items-center gap-3 px-4 h-16 border-b border-navy-700">
          <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
            <Package size={20} className="text-white" />
          </div>
          {sidebarOpen && (
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold leading-tight truncate">OKEY MANUAL</div>
              <div className="text-[10px] text-navy-400 leading-tight">AI Procurement Platform</div>
            </div>
          )}
          {sidebarOpen && (
            <button onClick={toggleSidebar} className="lg:hidden text-navy-400 hover:text-white">
              <X size={18} />
            </button>
          )}
        </div>

        <nav className="flex-1 py-3 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.to === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.to);

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => {
                  if (window.innerWidth < 1024 && sidebarOpen) toggleSidebar();
                }}
                className={clsx(
                  'flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-accent/15 text-accent'
                    : 'text-navy-300 hover:bg-navy-800 hover:text-white'
                )}
                title={!sidebarOpen ? item.label : undefined}
              >
                <Icon size={20} className="flex-shrink-0" />
                {sidebarOpen && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-navy-700">
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-navy-400 hover:bg-navy-800 hover:text-white transition-colors"
          >
            {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            {sidebarOpen && <span className="text-xs">Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
