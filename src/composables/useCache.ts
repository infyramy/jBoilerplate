import { ref, Ref, watch } from 'vue';

/**
 * Cache storage types
 */
export enum CacheType {
  MEMORY = 'memory',
  LOCAL_STORAGE = 'localStorage',
  SESSION_STORAGE = 'sessionStorage'
}

/**
 * Cache item structure with metadata
 */
export interface CacheItem<T> {
  data: T;
  expiresAt: number | null;
  createdAt: number;
}

/**
 * Cache options for configuration
 */
export interface CacheOptions {
  /**
   * Cache type (memory, localStorage, sessionStorage)
   */
  type?: CacheType;
  
  /**
   * Time-to-live in milliseconds (null for no expiration)
   */
  ttl?: number | null;
  
  /**
   * Prefix for storage keys (for localStorage/sessionStorage)
   */
  prefix?: string;
  
  /**
   * Maximum number of items to keep in memory cache
   */
  maxItems?: number;
  
  /**
   * Whether to enable cache debugging
   */
  debug?: boolean;
}

/**
 * Memory cache storage
 */
const memoryCache = new Map<string, CacheItem<any>>();

/**
 * Cache composable for storing and retrieving data with TTL
 * 
 * @param defaultOptions Default options for all cache operations
 * @returns Cache methods and utilities
 */
export function useCache(defaultOptions: CacheOptions = {}) {
  // Set default options
  const options = {
    type: CacheType.MEMORY,
    ttl: 5 * 60 * 1000, // 5 minutes
    prefix: 'cache:',
    maxItems: 100,
    debug: false,
    ...defaultOptions
  };
  
  /**
   * Generate storage key with prefix
   */
  const getKey = (key: string): string => {
    return `${options.prefix}${key}`;
  };
  
  /**
   * Debug log helper
   */
  const logDebug = (message: string, ...args: any[]): void => {
    if (options.debug) {
      console.debug(`[Cache] ${message}`, ...args);
    }
  };
  
  /**
   * Set cache item with options
   */
  const set = <T>(key: string, data: T, itemOptions?: Partial<CacheOptions>): void => {
    const { ttl, type } = { ...options, ...itemOptions };
    const fullKey = getKey(key);
    
    const item: CacheItem<T> = {
      data,
      expiresAt: ttl !== null ? Date.now() + ttl : null,
      createdAt: Date.now()
    };

    logDebug(`Setting ${fullKey}`, item);
    
    switch (type) {
      case CacheType.LOCAL_STORAGE:
        try {
          localStorage.setItem(fullKey, JSON.stringify(item));
        } catch (e) {
          console.error('Error storing in localStorage:', e);
        }
        break;
        
      case CacheType.SESSION_STORAGE:
        try {
          sessionStorage.setItem(fullKey, JSON.stringify(item));
        } catch (e) {
          console.error('Error storing in sessionStorage:', e);
        }
        break;
        
      case CacheType.MEMORY:
      default:
        // If we hit max items, remove the oldest one
        if (memoryCache.size >= options.maxItems) {
          const oldestKey = [...memoryCache.entries()]
            .sort(([, a], [, b]) => a.createdAt - b.createdAt)[0][0];
          
          logDebug(`Cache full, removing oldest item: ${oldestKey}`);
          memoryCache.delete(oldestKey);
        }
        
        memoryCache.set(fullKey, item);
        break;
    }
  };
  
  /**
   * Get cache item if valid
   */
  const get = <T>(key: string, itemOptions?: Partial<CacheOptions>): T | null => {
    const { type } = { ...options, ...itemOptions };
    const fullKey = getKey(key);
    let item: CacheItem<T> | null = null;
    
    switch (type) {
      case CacheType.LOCAL_STORAGE:
        try {
          const value = localStorage.getItem(fullKey);
          if (value) {
            item = JSON.parse(value) as CacheItem<T>;
          }
        } catch (e) {
          console.error('Error retrieving from localStorage:', e);
        }
        break;
        
      case CacheType.SESSION_STORAGE:
        try {
          const value = sessionStorage.getItem(fullKey);
          if (value) {
            item = JSON.parse(value) as CacheItem<T>;
          }
        } catch (e) {
          console.error('Error retrieving from sessionStorage:', e);
        }
        break;
        
      case CacheType.MEMORY:
      default:
        item = memoryCache.get(fullKey) as CacheItem<T> || null;
        break;
    }
    
    // Check if item exists and is not expired
    if (item) {
      const now = Date.now();
      if (item.expiresAt === null || item.expiresAt > now) {
        logDebug(`Cache hit for ${fullKey}`, item);
        return item.data;
      } else {
        logDebug(`Cache expired for ${fullKey}`);
        remove(key, { type });
      }
    } else {
      logDebug(`Cache miss for ${fullKey}`);
    }
    
    return null;
  };
  
  /**
   * Remove item from cache
   */
  const remove = (key: string, itemOptions?: Partial<CacheOptions>): void => {
    const { type } = { ...options, ...itemOptions };
    const fullKey = getKey(key);
    
    logDebug(`Removing ${fullKey}`);
    
    switch (type) {
      case CacheType.LOCAL_STORAGE:
        localStorage.removeItem(fullKey);
        break;
        
      case CacheType.SESSION_STORAGE:
        sessionStorage.removeItem(fullKey);
        break;
        
      case CacheType.MEMORY:
      default:
        memoryCache.delete(fullKey);
        break;
    }
  };
  
  /**
   * Clear all cache items for the current type
   */
  const clear = (itemOptions?: Partial<CacheOptions>): void => {
    const { type, prefix } = { ...options, ...itemOptions };
    
    logDebug(`Clearing cache type: ${type}`);
    
    switch (type) {
      case CacheType.LOCAL_STORAGE:
        // Only remove items with our prefix
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          if (key && key.startsWith(prefix)) {
            localStorage.removeItem(key);
          }
        }
        break;
        
      case CacheType.SESSION_STORAGE:
        // Only remove items with our prefix
        for (let i = sessionStorage.length - 1; i >= 0; i--) {
          const key = sessionStorage.key(i);
          if (key && key.startsWith(prefix)) {
            sessionStorage.removeItem(key);
          }
        }
        break;
        
      case CacheType.MEMORY:
      default:
        // Remove memory cache items with our prefix
        [...memoryCache.keys()].forEach(key => {
          if (key.startsWith(prefix)) {
            memoryCache.delete(key);
          }
        });
        break;
    }
  };
  
  /**
   * Create a cached ref that automatically saves to cache
   */
  const cachedRef = <T>(key: string, initialValue: T, itemOptions?: Partial<CacheOptions>) => {
    const cachedValue = get<T>(key, itemOptions);
    const refValue = ref(cachedValue !== null ? cachedValue : initialValue);
    
    // Watch for changes and update cache
    watch(refValue, (newValue) => {
      set(key, newValue, itemOptions);
    }, { deep: true });
    
    return refValue;
  };
  
  /**
   * Get cache stats for current type
   */
  const getStats = (itemOptions?: Partial<CacheOptions>) => {
    const { type, prefix } = { ...options, ...itemOptions };
    let count = 0;
    let size = 0;
    
    switch (type) {
      case CacheType.LOCAL_STORAGE:
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(prefix)) {
            count++;
            size += (localStorage.getItem(key) || '').length * 2; // UTF-16 characters = 2 bytes
          }
        }
        break;
        
      case CacheType.SESSION_STORAGE:
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key && key.startsWith(prefix)) {
            count++;
            size += (sessionStorage.getItem(key) || '').length * 2; // UTF-16 characters = 2 bytes
          }
        }
        break;
        
      case CacheType.MEMORY:
      default:
        for (const key of memoryCache.keys()) {
          if (key.startsWith(prefix)) {
            count++;
            // Rough size estimation
            try {
              size += JSON.stringify(memoryCache.get(key)).length * 2;
            } catch (e) {
              // Ignore serialization errors
            }
          }
        }
        break;
    }
    
    return {
      type,
      count,
      size,
      sizeInKB: Math.round(size / 1024),
    };
  };
  
  return {
    set,
    get,
    remove,
    clear,
    cachedRef,
    getStats,
    getKey
  };
} 