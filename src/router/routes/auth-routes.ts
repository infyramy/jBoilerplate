import type { RouteRecordRaw } from 'vue-router';

// Define the valid layout types
type LayoutType = 'dashboard' | 'blank' | 'forms' | 'auth';

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login.vue'),
    meta: {
      requiresAuth: false,
      layout: 'auth' as LayoutType,
      title: 'Login'
    }
  }
]; 