import type { Router, RouteRecordRaw } from 'vue-router';

type JsonRoute = {
  path: string;
  name: string;
  componentPath: string; // '@/pages/.../index.vue'
  meta?: Record<string, any>;
};

const JSON_URL = '/config/generated-routes.json';

// Create a glob import map for all pages
const pages = import.meta.glob('@/pages/**/*.vue');

async function fetchGeneratedRoutes(): Promise<JsonRoute[]> {
  try {
    const res = await fetch(JSON_URL, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    if (Array.isArray(data)) return data as JsonRoute[];
    return [];
  } catch {
    return [];
  }
}

export async function loadDynamicRoutes(router: Router) {
  const items = await fetchGeneratedRoutes();

  console.log(`Loading ${items.length} dynamic routes...`);

  for (const r of items) {
    if (!r.path || !r.name || !r.componentPath) continue;
    if (router.hasRoute(r.name)) {
      console.log(`Route ${r.name} already exists, skipping`);
      continue;
    }

    // Convert @/pages to /src/pages to match glob keys
    const normalizedPath = r.componentPath.replace(/^@\//, '/src/');

    // Get the component loader from the glob map
    const componentLoader = pages[normalizedPath];
    if (!componentLoader) {
      console.warn(`Component not found for route ${r.name}: ${r.componentPath} (normalized: ${normalizedPath})`);
      continue;
    }

    const record: RouteRecordRaw = {
      path: r.path,
      name: r.name,
      component: componentLoader,
      meta: r.meta || {},
    };

    router.addRoute(record);

    // Verify the route was added
    const wasAdded = router.hasRoute(r.name);
    console.log(`✅ Added dynamic route: ${r.name} at ${r.path} (verified: ${wasAdded})`);

    // Log all routes to debug
    const allRoutes = router.getRoutes();
    console.log(`Total routes after adding: ${allRoutes.length}`);
    const foundRoute = allRoutes.find(route => route.name === r.name);
    if (foundRoute) {
      console.log(`Found route in registry:`, {
        name: foundRoute.name,
        path: foundRoute.path,
        meta: foundRoute.meta
      });
    } else {
      console.error(`Route ${r.name} NOT found in registry after addRoute!`);
    }
  }
}
