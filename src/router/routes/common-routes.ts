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
  }
]; 