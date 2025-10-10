/**
 * Toast notification composable
 * Provides a consistent interface for displaying toast notifications
 */
import { toast } from 'vue-sonner';

/**
 * Toast variant types
 */
export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

/**
 * Toast options
 */
export interface ToastOptions {
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  cancel?: {
    label: string;
    onClick?: () => void;
  };
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
  important?: boolean;
  id?: string | number;
}

/**
 * Hook for using toast notifications
 * @returns Toast methods
 */
export function useToast() {
  /**
   * Show a toast notification
   * @param title Toast title
   * @param options Toast options
   */
  const show = (title: string, options?: ToastOptions) => {
    toast(title, options);
  };

  /**
   * Show a success toast notification
   * @param title Toast title
   * @param options Toast options
   */
  const success = (title: string, options?: ToastOptions) => {
    toast.success(title, options);
  };

  /**
   * Show an error toast notification
   * @param title Toast title
   * @param options Toast options
   */
  const error = (title: string, options?: ToastOptions) => {
    toast.error(title, options);
  };

  /**
   * Show a warning toast notification
   * @param title Toast title
   * @param options Toast options
   */
  const warning = (title: string, options?: ToastOptions) => {
    toast.warning(title, options);
  };

  /**
   * Show an info toast notification
   * @param title Toast title
   * @param options Toast options
   */
  const info = (title: string, options?: ToastOptions) => {
    toast.info(title, options);
  };

  /**
   * Show a promise toast notification
   * @param promise Promise to track
   * @param options Toast options for loading, success, and error states
   */
  const promise = <T>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    }
  ) => {
    return toast.promise(promise, options);
  };

  /**
   * Dismiss a toast notification
   * @param toastId ID of toast to dismiss (dismisses all if not provided)
   */
  const dismiss = (toastId?: string) => {
    toast.dismiss(toastId);
  };

  return {
    show,
    success,
    error,
    warning,
    info,
    promise,
    dismiss
  };
}

export default useToast; 