import type { App } from 'vue';
import type { Router } from 'vue-router';
import { analyticsService } from '@/services/analytics';

/**
 * Analytics plugin for initializing Umami
 */
export function setupAnalytics() {
  const umamiUrl = import.meta.env.VITE_UMAMI_URL;
  const websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID;
  
  if (umamiUrl && websiteId) {
    // Find the Umami script tag
    const umamiScript = document.querySelector('script[data-umami-script-url]');
    
    if (umamiScript) {
      // Update the script attributes with environment variable values
      umamiScript.setAttribute('src', `${umamiUrl}/script.js`);
      umamiScript.setAttribute('data-website-id', websiteId);
    } else {
      // If the script tag wasn't found, create and insert it
      const script = document.createElement('script');
      script.async = true;
      script.defer = true;
      script.src = `${umamiUrl}/script.js`;
      script.setAttribute('data-website-id', websiteId);
      
      document.head.appendChild(script);
    }
    
    console.log('[Analytics] Umami initialized with website ID:', websiteId);
  } else {
    console.log('[Analytics] Umami not initialized: missing configuration');
  }
}

export default {
  install(app: App, options?: { router?: Router }) {
    // Initialize Umami analytics
    setupAnalytics();
    
    const { router } = options || {};

    // If router is provided, track page views on route changes
    if (router) {
      router.afterEach((to) => {
        // Track page view with the route path
        analyticsService.trackPageView(to.fullPath);
      });
    }

    // Expose analytics service to components
    app.config.globalProperties.$analytics = analyticsService;
  }
};

// Type declarations for the analytics plugin
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $analytics: typeof analyticsService;
  }
} 