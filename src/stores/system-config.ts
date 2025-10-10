import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useColorMode } from '@vueuse/core';

interface SystemConfig {
  systemName: string;
  logoLight: string;
  logoDark: string;
  loginImage: string;
  loginTitle: string;
  loginDescription: string;
  loginLogoMode: 'light' | 'dark' | 'theme';
  loginLogoSize: 'small' | 'medium' | 'large' | 'custom';
  loginLogoCustomSize: number;
  themeColor: string;
  themeRadius: string;
  themeMode: 'light' | 'dark' | 'auto';
}

const DEFAULT_CONFIG: SystemConfig = {
  systemName: 'jBoilerplate',
  logoLight: '',
  logoDark: '',
  loginImage: '',
  loginTitle: 'Welcome Back',
  loginDescription: 'Sign in to your account to continue',
  loginLogoMode: 'theme',
  loginLogoSize: 'large',
  loginLogoCustomSize: 200,
  themeColor: 'zinc',
  themeRadius: '0.5',
  themeMode: 'light',
};

export const useSystemConfigStore = defineStore('system-config', () => {
  const config = ref<SystemConfig>({ ...DEFAULT_CONFIG });
  const isLoading = ref(true);
  const isDatabaseReady = ref(false);
  const databaseError = ref<string | null>(null);
  const colorMode = useColorMode();

  // Reactive logo paths - updated dynamically
  const logoLightPath = ref('/assets/logo/logo-light.svg');
  const logoDarkPath = ref('/assets/logo/logo-dark.svg');
  const logoTimestamp = ref(Date.now());

  // Fetch actual logo file path from server
  const fetchLogoPath = async (type: 'light' | 'dark'): Promise<string> => {
    try {
      const response = await fetch(`/api/logo-info?type=${type}`);
      const data = await response.json();
      if (data.success && data.logo) {
        return `${data.logo.path}?t=${logoTimestamp.value}`;
      }
    } catch (error) {
      console.error(`[SystemConfig] Failed to fetch ${type} logo path:`, error);
    }
    // Fallback
    return `/assets/logo/logo-${type}-default.svg?t=${logoTimestamp.value}`;
  };

  // Update logo paths from server
  const updateLogoPaths = async () => {
    logoLightPath.value = await fetchLogoPath('light');
    logoDarkPath.value = await fetchLogoPath('dark');
  };

  // Computed property for current logo based on theme
  const currentLogo = computed(() => {
    const isDark = colorMode.value === 'dark' ||
      (colorMode.value === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    return isDark ? logoDarkPath.value : logoLightPath.value;
  });

  // Computed property for login page logo
  const loginLogo = computed(() => {
    let logoType: 'light' | 'dark' = 'light';

    if (config.value.loginLogoMode === 'light') {
      logoType = 'light';
    } else if (config.value.loginLogoMode === 'dark') {
      logoType = 'dark';
    } else {
      // theme-based
      const isDark = colorMode.value === 'dark' ||
        (colorMode.value === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      logoType = isDark ? 'dark' : 'light';
    }

    return logoType === 'dark' ? logoDarkPath.value : logoLightPath.value;
  });

  // Computed property for login logo size
  const loginLogoSizeClass = computed(() => {
    if (config.value.loginLogoSize === 'custom') {
      return '';
    }
    const sizes = {
      small: 'w-32',
      medium: 'w-48',
      large: 'w-64'
    };
    return sizes[config.value.loginLogoSize] || sizes.large;
  });

  const loginLogoStyle = computed(() => {
    if (config.value.loginLogoSize === 'custom') {
      return { width: `${config.value.loginLogoCustomSize}px` };
    }
    return {};
  });

  // Load configuration from DB
  const loadFromDB = async (): Promise<{ success: boolean; config: SystemConfig }> => {
    try {
      const response = await fetch('/api/system-config/load-db');
      if (!response.ok) {
        throw new Error('Failed to fetch config from DB');
      }
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to load config from DB');
      }
      isDatabaseReady.value = true;
      databaseError.value = null;
      return { success: true, config: { ...DEFAULT_CONFIG, ...data.config } };
    } catch (error: any) {
      console.error('Failed to load config from DB:', error);
      isDatabaseReady.value = false;
      databaseError.value = error.message;
      return { success: false, config: { ...DEFAULT_CONFIG } };
    }
  };

  // Load configuration from file (fallback)
  const loadFromFile = async (): Promise<SystemConfig> => {
    try {
      const response = await fetch('/api/system-config/load-file');
      if (!response.ok) {
        throw new Error('Failed to fetch config from file');
      }
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to load config from file');
      }
      return { ...DEFAULT_CONFIG, ...data.config };
    } catch (error) {
      console.error('Failed to load config from file:', error);
      return { ...DEFAULT_CONFIG };
    }
  };

  // Initialize and load configuration (DB first, file fallback, then defaults)
  const init = async () => {
    isLoading.value = true;
    try {
      console.log('[SystemConfig] Attempting to load from database...');
      // Try database first
      const dbResult = await loadFromDB();

      if (dbResult.success) {
        console.log('[SystemConfig] Loaded from database successfully');
        config.value = dbResult.config;
      } else {
        console.log('[SystemConfig] Database failed, falling back to file...');
        // Fall back to file if DB fails
        const fileConfig = await loadFromFile();
        config.value = fileConfig;
        console.log('[SystemConfig] Loaded from file');
      }

      // Apply theme settings
      if (config.value.themeColor) {
        document.documentElement.setAttribute('data-color-scheme', config.value.themeColor);
        localStorage.setItem('theme-color', config.value.themeColor);
      }

      if (config.value.themeRadius) {
        document.documentElement.style.setProperty('--radius', `${config.value.themeRadius}rem`);
        localStorage.setItem('theme-radius', config.value.themeRadius);
      }

      // Update document title
      document.title = config.value.systemName || DEFAULT_CONFIG.systemName;

      // Load actual logo paths from server
      await updateLogoPaths();
      console.log('[SystemConfig] Logo paths loaded');
    } catch (error) {
      console.error('[SystemConfig] Failed to initialize, using defaults:', error);
      // If both fail, use defaults
      config.value = { ...DEFAULT_CONFIG };
    } finally {
      isLoading.value = false;
    }
  };

  // Save configuration to file
  const saveToFile = async (newConfig: Partial<SystemConfig>) => {
    try {
      const updatedConfig = { ...config.value, ...newConfig };

      const response = await fetch('/api/system-config/save-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedConfig),
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to save config to file');
      }

      config.value = updatedConfig;
      document.title = updatedConfig.systemName || config.value.systemName;
      return true;
    } catch (error: any) {
      console.error('Failed to save config to file:', error);
      throw new Error(error.message || 'Failed to save configuration');
    }
  };

  // Save configuration to DB
  const saveToDB = async (newConfig: Partial<SystemConfig>) => {
    try {
      const updatedConfig = { ...config.value, ...newConfig };

      const response = await fetch('/api/system-config/save-db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedConfig),
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to save config to DB');
      }

      config.value = updatedConfig;
      document.title = updatedConfig.systemName || config.value.systemName;
      return true;
    } catch (error: any) {
      console.error('Failed to save config to DB:', error);
      throw new Error(error.message || 'Failed to save configuration to database');
    }
  };

  // Update system name
  const updateSystemName = (name: string) => {
    config.value.systemName = name;
    document.title = name;
  };

  // Update logo (light mode)
  const updateLogoLight = (logoDataUrl: string) => {
    config.value.logoLight = logoDataUrl;
  };

  // Update logo (dark mode)
  const updateLogoDark = (logoDataUrl: string) => {
    config.value.logoDark = logoDataUrl;
  };

  // Update login image
  const updateLoginImage = (imageDataUrl: string) => {
    config.value.loginImage = imageDataUrl;
  };

  // Update login title
  const updateLoginTitle = (title: string) => {
    config.value.loginTitle = title;
  };

  // Update login description
  const updateLoginDescription = (description: string) => {
    config.value.loginDescription = description;
  };

  // Test database connection
  const testDatabaseConnection = async (dbConfig?: {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
  }): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch('/api/database/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dbConfig || {}),
      });

      const result = await response.json();
      return {
        success: result.success,
        message: result.message || (result.success ? 'Database connection successful' : 'Failed to connect to database')
      };
    } catch (error: any) {
      console.error('Database connection test failed:', error);
      return {
        success: false,
        message: error.message || 'Failed to connect to database'
      };
    }
  };

  // Reset to defaults (always save to database)
  const resetToDefaults = async () => {
    config.value = { ...DEFAULT_CONFIG };
    await saveToDB(DEFAULT_CONFIG);
  };

  // Bulk update and save (always to database)
  const updateConfig = async (newConfig: Partial<SystemConfig>) => {
    const updatedConfig = { ...config.value, ...newConfig };
    await saveToDB(updatedConfig);
  };

  // Refresh logos - triggers reactivity by updating timestamp and fetching new paths
  const refreshLogos = async () => {
    logoTimestamp.value = Date.now();
    await updateLogoPaths();
    console.log('[SystemConfig] Logo cache refreshed and paths updated');
  };

  // Alias init as loadConfig for backward compatibility
  const loadConfig = init;

  return {
    config,
    currentLogo,
    loginLogo,
    loginLogoSizeClass,
    loginLogoStyle,
    isLoading,
    isDatabaseReady,
    databaseError,
    init,
    loadConfig,
    updateSystemName,
    updateLogoLight,
    updateLogoDark,
    updateLoginImage,
    updateLoginTitle,
    updateLoginDescription,
    testDatabaseConnection,
    resetToDefaults,
    updateConfig,
    saveToFile,
    saveToDB,
    refreshLogos,
    updateLogoPaths,
  };
});
