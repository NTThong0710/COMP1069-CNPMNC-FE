import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const toastTypes = {
  success: {
    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    bgColor: 'bg-[#282828]',
    borderColor: 'border-green-500'
  },
  error: {
    icon: <AlertCircle className="w-5 h-5 text-red-500" />,
    bgColor: 'bg-[#282828]',
    borderColor: 'border-red-500'
  },
  info: {
    icon: <Info className="w-5 h-5 text-blue-500" />,
    bgColor: 'bg-[#282828]',
    borderColor: 'border-blue-500'
  }
};

const ToastNotification = ({ message, type = 'success', onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  // Xử lý hiệu ứng đóng dần
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false); // Bắt đầu hiệu ứng fade out
      setTimeout(onClose, 300); // Đợi hiệu ứng xong thì xóa khỏi DOM
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const style = toastTypes[type] || toastTypes.success;

  return (
    // Đã bỏ 'fixed', 'bottom', 'left' vì cha đã lo việc đó
    <div 
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg shadow-2xl border-l-4 
        ${style.borderColor} ${style.bgColor} text-white min-w-[300px] max-w-md
        transition-all duration-300 transform
        ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-2 opacity-0 scale-95'}
      `}
    >
      {style.icon}
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button onClick={handleClose} className="text-gray-400 hover:text-white transition">
        <X size={18} />
      </button>
    </div>
  );
};

export default ToastNotification;