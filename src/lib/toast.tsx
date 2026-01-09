'use client';

import { toast as sonnerToast } from 'sonner';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Loader2,
  Upload,
  Download,
  Trash2,
  UserPlus,
  Settings,
  Bell,
  Sparkles
} from 'lucide-react';

// Custom toast styling consistent with design system
const baseStyles = {
  success:
    'bg-green-50 border-green-200 text-green-900 dark:bg-green-950/50 dark:border-green-800 dark:text-green-100',
  error:
    'bg-red-50 border-red-200 text-red-900 dark:bg-red-950/50 dark:border-red-800 dark:text-red-100',
  warning:
    'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/50 dark:border-amber-800 dark:text-amber-100',
  info: 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-100',
  loading:
    'bg-slate-50 border-slate-200 text-slate-900 dark:bg-slate-950/50 dark:border-slate-800 dark:text-slate-100'
};

const iconStyles = {
  success: 'text-green-600 dark:text-green-400',
  error: 'text-red-600 dark:text-red-400',
  warning: 'text-amber-600 dark:text-amber-400',
  info: 'text-blue-600 dark:text-blue-400',
  loading: 'text-slate-600 dark:text-slate-400'
};

// Progress toast for operations like bulk uploads
interface ProgressToastOptions {
  title: string;
  description?: string;
  progress: number;
  total: number;
  icon?: React.ReactNode;
}

// Toast functions with consistent styling
export const toast = {
  success: (
    message: string,
    options?: { description?: string; duration?: number }
  ) => {
    return sonnerToast.success(message, {
      description: options?.description,
      duration: options?.duration ?? 4000,
      icon: <CheckCircle2 className={`h-5 w-5 ${iconStyles.success}`} />,
      className: baseStyles.success
    });
  },

  error: (
    message: string,
    options?: { description?: string; duration?: number }
  ) => {
    return sonnerToast.error(message, {
      description: options?.description,
      duration: options?.duration ?? 6000,
      icon: <XCircle className={`h-5 w-5 ${iconStyles.error}`} />,
      className: baseStyles.error
    });
  },

  warning: (
    message: string,
    options?: { description?: string; duration?: number }
  ) => {
    return sonnerToast.warning(message, {
      description: options?.description,
      duration: options?.duration ?? 5000,
      icon: <AlertTriangle className={`h-5 w-5 ${iconStyles.warning}`} />,
      className: baseStyles.warning
    });
  },

  info: (
    message: string,
    options?: { description?: string; duration?: number }
  ) => {
    return sonnerToast.info(message, {
      description: options?.description,
      duration: options?.duration ?? 4000,
      icon: <Info className={`h-5 w-5 ${iconStyles.info}`} />,
      className: baseStyles.info
    });
  },

  loading: (message: string, options?: { description?: string }) => {
    return sonnerToast.loading(message, {
      description: options?.description,
      icon: (
        <Loader2 className={`h-5 w-5 ${iconStyles.loading} animate-spin`} />
      ),
      className: baseStyles.loading
    });
  },

  // Promise-based toast for async operations
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    }
  ) => {
    return sonnerToast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error
    });
  },

  // Dismiss a specific toast or all toasts
  dismiss: (toastId?: string | number) => {
    sonnerToast.dismiss(toastId);
  },

  // Custom toast for specific scenarios
  custom: {
    welcome: (userName: string) => {
      return sonnerToast(
        <div className='flex items-center gap-3'>
          <Sparkles className='h-5 w-5 text-purple-500' />
          <div>
            <p className='font-medium'>Welcome back, {userName}!</p>
            <p className='text-muted-foreground text-sm'>
              Your dashboard is ready
            </p>
          </div>
        </div>,
        { duration: 5000 }
      );
    },

    upload: (fileName: string, progress: number) => {
      return sonnerToast(
        <div className='flex w-full items-start gap-3'>
          <Upload className='mt-0.5 h-5 w-5 text-blue-500' />
          <div className='flex-1'>
            <p className='font-medium'>Uploading {fileName}</p>
            <div className='mt-2 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700'>
              <div
                className='h-2 rounded-full bg-blue-500 transition-all duration-300'
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className='text-muted-foreground mt-1 text-xs'>
              {progress}% complete
            </p>
          </div>
        </div>,
        { duration: Infinity, id: `upload-${fileName}` }
      );
    },

    uploadComplete: (fileName: string) => {
      sonnerToast.dismiss(`upload-${fileName}`);
      return sonnerToast.success(`${fileName} uploaded successfully`, {
        icon: <CheckCircle2 className='h-5 w-5 text-green-500' />
      });
    },

    bulkOperation: (operation: string, current: number, total: number) => {
      const progress = Math.round((current / total) * 100);
      return sonnerToast(
        <div className='flex w-full items-start gap-3'>
          <Loader2 className='mt-0.5 h-5 w-5 animate-spin text-blue-500' />
          <div className='flex-1'>
            <p className='font-medium'>{operation}</p>
            <div className='mt-2 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700'>
              <div
                className='h-2 rounded-full bg-blue-500 transition-all duration-300'
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className='text-muted-foreground mt-1 text-xs'>
              {current} of {total} ({progress}%)
            </p>
          </div>
        </div>,
        { duration: Infinity, id: `bulk-${operation}` }
      );
    },

    bulkComplete: (operation: string, count: number) => {
      sonnerToast.dismiss(`bulk-${operation}`);
      return sonnerToast.success(`${operation} completed`, {
        description: `Successfully processed ${count} items`,
        icon: <CheckCircle2 className='h-5 w-5 text-green-500' />
      });
    },

    tip: (title: string, message: string) => {
      return sonnerToast(
        <div className='flex items-start gap-3'>
          <div className='rounded-full bg-purple-100 p-1.5 dark:bg-purple-900/50'>
            <Sparkles className='h-4 w-4 text-purple-600 dark:text-purple-400' />
          </div>
          <div>
            <p className='font-medium'>{title}</p>
            <p className='text-muted-foreground text-sm'>{message}</p>
          </div>
        </div>,
        { duration: 8000 }
      );
    },

    action: (message: string, actionLabel: string, onAction: () => void) => {
      return sonnerToast(message, {
        action: {
          label: actionLabel,
          onClick: onAction
        },
        duration: 10000
      });
    },

    notification: (
      title: string,
      message: string,
      type: 'message' | 'alert' | 'system' = 'system'
    ) => {
      const icons = {
        message: <Bell className='h-5 w-5 text-blue-500' />,
        alert: <AlertTriangle className='h-5 w-5 text-amber-500' />,
        system: <Settings className='h-5 w-5 text-slate-500' />
      };
      return sonnerToast(
        <div className='flex items-start gap-3'>
          {icons[type]}
          <div>
            <p className='font-medium'>{title}</p>
            <p className='text-muted-foreground text-sm'>{message}</p>
          </div>
        </div>,
        { duration: 6000 }
      );
    }
  }
};

// Export type for external use
export type ToastAPI = typeof toast;
