declare module 'vue-sonner' {
  import { DefineComponent } from 'vue';
  
  export const Toaster: DefineComponent<{
    position?: string;
    expand?: boolean;
    visibleToasts?: number;
    closeButton?: boolean;
    offset?: string | number;
    dir?: string;
    hotkey?: string[];
    theme?: string;
    richColors?: boolean;
    duration?: number;
    gap?: number;
    class?: string;
    toastOptions?: Record<string, any>;
    [key: string]: any;
  }>;
  
  export const toast: {
    (message: string, options?: Record<string, any>): void;
    success(message: string, options?: Record<string, any>): void;
    error(message: string, options?: Record<string, any>): void;
    warning(message: string, options?: Record<string, any>): void;
    info(message: string, options?: Record<string, any>): void;
    promise<T>(promise: Promise<T>, options?: Record<string, any>): Promise<T>;
    dismiss(toastId?: string): void;
    custom(component: any, options?: Record<string, any>): void;
  };
} 