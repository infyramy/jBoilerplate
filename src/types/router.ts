import type { RouteRecordRaw } from 'vue-router';
import { UserRole } from './auth';

/**
 * Extends the default RouteMeta interface to include our custom properties
 */
declare module 'vue-router' {
  interface RouteMeta {
    /** Whether authentication is required to access this route */
    requiresAuth: boolean;
    
    /** User roles that are allowed to access this route */
    roles?: UserRole[];
    
    /** The layout component to use for this route */
    layout?: 'dashboard' | 'forms' | 'blank';
    
    /** Page title to be displayed in the browser tab */
    title?: string;
    
    /** Whether this route should be cached */
    keepAlive?: boolean;
    
    /** Icon to use in navigation menus */
    icon?: string;
    
    /** Whether to show this route in navigation menus */
    hideInMenu?: boolean;
    
    /** Order in navigation menu */
    order?: number;
  }
}

/**
 * Type for a route with children
 */
export interface AppRouteRecordRaw {
  path: string;
  name?: string;
  component?: any;
  redirect?: string;
  alias?: string | string[];
  meta?: Record<string, any>;
  children?: AppRouteRecordRaw[];
}

/**
 * Navigation menu item
 */
export interface MenuItem {
  key: string;
  label: string;
  path: string;
  icon?: string;
  children?: MenuItem[];
  roles?: UserRole[];
  order?: number;
} 