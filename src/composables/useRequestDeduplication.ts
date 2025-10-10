/**
 * Keeps track of in-flight requests to prevent duplicates
 */
const pendingRequests = new Map<string, Promise<any>>();

/**
 * Options for request deduplication
 */
export interface RequestDeduplicationOptions {
  /**
   * Maximum time to keep a pending request in the cache (ms)
   */
  maxPendingTime?: number;
  
  /**
   * Whether to log debug information
   */
  debug?: boolean;
}

/**
 * Generate a unique key for a request based on method, url and body
 */
function generateRequestKey(method: string, url: string, body?: any): string {
  const bodyKey = body ? JSON.stringify(body) : '';
  return `${method}:${url}:${bodyKey}`;
}

/**
 * Vue composable for deduplicating API requests
 * 
 * @param defaultOptions Default options for all deduplication operations
 * @returns Deduplication methods and utilities
 */
export function useRequestDeduplication(defaultOptions: RequestDeduplicationOptions = {}) {
  const options = {
    maxPendingTime: 30000, // 30 seconds
    debug: false,
    ...defaultOptions
  };
  
  /**
   * Debug log helper
   */
  const logDebug = (message: string, ...args: any[]): void => {
    if (options.debug) {
      console.debug(`[RequestDeduplication] ${message}`, ...args);
    }
  };
  
  /**
   * Execute a request function with deduplication
   * If an identical request is already in progress, return its promise instead
   */
  const deduplicate = async <T>(
    method: string,
    url: string,
    requestFn: () => Promise<T>,
    body?: any,
    requestOptions?: RequestDeduplicationOptions
  ): Promise<T> => {
    const mergedOptions = { ...options, ...requestOptions };
    const requestKey = generateRequestKey(method, url, body);
    
    // Check if we already have this request in progress
    if (pendingRequests.has(requestKey)) {
      logDebug(`Deduplicating request: ${requestKey}`);
      return pendingRequests.get(requestKey) as Promise<T>;
    }
    
    // Create a new request and store it
    logDebug(`New request: ${requestKey}`);
    
    try {
      // Create the promise for this request
      const requestPromise = requestFn();
      
      // Store the promise
      pendingRequests.set(requestKey, requestPromise);
      
      // Set timeout to remove from pending requests
      setTimeout(() => {
        if (pendingRequests.get(requestKey) === requestPromise) {
          logDebug(`Cleaning up stale request: ${requestKey}`);
          pendingRequests.delete(requestKey);
        }
      }, mergedOptions.maxPendingTime);
      
      // Wait for the request to complete
      const response = await requestPromise;
      
      // Remove from pending requests
      pendingRequests.delete(requestKey);
      
      return response;
    } catch (error) {
      // Remove from pending requests on error
      pendingRequests.delete(requestKey);
      throw error;
    }
  };
  
  /**
   * Cancel all pending requests
   */
  const cancelAll = (): void => {
    logDebug(`Cancelling all pending requests: ${pendingRequests.size}`);
    pendingRequests.clear();
  };
  
  /**
   * Get the number of pending requests
   */
  const getPendingCount = (): number => {
    return pendingRequests.size;
  };
  
  /**
   * Check if a specific request is pending
   */
  const isPending = (method: string, url: string, body?: any): boolean => {
    const requestKey = generateRequestKey(method, url, body);
    return pendingRequests.has(requestKey);
  };
  
  return {
    deduplicate,
    cancelAll,
    getPendingCount,
    isPending
  };
} 