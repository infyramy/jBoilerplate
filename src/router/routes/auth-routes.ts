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
  },
  // Force a secondary login route to avoid potential caching issues
  {
    path: '/signin',
    redirect: '/login',
    meta: {
      requiresAuth: false,
      title: 'Sign In'
    }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/pages/register.vue'),
    meta: {
      requiresAuth: false,
      layout: 'auth' as LayoutType,
      title: 'Register'
    }
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('@/pages/forgot-password.vue'),
    meta: {
      requiresAuth: false,
      layout: 'auth' as LayoutType,
      title: 'Forgot Password'
    }
  }
]; 