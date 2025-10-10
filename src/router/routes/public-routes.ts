import type { RouteRecordRaw } from 'vue-router';

export const publicRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    redirect: '/login',
    meta: {
      requiresAuth: false,
      title: 'Home'
    }
  },
  {
    path: '/get-started',
    name: 'get-started',
    component: () => import('@/pages/get-started.vue'),
    meta: {
      requiresAuth: false,
      layout: 'blank',
      title: 'Get Started with jBoilerplate'
    }
  }
]; 