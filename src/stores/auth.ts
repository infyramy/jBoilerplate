import { defineStore } from "pinia";
import { ref, computed, markRaw } from "vue";
import { useRouter, Router } from "vue-router";
import { ofetch } from "ofetch";
import { exampleUsers, getMockCredentials } from "@/constants/example-users";
import { 
  type User, 
  type LoginCredentials, 
  type SSOCredentials, 
  type AuthResponse,
  type CSRFToken,
  type UserRole
} from "@/types/auth";
import { apiPost } from "@/services/api";

const getApiUrl = (): string => {
  if (window.API_URL) {
    return window.API_URL;
  }
  
  const env = process.env.NODE_ENV || "development";
  const environments = {
    development: "http://localhost:3000/api",
    staging: "https://staging-api.example.com",
    production: "https://api.example.com",
  };
  return environments[env as keyof typeof environments] || environments.development;
};

/**
 * Authentication store that manages user authentication state
 * Uses HTTP-only cookies for refresh tokens and localStorage for access tokens
 * Implements CSRF protection and a role-based access system
 */
export const useAuthStore = defineStore("auth", () => {
  // Initialize router safely, but don't mark it as raw yet since it might not be available
  let router: Router | null = null;
  try {
    const routerInstance = useRouter();
    // Only mark as raw if it's a valid object
    if (routerInstance && typeof routerInstance === 'object') {
      router = markRaw(routerInstance);
    }
  } catch (error) {
    console.warn("Router not available when initializing auth store");
    router = null;
  }

  const user = ref<User | null>(null);
  const accessToken = ref<string | null>(null);
  const csrfToken = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const roles = ref<string[]>([]);

  // Impersonation state
  const impersonating = ref(false);
  const originalUser = ref<User | null>(null);

  const isAuthenticated = computed(() => !!accessToken.value && !!user.value);
  
  // Get router instance safely
  const getRouter = (): Router | null => {
    // If router wasn't available during store initialization, try to get it now
    if (!router) {
      try {
        const routerInstance = useRouter();
        router = markRaw(routerInstance);
      } catch (error) {
        console.warn("Router still not available");
      }
    }
    return router;
  };

  /**
   * Check if user has a specific role
   */
  const hasRole = (role: UserRole): boolean => {
    return user.value?.user_type === role;
  };

  /**
   * Check if user has permission to access a resource
   */
  const hasPermission = (permission: string): boolean => {
    // This is a simple implementation. In a real app, you would have
    // a more robust permission system with role-based permissions
    const rolePermissions: Record<UserRole, string[]> = {
      superadmin: ['all', 'user:read', 'user:write', 'user:delete', 'settings:read', 'settings:write', 'system:read', 'system:write'],
      admin: ['user:read', 'user:write', 'settings:read', 'settings:write'],
      manager: ['user:read', 'user:write', 'team:read', 'team:write', 'project:read', 'project:write'],
      user: ['user:read']
    };
    
    // Superadmin has all permissions
    if (user.value?.user_type === 'superadmin') {
      return true;
    }
    
    // Check if user's role has the requested permission
    return user.value ? rolePermissions[user.value.user_type].includes(permission) : false;
  };

  /**
   * Get CSRF token from the server
   */
  const fetchCSRFToken = async (): Promise<string> => {
    try {
      // First try to get from localStorage to avoid API call if possible
      const storedToken = localStorage.getItem("csrf_token");
      if (storedToken) {
        csrfToken.value = storedToken;
        return storedToken;
      }
      
      try {
        const response = await ofetch<CSRFToken>(`${getApiUrl()}/auth/csrf-token`, {
          method: "GET",
          credentials: "include",
          timeout: 3000, // Add timeout to fail faster
        });
        
        csrfToken.value = response.token;
        localStorage.setItem("csrf_token", response.token);
        return response.token;
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error);
        // Generate a mock token when API is not available
        const mockToken = `mock_csrf_${Date.now()}`;
        csrfToken.value = mockToken;
        localStorage.setItem("csrf_token", mockToken);
        return mockToken;
      }
    } catch (error) {
      console.error("Error in fetchCSRFToken:", error);
      return "";
    }
  };

  /**
   * Initialize the auth store
   */
  const init = async (): Promise<void> => {
    // Try to load user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      user.value = JSON.parse(storedUser);
    }
    
    // Try to load tokens
    const storedAccessToken = localStorage.getItem("access_token");
    const storedCSRFToken = localStorage.getItem("csrf_token");
    
    if (storedAccessToken) {
      accessToken.value = storedAccessToken;
    }
    
    if (storedCSRFToken) {
      csrfToken.value = storedCSRFToken;
    }
    
    // If we have tokens but no user, try to fetch user data
    if (accessToken.value && !user.value) {
      try {
        await fetchUserData();
      } catch (error) {
        // If we can't get user data, clear the tokens
        clearAuthData();
      }
    }
    
    // Fetch a new CSRF token if needed
    if (!csrfToken.value) {
      await fetchCSRFToken();
    }
    
    // Initialize impersonation state
    const isImpersonating = localStorage.getItem("impersonating") === "true";
    const storedOriginalUser = localStorage.getItem("original_user");
    
    if (isImpersonating && storedOriginalUser) {
      impersonating.value = true;
      originalUser.value = JSON.parse(storedOriginalUser);
    }
  };

  /**
   * Fetch the current user's data from the server
   */
  const fetchUserData = async (): Promise<void> => {
    try {
      const { data } = await apiPost<User>("/auth/me", {});
      user.value = data;
      localStorage.setItem("user", JSON.stringify(data));
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      throw error;
    }
  };

  /**
   * Clear all authentication data
   */
  const clearAuthData = (): void => {
    user.value = null;
    accessToken.value = null;
    csrfToken.value = null;
    roles.value = [];
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("csrf_token");
  };

  /**
   * Login with email and password
   */
  async function login(credentials: LoginCredentials): Promise<void> {
    isLoading.value = true;
    error.value = null;

    try {
      // For the boilerplate, we're using mock authentication
      // In a real app, you would call the API
      const matchedUser = exampleUsers.find(u => u.email === credentials.email);
      const mockCreds = matchedUser ? getMockCredentials(matchedUser) : null;

      if (!matchedUser || credentials.password !== mockCreds?.password) {
        throw new Error("Invalid email or password");
      }

      // Simulate a response from the server
      const data = {
        accessToken: `mock_token_${matchedUser.id}`,
        user: matchedUser
      };

      // In a real app, the token would be returned by the API
      // and the access token would be set as an HTTP-only cookie
      accessToken.value = data.accessToken;
      user.value = data.user;

      // Store data in localStorage
      if (accessToken.value) {
        localStorage.setItem("access_token", accessToken.value);
        localStorage.setItem("user", JSON.stringify(user.value));
      }

      // Fetch CSRF token for future requests
      await fetchCSRFToken();
    } catch (e: any) {
      console.error("Login error:", e);
      error.value = e.message || "Login failed";
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Login with a social provider
   */
  async function loginWithSSO(credentials: SSOCredentials): Promise<void> {
    isLoading.value = true;
    error.value = null;

    try {
      // Get CSRF token first
      await fetchCSRFToken();
      
      // Call the SSO endpoint
      const data = await ofetch<AuthResponse>(
        `${getApiUrl()}/auth/sso/${credentials.provider}`,
        {
          method: "POST",
          body: {
            token: credentials.token,
          },
          headers: {
            "X-CSRF-TOKEN": csrfToken.value || "",
          },
          credentials: "include",
        }
      );

      // Set authentication data
      accessToken.value = data.tokens.access_token;
      user.value = data.user;

      // Store data
      if (accessToken.value) {
        localStorage.setItem("access_token", accessToken.value);
        localStorage.setItem("user", JSON.stringify(user.value));
      }
    } catch (e: any) {
      console.error("SSO Login error:", e);
      error.value = e.data?.message || "SSO login failed";
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Refresh the access token using the HTTP-only refresh token cookie
   */
  async function refreshAccessToken(): Promise<string | null> {
    try {
      // Get a new CSRF token
      await fetchCSRFToken();
      
      // Call the refresh token endpoint
      const data = await ofetch<{ accessToken: string }>(
        `${getApiUrl()}/auth/refresh-token`,
        {
          method: "POST",
          credentials: "include", // Important for cookies
          headers: {
            "X-CSRF-TOKEN": csrfToken.value || "",
          },
        }
      );

      accessToken.value = data.accessToken;
      localStorage.setItem("access_token", data.accessToken);
      return data.accessToken;
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
      return null;
    }
  }

  /**
   * Logout the user and clear all authentication data
   */
  async function logout(): Promise<void> {
    try {
      // Only call the API if we have an access token (we're logged in)
      if (accessToken.value) {
        try {
          // Try to call logout endpoint to invalidate refresh token
          // Use a short timeout to avoid long waits if the API is down
          await ofetch(`${getApiUrl()}/auth/logout`, {
            method: "POST",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${accessToken.value || ""}`,
              "X-CSRF-TOKEN": csrfToken.value || "",
            },
            timeout: 2000, // Add a 2 second timeout
          });
        } catch (error) {
          console.error("Logout API call failed:", error);
          // Continue with local logout even if API call fails
        }
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local state regardless of server response
      clearAuthData();
      
      // Only redirect if router is available
      const routerInstance = getRouter();
      if (routerInstance) {
        routerInstance.push("/login");
      }
    }
  }

  /**
   * Start impersonating a user
   */
  async function impersonateUser(targetUser: User): Promise<void> {
    if (!user.value) {
      throw new Error("Cannot impersonate: No authenticated user");
    }
    
    if (!hasPermission('user:impersonate')) {
      throw new Error("You don't have permission to impersonate users");
    }
    
    try {
      // Store the original user
      originalUser.value = { ...user.value };
      
      // Set impersonation flag
      impersonating.value = true;
      
      // Replace current user with target user
      user.value = targetUser;
      
      // Store the impersonation state
      localStorage.setItem("impersonating", "true");
      localStorage.setItem("original_user", JSON.stringify(originalUser.value));
      
      // In a real app, you would make an API call to start impersonation
      // and the backend would issue a special token
      
      // For our boilerplate, we'll just store the impersonated user
      localStorage.setItem("user", JSON.stringify(user.value));
      
      console.log(`Now impersonating user: ${targetUser.email}`);
    } catch (error) {
      console.error("Failed to impersonate user:", error);
      throw error;
    }
  }
  
  /**
   * Stop impersonating and return to original user
   */
  async function stopImpersonating(): Promise<void> {
    if (!impersonating.value || !originalUser.value) {
      return;
    }
    
    try {
      // Restore original user
      user.value = originalUser.value;
      
      // Reset impersonation state
      impersonating.value = false;
      originalUser.value = null;
      
      // Clean up localStorage
      localStorage.removeItem("impersonating");
      localStorage.removeItem("original_user");
      localStorage.setItem("user", JSON.stringify(user.value));
      
      // In a real app, you would make an API call to end impersonation
      
      console.log("Stopped impersonating, returned to original user");
    } catch (error) {
      console.error("Failed to stop impersonating:", error);
      throw error;
    }
  }

  return {
    user,
    accessToken,
    csrfToken,
    isLoading,
    error,
    roles,
    isAuthenticated,
    hasRole,
    hasPermission,
    login,
    loginWithSSO,
    logout,
    init,
    refreshAccessToken,
    fetchUserData,
    
    // Impersonation
    impersonating: computed(() => impersonating.value),
    originalUser: computed(() => originalUser.value),
    impersonateUser,
    stopImpersonating
  };
});
