/**
 * Email template information
 */
export interface EmailTemplate {
  id: string;
  name: string;
  description?: string;
  subject: string;
  requiredVariables: string[];
}

/**
 * Options for sending an email
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
 * Response from email sending operations
 */
export interface EmailResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: any;
} 