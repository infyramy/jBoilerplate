<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarInset,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import {
  ChevronLeftIcon,
  FileTextIcon,
  CalendarIcon,
  PlusIcon,
  EyeIcon,
  ShareIcon,
  EditIcon,
  ScrollTextIcon,
  MessageCircleIcon,
  HomeIcon,
  InboxIcon,
  SunIcon,
  MoonIcon,
} from "lucide-vue-next";
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useColorMode } from "@vueuse/core";

const router = useRouter();
const route = useRoute();

// Initialize color mode
const mode = useColorMode();

function toggleMode() {
  mode.value = mode.value === "dark" ? "light" : "dark";
}

// Get form ID from route params
const formId = computed(() => route.params.id as string);

const navigation = ref([
  {
    title: "Form Setup",
    items: [
      {
        title: "Overview",
        icon: HomeIcon,
        url: `/manager/documents/${formId.value}`,
      },
      {
        title: "Title & Description",
        icon: FileTextIcon,
        url: `/manager/documents/${formId.value}/title`,
      },
      {
        title: "Calendar",
        icon: CalendarIcon,
        url: `/manager/documents/${formId.value}/calendar`,
      },
      {
        title: "Add-ons",
        icon: PlusIcon,
        url: `/manager/documents/${formId.value}/addons`,
      },
    ],
  },
  {
    title: "Form Builder",
    items: [
      {
        title: "Form Fields",
        icon: EditIcon,
        url: `/manager/documents/${formId.value}/fields`,
      },
    ],
  },
  {
    title: "Configuration",
    items: [
      {
        title: "Terms & Conditions",
        icon: ScrollTextIcon,
        url: `/manager/documents/${formId.value}/terms`,
      },
      {
        title: "Messaging & Redirect",
        icon: MessageCircleIcon,
        url: `/manager/documents/${formId.value}/messaging`,
      },
    ],
  },
]);

// Check if current route matches navigation item
const isActiveRoute = (url: string) => {
  return route.path === url;
};
</script>

<template>
  <SidebarProvider>
    <Sidebar class="border-r">
      <SidebarHeader class="border-b">
        <!-- Back to Forms Navigation -->
        <div class="p-4">
          <button
            @click="router.push('/manager/documents')"
            class="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 hover:bg-accent px-3 py-2 rounded-md w-full"
          >
            <ChevronLeftIcon class="w-4 h-4" />
            <span>Back to Documents</span>
          </button>
        </div>

        <!-- Form Title -->
        <div class="px-4 pb-4">
          <h2 class="text-lg font-semibold text-foreground">
            Document Form
          </h2>
          <p class="text-sm text-muted-foreground">
            Form ID: {{ formId || "new" }}
          </p>
        </div>
      </SidebarHeader>

      <SidebarContent class="px-2">
        <div class="space-y-4">
          <SidebarGroup
            v-for="section in navigation"
            :key="section.title"
            class="space-y-2"
          >
            <SidebarGroupLabel
              class="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3"
            >
              {{ section.title }}
            </SidebarGroupLabel>

            <SidebarMenu class="space-y-1">
              <SidebarMenuItem v-for="item in section.items" :key="item.title">
                <SidebarMenuButton
                  @click="router.push(item.url)"
                  :class="[
                    'w-full justify-start gap-3 px-3 py-2 text-sm transition-all duration-200',
                    isActiveRoute(item.url)
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'hover:bg-accent hover:text-accent-foreground',
                  ]"
                >
                  <component
                    :is="item.icon"
                    :class="[
                      'w-4 h-4 flex-shrink-0',
                      isActiveRoute(item.url)
                        ? 'text-primary-foreground '
                        : 'text-muted-foreground',
                    ]"
                  />
                  <span class="font-medium truncate">{{ item.title }}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </div>
      </SidebarContent>

      <SidebarFooter class="border-t p-4">
        <div class="space-y-3">
          <!-- Quick Actions -->
          <div class="space-y-2">
            <Button
              variant="outline"
              size="sm"
              class="w-full justify-start"
              @click="router.push(`/manager/documents/${formId}/preview`)"
            >
              <EyeIcon class="w-4 h-4 mr-2" />
              Preview Form
            </Button>
            <Button
              size="sm"
              class="w-full justify-start"
              @click="router.push(`/manager/documents/${formId}/publish`)"
            >
              <ShareIcon class="w-4 h-4 mr-2" />
              Publish Form
            </Button>
          </div>

          <!-- Theme Toggle -->
          <div class="border-t pt-2">
            <Button
              variant="ghost"
              size="sm"
              class="w-full justify-start"
              @click="toggleMode"
            >
              <SunIcon v-if="mode === 'dark'" class="w-4 h-4 mr-2" />
              <MoonIcon v-else class="w-4 h-4 mr-2" />
              {{ mode === "dark" ? "Light Mode" : "Dark Mode" }}
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>

    <div class="flex-1 overflow-auto">
      <!-- Main Content -->
      <div class="p-4 sm:p-6 max-w-7xl mx-auto">
        <slot />
      </div>
    </div>
  </SidebarProvider>
</template>
