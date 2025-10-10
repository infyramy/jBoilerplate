import type { RouteRecordRaw } from 'vue-router';

export const commonRoutes: RouteRecordRaw[] = [
  {
    path: '/notifications',
    name: 'notifications',
    component: () => import('@/pages/notifications/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin', 'manager', 'user'],
      layout: 'dashboard',
      title: 'Notifications'
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/pages/profile.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin', 'manager', 'user'],
      layout: 'dashboard',
      title: 'Profile'
    }
  },
  {
    path: '/setting',
    name: 'setting',
    component: () => import('@/pages/setting.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin', 'manager', 'user'],
      layout: 'dashboard',
      title: 'Settings'
    }
  },
  {
    path: '/privacy-policy',
    name: 'privacy-policy',
    component: () => import('@/pages/privacy-policy.vue'),
    meta: {
      requiresAuth: false,
      title: 'Privacy Policy'
    }
  },
  {
    path: '/terms-of-service',
    name: 'terms-of-service',
    component: () => import('@/pages/terms-of-service.vue'),
    meta: {
      requiresAuth: false,
      title: 'Terms of Service'
    }
  },
  {
    path: '/configuration',
    name: 'configuration',
    component: () => import('@/pages/configuration.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin'],
      layout: 'dashboard',
      title: 'System Configuration'
    }
  }
]; 