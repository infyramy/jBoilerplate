<template>
  <div 
    v-if="authStore.impersonating"
    class="bg-yellow-500 text-black py-2 px-4 w-full flex items-center justify-between"
  >
    <div class="flex items-center space-x-2">
      <UserSquare class="h-5 w-5" />
      <span>
        <strong>Impersonation Mode:</strong> 
        You are viewing as {{ authStore.user?.fullname }} ({{ authStore.user?.email }})
      </span>
    </div>
    <Button variant="default" class="bg-yellow-600 hover:bg-yellow-700" @click="stopImpersonating">
      <ArrowLeft class="mr-2 h-4 w-4" />
      Return to Admin
    </Button>
  </div>
</template>

<script setup lang="ts">
import { UserSquare, ArrowLeft } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const stopImpersonating = async () => {
  await authStore.stopImpersonating();
  
  // Redirect back to admin dashboard
  router.push('/admin/dashboard');
};
</script> 