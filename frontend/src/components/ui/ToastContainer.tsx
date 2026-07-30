import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import type { ToastVariant } from '../../context/ToastContext';

const variantConfig: Record<ToastVariant, { icon: typeof CheckCircle2; classes: string }> = {
  success: { icon: CheckCircle2, classes: 'border-success/30 text-success' },
  error: { icon: XCircle, classes: 'border-danger/30 text-danger' },
  info: { icon: Info, classes: 'border-primary/30 text-primary' },
};

export const ToastContainer = () => {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-100 flex w-full max-w-xs flex-col gap-2 sm:top-5 sm:right-5">
      {toasts.map((toast) => {
        const config = variantConfig[toast.variant];
        const Icon = config.icon;
        return (
          <div
            key={toast.id}
            className={`animate-toast-in flex items-start gap-2.5 rounded-md border bg-surface-2 px-3.5 py-3 shadow-lg ${config.classes}`}
            role="status"
          >
            <Icon className="mt-0.5 h-4 w-4 shrink-0" />
            <p className="flex-1 text-sm text-text">{toast.message}</p>
            <button
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="text-text-faint hover:text-text"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
