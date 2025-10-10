import type { RouteRecordRaw } from 'vue-router';

export const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    redirect: '/admin/home',
    meta: {
      requiresAuth: true,
      roles: ['admin'],
      layout: 'dashboard'
    }
  },
  {
    path: '/admin/home',
    name: 'admin-home',
    component: () => import('@/pages/admin/dashboard/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin'],
      layout: 'dashboard',
      title: 'Dashboard'
    }
  },
  {
    path: '/admin/dashboard',
    redirect: '/admin/home',
    meta: {
      requiresAuth: true,
      roles: ['admin'],
      layout: 'dashboard'
    }
  },
  {
    path: '/admin/page-editor',
    name: 'admin-page-editor',
    component: () => import('@/pages/admin/page-editor/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin'],
      layout: 'dashboard',
      title: 'Page Editor'
    }
  },
  {
    path: '/admin/menu-editor',
    name: 'admin-menu-editor',
    component: () => import('@/pages/admin/menu-editor/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin'],
      layout: 'dashboard',
      title: 'Menu Editor'
    }
  },
  {
    path: '/admin/system-status',
    name: 'admin-system-status',
    component: () => import('@/pages/admin/system-status/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin'],
      layout: 'dashboard',
      title: 'System Status'
    }
  }
]; 