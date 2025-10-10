import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import i18n from "./plugins/i18n";
import analyticsPlugin from "./plugins/analytics";
import configPlugin from "./plugins/config";
import { useAuthStore } from "./stores/auth";
import { useSystemConfigStore } from "./stores/system-config";
import { loadDynamicRoutes } from "./router/dynamic-routes";
import { useNavigationStore } from "./stores/navigation";
import App from "./App.vue";
import "./assets/index.css";
import "./assets/transitions.css";
import "./assets/theme-customizer.css";

// Set API URL globally
window.API_URL = import.meta.env.VITE_API_URL;

// Initialize theme based on user preference
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark');
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
};

// Initialize theme
initializeTheme();

// Create the app with Vue
console.log("Initializing application...");

// Global error handler
window.addEventListener('error', (event) => {
  console.error('[Global Error]', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('[Unhandled Promise Rejection]', event.reason);
});

const app = createApp(App);

// Vue error handler
app.config.errorHandler = (err, instance, info) => {
  console.error('[Vue Error]', err, info);
};

const pinia = createPinia();
app.use(pinia);
app.use(router); // Register router before auth initialization
app.use(i18n);
app.use(configPlugin);
app.use(analyticsPlugin, { router });

// Set initial locale from localStorage if available
const savedLocale = localStorage.getItem('locale');
if (savedLocale && ['en', 'es'].includes(savedLocale)) {
  i18n.global.locale.value = savedLocale as 'en' | 'es';
}

// Initialize system config store first (for document title)
const systemConfigStore = useSystemConfigStore();

// Add timeout to ensure app mounts even if initialization hangs
const initTimeout = setTimeout(() => {
  console.warn("⚠️ Initialization taking too long (>3s), mounting app anyway...");
  try {
    app.mount("#app");
    console.log("✓ Application mounted after timeout.");
    router.replace('/login').catch(err => {
      console.error("Router navigation failed:", err);
      window.location.href = '/login';
    });
  } catch (e) {
    console.error("❌ Failed to mount app:", e);
    // Show error to user
    document.getElementById('app').innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: system-ui;">
        <div style="text-align: center; max-width: 500px; padding: 20px;">
          <h2 style="color: #ef4444;">Application Failed to Load</h2>
          <p style="color: #6b7280; margin: 16px 0;">There was an error initializing the application.</p>
          <pre style="background: #f3f4f6; padding: 12px; border-radius: 4px; text-align: left; overflow: auto;">${e}</pre>
          <button onclick="window.location.reload()" style="margin-top: 16px; padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">Reload Page</button>
        </div>
      </div>
    `;
  }
}, 3000); // 3 second timeout (reduced from 10s)

// Initialize both stores
console.log("🔄 Starting store initialization...");

Promise.all([
  systemConfigStore.init().then(() => console.log("✓ System config store initialized")),
  useAuthStore().init().then(() => console.log("✓ Auth store initialized"))
]).then(async () => {
  console.log("✓ All stores initialized, clearing timeout");
  clearTimeout(initTimeout); // Clear timeout if initialization succeeds

  const authStore = useAuthStore();
  console.log("📊 System config:", systemConfigStore.config.systemName);
  console.log("🔐 Auth state:", {
    isAuthenticated: authStore.isAuthenticated,
    userType: authStore.user?.user_type || 'none'
  });

  // Load dynamic routes and navigation before mount
  console.log("🔄 Loading dynamic routes...");
  await loadDynamicRoutes(router);
  console.log("✓ Dynamic routes loaded");

  try {
    const nav = useNavigationStore();
    if ((nav as any).load) {
      console.log("🔄 Loading navigation...");
      await (nav as any).load();
      console.log("✓ Navigation loaded");
    }
  } catch (navError) {
    console.warn("⚠️ Navigation load failed (non-critical):", navError);
  }

  // Mount the app after auth initialization
  console.log("🔄 Mounting Vue app...");
  app.mount("#app");
  console.log("✅ Application mounted successfully!");

  // Force router to re-resolve current path after dynamic routes are loaded
  const currentPath = window.location.pathname;
  console.log("🔄 Current path:", currentPath);

  if (currentPath && currentPath !== '/' && currentPath !== '') {
    console.log("🔄 Re-resolving path:", currentPath);
    await router.replace(currentPath);
  } else if (currentPath === '/' || currentPath === '') {
    console.log("🔄 Root path detected, letting router handle redirection");
    await router.replace('/');
  }

  console.log("✅ Initialization complete!");
}).catch(error => {
  clearTimeout(initTimeout); // Clear timeout on error
  console.error("❌ Store initialization failed:", error);
  console.error("Stack trace:", error.stack);

  // Still mount the app even if init fails
  try {
    console.log("🔄 Attempting to mount app despite error...");
    app.mount("#app");
    console.log("✓ App mounted after error");

    // Force navigation to login on error
    console.log("🔄 Forcing navigation to /login...");
    router.replace('/login').catch(routerError => {
      console.error("Router failed, using window.location:", routerError);
      window.location.href = '/login';
    });
  } catch (mountError) {
    console.error("❌ Fatal: Failed to mount app:", mountError);
    console.error("Stack trace:", mountError.stack);
  }
});
