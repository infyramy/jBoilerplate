export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiConfig {
  endpoint: string;
  method?: HttpMethod;
  body?: any;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean> | undefined;
  withCredentials?: boolean;
  responseType?: 'json' | 'text' | 'blob' | 'arrayBuffer';
  timeout?: number;
  retry?: number | boolean;
  
  /**
   * Whether to cache responses (defaults to true for GET requests, false for others)
   */
  cache?: boolean;
  
  /**
   * Time-to-live for cached responses in milliseconds
   * If not specified, uses the default TTL from the cache configuration
   */
  cacheTTL?: number | null;
  
  /**
   * Whether to deduplicate identical in-flight requests (defaults to true)
   */
  deduplicate?: boolean;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string | undefined;
  errors?: Record<string, string[]> | undefined;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]> | undefined;
}

export interface RequestParams {
  [key: string]: string | number | boolean | undefined;
}

export interface Environment {
  name: string;
  apiUrl: string;
} 