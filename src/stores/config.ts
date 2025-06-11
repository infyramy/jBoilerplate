/**
 * Configuration store for managing application-wide settings
 */
import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import type { AppConfig, ConfigSection, ConfigHistoryEntry } from '@/types/config';
import { defaultConfig } from '@/types/config';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/composables/useToast';

/**
 * Configuration store
 * Manages all application configuration settings and provides CRUD operations
 */
export const useConfigStore = defineStore('config', () => {
  const authStore = useAuthStore();
  const toast = useToast();
  
  // State
  const config = ref<AppConfig>({ ...defaultConfig });
  const configHistory = ref<ConfigHistoryEntry[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  
  // Getters
  const getConfig = computed(() => config.value);
  const getAppName = computed(() => config.value.app.name);
  const getTheme = computed(() => config.value.ui.theme);
  const getBranding = computed(() => config.value.ui.branding);
  const getLayout = computed(() => config.value.ui.layout);
  const getLoginConfig = computed(() => config.value.auth.login);
  
  /**
   * Check if a feature is enabled
   * @param featureKey - The feature key to check
   * @returns Whether the feature is enabled
   */
  const isFeatureEnabled = (featureKey: string): boolean => {
    return config.value.features[featureKey] ?? false;
  };
  
  /**
   * Load configuration from storage
   */
  async function loadConfig() {
    isLoading.value = true;
    error.value = null;
    
    try {
      // In a real implementation, this would be an API call
      // For now, we'll use localStorage as a temporary solution
      const storedConfig = localStorage.getItem('appConfig');
      
      if (storedConfig) {
        config.value = JSON.parse(storedConfig);
      } else {
        config.value = { ...defaultConfig };
        // Save default config to localStorage
        localStorage.setItem('appConfig', JSON.stringify(config.value));
      }
      
      // Create initial history entry if none exists
      if (configHistory.value.length === 0) {
        configHistory.value.push({
          timestamp: new Date().toISOString(),
          config: JSON.parse(JSON.stringify(config.value)),
          user: 'System'
        });
      }
    } catch (err) {
      console.error('Failed to load configuration:', err);
      error.value = 'Failed to load configuration';
      // Fallback to defaults
      config.value = { ...defaultConfig };
    } finally {
      isLoading.value = false;
    }
  }
  
  /**
   * Update a specific section of the configuration
   * @param section - The configuration section to update
   * @param data - The new data for the section
   */
  async function updateConfig<T extends ConfigSection>(section: T, data: Partial<AppConfig[T]>) {
    isLoading.value = true;
    error.value = null;
    
    try {
      // Create a snapshot for history
      const snapshot: ConfigHistoryEntry = {
        timestamp: new Date().toISOString(),
        config: JSON.parse(JSON.stringify(config.value)),
        user: authStore.user?.fullname || 'Unknown'
      };
      
      configHistory.value.push(snapshot);
      
      // Limit history size to prevent memory issues
      if (configHistory.value.length > 20) {
        configHistory.value.shift();
      }
      
      // Update the config
      config.value[section] = {
        ...config.value[section],
        ...data as any // Type assertion needed for TypeScript to accept the spread
      };
      
      // Update metadata
      config.value.meta = {
        lastUpdated: new Date().toISOString(),
        version: config.value.meta.version + 1,
        updatedBy: authStore.user?.fullname || 'Unknown'
      };
      
      // In a real implementation, this would be an API call
      // For now, we'll use localStorage as a temporary solution
      localStorage.setItem('appConfig', JSON.stringify(config.value));
      
      toast.success('Configuration updated successfully');
    } catch (err) {
      console.error('Failed to update configuration:', err);
      error.value = 'Failed to update configuration';
      toast.error('Failed to update configuration');
    } finally {
      isLoading.value = false;
    }
  }
  
  /**
   * Rollback to a previous configuration version
   * @param historyIndex - The index of the history entry to rollback to
   */
  function rollbackConfig(historyIndex: number) {
    if (historyIndex >= 0 && historyIndex < configHistory.value.length) {
      const snapshot = configHistory.value[historyIndex];
      
      try {
        // Create a new snapshot before rolling back
        const currentSnapshot: ConfigHistoryEntry = {
          timestamp: new Date().toISOString(),
          config: JSON.parse(JSON.stringify(config.value)),
          user: authStore.user?.fullname || 'Unknown'
        };
        
        configHistory.value.push(currentSnapshot);
        
        // Apply the rollback
        config.value = JSON.parse(JSON.stringify(snapshot.config));
        
        // Update metadata
        config.value.meta = {
          lastUpdated: new Date().toISOString(),
          version: config.value.meta.version + 1,
          updatedBy: authStore.user?.fullname || 'Unknown'
        };
        
        // In a real implementation, this would be an API call
        // For now, we'll use localStorage as a temporary solution
        localStorage.setItem('appConfig', JSON.stringify(config.value));
        
        toast.success('Configuration rolled back successfully');
      } catch (err) {
        console.error('Failed to rollback configuration:', err);
        error.value = 'Failed to rollback configuration';
        toast.error('Failed to rollback configuration');
      }
    } else {
      error.value = 'Invalid history index';
      toast.error('Failed to rollback configuration: Invalid history index');
    }
  }
  
  /**
   * Reset configuration to defaults
   */
  function resetConfig() {
    try {
      // Create a snapshot before resetting
      const snapshot: ConfigHistoryEntry = {
        timestamp: new Date().toISOString(),
        config: JSON.parse(JSON.stringify(config.value)),
        user: authStore.user?.fullname || 'Unknown'
      };
      
      configHistory.value.push(snapshot);
      
      // Reset to defaults
      config.value = { ...defaultConfig };
      
      // Update metadata
      config.value.meta = {
        lastUpdated: new Date().toISOString(),
        version: config.value.meta.version + 1,
        updatedBy: authStore.user?.fullname || 'Unknown'
      };
      
      // In a real implementation, this would be an API call
      // For now, we'll use localStorage as a temporary solution
      localStorage.setItem('appConfig', JSON.stringify(config.value));
      
      toast.success('Configuration reset to defaults');
    } catch (err) {
      console.error('Failed to reset configuration:', err);
      error.value = 'Failed to reset configuration';
      toast.error('Failed to reset configuration');
    }
  }
  
  // Watch for config changes to apply dynamic settings
  watch(() => config.value.ui.theme, (newTheme) => {
    // Apply theme changes to the document (this would be more robust in a real implementation)
    document.documentElement.style.setProperty('--primary', newTheme.primaryColor);
    document.documentElement.style.setProperty('--secondary', newTheme.secondaryColor);
    document.documentElement.style.setProperty('--accent', newTheme.accentColor);
  }, { deep: true });
  
  // Initialize config on store creation
  loadConfig();
  
  return {
    // State
    config,
    configHistory,
    isLoading,
    error,
    
    // Getters
    getConfig,
    getAppName,
    getTheme,
    getBranding,
    getLayout,
    getLoginConfig,
    isFeatureEnabled,
    
    // Actions
    loadConfig,
    updateConfig,
    rollbackConfig,
    resetConfig
  };
}); 