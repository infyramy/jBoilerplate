import { configService } from '@/services/config';

/**
 * Analytics service for tracking user events using Umami
 */
export class AnalyticsService {
  private enabled: boolean;
  private websiteId: string;
  private umamiUrl: string;

  constructor() {
    const { umamiWebsiteId, umamiUrl, enabled } = configService.analytics;
    this.websiteId = umamiWebsiteId;
    this.umamiUrl = umamiUrl;
    this.enabled = enabled && configService.isFeatureEnabled('analytics');
  }

  /**
   * Check if analytics is enabled
   */
  get isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Track a page view
   * @param url The URL to track
   */
  trackPageView(url?: string): void {
    if (!this.isEnabled) return;

    try {
      const umami = (window as any).umami;
      if (typeof umami === 'function') {
        umami.trackView(url);
      }
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  }

  /**
   * Track a custom event
   * @param eventName Name of the event
   * @param eventData Additional event data
   */
  trackEvent(eventName: string, eventData?: Record<string, any>): void {
    if (!this.isEnabled) return;

    try {
      const umami = (window as any).umami;
      if (typeof umami === 'function') {
        umami.trackEvent(eventName, eventData);
      }
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }

  /**
   * Track a user action like button click
   * @param actionName The action name (e.g., 'click', 'submit')
   * @param elementName The element name (e.g., 'signup-button', 'login-form')
   * @param additionalData Additional data to track
   */
  trackAction(
    actionName: string,
    elementName: string,
    additionalData?: Record<string, any>
  ): void {
    this.trackEvent(`${actionName}:${elementName}`, additionalData);
  }

  /**
   * Track form submissions
   * @param formName The name of the form
   * @param successful Whether the submission was successful
   * @param additionalData Additional data to track
   */
  trackFormSubmission(
    formName: string,
    successful: boolean,
    additionalData?: Record<string, any>
  ): void {
    this.trackEvent(
      `form:${formName}:${successful ? 'success' : 'failure'}`,
      additionalData
    );
  }

  /**
   * Track user authentication events
   * @param action The authentication action (e.g., 'login', 'signup', 'logout')
   * @param successful Whether the action was successful
   * @param additionalData Additional data to track
   */
  trackAuth(
    action: 'login' | 'signup' | 'logout' | 'password-reset',
    successful: boolean,
    additionalData?: Record<string, any>
  ): void {
    this.trackEvent(
      `auth:${action}:${successful ? 'success' : 'failure'}`,
      additionalData
    );
  }

  /**
   * Track feature usage
   * @param featureName The name of the feature
   * @param additionalData Additional data about the feature usage
   */
  trackFeatureUsage(
    featureName: string,
    additionalData?: Record<string, any>
  ): void {
    this.trackEvent(`feature:${featureName}`, additionalData);
  }

  /**
   * Track errors
   * @param errorType The type of error
   * @param errorMessage The error message
   * @param additionalData Additional data about the error
   */
  trackError(
    errorType: string,
    errorMessage: string,
    additionalData?: Record<string, any>
  ): void {
    this.trackEvent(`error:${errorType}`, {
      message: errorMessage,
      ...additionalData
    });
  }
}

// Export a singleton instance
export const analyticsService = new AnalyticsService(); 