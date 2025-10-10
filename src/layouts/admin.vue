<script setup lang="ts">
import { ref, computed } from 'vue';
import { useNavigationStore } from "@/stores/navigation";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useRoute } from 'vue-router';

const navigationStore = useNavigationStore();
const route = useRoute();

// Use admin navigation specifically
const navigation = computed(() => navigationStore.adminNavigation);

// Computed breadcrumbs based on current route
const breadcrumbs = computed(() => {
  const paths = route.path.split('/').filter(Boolean);
  let currentPath = '';
  
  return paths.map(path => {
    currentPath += `/${path}`;
    return {
      name: path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' '),
      path: currentPath
    };
  });
});

// Check if user has super admin privileges
const isSuperAdmin = ref(true); // This would be determined from the auth store in a real app
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <!-- Admin Header with Breadcrumbs -->
    <header class="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="container flex h-14 items-center px-4">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/dashboard">Admin</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          
          <template v-for="(crumb, index) in breadcrumbs.slice(1)" :key="index">
            <BreadcrumbItem>
              <BreadcrumbLink v-if="index < breadcrumbs.length - 2" :href="crumb.path">
                {{ crumb.name }}
              </BreadcrumbLink>
              <BreadcrumbPage v-else>{{ crumb.name }}</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator v-if="index < breadcrumbs.length - 2" />
          </template>
        </Breadcrumb>
        
        <div class="ml-auto flex items-center gap-2">
          <Button v-if="isSuperAdmin" variant="outline" size="sm" href="/admin/system">
            Super Admin
          </Button>
        </div>
      </div>
    </header>
    
    <!-- Main Content -->
    <slot />
  </div>
</template> 