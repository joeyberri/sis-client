'use client';

import { toast as sonnerToast } from 'sonner';

type ToastOptions = {
  title?: string;
  description?: string;
  variant?: 'destructive' | 'default' | string;
  duration?: number;
};

export function useToast() {
  const toast = ({ title, description, variant, duration }: ToastOptions) => {
    // Build a simple message that includes title and description
    const message = title && description ? `${title}: ${description}` : title || description || '';

    // Map variants to sonner helpers when available
    try {
      if (variant === 'destructive' && (sonnerToast as any).error) {
        // sonner provides toast.error in some versions
        (sonnerToast as any).error(message, { duration });
        return;
      }

      if (variant === 'default' && (sonnerToast as any).success) {
        (sonnerToast as any).success(message, { duration });
        return;
      }

      // Fallback: call toast directly
      sonnerToast(message, { duration });
    } catch (e) {
      // As a last resort, use window.alert so the user sees something during dev
      try {
        if (message) window.alert(message);
      } catch (err) {
        // no-op
      }
    }
  };

  return { toast };
}
