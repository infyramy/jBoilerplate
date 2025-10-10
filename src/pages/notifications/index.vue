<template>
  <div class="space-y-6">
    <Breadcrumb :breadcrumb="breadcrumbs" />
    
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-foreground">
          Notifications
        </h1>
        <p class="text-muted-foreground mt-1">
          View and manage your notification history
        </p>
      </div>
      <Button 
        variant="outline" 
        class="gap-2" 
        @click="markAllAsRead"
        :disabled="notificationStore.unreadCount === 0"
      >
        <CheckCheck class="h-4 w-4" />
        Mark All as Read
      </Button>
    </div>
    
    <!-- Search and Filter Bar -->
    <div class="bg-card rounded-lg border shadow-sm p-4 mb-4">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            v-model="searchQuery"
            placeholder="Search by title or message..." 
            class="pl-10"
          />
        </div>
        <div class="flex gap-2">
          <Select v-model="selectedFilter" class="w-[140px]">
            <SelectTrigger>
              <div class="flex items-center gap-2">
                <ArrowUpDown class="h-4 w-4" />
                <SelectValue placeholder="Sort by" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            class="gap-2" 
            @click="resetFilters"
            :disabled="!hasActiveFilters"
          >
            <RefreshCw class="h-4 w-4" />
            <span class="hidden sm:inline">Reset</span>
          </Button>
        </div>
      </div>
      
      <div v-if="searchQuery" class="mt-2 text-sm text-muted-foreground">
        Found {{ filteredNotifications.length }} result{{ filteredNotifications.length !== 1 ? 's' : '' }} for "{{ searchQuery }}"
      </div>
    </div>
    
    <!-- Tabs and Content -->
    <Tabs v-model="selectedTab" class="w-full">
      <TabsList class="w-full mb-4 grid grid-cols-5 sm:grid-cols-5">
        <TabsTrigger value="all">
          <div class="flex items-center gap-2">
            <Bell class="h-4 w-4" />
            <span class="hidden sm:inline">All</span>
          </div>
        </TabsTrigger>
        <TabsTrigger value="unread">
          <div class="flex items-center gap-2">
            <div class="relative">
              <Bell class="h-4 w-4" />
              <span v-if="notificationStore.unreadCount > 0" class="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></span>
            </div>
            <span class="hidden sm:inline">Unread</span>
            <Badge v-if="notificationStore.unreadCount > 0" variant="secondary" class="ml-1 hidden sm:inline-flex">
              {{ notificationStore.unreadCount }}
            </Badge>
          </div>
        </TabsTrigger>
        <TabsTrigger value="info">
          <div class="flex items-center gap-2">
            <Info class="h-4 w-4 text-blue-600" />
            <span class="hidden sm:inline">Info</span>
          </div>
        </TabsTrigger>
        <TabsTrigger value="success">
          <div class="flex items-center gap-2">
            <CheckCircle class="h-4 w-4 text-green-600" />
            <span class="hidden sm:inline">Success</span>
          </div>
        </TabsTrigger>
        <TabsTrigger value="warning">
          <div class="flex items-center gap-2">
            <AlertTriangle class="h-4 w-4 text-amber-600" />
            <span class="hidden sm:inline">Warning</span>
          </div>
        </TabsTrigger>
      </TabsList>
      
      <Card>
        <CardHeader class="pb-3">
          <CardTitle>{{ getTabTitle }}</CardTitle>
          <CardDescription>
            {{ getTabDescription }}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-if="filteredNotifications.length === 0" class="p-4 text-center text-muted-foreground">
              No notifications found
            </div>
            <div v-else v-for="notification in filteredNotifications" :key="notification.id" 
                 class="flex gap-4 p-4 rounded-lg transition-colors"
                 :class="{ 'bg-muted': !notification.read }"
                 @click="markAsRead(notification.id)">
              <div class="mt-1">
                <component :is="getNotificationIcon(notification.type)" 
                  class="h-5 w-5" 
                  :class="{
                    'text-green-600': notification.type === 'success',
                    'text-blue-600': notification.type === 'info',
                    'text-amber-600': notification.type === 'warning',
                    'text-red-600': notification.type === 'error'
                  }" />
              </div>
              <div class="flex-1">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                  <h3 class="font-semibold">{{ notification.title }}</h3>
                  <span class="text-xs text-muted-foreground">
                    {{ formatTimeAgo(notification.timestamp) }}
                  </span>
                </div>
                <p class="text-sm text-muted-foreground">{{ notification.message }}</p>
                <div class="text-xs text-muted-foreground mt-2">
                  {{ formatDate(notification.timestamp) }}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useNotificationStore } from "@/stores/notification";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, Info, AlertTriangle, Search, Bell, CheckCheck, ArrowUpDown, RefreshCw } from "lucide-vue-next";
import Breadcrumb from "@/layouts/components/PageHeader.vue";

// Breadcrumbs data
const breadcrumbs = [
  {
    count: 1,
    label: "Notifications",
    href: "/notifications",
    action: false,
  },
];

const notificationStore = useNotificationStore();
const searchQuery = ref("");
const selectedTab = ref("all");
const selectedFilter = ref("newest");

// Filter notifications
const filteredNotifications = computed(() => {
  let notifications = [...notificationStore.notifications];
  
  // Filter by tab
  if (selectedTab.value !== "all") {
    if (selectedTab.value === "unread") {
      notifications = notifications.filter(notification => !notification.read);
    } else {
      notifications = notifications.filter(notification => notification.type === selectedTab.value);
    }
  }
  
  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    notifications = notifications.filter(notification => 
      notification.title.toLowerCase().includes(query) || 
      notification.message.toLowerCase().includes(query)
    );
  }
  
  // Sort notifications
  if (selectedFilter.value === "newest") {
    notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  } else if (selectedFilter.value === "oldest") {
    notifications.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }
  
  return notifications;
});

// Get notification icon based on type
function getNotificationIcon(type: 'info' | 'success' | 'warning' | 'error'): typeof CheckCircle | typeof XCircle | typeof AlertTriangle | typeof Info {
  switch (type) {
    case "success":
      return CheckCircle;
    case "error":
      return XCircle;
    case "warning":
      return AlertTriangle;
    case "info":
    default:
      return Info;
  }
}

// Get tab title based on selected tab
const getTabTitle = computed((): string => {
  switch (selectedTab.value) {
    case "unread":
      return "Unread Notifications";
    case "info":
      return "Information Notifications";
    case "success":
      return "Success Notifications";
    case "warning":
      return "Warning Notifications";
    case "all":
    default:
      return "All Notifications";
  }
});

// Get tab description based on selected tab
const getTabDescription = computed((): string => {
  switch (selectedTab.value) {
    case "unread":
      return "View your unread notifications";
    case "info":
      return "View all informational notifications";
    case "success":
      return "View all success notifications";
    case "warning":
      return "View all warning notifications";
    case "all":
    default:
      return "View all of your notifications in one place";
  }
});

// Format date
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric"
  }).format(date);
}

// Format time ago
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

// Handle marking a notification as read
function markAsRead(id: string): void {
  notificationStore.markAsRead(id);
}

// Handle marking all notifications as read
function markAllAsRead(): void {
  notificationStore.markAllAsRead();
}

// Handle resetting filters
function resetFilters(): void {
  searchQuery.value = "";
  selectedFilter.value = "newest";
}

// Check if there are active filters
const hasActiveFilters = computed(() => {
  return searchQuery.value.trim() !== "" || selectedFilter.value !== "newest";
});

onMounted(() => {
  // Nothing to do on mount
});
</script>

<style scoped>
.bg-muted {
  @apply hover:bg-muted/80 cursor-pointer;
}
</style>
