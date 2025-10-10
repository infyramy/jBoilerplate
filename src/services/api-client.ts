import { Hono } from 'hono';
import { env } from 'hono/preset/env';
import { ofetch } from 'ofetch';
import { useAuthStore } from '@/stores/auth';
import { toast } from 'vue-sonner';
import { configService } from '@/services/config';
import type { ApiConfig, ApiResponse, ApiError } from '@/types/api';

// Create a new Hono instance
const app = new Hono();

// Use the env preset to access environment variables
app.use(env());

// Get API URL based on environment
const getApiUrl = (): string => {
  // Use window.API_URL if available (for backward compatibility)
  if (window.API_URL) {
    return window.API_URL;
  }
  
  // Otherwise use config service
  return configService.api.url;
};

// Default headers with authorization
const getDefaultHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('access_token');
  const csrfToken = localStorage.getItem('csrf_token');
  
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
  };
};

// Request interceptor
const requestInterceptor = (config: ApiConfig): ApiConfig => {
  // Log requests in development
  if (configService.isDevelopment) {
    console.log(`[API Request] ${config.method || 'GET'} ${config.endpoint}`, config);
  }
  
  return config;
};

// Response logger for development
const logResponse = (endpoint: string, method: string, response: any): void => {
  if (configService.isDevelopment) {
    console.log(`[API Response] ${method} ${endpoint}`, response);
  }
};

// Error handler
const handleApiError = (error: any): ApiError => {
  // Log errors in development
  if (configService.isDevelopment) {
    console.error('[API Error]', error);
  }
  
  if (error.response) {
    const status = error.response.status;
    const message = error.response._data?.message || 'An error occurred';
    const errors = error.response._data?.errors;
    
    return {
      status,
      message,
      errors,
    };
  } else if (error.request) {
    return {
      status: 500,
      message: 'No response received from server',
    };
  } else {
    return {
      status: 500,
      message: error.message || 'An error occurred',
    };
  }
};

// Main API function using HONO
export async function api<T>(config: ApiConfig): Promise<ApiResponse<T>> {
  // Apply request interceptor
  const processedConfig = requestInterceptor(config);
  
  try {
    const fetchOptions: any = {
      method: processedConfig.method || 'GET',
      body: processedConfig.body,
      headers: {
        ...getDefaultHeaders(),
        ...processedConfig.headers,
      },
      credentials: 'include',
      retry: processedConfig.retry === true ? configService.api.retries : (processedConfig.retry || 0),
      timeout: processedConfig.timeout || configService.api.timeout,
      responseType: processedConfig.responseType as any,
    };
    
    // Only add params if they exist
    if (processedConfig.params) {
      fetchOptions.params = processedConfig.params;
    }
    
    // Prepare the endpoint URL
    const url = `${getApiUrl()}${processedConfig.endpoint}`;
    
    // Use ofetch to make the request
    const response = await ofetch<T>(url, fetchOptions);
    
    // Log response in development
    logResponse(processedConfig.endpoint, processedConfig.method || 'GET', response);
    
    return {
      data: response,
      status: 200,
    };
  } catch (error: any) {
    const apiError = handleApiError(error);
    
    // Handle unauthorized/invalid token (401)
    if (apiError.status === 401) {
      const authStore = useAuthStore();
      
      // Try to refresh the token
      try {
        const newToken = await authStore.refreshAccessToken();
        if (newToken) {
          // Retry the original request with the new token
          return api<T>(config);
        }
      } catch (refreshError) {
        // If token refresh fails, log out the user
        toast.error('Your session has expired. Please log in again.');
        await authStore.logout();
      }
    } 
    
    // Handle forbidden (403)
    if (apiError.status === 403) {
      toast.error("You don't have permission to perform this action.");
    }
    
    // Handle not found (404)
    if (apiError.status === 404) {
      toast.error('The requested resource was not found.');
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
      toast.error('An unexpected error occurred. Please try again later.');
    }

    return {
      data: {} as T,
      status: apiError.status,
      message: apiError.message,
      errors: apiError.errors,
    };
  }
}

// Define API endpoints using HONO
app.get('/users', async (c) => {
  const response = await api<any>({
    endpoint: '/users',
    method: 'GET',
    params: c.req.query(),
  });
  
  return c.json(response.data);
});

app.get('/users/:id', async (c) => {
  const id = c.req.param('id');
  const response = await api<any>({
    endpoint: `/users/${id}`,
    method: 'GET',
  });
  
  return c.json(response.data);
});

app.post('/users', async (c) => {
  const body = await c.req.json();
  const response = await api<any>({
    endpoint: '/users',
    method: 'POST',
    body,
  });
  
  return c.json(response.data);
});

app.put('/users/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const response = await api<any>({
    endpoint: `/users/${id}`,
    method: 'PUT',
    body,
  });
  
  return c.json(response.data);
});

app.delete('/users/:id', async (c) => {
  const id = c.req.param('id');
  const response = await api<any>({
    endpoint: `/users/${id}`,
    method: 'DELETE',
  });
  
  return c.json(response.data);
});

// Helper functions for common HTTP methods
export const apiGet = <T>(endpoint: string, params?: Record<string, string | number | boolean>): Promise<ApiResponse<T>> => {
  return api<T>({
    endpoint,
    method: 'GET',
    params,
  });
};

export const apiPost = <T>(endpoint: string, body: any, config: Partial<ApiConfig> = {}): Promise<ApiResponse<T>> => {
  return api<T>({
    endpoint,
    method: 'POST',
    body,
    ...config,
  });
};

export const apiPut = <T>(endpoint: string, body: any, config: Partial<ApiConfig> = {}): Promise<ApiResponse<T>> => {
  return api<T>({
    endpoint,
    method: 'PUT',
    body,
    ...config,
  });
};

export const apiPatch = <T>(endpoint: string, body: any, config: Partial<ApiConfig> = {}): Promise<ApiResponse<T>> => {
  return api<T>({
    endpoint,
    method: 'PATCH',
    body,
    ...config,
  });
};

export const apiDelete = <T>(endpoint: string, config: Partial<ApiConfig> = {}): Promise<ApiResponse<T>> => {
  return api<T>({
    endpoint,
    method: 'DELETE',
    ...config,
  });
};

// Export the Hono app for direct use
export const apiClient = app; 