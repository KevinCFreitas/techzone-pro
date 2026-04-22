import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, ShoppingCart, Trash2, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

const getIcon = (type: ToastType) => {
  switch (type) {
    case 'success':
      return <CheckCircle size={20} className="text-green-500" />;
    case 'error':
      return <XCircle size={20} className="text-red-500" />;
    case 'warning':
      return <AlertCircle size={20} className="text-yellow-500" />;
    case 'info':
    default:
      return <ShoppingCart size={20} className="text-blue-500" />;
  }
};

const getStyles = (type: ToastType) => {
  switch (type) {
    case 'success':
      return 'bg-green-50 border-green-200 text-green-900';
    case 'error':
      return 'bg-red-50 border-red-200 text-red-900';
    case 'warning':
      return 'bg-yellow-50 border-yellow-200 text-yellow-900';
    case 'info':
    default:
      return 'bg-blue-50 border-blue-200 text-blue-900';
  }
};

export default function Toast({ toasts, onRemove }: ToastProps) {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] space-y-3 pointer-events-none w-full max-w-md px-4">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={onRemove}
          icon={getIcon(toast.type)}
          styles={getStyles(toast.type)}
        />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: ToastMessage;
  onRemove: (id: string) => void;
  icon: React.ReactNode;
  styles: string;
}

function ToastItem({ toast, onRemove, icon, styles }: ToastItemProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onRemove(toast.id), 300);
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg border pointer-events-auto
        ${styles}
        shadow-lg hover-lift transition-smooth
      `}
      style={{
        animation: isExiting ? 'fadeOutUp 0.3s ease-out forwards' : 'fadeInDown 0.4s ease-out forwards',
      }}
    >
      <div className="flex-shrink-0 animate-bounce-in">{icon}</div>
      <p className="flex-1 font-medium text-sm">{toast.message}</p>
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(() => onRemove(toast.id), 300);
        }}
        className="flex-shrink-0 text-current opacity-50 hover:opacity-100 transition-opacity hover-scale"
      >
        <X size={18} />
      </button>
    </div>
  );
}
