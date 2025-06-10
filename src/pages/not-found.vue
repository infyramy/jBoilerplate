<template>
  <div class="flex min-h-svh flex-col items-center justify-center">
    <div class="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
      <div class="text-6xl font-bold text-primary">404</div>
      <h1 class="mt-4 text-3xl font-bold tracking-tight">Page not found</h1>
      <p class="mt-2 text-muted-foreground">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button @click="goToDashboard" class="mt-6">
        Go to dashboard
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();

function goToDashboard() {
  if (!authStore.isAuthenticated) {
    router.push("/login");
    return;
  }

  // Redirect based on user role
  const userType = authStore.user?.user_type;
  console.log(`404 page - Redirecting user with role ${userType} to dashboard`);
  
  switch (userType) {
    case "superadmin":
      router.push("/superadmin/dashboard");
      break;
    case "admin":
      router.push("/admin/dashboard");
      break;
    case "manager":
      router.push("/manager/home");
      break;
    case "user":
      router.push("/user/home");
      break;
    default:
      router.push("/login");
  }
}
</script>

<style scoped>
.animate-bounce {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style> 