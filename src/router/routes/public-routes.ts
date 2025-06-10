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
    path: '/welcome',
    redirect: '/login',
    meta: {
      requiresAuth: false,
      title: 'Welcome'
    }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/pages/about.vue'),
    meta: {
      requiresAuth: false,
      layout: 'blank',
      title: 'About Us'
    }
  },
  {
    path: '/privacy-policy',
    name: 'privacy-policy',
    component: () => import('@/pages/privacy-policy.vue'),
    meta: {
      requiresAuth: false,
      layout: 'blank',
      title: 'Privacy Policy'
    }
  },
  {
    path: '/terms-of-service',
    name: 'terms-of-service',
    component: () => import('@/pages/terms-of-service.vue'),
    meta: {
      requiresAuth: false,
      layout: 'blank',
      title: 'Terms of Service'
    }
  }
]; 