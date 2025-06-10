import type { RouteRecordRaw } from 'vue-router';

export const userRoutes: RouteRecordRaw[] = [
  {
    path: '/user',
    redirect: '/user/home',
    meta: {
      requiresAuth: true,
      roles: ['user'],
      layout: 'dashboard'
    }
  },
  {
    path: '/user/home',
    name: 'user-home',
    component: () => import('@/pages/user/home/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['user'],
      layout: 'dashboard',
      title: 'Home'
    }
  }
]; 