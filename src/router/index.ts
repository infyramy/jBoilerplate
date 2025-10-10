import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useSystemConfigStore } from "@/stores/system-config";
import { routes } from "./routes/index";
import type { UserRole } from "@/types/auth";
import { prefetchRouteComponents } from "@/composables/useAsyncComponent";

// Define common component loaders for prefetching
const commonComponentLoaders = {
  'dashboard': () => import('@/layouts/dashboard.vue'),
  'admin': () => import('@/pages/admin/dashboard/index.vue'),
  'user': () => import('@/pages/user/home/index.vue'),
  'profile': () => import('@/pages/profile/index.vue'),
  'settings': () => import('@/pages/setting/index.vue'),
};

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0 };
  }
});

// Setup status cache to avoid repeated API calls
// Using localStorage to persist across page reloads
const CACHE_DURATION = 60000; // 1 minute
const SETUP_CACHE_KEY = 'setup_status_cache';

function getSetupStatusCache(): { initialized: boolean; timestamp: number } | null {
  try {
    const cached = localStorage.getItem(SETUP_CACHE_KEY);
    if (!cached) return null;
    const data = JSON.parse(cached);
    // Check if cache is still valid
    if (Date.now() - data.timestamp > CACHE_DURATION) {
      localStorage.removeItem(SETUP_CACHE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function setSetupStatusCache(initialized: boolean): void {
  try {
    localStorage.setItem(SETUP_CACHE_KEY, JSON.stringify({
      initialized,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error('Failed to cache setup status:', error);
  }
}

async function checkSetupStatus(): Promise<boolean> {
  // Use cache if valid
  const cached = getSetupStatusCache();
  if (cached !== null) {
    console.log('Using cached setup status:', cached.initialized);
    return cached.initialized;
  }

  try {
    const response = await fetch('/api/setup/status');
    const data = await response.json();
    console.log('Fetched setup status from API:', data.initialized);
    setSetupStatusCache(data.initialized);
    return data.initialized;
  } catch (error) {
    console.error('Failed to check setup status:', error);
    // On error, check if jboilerplate_setup_complete is set as fallback
    const fallback = localStorage.getItem('jboilerplate_setup_complete') === 'true';
    console.log('Using fallback setup status:', fallback);
    return fallback;
  }
}

// Function to clear setup status cache (call after completing setup)
export function clearSetupStatusCache() {
  localStorage.removeItem(SETUP_CACHE_KEY);
  console.log('Setup status cache cleared');
}

// Navigation guard for authentication and role-based access
router.beforeEach(async (to, from, next) => {
  // Check setup status first (except for get-started route itself)
  if (to.name !== 'get-started') {
    const isInitialized = await checkSetupStatus();
    if (!isInitialized) {
      console.log('System not initialized, redirecting to get-started');
      return next({ name: 'get-started' });
    }
  } else {
    // If trying to access get-started but setup is already complete, block it
    const isInitialized = await checkSetupStatus();
    if (isInitialized) {
      console.log('Setup already completed, redirecting to login');
      return next({ name: 'login' });
    }
  }

  // Set document title based on route metadata with system name
  const systemConfigStore = useSystemConfigStore();
  const systemName = systemConfigStore.config.systemName;
  document.title = to.meta.title
    ? `${to.meta.title} | ${systemName}`
    : systemName;

  const authStore = useAuthStore();
  const requiresAuth = to.meta.requiresAuth;
  const allowedRoles = to.meta.roles as string[] | undefined;
  
  console.log('Route access:', { 
    path: to.path, 
    requiresAuth, 
    isAuthenticated: authStore.isAuthenticated,
    userRole: authStore.user?.user_type || 'none' 
  });
  
  // Special case for home route (/) - redirect to login if not authenticated
  if (to.path === '/' && to.name === 'home') {
    if (!authStore.isAuthenticated) {
      console.log("Redirecting from home to login (not authenticated)");
      return next('/login');
    } else {
      // If authenticated, redirect to appropriate dashboard based on role
      const userType = authStore.user?.user_type as UserRole;
      let dashboardPath = getDashboardPathByRole(userType);
      console.log(`Redirecting from home to ${dashboardPath} (authenticated as ${userType})`);
      return next(dashboardPath);
    }
  }

  // Handle public routes
  if (!requiresAuth) {
    // If user is authenticated and tries to access login/register, redirect to their dashboard
    // Exception: get-started page is always accessible
    if (
      authStore.isAuthenticated &&
      (to.name === "login" || to.name === "register") &&
      to.name !== "get-started"
    ) {
      const userType = authStore.user?.user_type as UserRole;
      const dashboardPath = getDashboardPathByRole(userType);

      // Prevent redirect loop by checking if we're already going to the dashboard
      if (to.path === dashboardPath) {
        return next();
      }
      
      console.log(`Redirecting authenticated user from ${to.name} to: ${dashboardPath}`);
      return next(dashboardPath);
    }
    return next();
  }

  // Handle protected routes
  if (!authStore.isAuthenticated) {
    console.log("Unauthenticated user trying to access protected route:", to.path);
    
    // Prevent redirect loop by checking if we're already going to login
    if (to.name === "login") {
      return next();
    }
    
    // Save the intended destination
    return next({
      name: "login",
      query: { redirect: to.fullPath },
    });
  }

  // Check role-based access
  if (allowedRoles && authStore.user) {
    // Allow access if roles include 'all' or if user's role is in the allowed roles
    const hasAccess = allowedRoles.includes('all') || allowedRoles.includes(authStore.user.user_type);

    if (!hasAccess) {
      console.log(`User role ${authStore.user.user_type} not authorized for route: ${to.path}`);

      // Redirect to appropriate dashboard instead of 404
      const userType = authStore.user.user_type as UserRole;
      const dashboardPath = getDashboardPathByRole(userType);
      console.log(`Redirecting to ${dashboardPath}`);
      return next(dashboardPath);
    }
  }

  // Proceed to route
  return next();
});

// After each route change, prefetch components for likely next navigations
router.afterEach((to) => {
  // Prefetch components based on current route
  prefetchRouteComponents(to.path, commonComponentLoaders);
});

// Helper function to get dashboard path by role
function getDashboardPathByRole(role: UserRole): string {
  switch (role) {
    case "admin":
      return "/admin/home";
    case "user":
      return "/user/home";
    default:
      return "/login";
  }
}

export default router;
