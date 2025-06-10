<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "vue-sonner";

interface FBAuthResponse {
  accessToken: string;
  expiresIn: number;
  signedRequest: string;
  userID: string;
}

declare const FB: {
  init: (config: {
    appId: string;
    cookie: boolean;
    xfbml: boolean;
    version: string;
  }) => void;
  login: (
    callback: (response: { authResponse?: FBAuthResponse }) => void,
    options?: { scope: string }
  ) => void;
};

const router = useRouter();
const authStore = useAuthStore();

const businessName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const isSubmitting = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const isGoogleLoaded = ref(false);
const isFacebookLoaded = ref(false);

async function handleSubmit() {
  if (
    !businessName.value ||
    !email.value ||
    !password.value ||
    !confirmPassword.value
  ) {
    toast.error("Please fill in all fields");
    return;
  }

  if (password.value !== confirmPassword.value) {
    toast.error("Passwords do not match");
    return;
  }

  try {
    isSubmitting.value = true;

    // await authStore.register({
    //   business_name: businessName.value,
    //   email: email.value,
    //   password: password.value,
    // });

    toast.success(
      "Registration successful! Please check your email to verify your account."
    );
    router.push("/login");
  } catch (error: any) {
    console.error("Registration error:", error);
    toast.error(
      error.data?.message || "Registration failed. Please try again."
    );
  } finally {
    isSubmitting.value = false;
  }
}

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}

function toggleConfirmPasswordVisibility() {
  showConfirmPassword.value = !showConfirmPassword.value;
}

// Initialize Google SDK
function loadGoogleSDK() {
  return new Promise<void>((resolve) => {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      window.gapi.load("auth2", () => {
        window.gapi.auth2
          .init({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          })
          .then(() => {
            isGoogleLoaded.value = true;
            resolve();
          });
      });
    };

    document.head.appendChild(script);
  });
}

async function handleGoogleLogin() {
  if (!isGoogleLoaded.value) {
    toast.error(
      "Google authentication is still initializing. Please try again in a moment."
    );
    return;
  }

  try {
    isSubmitting.value = true;
    const auth2 = window.gapi.auth2.getAuthInstance();
    const googleUser = await auth2.signIn();
    const token = googleUser.getAuthResponse().id_token;

    await authStore.loginWithSSO({
      provider: "google",
      token,
    });
  } catch (error: any) {
    console.error("Google login error:", error);
    toast.error(error.message || "Failed to login with Google");
  } finally {
    isSubmitting.value = false;
  }
}

function loadFacebookSDK() {
  return new Promise<void>((resolve) => {
    if (window.location.protocol !== "https:") {
      toast.error(
        "Facebook login requires HTTPS. Please use a secure connection."
      );
      resolve();
      return;
    }

    window.fbAsyncInit = function () {
      FB.init({
        appId: import.meta.env.VITE_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: "v18.0",
      });
      isFacebookLoaded.value = true;
      resolve();
    };

    const script = document.createElement("script");
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  });
}

async function handleFacebookLogin() {
  if (!isFacebookLoaded.value) {
    toast.error(
      "Facebook authentication is still initializing. Please try again in a moment."
    );
    return;
  }

  if (window.location.protocol !== "https:") {
    toast.error(
      "Facebook login requires HTTPS. Please use a secure connection."
    );
    return;
  }

  try {
    isSubmitting.value = true;
    const response = await new Promise<FBAuthResponse>((resolve, reject) => {
      FB.login(
        (response: { authResponse?: FBAuthResponse }) => {
          if (response.authResponse) {
            resolve(response.authResponse);
          } else {
            reject(new Error("Facebook login cancelled"));
          }
        },
        { scope: "email" }
      );
    });

    await authStore.loginWithSSO({
      provider: "facebook",
      token: response.accessToken,
    });
  } catch (error: any) {
    console.error("Facebook login error:", error);
    toast.error(error.message || "Failed to login with Facebook");
  } finally {
    isSubmitting.value = false;
  }
}

onMounted(() => {
  loadGoogleSDK();
  loadFacebookSDK();
});
</script>

<template>
  <div>
    <div class="flex flex-col space-y-2 text-center">
      <h1 class="text-2xl font-semibold tracking-tight">
        Create an account
      </h1>
      <p class="text-sm text-muted-foreground">
        Enter your details to create your account
      </p>
    </div>

    <Card>
      <CardContent class="pt-4">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="space-y-2">
            <Label for="businessName">Business Name</Label>
            <Input
              id="businessName"
              v-model="businessName"
              placeholder="Your Business Name"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              v-model="email"
              required
              autocomplete="email"
            />
          </div>
          <div class="space-y-2">
            <Label for="password">Password</Label>
            <div class="relative">
              <Input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                v-model="password"
                required
                autocomplete="new-password"
              />
              <button
                type="button"
                @click="togglePasswordVisibility"
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5"
              >
                <span
                  class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <svg
                    v-if="showPassword"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="h-4 w-4"
                  >
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                    <line x1="2" x2="22" y1="2" y2="22"></line>
                  </svg>
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="h-4 w-4"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </span>
              </button>
            </div>
          </div>
          <div class="space-y-2">
            <Label for="confirmPassword">Confirm Password</Label>
            <div class="relative">
              <Input
                id="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="••••••••"
                v-model="confirmPassword"
                required
                autocomplete="new-password"
              />
              <button
                type="button"
                @click="toggleConfirmPasswordVisibility"
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5"
              >
                <span
                  class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <svg
                    v-if="showConfirmPassword"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="h-4 w-4"
                  >
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                    <line x1="2" x2="22" y1="2" y2="22"></line>
                  </svg>
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="h-4 w-4"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </span>
              </button>
            </div>
          </div>
          <Button
            type="submit"
            class="w-full"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting">
              <svg
                class="animate-spin mr-2 h-4 w-4 text-primary-foreground"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Creating account...
            </span>
            <span v-else>Create account</span>
          </Button>
        </form>

        <!-- Social Login -->
        <div class="mt-6 space-y-4">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <span class="w-full border-t"></span>
            </div>
            <div class="relative flex justify-center text-xs">
              <span class="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              type="button"
              @click="handleGoogleLogin"
              :disabled="isSubmitting"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 0 24 24"
                width="24"
                class="h-4 w-4 mr-2"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Google
            </Button>
            <Button
              variant="outline"
              type="button"
              @click="handleFacebookLogin"
              :disabled="isSubmitting"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                class="h-4 w-4 mr-2 text-blue-600 fill-current"
              >
                <path
                  d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z"
                />
              </svg>
              Facebook
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <p class="text-center text-sm text-muted-foreground mt-6">
      Already have an account?
      <router-link
        to="/login"
        class="text-primary underline underline-offset-4 hover:text-primary/90"
      >
        Sign in
      </router-link>
    </p>
  </div>
</template>
