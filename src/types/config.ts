/**
 * Configuration types for the application
 */

/**
 * Application configuration interface
 */
export interface AppConfig {
  // Core Application Settings
  app: {
    name: string;
    description: string;
    version: string;
    defaultLanguage: string;
    defaultTimezone: string;
    maintenanceMode: boolean;
    maintenanceMessage: string;
  };
  
  // Authentication Settings
  auth: {
    enableRegistration: boolean;
    requireEmailVerification: boolean;
    defaultRole: string;
    passwordPolicy: {
      minLength: number;
      requireSpecialChar: boolean;
      requireUppercase: boolean;
      requireNumber: boolean;
    };
    sessionTimeout: number;
    login: {
      backgroundImage: string;
      title: string;
      subtitle: string;
    };
  };
  
  // UI/UX Settings
  ui: {
    theme: {
      primaryColor: string;
      secondaryColor: string;
      accentColor: string;
      borderRadius: string;
      fontFamily: string;
    };
    branding: {
      logoLight: string;
      logoDark: string;
      favicon: string;
      authBackground: string;
    };
    layout: {
      sidebarCollapsed: boolean;
      contentWidth: 'full' | 'boxed';
      defaultDarkMode: boolean;
    };
  };
  
  // Email Settings
  email: {
    provider: 'smtp' | 'plunk';
    from: string;
    smtp: {
      host: string;
      port: number;
      secure: boolean;
      auth: {
        user: string;
        pass: string;
      };
    };
    plunk: {
      apiKey: string;
    };
  };
  
  // SEO Settings
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogImage: string;
    robotsTxt: string;
    enableSitemap: boolean;
    verificationCodes: {
      google: string;
      bing: string;
      yandex: string;
    };
  };
  
  // Feature Flags
  features: {
    [key: string]: boolean;
  };
  
  // Developer Settings
  developer: {
    injectScripts: {
      head: string[];
      body: string[];
    };
    apiKeys: {
      [service: string]: string;
    };
    debugMode: boolean;
    environment: {
      [key: string]: string;
    };
  };
  
  // Timestamps and version control
  meta: {
    lastUpdated: string;
    version: number;
    updatedBy: string;
  };
}

/**
 * Default configuration fallback values
 */
export const defaultConfig: AppConfig = {
  app: {
    name: 'jBoilerplate',
    description: 'A Vue 3 Boilerplate with TypeScript and Tailwind CSS',
    version: '1.0.0',
    defaultLanguage: 'en',
    defaultTimezone: 'UTC',
    maintenanceMode: false,
    maintenanceMessage: 'We are currently performing maintenance. Please check back later.',
  },
  auth: {
    enableRegistration: true,
    requireEmailVerification: true,
    defaultRole: 'user',
    passwordPolicy: {
      minLength: 8,
      requireSpecialChar: true,
      requireUppercase: true,
      requireNumber: true,
    },
    sessionTimeout: 86400, // 24 hours in seconds
    login: {
      backgroundImage: '/images/auth-background.jpg',
      title: 'Welcome to jBoilerplate',
      subtitle: 'Sign in to your account to continue',
    },
  },
  ui: {
    theme: {
      primaryColor: '#0ea5e9', // sky-500
      secondaryColor: '#6366f1', // indigo-500
      accentColor: '#ec4899', // pink-500
      borderRadius: '0.5rem',
      fontFamily: 'Inter, sans-serif',
    },
    branding: {
      logoLight: '/images/logo-light.svg',
      logoDark: '/images/logo-dark.svg',
      favicon: '/favicon.ico',
      authBackground: '/images/auth-background.jpg',
    },
    layout: {
      sidebarCollapsed: false,
      contentWidth: 'full',
      defaultDarkMode: false,
    },
  },
  email: {
    provider: 'smtp',
    from: 'noreply@example.com',
    smtp: {
      host: 'smtp.example.com',
      port: 587,
      secure: false,
      auth: {
        user: '',
        pass: '',
      },
    },
    plunk: {
      apiKey: '',
    },
  },
  seo: {
    metaTitle: 'jBoilerplate - Vue 3 Starter Template',
    metaDescription: 'A production-ready Vue 3 boilerplate with TypeScript, Tailwind CSS and more.',
    ogImage: '/images/og-image.jpg',
    robotsTxt: 'User-agent: *\nAllow: /',
    enableSitemap: true,
    verificationCodes: {
      google: '',
      bing: '',
      yandex: '',
    },
  },
  features: {
    darkMode: true,
    multilingualSupport: true,
    notifications: true,
    analytics: false,
    adminDashboard: true,
    userManagement: true,
    emailService: true,
  },
  developer: {
    injectScripts: {
      head: [],
      body: [],
    },
    apiKeys: {},
    debugMode: false,
    environment: {},
  },
  meta: {
    lastUpdated: new Date().toISOString(),
    version: 1,
    updatedBy: 'System',
  },
};

/**
 * Configuration section type
 */
export type ConfigSection = keyof AppConfig;

/**
 * Configuration history entry
 */
export interface ConfigHistoryEntry {
  timestamp: string;
  config: AppConfig;
  user: string;
} 