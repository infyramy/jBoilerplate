<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      <Button :variant="isEditMode ? 'default' : 'outline'" @click="toggleEditMode">
        <PencilIcon v-if="!isEditMode" class="mr-2 h-4 w-4" />
        <GridIcon v-else class="mr-2 h-4 w-4" />
        {{ isEditMode ? 'Save Layout' : 'Customize Dashboard' }}
      </Button>
    </div>

    <!-- Dashboard editor controls (only visible in edit mode) -->
    <Card v-if="isEditMode" class="bg-muted/50">
      <CardHeader>
        <CardTitle>Dashboard Editor</CardTitle>
        <CardDescription>Drag and drop widgets to customize your dashboard</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div>
            <h3 class="text-sm font-medium mb-2">Available Widgets</h3>
            <div class="flex flex-wrap gap-2">
              <div
                v-for="widget in availableWidgetsToAdd"
                :key="widget.id"
                draggable="true"
                @dragstart="startDrag(widget.id)"
                @dragend="endDrag"
                class="flex items-center gap-2 px-3 py-2 rounded-md border bg-card cursor-move hover:bg-accent transition-colors"
              >
                <component :is="widget.icon" class="h-4 w-4 text-muted-foreground" />
                <span class="text-sm">{{ widget.name }}</span>
              </div>
            </div>
          </div>
          
          <div class="text-sm text-muted-foreground">
            <p>• Drag widgets to reorder them</p>
            <p>• Click the size button to change widget size</p>
            <p>• Click the X button to remove widgets</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Dashboard Grid -->
    <div 
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      :class="{ 'border-2 border-dashed border-muted-foreground/20 p-4 rounded-lg': isEditMode }"
    >
      <!-- Dashboard widgets -->
      <template v-for="(widget, index) in dashboardLayout" :key="`${widget.id}-${index}`">
        <div
          :class="[
            getWidgetClass(widget.size),
            { 
              'cursor-move border-2 border-dashed hover:border-primary/50 relative': isEditMode,
              'opacity-50': isDragging && draggedWidget === widget.id,
              'border-primary': hoveredWidgetArea === index && isDragging
            }
          ]"
          draggable="true"
          @dragstart="startDrag(widget.id)"
          @dragover="dragOver($event, index)"
          @drop="drop($event, index)"
          @dragend="endDrag"
        >
          <!-- Widget controls (only visible in edit mode) -->
          <div v-if="isEditMode" class="absolute right-2 top-2 z-10 flex gap-1">
            <Button variant="ghost" size="icon" class="h-6 w-6" @click="toggleWidgetSize(index)">
              <MaximizeIcon v-if="widget.size === 'small'" class="h-3 w-3" />
              <MinimizeIcon v-else class="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" class="h-6 w-6 text-destructive" @click="removeWidget(index)">
              <XIcon class="h-3 w-3" />
            </Button>
          </div>
          
          <!-- User Stats Widget -->
          <Card v-if="widget.id === 'users'">
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">Total Users</CardTitle>
              <Users class="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">{{ stats.totalUsers }}</div>
              <p class="text-xs text-muted-foreground">
                <span class="text-green-500 flex items-center">
                  <ArrowUp class="mr-1 h-3 w-3" />
                  {{ stats.userGrowth }}%
                </span>
                from last month
              </p>
            </CardContent>
          </Card>

          <!-- Active Users Widget -->
          <Card v-else-if="widget.id === 'activeUsers'">
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">Active Users</CardTitle>
              <Activity class="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">{{ stats.activeUsers }}</div>
              <p class="text-xs text-muted-foreground">
                <span class="text-muted-foreground">
                  {{ Math.round((stats.activeUsers / stats.totalUsers) * 100) }}% of total users
                </span>
              </p>
            </CardContent>
          </Card>

          <!-- Revenue Widget -->
          <Card v-else-if="widget.id === 'revenue'">
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">Revenue</CardTitle>
              <BarChart class="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">{{ stats.revenue }}</div>
              <p class="text-xs text-muted-foreground">
                <span class="text-green-500 flex items-center">
                  <ArrowUp class="mr-1 h-3 w-3" />
                  {{ stats.revenueGrowth }}%
                </span>
                from last month
              </p>
            </CardContent>
          </Card>

          <!-- System Status Widget -->
          <Card v-else-if="widget.id === 'systemStatus'">
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">System Status</CardTitle>
              <Server class="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">{{ stats.uptime }}</div>
              <p class="text-xs text-muted-foreground">
                <span class="text-green-500">All systems operational</span>
              </p>
            </CardContent>
          </Card>

          <!-- User Activity Chart Widget -->
          <Card v-else-if="widget.id === 'userActivity'" className="col-span-2">
            <CardHeader>
              <CardTitle>Weekly User Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="h-[200px] w-full">
                <BarChartComponent
                  :data="userActivity.map(item => item.count)"
                  :categories="userActivity.map(item => item.day)"
                  :colors="['hsl(var(--primary))']"
                />
              </div>
            </CardContent>
          </Card>

          <!-- Server Resources Widget -->
          <Card v-else-if="widget.id === 'serverResources'">
            <CardHeader>
              <CardTitle>Server Resources</CardTitle>
              <CardDescription>
                Current resource utilization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <div class="space-y-2">
                  <div class="flex items-center justify-between text-sm">
                    <span>CPU Usage</span>
                    <span class="font-medium">{{ stats.cpuUsage }}%</span>
                  </div>
                  <div class="h-2 w-full rounded-full bg-secondary">
                    <div class="h-full rounded-full bg-primary" :style="{ width: `${stats.cpuUsage}%` }"></div>
                  </div>
                </div>
                
                <div class="space-y-2">
                  <div class="flex items-center justify-between text-sm">
                    <span>Memory Usage</span>
                    <span class="font-medium">{{ stats.memoryUsage }}%</span>
                  </div>
                  <div class="h-2 w-full rounded-full bg-secondary">
                    <div class="h-full rounded-full bg-primary" :style="{ width: `${stats.memoryUsage}%` }"></div>
                  </div>
                </div>
                
                <div class="space-y-2">
                  <div class="flex items-center justify-between text-sm">
                    <span>Disk Usage</span>
                    <span class="font-medium">{{ stats.diskUsage }}%</span>
                  </div>
                  <div class="h-2 w-full rounded-full bg-secondary">
                    <div class="h-full rounded-full bg-primary" :style="{ width: `${stats.diskUsage}%` }"></div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" class="w-full">
                View Details
              </Button>
            </CardFooter>
          </Card>

          <!-- Recent Activity Widget -->
          <Card v-else-if="widget.id === 'recentActivity'">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest system events and user actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <div class="flex items-start gap-4 rounded-lg border p-3">
                  <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Users class="h-4 w-4 text-primary" />
                  </div>
                  <div class="flex-1 space-y-1">
                    <p class="text-sm font-medium">New user registered</p>
                    <p class="text-xs text-muted-foreground">John Smith created an account</p>
                    <p class="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                
                <div class="flex items-start gap-4 rounded-lg border p-3">
                  <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <BarChart class="h-4 w-4 text-primary" />
                  </div>
                  <div class="flex-1 space-y-1">
                    <p class="text-sm font-medium">Monthly report generated</p>
                    <p class="text-xs text-muted-foreground">System generated the monthly activity report</p>
                    <p class="text-xs text-muted-foreground">4 hours ago</p>
                  </div>
                </div>
                
                <div class="flex items-start gap-4 rounded-lg border p-3">
                  <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Server class="h-4 w-4 text-primary" />
                  </div>
                  <div class="flex-1 space-y-1">
                    <p class="text-sm font-medium">System update completed</p>
                    <p class="text-xs text-muted-foreground">All servers updated to the latest version</p>
                    <p class="text-xs text-muted-foreground">Yesterday</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" class="w-full">View All Activity</Button>
            </CardFooter>
          </Card>

          <!-- User Distribution Widget -->
          <Card v-else-if="widget.id === 'userDistribution'">
            <CardHeader>
              <CardTitle>User Distribution</CardTitle>
              <CardDescription>Users by role type</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="h-[200px] w-full">
                <DonutChart 
                  :data="userDistribution.data.map(item => item.value)"
                  :categories="userDistribution.data.map(item => item.name)"
                  :colors="userDistribution.colors"
                />
              </div>
            </CardContent>
          </Card>

          <!-- Traffic Sources Widget -->
          <Card v-else-if="widget.id === 'trafficSources'">
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>Where your users come from</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="h-[200px] w-full">
                <DonutChart 
                  :data="trafficSources.data.map(item => item.value)"
                  :categories="trafficSources.data.map(item => item.name)"
                  :colors="trafficSources.colors"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </template>

      <!-- Add widget button (only visible in edit mode) -->
      <div 
        v-if="isEditMode && availableWidgetsToAdd.length > 0" 
        class="col-span-1 border-2 border-dashed rounded-lg flex items-center justify-center p-6 cursor-pointer hover:border-primary/50 transition-colors"
        @dragover.prevent
        @drop="drop($event, dashboardLayout.length)"
      >
        <div class="flex flex-col items-center gap-2">
          <Button variant="outline" size="icon" @click="isAddWidgetMenuOpen = true">
            <Plus class="h-6 w-6" />
          </Button>
          <span class="text-sm text-muted-foreground">Drag a widget here or click to add</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, Server, Activity, ArrowUp, BarChart, LayoutDashboard, 
  PencilIcon, XIcon, Plus, GridIcon, MaximizeIcon, MinimizeIcon
} from "lucide-vue-next";
import { BarChart as BarChartComponent } from "@/components/ui/chart-bar";
import { LineChart } from "@/components/ui/chart-line";
import { DonutChart } from "@/components/ui/chart-donut";
import { defaultColors } from "@/components/ui/chart";

// Dashboard state
const isEditMode = ref(false);
const isDragging = ref(false);
const draggedWidget = ref<null | string>(null);
const hoveredWidgetArea = ref<null | number>(null);

// Dashboard layout configuration
const dashboardLayout = ref([
  { id: 'users', size: 'small' },
  { id: 'activeUsers', size: 'small' },
  { id: 'revenue', size: 'small' },
  { id: 'systemStatus', size: 'small' },
  { id: 'userActivity', size: 'large' },
  { id: 'serverResources', size: 'medium' },
  { id: 'recentActivity', size: 'large' },
]);

// Available widgets for adding to dashboard
const availableWidgets = ref([
  { id: 'users', name: 'Total Users', icon: Users, size: 'small' },
  { id: 'activeUsers', name: 'Active Users', icon: Activity, size: 'small' },
  { id: 'revenue', name: 'Revenue', icon: BarChart, size: 'small' },
  { id: 'systemStatus', name: 'System Status', icon: Server, size: 'small' },
  { id: 'userActivity', name: 'User Activity Chart', icon: BarChart, size: 'large' },
  { id: 'serverResources', name: 'Server Resources', icon: Server, size: 'medium' },
  { id: 'recentActivity', name: 'Recent Activity', icon: Activity, size: 'large' },
  { id: 'userDistribution', name: 'User Distribution', icon: Users, size: 'medium' },
  { id: 'trafficSources', name: 'Traffic Sources', icon: BarChart, size: 'medium' },
]);

// Mock data for the dashboard
const stats = ref({
  totalUsers: 486,
  activeUsers: 382,
  newUsers: 24,
  servers: 8,
  cpuUsage: 38,
  memoryUsage: 62,
  diskUsage: 47,
  uptime: "99.98%",
  userGrowth: 12,
  revenue: "$12,845",
  revenueGrowth: 8,
});

// Mock data for user activity chart
const userActivity = ref([
  { day: 'Mon', count: 45 },
  { day: 'Tue', count: 52 },
  { day: 'Wed', count: 49 },
  { day: 'Thu', count: 63 },
  { day: 'Fri', count: 55 },
  { day: 'Sat', count: 38 },
  { day: 'Sun', count: 42 },
]);

// User distribution data for donut chart
const userDistribution = ref({
  data: [
    { name: 'Admins', value: 15 },
    { name: 'Managers', value: 35 },
    { name: 'Regular Users', value: 436 },
  ],
  colors: defaultColors(3),
});

// Traffic sources data
const trafficSources = ref({
  data: [
    { name: 'Direct', value: 35 },
    { name: 'Search', value: 42 },
    { name: 'Social', value: 18 },
    { name: 'Referral', value: 5 },
  ],
  colors: defaultColors(4),
});

// Methods for drag and drop functionality
function startDrag(widgetId: string) {
  if (!isEditMode.value) return;
  isDragging.value = true;
  draggedWidget.value = widgetId;
}

function endDrag() {
  isDragging.value = false;
  draggedWidget.value = null;
  hoveredWidgetArea.value = null;
}

function dragOver(event: DragEvent, index: number) {
  if (!isEditMode.value || !isDragging.value) return;
  event.preventDefault();
  hoveredWidgetArea.value = index;
}

function drop(event: DragEvent, index: number) {
  if (!isEditMode.value || !draggedWidget.value) return;
  event.preventDefault();
  
  // Find current index of dragged widget
  const currentIndex = dashboardLayout.value.findIndex(widget => widget.id === draggedWidget.value);
  
  if (currentIndex !== -1) {
    // Move widget from current position to new position
    const [removed] = dashboardLayout.value.splice(currentIndex, 1);
    dashboardLayout.value.splice(index, 0, removed);
  } else {
    // Add new widget to dashboard
    const widgetToAdd = availableWidgets.value.find(widget => widget.id === draggedWidget.value);
    if (widgetToAdd) {
      dashboardLayout.value.splice(index, 0, { id: widgetToAdd.id, size: widgetToAdd.size });
    }
  }
  
  endDrag();
}

function addWidget(widgetId: string) {
  const widgetToAdd = availableWidgets.value.find(widget => widget.id === widgetId);
  if (widgetToAdd) {
    dashboardLayout.value.push({ id: widgetToAdd.id, size: widgetToAdd.size });
  }
}

function removeWidget(index: number) {
  if (!isEditMode.value) return;
  dashboardLayout.value.splice(index, 1);
}

function toggleWidgetSize(index: number) {
  if (!isEditMode.value) return;
  const widget = dashboardLayout.value[index];
  const sizes = ['small', 'medium', 'large'];
  const currentSizeIndex = sizes.indexOf(widget.size);
  const nextSizeIndex = (currentSizeIndex + 1) % sizes.length;
  widget.size = sizes[nextSizeIndex];
}

function toggleEditMode() {
  isEditMode.value = !isEditMode.value;
  if (!isEditMode.value) {
    // Save dashboard layout to user preferences (in a real app)
    console.log('Dashboard layout saved:', dashboardLayout.value);
  }
}

// Get widget class based on size
function getWidgetClass(size: string) {
  switch (size) {
    case 'small':
      return 'col-span-1';
    case 'medium':
      return 'col-span-2';
    case 'large':
      return 'col-span-3';
    default:
      return 'col-span-1';
  }
}

// Get available widgets that are not already on the dashboard
const availableWidgetsToAdd = computed(() => {
  const dashboardWidgetIds = dashboardLayout.value.map(widget => widget.id);
  return availableWidgets.value.filter(widget => !dashboardWidgetIds.includes(widget.id));
});
</script> 