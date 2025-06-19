import { ref, reactive, watch, computed } from 'vue';
                                                                                                                                                                                                                                                                                                                                                                                            
/**
 * Types for configuration values
 */
export interface AppConfig {
  environment: string;
  api: {
    url: string;
    timeout: number;
    retries: number;
  };
  database: {
    client: string;
    host: string;
    port: number;
    user: string;
    password: string;
    name: string;
  };
  email: {
    plunkApiKey: string;
    defaultFromEmail: string;
  };
  analytics: {
    umamiWebsiteId: string;
    umamiUrl: string;
    enabled: boolean;
  };
  features: Record<string, boolean>;
}

/**
 * Default configuration values
 */
const defaultConfig: AppConfig = {
  environment: 'development',
  api: {
    url: 'http://localhost:3000/api',
    timeout: 30000,
    retries: 3,
  },
  database: {
    client: 'pg',
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    name: 'jboilerplate_dev',
  },
  email: {
    plunkApiKey: '',
    defaultFromEmail: 'no-reply@jboilerplate.com',
  },
  analytics: {
    umamiWebsiteId: '',
    umamiUrl: '',
    enabled: false,
  },
  features: {
    darkMode: true,
    multilingualSupport: true,
    notifications: true,
    analytics: false,
    adminDashboard: true,
    userManagement: true,
    emailService: false,
  },
};

/**
 * Load configuration from environment variables
 */
const loadConfigFromEnv = (): Partial<AppConfig> => {
  return {
    environment: import.meta.env.VITE_ENVIRONMENT || defaultConfig.environment,
    api: {
      url: import.meta.env.VITE_API_URL || defaultConfig.api.url,
      timeout: Number(import.meta.env.VITE_API_TIMEOUT) || defaultConfig.api.timeout,
      retries: Number(import.meta.env.VITE_API_RETRIES) || defaultConfig.api.retries,
    },
    database: {
      client: import.meta.env.VITE_DB_CLIENT || defaultConfig.database.client,
      host: import.meta.env.VITE_DB_HOST || defaultConfig.database.host,
      port: Number(import.meta.env.VITE_DB_PORT) || defaultConfig.database.port,
      user: import.meta.env.VITE_DB_USER || defaultConfig.database.user,
      password: import.meta.env.VITE_DB_PASSWORD || defaultConfig.database.password,
      name: import.meta.env.VITE_DB_NAME || defaultConfig.database.name,
    },
    email: {
      plunkApiKey: import.meta.env.VITE_PLUNK_API_KEY || defaultConfig.email.plunkApiKey,
      defaultFromEmail: import.meta.env.VITE_DEFAULT_FROM_EMAIL || defaultConfig.email.defaultFromEmail,
    },
    analytics: {
      umamiWebsiteId: import.meta.env.VITE_UMAMI_WEBSITE_ID || defaultConfig.analytics.umamiWebsiteId,
      umamiUrl: import.meta.env.VITE_UMAMI_URL || defaultConfig.analytics.umamiUrl,
      enabled: !!import.meta.env.VITE_UMAMI_WEBSITE_ID && !!import.meta.env.VITE_UMAMI_URL,
    },
  };
};

/**
 * Configuration Service for centralized config management
 */
export class ConfigService {
  private _config: AppConfig;
  private _runtimeConfig = reactive<Record<string, any>>({});
  private _features = reactive<Record<string, boolean>>({...defaultConfig.features});

  constructor() {
    // Merge default config with environment variables
    this._config = {
      ...defaultConfig,
      ...loadConfigFromEnv(),
      features: { ...defaultConfig.features },
    };

    // Initialize features based on environment variables
    this.initializeFeatureFlags();
    
    // Log configuration in development
    if (this._config.environment === 'development') {
      console.log('[Config] Initialized with:', {
        ...this._config,
        database: { ...this._config.database, password: '***' }, // Hide sensitive data
        email: { ...this._config.email, plunkApiKey: '***' }, // Hide sensitive data
      });
    }
  }

  /**
   * Initialize feature flags from environment variables
   */
  private initializeFeatureFlags(): void {
    // Try to load features from environment variables (format: VITE_FEATURE_FEATURE_NAME=true/false)
    Object.keys(this._features).forEach(featureKey => {
      const envKey = `VITE_FEATURE_${featureKey.toUpperCase()}`;
      const envValue = import.meta.env[envKey];
      
      if (envValue !== undefined) {
        this._features[featureKey] = envValue === 'true';
      }
    });
  }

  /**
   * Get the current environment
   */
  get environment(): string {
    return this._config.environment;
  }

  /**
   * Check if running in development environment
   */
  get isDevelopment(): boolean {
    return this._config.environment === 'development';
  }

  /**
   * Check if running in production environment
   */
  get isProduction(): boolean {
    return this._config.environment === 'production';
  }

  /**
   * Get API configuration
   */
  get api(): AppConfig['api'] {
    return this._config.api;
  }

  /**
   * Get database configuration
   */
  get database(): AppConfig['database'] {
    return this._config.database;
  }

  /**
   * Get email configuration
   */
  get email(): AppConfig['email'] {
    return this._config.email;
  }

  /**
   * Get analytics configuration
   */
  get analytics(): AppConfig['analytics'] {
    return this._config.analytics;
  }

  /**
   * Check if a feature flag is enabled
   */
  isFeatureEnabled(featureName: string): boolean {
    return !!this._features[featureName];
  }

  /**
   * Get all feature flags
   */
  get features(): Record<string, boolean> {
    return { ...this._features };
  }

  /**
   * Enable a feature flag at runtime
   */
  enableFeature(featureName: string): void {
    this._features[featureName] = true;
  }

  /**
   * Disable a feature flag at runtime
   */
  disableFeature(featureName: string): void {
    this._features[featureName] = false;
  }

  /**
   * Toggle a feature flag at runtime
   */
  toggleFeature(featureName: string): boolean {
    this._features[featureName] = !this._features[featureName];
    return this._features[featureName];
  }

  /**
   * Set a runtime configuration value
   */
  setRuntimeConfig(key: string, value: any): void {
    this._runtimeConfig[key] = value;
  }

  /**
   * Get a runtime configuration value
   */
  getRuntimeConfig<T>(key: string, defaultValue?: T): T {
    return this._runtimeConfig[key] !== undefined 
      ? this._runtimeConfig[key] 
      : (defaultValue as T);
  }

  /**
   * Clear all runtime configuration
   */
  clearRuntimeConfig(): void {
    Object.keys(this._runtimeConfig).forEach(key => {
      delete this._runtimeConfig[key];
    });
  }
}

// Export a singleton instance
export const configService = new ConfigService();

/**
 * UI-specific configuration structure
 */
export interface UIConfig {
  app: {
    name: string;
    url: string;
    adminEmail: string;
    environment: string;
    debug: boolean;
  };
  locale: {
    defaultLanguage: string;
    dateFormat: string;
    timeFormat: string;
    timezone: string;
  };
  mail: {
    driver: string;
    fromAddress: string;
    fromName: string;
    host: string;
    port: number;
    username: string;
    password: string;
    encryption: string;
    apiKey: string;
  };
  security: {
    sessionLifetime: number;
    maxLoginAttempts: number;
    passwordMinLength: number;
    passwordRequireUppercase: boolean;
    passwordRequireNumber: boolean;
    passwordRequireSpecial: boolean;
    twoFactorEnabled: boolean;
  };
  ui: {
    theme: string;
    animations: boolean;
    denseMode: boolean;
    sidebarCollapsed: boolean;
  };
}

/**
 * Default UI configuration values
 */
const defaultUIConfig: UIConfig = {
  app: {
    name: 'jBoilerplate',
    url: 'http://localhost:3000',
    adminEmail: 'admin@example.com',
    environment: 'development',
    debug: true,
  },
  locale: {
    defaultLanguage: 'en',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: 'HH:mm',
    timezone: 'UTC',
  },
  mail: {
    driver: 'smtp',
    fromAddress: 'no-reply@example.com',
    fromName: 'jBoilerplate',
    host: 'smtp.example.com',
    port: 587,
    username: '',
    password: '',
    encryption: 'tls',
    apiKey: '',
  },
  security: {
    sessionLifetime: 120,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireNumber: true,
    passwordRequireSpecial: true,
    twoFactorEnabled: false,
  },
  ui: {
    theme: 'system',
    animations: true,
    denseMode: false,
    sidebarCollapsed: false,
  },
};

/**
 * Hook for using the config service in UI components
 */
export function useConfigService() {
  // UI configuration state
  const config = reactive<UIConfig>(JSON.parse(JSON.stringify(defaultUIConfig)));
  
  // Loading states
  const isLoading = ref(true);
  const isLoaded = ref(false);
  const error = ref<Error | null>(null);

  // Load configuration from the server
  const loadConfig = async () => {
    isLoading.value = true;
    error.value = null;
    
    try {
      // Simulate API call - in a real app, this would be an API call to load config
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Load saved config from localStorage if available
      const savedConfig = localStorage.getItem('app_config');
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        Object.assign(config, parsedConfig);
      }
      
      isLoaded.value = true;
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to load configuration');
      console.error('[ConfigService]', error.value);
      return false;
    } finally {
      isLoading.value = false;
    }
  };
  
  // Save configuration to the server
  const saveConfig = async () => {
    try {
      // Simulate API call - in a real app, this would be an API call to save config
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Save to localStorage for demo
      localStorage.setItem('app_config', JSON.stringify(config));
      
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to save configuration');
      console.error('[ConfigService]', error.value);
      return false;
    }
  };
  
  // Reset configuration to defaults
  const resetConfig = async () => {
    try {
      // Reset to defaults
      Object.assign(config, JSON.parse(JSON.stringify(defaultUIConfig)));
      
      // Save to localStorage
      localStorage.setItem('app_config', JSON.stringify(config));
      
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to reset configuration');
      console.error('[ConfigService]', error.value);
      return false;
    }
  };

  // Update a specific config section
  const updateConfig = <T extends keyof UIConfig>(section: T, values: Partial<UIConfig[T]>) => {
    Object.assign(config[section], values);
  };

  // Load config immediately
  loadConfig();

  return {
    config,
    isLoading,
    isLoaded,
    error,
    loadConfig,
    saveConfig,
    resetConfig,
    updateConfig
  };
} 