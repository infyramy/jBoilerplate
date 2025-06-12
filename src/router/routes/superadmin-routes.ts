import type { RouteRecordRaw } from 'vue-router';

export const superadminRoutes: RouteRecordRaw[] = [
  {
    path: '/superadmin',
    redirect: '/superadmin/home',
    meta: {
      requiresAuth: true,
      roles: ['superadmin'],
      layout: 'dashboard'
    }
  },
  {
    path: '/superadmin/home',
    name: 'superadmin-home',
    component: () => import('@/pages/superadmin/dashboard/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['superadmin'],
      layout: 'dashboard',
      title: 'Home'
    }
  },
  {
    path: '/superadmin/dashboard',
    redirect: '/superadmin/home',
    meta: {
      requiresAuth: true,
      roles: ['superadmin'],
      layout: 'dashboard'
    }
  },
  // Users & Roles Management
  {
    path: '/superadmin/users',
    name: 'superadmin-users',
    component: () => import('@/pages/superadmin/users/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['superadmin'],
      layout: 'dashboard',
      title: 'Users Management'
    }
  },
  {
    path: '/superadmin/roles',
    name: 'superadmin-roles',
    component: () => import('@/pages/superadmin/roles/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['superadmin'],
      layout: 'dashboard',
      title: 'Roles Management'
    }
  },
  // Navigation Editor
  {
    path: '/superadmin/navigation',
    name: 'superadmin-navigation',
    component: () => import('@/pages/superadmin/navigation/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['superadmin'],
      layout: 'dashboard',
      title: 'Navigation Editor'
    }
  },
  // Branding & UI
  {
    path: '/superadmin/branding',
    name: 'superadmin-branding',
    component: () => import('@/pages/superadmin/branding/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['superadmin'],
      layout: 'dashboard',
      title: 'Branding & UI'
    }
  },
  // Theme & Appearance
  {
    path: '/superadmin/theme',
    name: 'superadmin-theme',
    component: () => import('@/pages/superadmin/theme/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['superadmin'],
      layout: 'dashboard',
      title: 'Theme & Appearance'
    }
  },
  // Email Settings
  {
    path: '/superadmin/email-settings',
    name: 'superadmin-email-settings',
    component: () => import('@/pages/superadmin/email-settings/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['superadmin'],
      layout: 'dashboard',
      title: 'Email Settings'
    }
  },
  // SEO & Meta
  {
    path: '/superadmin/seo',
    name: 'superadmin-seo',
    component: () => import('@/pages/superadmin/seo/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['superadmin'],
      layout: 'dashboard',
      title: 'SEO & Meta'
    }
  },
  // Core Configuration
  {
    path: '/superadmin/config',
    name: 'superadmin-config',
    component: () => import('@/pages/superadmin/config/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['superadmin'],
      layout: 'dashboard',
      title: 'Core Configuration'
    }
  },
  // Developer Tools
  {
    path: '/superadmin/dev-tools',
    name: 'superadmin-dev-tools',
    redirect: '/superadmin/dev-tools/scripts',
    meta: {
      requiresAuth: true,
      roles: ['superadmin'],
      layout: 'dashboard',
      title: 'Developer Tools'
    }
  },
  // Developer Tools - Scripts
  {
    path: '/superadmin/dev-tools/scripts',
    name: 'superadmin-dev-tools-scripts',
    component: () => import('@/pages/superadmin/dev-tools/scripts/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['superadmin'],
      layout: 'dashboard',
      title: 'Custom Scripts'
    }
  },
  // Developer Tools - Maintenance Mode
  {
    path: '/superadmin/dev-tools/maintenance',
    name: 'superadmin-dev-tools-maintenance',
    component: () => import('@/pages/superadmin/dev-tools/maintenance/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['superadmin'],
      layout: 'dashboard',
      title: 'Maintenance Mode'
    }
  },
  // Developer Tools - API Keys
  {
    path: '/superadmin/dev-tools/api-keys',
    name: 'superadmin-dev-tools-api-keys',
    component: () => import('@/pages/superadmin/dev-tools/api-keys/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['superadmin'],
      layout: 'dashboard',
      title: 'API Keys'
    }
  },
  // Developer Tools - Environment Variables
  {
    path: '/superadmin/dev-tools/env',
    name: 'superadmin-dev-tools-env',
    component: () => import('@/pages/superadmin/dev-tools/env/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['superadmin'],
      layout: 'dashboard',
      title: 'Environment Variables'
    }
  },
  // Logs & Activity
  {
    path: '/superadmin/logs',
    name: 'superadmin-logs',
    component: () => import('@/pages/superadmin/logs/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['superadmin'],
      layout: 'dashboard',
      title: 'Logs & Activity'
    }
  },
  {
    path: '/superadmin/documentation',
    name: 'superadmin-documentation',
    component: () => import('@/pages/superadmin/docs/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['superadmin'],
      layout: 'dashboard',
      title: 'Documentation'
    }
  },
  {
    path: '/superadmin/kitchen-sink',
    name: 'superadmin-kitchen-sink',
    component: () => import('@/pages/superadmin/kitchen-sink/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['superadmin'],
      layout: 'dashboard',
      title: 'Kitchen Sink'
    }
  }
]; 