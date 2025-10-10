/**
 * API Configuration options
 */
export interface ApiConfig {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  params?: Record<string, string | number | boolean>;
  body?: any;
  headers?: Record<string, string>;
  timeout?: number;
  retry?: boolean | number;
  responseType?: 'json' | 'text' | 'blob' | 'arrayBuffer' | 'stream';
}

/**
 * API Response structure
 */
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
  errors?: Record<string, string[]>;
}

/**
 * API Error structure
 */
export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
} 