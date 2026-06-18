import { X, CheckCircle, AlertCircle, InfoIcon, Triangle } from "lucide-react";
import type { Toast, ToastType } from "../hooks/useToast";

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const toastStyles: Record<
  ToastType,
  { bg: string; border: string; icon: React.ReactNode; color: string }
> = {
  success: {
    bg: "bg-[#1a3d2f]",
    border: "border-[#2d6a4f]",
    color: "text-[#52b788]",
    icon: <CheckCircle className="w-5 h-5" />,
  },
  error: {
    bg: "bg-[#3d1a1a]",
    border: "border-[#6a2d2d]",
    color: "text-[#ff6b6b]",
    icon: <AlertCircle className="w-5 h-5" />,
  },
  warning: {
    bg: "bg-[#3d2f1a]",
    border: "border-[#6a5a2d]",
    color: "text-[#ffd93d]",
    icon: <Triangle className="w-5 h-5" />,
  },
  info: {
    bg: "bg-[#1a2f3d]",
    border: "border-[#2d4d6a]",
    color: "text-[#4da6ff]",
    icon: <InfoIcon className="w-5 h-5" />,
  },
};

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm">
      {toasts.map((toast) => {
        const style = toastStyles[toast.type];
        return (
          <div
            key={toast.id}
            className={`${style.bg} border ${style.border} rounded-2xl p-4 flex items-start gap-3 animate-slideInUp`}
          >
            <div className={`${style.color} shrink-0 mt-0.5`}>{style.icon}</div>
            <p className="text-white flex-1 text-sm">{toast.message}</p>
            <button
              onClick={() => onRemove(toast.id)}
              className="text-[#adaaaa] hover:text-white transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
