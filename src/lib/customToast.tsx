import { toast as sonnerToast } from "sonner";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

const iconMap = {
  success: <CheckCircle className="w-4 h-4 text-green-800" />, // deeper green
  error: <XCircle className="w-4 h-4 text-red-800" />, // strong red
  warning: <AlertTriangle className="w-4 h-4 text-yellow-700" />, // rich amber
  info: <Info className="w-4 h-4 text-blue-900" />, // dark blue
};

const toast = {
  success: (message: string, opts = {}) =>
    sonnerToast.success(message, { icon: iconMap.success, ...opts }),
  error: (message: string, opts = {}) =>
    sonnerToast.error(message, { icon: iconMap.error, ...opts }),
  warning: (message: string, opts = {}) =>
    sonnerToast(message, { icon: iconMap.warning, ...opts }),
  info: (message: string, opts = {}) =>
    sonnerToast(message, { icon: iconMap.info, ...opts }),
};

export default toast;
