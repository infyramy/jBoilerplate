import { ConfigService } from '@/services/config';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $config: ConfigService;
  }
}

export interface FeatureFlags {
  darkMode: boolean;
  multilingualSupport: boolean;
  notifications: boolean;
  analytics: boolean;
  adminDashboard: boolean;
  userManagement: boolean;
  emailService: boolean;
  [key: string]: boolean;
}

export interface RuntimeConfig {
  [key: string]: any;
} 