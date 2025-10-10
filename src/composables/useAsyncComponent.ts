import { defineAsyncComponent, h, Component } from 'vue';
import LazyComponent from '@/components/ui/loading/LazyComponent.vue';

/**
 * Creates an async component with improved loading and error states
 * 
 * @param loader Function that returns a Promise that resolves to a component
 * @param loadingText Custom loading text to display during component loading
 * @returns Async component with loading and error handling
 */
export function useAsyncComponent(
  loader: () => Promise<Component>,
  loadingText: string = 'Loading...'
) {
  return defineAsyncComponent({
    loader,
    // Create loading component with provided text
    loadingComponent: h(LazyComponent, { loadingText }),
    // Add delay to prevent flash of loading state for fast connections
    delay: 200,
    // Set reasonable timeout
    timeout: 30000,
    // Basic error handler
    onError: (err, retry, fail) => {
      console.error('Error loading component:', err);
      fail();
    }
  });
}

/**
 * Creates a group of async components with consistent loading behavior
 * 
 * @param components Record of component loaders
 * @param loadingText Custom loading text to display during component loading
 * @returns Record of async components with consistent loading behavior
 */
export function useAsyncComponentGroup<T extends Record<string, () => Promise<Component>>>(
  components: T,
  loadingText?: string
): Record<keyof T, Component> {
  const result = {} as Record<keyof T, Component>;
  
  for (const key in components) {
    result[key] = useAsyncComponent(components[key], loadingText);
  }
  
  return result;
}

/**
 * Prefetches components based on route for faster loading
 * 
 * @param path Current route path
 * @param componentLoaders Map of path patterns to component loaders
 */
export function prefetchRouteComponents(
  path: string,
  componentLoaders: Record<string, () => Promise<Component>>
) {
  for (const pattern in componentLoaders) {
    // Simple pattern matching - can be enhanced for more complex needs
    if (path.includes(pattern)) {
      // Prefetch the component
      componentLoaders[pattern]().catch(() => {
        // Silently catch errors during prefetching
        console.info(`Prefetching failed for pattern: ${pattern}`);
      });
    }
  }
} 