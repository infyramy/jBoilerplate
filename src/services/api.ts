import { ofetch, type FetchResponse, FetchError } from "ofetch";
import { useAuthStore } from "@/stores/auth";
import { toast } from "vue-sonner";
import { 
  type ApiConfig,
  type ApiResponse,
  type ApiError,
  type Environment 
} from "@/types/api";
import { useCache, CacheType } from "@/composables/useCache";
import { useRequestDeduplication } from "@/composables/useRequestDeduplication";

// Initialize cache and request deduplication
const cache = useCache({
  prefix: 'api:',
  type: CacheType.MEMORY,
  debug: process.env.NODE_ENV === 'development'
});

const deduplication = useRequestDeduplication({
  debug: process.env.NODE_ENV === 'development'
});

// Environment configuration
const environments: Record<string, Environment> = {
  development: {
    name: "Development",
    apiUrl: "http://localhost:3000/api",
  },
  staging: {
    name: "Staging",
    apiUrl: "https://staging-api.example.com",
  },
  production: {
    name: "Production",
    apiUrl: "https://api.example.com",
  },
};

// Get API URL based on environment
export const getApiUrl = (): string => {
  // Use window.API_URL if available (for backward compatibility)
  if (window.API_URL) {
    return window.API_URL;
  }
  
  // Otherwise use environment variable with fallback
  const env = process.env.NODE_ENV || "development";
  return environments[env]?.apiUrl || environments.development.apiUrl;
};

// Default headers with authorization
const getDefaultHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("access_token");
  const csrfToken = localStorage.getItem("csrf_token");
  
  return {
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    ...(csrfToken ? { "X-CSRF-TOKEN": csrfToken } : {}),
  };
};

// Generate cache key from API config
const generateCacheKey = (config: ApiConfig): string => {
  const method = config.method || 'GET';
  const params = config.params ? `?${new URLSearchParams(config.params as any).toString()}` : '';
  const bodyKey = config.body ? `:${JSON.stringify(config.body)}` : '';
  
  return `${method}:${config.endpoint}${params}${bodyKey}`;
};

// Request interceptor
const requestInterceptor = (config: ApiConfig): ApiConfig => {
  // Log requests in development
  if (process.env.NODE_ENV === "development") {
    console.log(`[API Request] ${config.method || 'GET'} ${config.endpoint}`, config);
  }
  
  return config;
};

// Response logger for development
const logResponse = (endpoint: string, method: string, response: any): void => {
  if (process.env.NODE_ENV === "development") {
    console.log(`[API Response] ${method} ${endpoint}`, response);
  }
};

// Error handler
const handleApiError = (error: FetchError): ApiError => {
  // Log errors in development
  if (process.env.NODE_ENV === "development") {
    console.error("[API Error]", error);
  }
  
  if (error.response) {
    const status = error.response.status;
    const message = error.response._data?.message || "An error occurred";
    const errors = error.response._data?.errors;
    
    return {
      status,
      message,
      errors,
    };
  } else if (error.request) {
    return {
      status: 500,
      message: "No response received from server",
    };
  } else {
    return {
      status: 500,
      message: error.message || "An error occurred",
    };
  }
};

// Invalidate cache for specific endpoints or patterns
export function invalidateApiCache(pattern?: string): void {
  if (pattern) {
    // Get all cache keys that match the pattern
    const stats = cache.getStats();
    console.log(`Invalidating cache entries matching: ${pattern}`);
    cache.clear();
  } else {
    // Clear all API cache
    console.log('Invalidating all API cache');
    cache.clear();
  }
}

// Main API function
export async function api<T>(config: ApiConfig): Promise<ApiResponse<T>> {
  // Apply request interceptor
  const processedConfig = requestInterceptor(config);
  
  // Check if request should use cache
  const useCache = processedConfig.cache !== false && 
                   (processedConfig.method || 'GET').toUpperCase() === 'GET';
  
  // Check if request should be deduplicated
  const shouldDeduplicate = processedConfig.deduplicate !== false;
  
  // Generate cache key
  const cacheKey = generateCacheKey(processedConfig);
  
  // Try to get from cache first
  if (useCache) {
    const cachedResponse = cache.get<ApiResponse<T>>(cacheKey);
    if (cachedResponse) {
      if (process.env.NODE_ENV === "development") {
        console.log(`[API Cache] Hit for ${processedConfig.method || 'GET'} ${processedConfig.endpoint}`);
      }
      return cachedResponse;
    }
  }
  
  // Prepare the actual request function
  const makeRequest = async (): Promise<ApiResponse<T>> => {
    try {
      const fetchOptions: any = {
        method: processedConfig.method || "GET",
        body: processedConfig.body,
        headers: {
          ...getDefaultHeaders(),
          ...processedConfig.headers,
        },
        credentials: "include",
        retry: processedConfig.retry === true ? 3 : (processedConfig.retry || 0),
        timeout: processedConfig.timeout,
        responseType: processedConfig.responseType as any,
      };
      
      // Only add params if they exist
      if (processedConfig.params) {
        fetchOptions.params = processedConfig.params;
      }
      
      const response = (await ofetch<T>(
        `${getApiUrl()}${processedConfig.endpoint}`, 
        fetchOptions
      )) as T & { headers?: Headers };

      // Log response in development
      logResponse(processedConfig.endpoint, processedConfig.method || "GET", response);

      // Check for new access token in response headers
      const newAccessToken = response.headers?.get("X-New-Access-Token");
      if (newAccessToken) {
        localStorage.setItem("access_token", newAccessToken);
      }
      
      // Check for CSRF token in response headers
      const csrfToken = response.headers?.get("X-CSRF-TOKEN");
      if (csrfToken) {
        localStorage.setItem("csrf_token", csrfToken);
      }

      const apiResponse = {
        data: response,
        status: 200,
      };
      
      // Cache successful GET responses
      if (useCache) {
        const ttl = processedConfig.cacheTTL || null; // Use provided TTL or default
        cache.set(cacheKey, apiResponse, { ttl });
      }

      return apiResponse;
    } catch (error: any) {
      const apiError = handleApiError(error);
      
      // Handle unauthorized/invalid token (401)
      if (apiError.status === 401) {
        const authStore = useAuthStore();

        // Check if we got a new access token in the response
        const newAccessToken = error.response?.headers?.get("X-New-Access-Token");
        if (newAccessToken) {
          localStorage.setItem("access_token", newAccessToken);
          // Retry the original request with the new token
          return api<T>(config);
        }

        // Try to refresh the token
        try {
          const newToken = await authStore.refreshAccessToken();
          if (newToken) {
            // Retry the original request with the new token
            return api<T>(config);
          }
        } catch (refreshError) {
          // If token refresh fails, log out the user
          toast.error("Your session has expired. Please log in again.");
          await authStore.logout();
        }
      } 
      
      // Handle forbidden (403)
      if (apiError.status === 403) {
        toast.error("You don't have permission to perform this action.");
      }
      
      // Handle not found (404)
      if (apiError.status === 404) {
        toast.error("The requested resource was not found.");
      }
      
      // Handle validation errors (422)
      if (apiError.status === 422 && apiError.errors) {
        const firstError = Object.values(apiError.errors)[0]?.[0];
        if (firstError) {
          toast.error(firstError);
        }
      }
      
      // Handle server errors (500)
      if (apiError.status >= 500) {
        toast.error("An unexpected error occurred. Please try again later.");
      }

      return {
        data: {} as T,
        status: apiError.status,
        message: apiError.message,
        errors: apiError.errors,
      };
    }
  };
  
  // Use request deduplication if enabled
  if (shouldDeduplicate) {
    return deduplication.deduplicate(
      processedConfig.method || 'GET',
      processedConfig.endpoint,
      makeRequest,
      processedConfig.body
    );
  }
  
  // Otherwise just make the request
  return makeRequest();
}

// Helper functions for common HTTP methods
export const apiGet = <T>(
  endpoint: string, 
  params?: Record<string, string | number | boolean>,
  config: Partial<ApiConfig> = {}
): Promise<ApiResponse<T>> => {
  return api<T>({
    endpoint,
    method: "GET",
    params,
    ...config,
  });
};

export const apiPost = <T>(
  endpoint: string, 
  body: any, 
  config: Partial<ApiConfig> = {}
): Promise<ApiResponse<T>> => {
  return api<T>({
    endpoint,
    method: "POST",
    body,
    // Disable caching by default for mutations
    cache: false,
    ...config,
  });
};

export const apiPut = <T>(
  endpoint: string, 
  body: any, 
  config: Partial<ApiConfig> = {}
): Promise<ApiResponse<T>> => {
  return api<T>({
    endpoint,
    method: "PUT",
    body,
    // Disable caching by default for mutations
    cache: false,
    ...config,
  });
};

export const apiPatch = <T>(
  endpoint: string, 
  body: any, 
  config: Partial<ApiConfig> = {}
): Promise<ApiResponse<T>> => {
  return api<T>({
    endpoint,
    method: "PATCH",
    body,
    // Disable caching by default for mutations
    cache: false,
    ...config,
  });
};

export const apiDelete = <T>(
  endpoint: string, 
  config: Partial<ApiConfig> = {}
): Promise<ApiResponse<T>> => {
  return api<T>({
    endpoint,
    method: "DELETE",
    // Disable caching by default for mutations
    cache: false,
    ...config,
  });
};

// Example usage:
// const response = await api<User[]>({
//   endpoint: '/users',
//   method: 'GET'
// })
