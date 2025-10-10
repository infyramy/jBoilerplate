import { apiPost } from '@/services/api';
import { configService } from '@/services/config';
import type { EmailOptions, EmailResponse, EmailTemplate } from '@/types/email';

/**
 * Email service using Plunk API
 */
export class EmailService {
  private apiKey: string;
  private baseUrl: string;
  private defaultFromEmail: string;

  constructor() {
    this.apiKey = configService.email.plunkApiKey;
    this.baseUrl = 'https://api.useplunk.com/v1';
    this.defaultFromEmail = configService.email.defaultFromEmail;
  }

  /**
   * Send an email using Plunk API
   */
  async sendEmail(options: EmailOptions): Promise<EmailResponse> {
    try {
      // If no API key is provided, log a warning and return a fake success response in development
      if (!this.apiKey) {
        console.warn('PLUNK_API_KEY is not set. Email would have been sent with the following details:', options);
        
        if (configService.isDevelopment) {
          return {
            success: true,
            message: 'Email sending simulated in development mode',
            data: {
              id: 'dev-email-id',
              to: options.to,
              subject: options.subject,
              createdAt: new Date().toISOString()
            }
          };
        }
        
        throw new Error('PLUNK_API_KEY is not configured');
      }

      // Send the email using Plunk API
      const response = await fetch(`${this.baseUrl}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          to: options.to,
          subject: options.subject,
          body: options.body,
          from: options.from || this.defaultFromEmail,
          replyTo: options.replyTo,
          templateId: options.templateId,
          variables: options.variables
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send email');
      }

      return {
        success: true,
        message: 'Email sent successfully',
        data: data
      };
    } catch (error: any) {
      console.error('Error sending email:', error);
      
      return {
        success: false,
        message: error.message || 'Failed to send email',
        error
      };
    }
  }

  /**
   * Send an email using a template
   */
  async sendTemplateEmail(
    to: string | string[],
    templateId: string,
    variables: Record<string, any>,
    options: Partial<EmailOptions> = {}
  ): Promise<EmailResponse> {
    return this.sendEmail({
      to,
      templateId,
      variables,
      ...options
    });
  }

  /**
   * Send a welcome email to a new user
   */
  async sendWelcomeEmail(
    to: string,
    name: string,
    options: Partial<EmailOptions> = {}
  ): Promise<EmailResponse> {
    // You would typically have a template ID for welcome emails
    // const templateId = 'welcome-email-template-id';
    
    // For now, we'll use a simple HTML body
    const body = `
      <h1>Welcome to jBoilerplate, ${name}!</h1>
      <p>Thank you for joining our platform. We're excited to have you on board.</p>
      <p>If you have any questions or need assistance, feel free to reply to this email.</p>
      <p>Best regards,<br>The jBoilerplate Team</p>
    `;

    return this.sendEmail({
      to,
      subject: 'Welcome to jBoilerplate!',
      body,
      ...options
    });
  }

  /**
   * Send a password reset email
   */
  async sendPasswordResetEmail(
    to: string,
    resetLink: string,
    options: Partial<EmailOptions> = {}
  ): Promise<EmailResponse> {
    const body = `
      <h1>Password Reset</h1>
      <p>You've requested to reset your password. Click the link below to proceed:</p>
      <p><a href="${resetLink}">Reset Password</a></p>
      <p>If you didn't request this, you can safely ignore this email.</p>
      <p>This link will expire in 1 hour.</p>
      <p>Best regards,<br>The jBoilerplate Team</p>
    `;

    return this.sendEmail({
      to,
      subject: 'Password Reset Request',
      body,
      ...options
    });
  }
}

// Export a singleton instance
export const emailService = new EmailService(); 