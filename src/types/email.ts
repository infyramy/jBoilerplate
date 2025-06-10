/**
 * Email template structure
 */
export interface EmailTemplate {
  id: string;
  name: string;
  description?: string;
  subject: string;
  body: string;
  variables?: string[];
}

/**
 * Email sending options
 */
export interface EmailOptions {
  to: string | string[];
  subject?: string;
  body?: string;
  from?: string;
  replyTo?: string;
  templateId?: string;
  variables?: Record<string, any>;
}

/**
 * Email service response
 */
export interface EmailResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    to: string | string[];
    subject?: string;
    createdAt: string;
    [key: string]: any;
  };
  error?: any;
} 