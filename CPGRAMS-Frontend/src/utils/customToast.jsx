import toast from 'react-hot-toast';
import { X } from 'lucide-react';

const variantStyles = {
  success: {
    title: 'Success',
    bg: 'bg-green-500',
    titleColor: 'text-white',
    descColor: 'text-white/90',
  },
  error: {
    title: 'Missing Information',
    bg: 'bg-red-500',
    titleColor: 'text-white',
    descColor: 'text-white/90',
  },
  warning: {
    title: 'Warning',
    bg: 'bg-yellow-500',
    titleColor: 'text-white',
    descColor: 'text-white/90',
  },
};

export const showToast = (message, type = 'success') => {
  const variant = variantStyles[type] || variantStyles.success;

  toast.custom((t) => (
    <div
      className={`relative flex items-start gap-3 max-w-sm w-full ${variant.bg} rounded-md shadow-lg p-4 transform transition-all duration-500 ease-out ${
        t.visible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 -translate-y-2 scale-95'
      }`}
    >
      <div className="flex-1 space-y-1">
        <p className={`text-sm font-semibold ${variant.titleColor}`}>
          {variant.title}
        </p>
        <p className={`text-sm ${variant.descColor}`}>{message}</p>
      </div>

      {/* Close Button */}
      <button
        onClick={() => toast.dismiss(t.id)}
        className="absolute top-2 right-2 text-white/80 hover:text-white transition"
      >
        <X size={16} />
      </button>
    </div>
  ));
};
