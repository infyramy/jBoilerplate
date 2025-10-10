import { ref, Ref, unref, onUnmounted, onDeactivated } from 'vue';

export type IntersectionObserverCallback = (
  entries: IntersectionObserverEntry[],
  observer: IntersectionObserver
) => void;

/**
 * Vue composable for using Intersection Observer API
 * 
 * @param target Element ref to observe
 * @param callback Function to call when intersection changes
 * @param options IntersectionObserver options
 * @returns Control functions (stop)
 */
export function useIntersectionObserver(
  target: Ref<Element | null | undefined> | Element | null | undefined,
  callback: IntersectionObserverCallback,
  options: IntersectionObserverOptions = {}
) {
  let cleanup = () => {};
  const isSupported = window && 'IntersectionObserver' in window;
  
  const stopObserver = () => {
    cleanup();
  };

  const observer = ref<IntersectionObserver | undefined>(undefined);

  if (isSupported) {
    // Create observer instance
    observer.value = new IntersectionObserver(callback, options);
    
    const stopObserving = () => {
      if (observer.value) {
        observer.value.disconnect();
        observer.value = undefined;
      }
    };

    // Observe the target element
    const el = unref(target);
    if (el) {
      observer.value.observe(el);
    }

    cleanup = () => {
      stopObserving();
    };

    onUnmounted(stopObserving);
    onDeactivated(stopObserving);
  }

  return {
    observer,
    stop: stopObserver
  };
}

export interface IntersectionObserverOptions extends IntersectionObserverInit {
  /**
   * Root margin in pixels or percent
   */
  rootMargin?: string;
} 