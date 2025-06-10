<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const isLoading = ref(true);

// Redirect based on authentication status
onMounted(() => {
  // Wait for auth store to be ready
  setTimeout(() => {
    redirectBasedOnAuth();
  }, 300);
});

function redirectBasedOnAuth() {
  if (!authStore.isAuthenticated) {
    console.log('Root page - User not authenticated, redirecting to login');
    router.replace('/login');
  } else {
    // Redirect based on user role
    const userType = authStore.user?.user_type;
    console.log(`Root page - User authenticated as ${userType}, redirecting to dashboard`);
    
    switch (userType) {
      case 'superadmin':
        router.replace('/superadmin/dashboard');
        break;
      case 'admin':
        router.replace('/admin/dashboard');
        break;
      case 'manager':
        router.replace('/manager/home');
        break;
      case 'user':
        router.replace('/user/home');
        break;
      default:
        router.replace('/login');
    }
  }
  
  // Set loading to false after redirect is initiated
  setTimeout(() => {
    isLoading.value = false;
  }, 100);
}
</script>

<template>
  <div v-if="isLoading" class="flex h-screen items-center justify-center">
    <div class="text-center">
      <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
      <p class="mt-4 text-muted-foreground">Loading...</p>
    </div>
  </div>
</template>
