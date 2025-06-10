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
      title: 'Home'
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
    path: '/admin/projects',
    name: 'admin-projects',
    component: () => import('@/pages/admin/projects/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin'],
      layout: 'dashboard',
      title: 'Project Management'
    }
  },
  {
    path: '/admin/documents',
    name: 'admin-documents',
    component: () => import('@/pages/admin/documents/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin'],
      layout: 'dashboard',
      title: 'Document Management'
    }
  },
  {
    path: '/admin/team',
    name: 'admin-team',
    component: () => import('@/pages/admin/team/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin'],
      layout: 'dashboard',
      title: 'Team Management'
    }
  },
  {
    path: '/admin/calendar',
    name: 'admin-calendar',
    component: () => import('@/pages/admin/calendar/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin'],
      layout: 'dashboard',
      title: 'Calendar'
    }
  },
  {
    path: '/admin/analytics',
    name: 'admin-analytics',
    component: () => import('@/pages/admin/analytics/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin'],
      layout: 'dashboard',
      title: 'Analytics'
    }
  },
  {
    path: '/admin/api-access',
    name: 'admin-api-access',
    component: () => import('@/pages/admin/api-access/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin'],
      layout: 'dashboard',
      title: 'API Access'
    }
  }
]; 