/**
 * Input sanitization service for preventing XSS and other injection attacks
 */
export class SanitizerService {
  /**
   * Sanitize a string by escaping HTML entities
   * Use this for user-generated content that should not contain HTML
   * 
   * @param input The string to sanitize
   * @returns Sanitized string with HTML entities escaped
   */
  public static sanitizeString(input: string | null | undefined): string {
    if (input === null || input === undefined) {
      return '';
    }
    
    return String(input)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
  
  /**
   * Sanitize an object by recursively sanitizing all string properties
   * 
   * @param obj The object to sanitize
   * @returns New sanitized object (does not modify the original)
   */
  public static sanitizeObject<T>(obj: T): T {
    if (obj === null || obj === undefined) {
      return obj;
    }
    
    if (typeof obj === 'string') {
      return this.sanitizeString(obj) as unknown as T;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item)) as unknown as T;
    }
    
    if (typeof obj === 'object') {
      const result: Record<string, any> = {};
      
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          result[key] = this.sanitizeObject((obj as Record<string, any>)[key]);
        }
      }
      
      return result as T;
    }
    
    return obj;
  }
  
  /**
   * Sanitize HTML content to prevent XSS attacks
   * Use this when you need to allow some HTML but want to remove potentially dangerous content
   * 
   * @param html HTML string to sanitize
   * @returns Sanitized HTML string
   */
  public static sanitizeHtml(html: string | null | undefined): string {
    if (html === null || html === undefined) {
      return '';
    }
    
    // Simple HTML sanitization - in production, use a library like DOMPurify
    return String(html)
      // Remove script tags and their contents
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      // Remove onclick and similar event handlers
      .replace(/\s+on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]*)/gi, '')
      // Remove javascript: URLs
      .replace(/javascript\s*:/gi, 'removed:')
      // Remove data: URLs
      .replace(/data\s*:/gi, 'removed:')
      // Remove base64
      .replace(/base64/gi, 'removed');
  }
  
  /**
   * Strip all HTML tags from a string
   * 
   * @param html HTML string to strip
   * @returns Plain text without any HTML tags
   */
  public static stripHtml(html: string | null | undefined): string {
    if (html === null || html === undefined) {
      return '';
    }
    
    return String(html)
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'");
  }
  
  /**
   * Sanitize a URL to prevent javascript: and other potentially malicious URLs
   * 
   * @param url The URL to sanitize
   * @returns Sanitized URL or empty string if unsafe
   */
  public static sanitizeUrl(url: string | null | undefined): string {
    if (url === null || url === undefined) {
      return '';
    }
    
    const urlString = String(url).trim();
    
    // Check for javascript: and data: URLs
    if (/^(javascript|data|vbscript|file):/i.test(urlString)) {
      return '';
    }
    
    // Check for invalid protocol or no protocol
    if (!/^(https?:\/\/|\/|#|tel:|mailto:)/i.test(urlString)) {
      // If no protocol, assume it's a relative URL and add a leading slash if needed
      return urlString.startsWith('/') ? urlString : `/${urlString}`;
    }
    
    return urlString;
  }
  
  /**
   * Sanitize a form input value based on its type
   * 
   * @param value The value to sanitize
   * @param type The input type (text, email, url, etc.)
   * @returns Sanitized value appropriate for the input type
   */
  public static sanitizeInput(value: string | null | undefined, type: string = 'text'): string {
    if (value === null || value === undefined) {
      return '';
    }
    
    switch (type.toLowerCase()) {
      case 'email':
        // Basic email sanitization - removes HTML and limits to valid email characters
        return this.sanitizeString(value)
          .replace(/[^a-zA-Z0-9.@_+-]/g, '');
          
      case 'url':
        // Use URL sanitization
        return this.sanitizeUrl(value);
        
      case 'number':
        // Allow only digits, decimal point, and minus sign
        return this.sanitizeString(value)
          .replace(/[^0-9.-]/g, '');
          
      case 'tel':
        // Allow only digits, plus sign, spaces, parentheses, and hyphens
        return this.sanitizeString(value)
          .replace(/[^0-9+() -]/g, '');
          
      case 'html':
        // Allow sanitized HTML
        return this.sanitizeHtml(value);
        
      case 'plaintext':
        // Strip all HTML
        return this.stripHtml(value);
        
      case 'text':
      default:
        // Standard string sanitization
        return this.sanitizeString(value);
    }
  }
}

// Export singleton functions for easier usage
export const sanitizeString = SanitizerService.sanitizeString.bind(SanitizerService);
export const sanitizeObject = SanitizerService.sanitizeObject.bind(SanitizerService);
export const sanitizeHtml = SanitizerService.sanitizeHtml.bind(SanitizerService);
export const stripHtml = SanitizerService.stripHtml.bind(SanitizerService);
export const sanitizeUrl = SanitizerService.sanitizeUrl.bind(SanitizerService);
export const sanitizeInput = SanitizerService.sanitizeInput.bind(SanitizerService); 