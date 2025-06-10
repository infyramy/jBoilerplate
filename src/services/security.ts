import { ofetch } from 'ofetch';
import { getApiUrl } from './api';

/**
 * Security service for managing CSRF tokens and protection
 */
export class SecurityService {
  private static instance: SecurityService;
  private csrfToken: string | null = null;
  private tokenExpiresAt: number | null = null;
  private tokenRefreshPromise: Promise<string> | null = null;
  
  /**
   * Get singleton instance
   */
  public static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    return SecurityService.instance;
  }
  
  /**
   * Private constructor for singleton pattern
   */
  private constructor() {
    // Load any existing token from storage
    this.loadTokenFromStorage();
    
    // Add event listener for visibility change to refresh token when needed
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && this.shouldRefreshToken()) {
          this.refreshCsrfToken();
        }
      });
    }
  }
  
  /**
   * Load CSRF token from storage
   */
  private loadTokenFromStorage(): void {
    try {
      const storedToken = localStorage.getItem('csrf_token');
      const storedExpiry = localStorage.getItem('csrf_token_expires');
      
      if (storedToken) {
        this.csrfToken = storedToken;
        this.tokenExpiresAt = storedExpiry ? parseInt(storedExpiry, 10) : null;
      }
    } catch (error) {
      console.error('Error loading CSRF token from storage:', error);
    }
  }
  
  /**
   * Save CSRF token to storage
   */
  private saveTokenToStorage(): void {
    try {
      if (this.csrfToken) {
        localStorage.setItem('csrf_token', this.csrfToken);
        
        if (this.tokenExpiresAt) {
          localStorage.setItem('csrf_token_expires', this.tokenExpiresAt.toString());
        }
      }
    } catch (error) {
      console.error('Error saving CSRF token to storage:', error);
    }
  }
  
  /**
   * Check if token should be refreshed
   */
  private shouldRefreshToken(): boolean {
    // If no token exists, it should be refreshed
    if (!this.csrfToken) {
      return true;
    }
    
    // If token has no expiry, assume it's valid
    if (!this.tokenExpiresAt) {
      return false;
    }
    
    // If token expires in less than 5 minutes, refresh it
    const fiveMinutesInMs = 5 * 60 * 1000;
    return Date.now() + fiveMinutesInMs > this.tokenExpiresAt;
  }
  
  /**
   * Get current CSRF token, refreshing if needed
   */
  public async getCsrfToken(): Promise<string> {
    if (this.shouldRefreshToken()) {
      return this.refreshCsrfToken();
    }
    
    return this.csrfToken || '';
  }
  
  /**
   * Refresh CSRF token from server
   */
  public async refreshCsrfToken(): Promise<string> {
    // If already refreshing, return the existing promise
    if (this.tokenRefreshPromise) {
      return this.tokenRefreshPromise;
    }
    
    // Create a new refresh promise
    this.tokenRefreshPromise = new Promise<string>(async (resolve, reject) => {
      try {
        const response = await ofetch('/csrf-token', {
          method: 'GET',
          baseURL: getApiUrl(),
          headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        });
        
        if (response && response.token) {
          this.csrfToken = response.token;
          
          // Set expiry - default to 2 hours if not provided by server
          const expiresInMs = response.expires_in ? 
            response.expires_in * 1000 : 
            2 * 60 * 60 * 1000;
            
          this.tokenExpiresAt = Date.now() + expiresInMs;
          
          // Save to storage
          this.saveTokenToStorage();
          
          resolve(response.token);
        } else {
          throw new Error('Invalid CSRF token response');
        }
      } catch (error) {
        console.error('Error refreshing CSRF token:', error);
        
        // On error, return an empty token but continue execution
        // This prevents API requests from failing completely when CSRF server is down
        resolve('');
      } finally {
        this.tokenRefreshPromise = null;
      }
    });
    
    return this.tokenRefreshPromise;
  }
  
  /**
   * Get CSRF token header
   */
  public async getCsrfHeader(): Promise<Record<string, string>> {
    const token = await this.getCsrfToken();
    return { 'X-CSRF-TOKEN': token };
  }
  
  /**
   * Add CSRF token to form data
   */
  public async addCsrfToFormData(formData: FormData): Promise<FormData> {
    const token = await this.getCsrfToken();
    formData.append('_token', token);
    return formData;
  }
  
  /**
   * Clear CSRF token
   */
  public clearCsrfToken(): void {
    this.csrfToken = null;
    this.tokenExpiresAt = null;
    
    try {
      localStorage.removeItem('csrf_token');
      localStorage.removeItem('csrf_token_expires');
    } catch (error) {
      console.error('Error clearing CSRF token from storage:', error);
    }
  }
}

// Export a singleton instance
export const securityService = SecurityService.getInstance(); 