import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useStore } from './store';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import ToastContainer from './components/Toast';
import Dashboard from './pages/Dashboard';
import Suppliers from './pages/Suppliers';
import SupplierProfile from './pages/SupplierProfile';
import RFQs from './pages/RFQs';
import RFQDetail from './pages/RFQDetail';
import Quotations from './pages/Quotations';
import AddQuotation from './pages/AddQuotation';
import AIReview from './pages/AIReview';
import Compare from './pages/Compare';
import PurchaseOrders from './pages/PurchaseOrders';
import Shipments from './pages/Shipments';
import Analytics from './pages/Analytics';
import AIIntelligence from './pages/AIIntelligence';
import Settings from './pages/Settings';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

export default function App() {
  const { sidebarOpen } = useStore();
  const isMobile = useIsMobile();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className={clsx(
          'transition-all duration-300 min-h-screen',
          isMobile ? 'ml-0' : sidebarOpen ? 'ml-64' : 'ml-[72px]'
        )}>
          <Topbar />
          <main className="p-4 md:p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/suppliers/:id" element={<SupplierProfile />} />
              <Route path="/rfqs" element={<RFQs />} />
              <Route path="/rfqs/:id" element={<RFQDetail />} />
              <Route path="/quotations" element={<Quotations />} />
              <Route path="/quotations/add" element={<AddQuotation />} />
              <Route path="/quotations/ai-review" element={<AIReview />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/purchase-orders" element={<PurchaseOrders />} />
              <Route path="/shipments" element={<Shipments />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/ai-intelligence" element={<AIIntelligence />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
}
