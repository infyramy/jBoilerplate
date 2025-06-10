import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import i18n from "./plugins/i18n";
import analyticsPlugin from "./plugins/analytics";
import configPlugin from "./plugins/config";
import { useAuthStore } from "./stores/auth";
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

const app = createApp(App);
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

// Initialize the auth store after router setup
const authStore = useAuthStore();
console.log("Initializing auth store...");

authStore.init().then(() => {
  console.log("Auth store initialized successfully.");
  console.log("Auth state:", { 
    isAuthenticated: authStore.isAuthenticated,
    userType: authStore.user?.user_type || 'none'
  });
  
  // Mount the app after auth initialization
  app.mount("#app");
  console.log("Application mounted successfully.");
  
  // Let the router handle redirection
  const currentPath = window.location.pathname;
  if (currentPath === '/' || currentPath === '') {
    console.log("Detected root path, letting router handle redirection");
    router.replace('/');
  }
}).catch(error => {
  console.error("Failed to initialize auth store:", error);
  // Still mount the app even if auth init fails
  app.mount("#app");
  console.log("Application mounted with auth initialization error.");
  
  // Force navigation to login on error
  router.replace('/login');
});
