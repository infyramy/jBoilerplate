import type { RouteRecordRaw } from 'vue-router';

export const managerRoutes: RouteRecordRaw[] = [
  {
    path: '/manager',
    redirect: '/manager/home',
    meta: {
      requiresAuth: true,
      roles: ['manager'],
      layout: 'dashboard'
    }
  },
  {
    path: '/manager/home',
    name: 'manager-home',
    component: () => import('@/pages/manager/home/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['manager'],
      layout: 'dashboard',
      title: 'Manager Home'
    }
  },
  {
    path: '/manager/projects',
    name: 'manager-projects',
    component: () => import('@/pages/manager/projects/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['manager'],
      layout: 'dashboard',
      title: 'Projects'
    }
  },
  {
    path: '/manager/team',
    name: 'manager-team',
    component: () => import('@/pages/manager/team/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['manager'],
      layout: 'dashboard',
      title: 'Team Management'
    }
  }
]; 