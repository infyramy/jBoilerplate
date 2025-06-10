import { App, Plugin } from 'vue';
import { configService } from '@/services/config';

/**
 * Vue plugin for the configuration service
 */
export const ConfigPlugin: Plugin = {
  install: (app: App) => {
    // Provide the config service to all components
    app.provide('config', configService);
    
    // Add the config service to the global properties
    app.config.globalProperties.$config = configService;
  }
};

export default ConfigPlugin; 