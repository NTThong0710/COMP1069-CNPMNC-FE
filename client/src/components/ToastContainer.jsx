import { useToast } from "../context/ToastContext";
import { CheckCircle, AlertCircle, Info, XCircle, X } from "lucide-react";
import { useEffect } from "react";

/**
 * ToastContainer - Hiển thị tất cả toast notifications
 * Đặt ở top-right, auto-remove sau duration
 */
function ToastContainer() {
  const { toasts, removeToast } = useToast();

  const getToastStyle = (type) => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-500",
          icon: <CheckCircle size={20} />,
          text: "text-white",
        };
      case "error":
        return {
          bg: "bg-red-500",
          icon: <XCircle size={20} />,
          text: "text-white",
        };
      case "warning":
        return {
          bg: "bg-amber-500",
          icon: <AlertCircle size={20} />,
          text: "text-white",
        };
      case "info":
      default:
        return {
          bg: "bg-blue-500",
          icon: <Info size={20} />,
          text: "text-white",
        };
    }
  };

  return (
    <div className="fixed top-6 right-6 z-[9999] space-y-3 pointer-events-none">
      {toasts.map((toast) => {
        const style = getToastStyle(toast.type);
        return (
          <div
            key={toast.id}
            className={`
              ${style.bg} ${style.text}
              px-4 py-3 rounded-lg shadow-2xl
              flex items-center gap-3
              min-w-max max-w-sm
              animate-in slide-in-from-top-4 fade-in duration-300
              pointer-events-auto
              backdrop-blur-md bg-opacity-95
              border border-white/20
            `}
          >
            <span className="flex-shrink-0">{style.icon}</span>
            <span className="font-medium text-sm">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 flex-shrink-0 hover:opacity-70 transition"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default ToastContainer;
