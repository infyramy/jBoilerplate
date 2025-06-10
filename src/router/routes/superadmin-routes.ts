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