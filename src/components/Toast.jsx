import { useEffect } from 'react';
import { useStore } from '../store';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import clsx from 'clsx';

const icons = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
};

const styles = {
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

export default function ToastContainer() {
  const { toasts, removeToast } = useStore();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function Toast({ toast, onDismiss }) {
  const Icon = icons[toast.type] || Info;

  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className={clsx(
      'animate-slide-in flex items-start gap-3 p-4 rounded-xl border shadow-lg',
      styles[toast.type] || styles.info
    )}>
      <Icon size={18} className="mt-0.5 flex-shrink-0" />
      <p className="text-sm font-medium flex-1">{toast.message}</p>
      <button onClick={onDismiss} className="text-current opacity-50 hover:opacity-100">
        <X size={14} />
      </button>
    </div>
  );
}
