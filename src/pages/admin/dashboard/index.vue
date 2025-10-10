<script setup lang="ts">
import { ref } from 'vue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Calendar,
  FileText,
  Download,
  Eye,
  Package,
  MessageSquare,
  Zap,
  Database,
  Globe,
  Settings,
  Bell,
  Shield
} from 'lucide-vue-next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

// Mock Data - Statistics Cards
const stats = ref([
  {
    title: 'Total Revenue',
    value: '$45,231.89',
    change: '+20.1%',
    trend: 'up',
    icon: DollarSign,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-950',
  },
  {
    title: 'Active Users',
    value: '2,350',
    change: '+15.3%',
    trend: 'up',
    icon: Users,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-950',
  },
  {
    title: 'Orders',
    value: '1,234',
    change: '-5.2%',
    trend: 'down',
    icon: ShoppingCart,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-950',
  },
  {
    title: 'Conversion Rate',
    value: '3.24%',
    change: '+8.7%',
    trend: 'up',
    icon: TrendingUp,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-950',
  },
]);

// Recent Orders
const recentOrders = ref([
  { id: 'ORD-001', customer: 'John Doe', email: 'john@example.com', status: 'completed', amount: '$250.00', date: '2025-10-07' },
  { id: 'ORD-002', customer: 'Jane Smith', email: 'jane@example.com', status: 'processing', amount: '$180.50', date: '2025-10-07' },
  { id: 'ORD-003', customer: 'Bob Johnson', email: 'bob@example.com', status: 'pending', amount: '$420.00', date: '2025-10-06' },
  { id: 'ORD-004', customer: 'Alice Williams', email: 'alice@example.com', status: 'completed', amount: '$95.75', date: '2025-10-06' },
  { id: 'ORD-005', customer: 'Charlie Brown', email: 'charlie@example.com', status: 'cancelled', amount: '$310.25', date: '2025-10-05' },
]);

// Top Products
const topProducts = ref([
  { name: 'Premium Subscription', sales: 450, revenue: '$22,500', trend: '+12%', color: 'bg-blue-500' },
  { name: 'Basic Plan', sales: 380, revenue: '$7,600', trend: '+8%', color: 'bg-green-500' },
  { name: 'Enterprise License', sales: 120, revenue: '$36,000', trend: '+25%', color: 'bg-purple-500' },
  { name: 'Add-on Package', sales: 290, revenue: '$5,800', trend: '-3%', color: 'bg-amber-500' },
  { name: 'Support Bundle', sales: 210, revenue: '$4,200', trend: '+15%', color: 'bg-pink-500' },
]);

// Recent Activity
const recentActivity = ref([
  { user: 'Admin', action: 'Updated system configuration', time: '2 minutes ago', icon: Settings, color: 'text-blue-600' },
  { user: 'John Doe', action: 'Created new order #ORD-001', time: '15 minutes ago', icon: ShoppingCart, color: 'text-green-600' },
  { user: 'System', action: 'Database backup completed', time: '1 hour ago', icon: Database, color: 'text-purple-600' },
  { user: 'Jane Smith', action: 'Submitted support ticket', time: '2 hours ago', icon: MessageSquare, color: 'text-amber-600' },
  { user: 'Admin', action: 'Added new user account', time: '3 hours ago', icon: Users, color: 'text-pink-600' },
]);

// System Health
const systemHealth = ref([
  { name: 'CPU Usage', value: 45, status: 'healthy', color: 'bg-green-500' },
  { name: 'Memory Usage', value: 68, status: 'warning', color: 'bg-amber-500' },
  { name: 'Disk Space', value: 78, status: 'warning', color: 'bg-amber-500' },
  { name: 'API Response', value: 92, status: 'healthy', color: 'bg-green-500' },
]);

// Notifications
const notifications = ref([
  { title: 'System Update Available', message: 'Version 2.5.0 is ready to install', type: 'info', icon: Bell },
  { title: 'Low Disk Space', message: 'Server disk usage at 78%', type: 'warning', icon: Shield },
  { title: 'New User Signups', message: '24 new users today', type: 'success', icon: Users },
]);

// Quick Actions
const quickActions = ref([
  { label: 'Create User', icon: Users },
  { label: 'New Order', icon: ShoppingCart },
  { label: 'Generate Report', icon: FileText },
  { label: 'View Analytics', icon: TrendingUp },
  { label: 'Database Backup', icon: Database },
  { label: 'System Settings', icon: Settings },
]);

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    completed: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400',
    processing: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400',
    pending: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

const getNotificationType = (type: string) => {
  const types: Record<string, string> = {
    info: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800',
    warning: 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800',
    success: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
  };
  return types[type] || 'bg-gray-50';
};
</script>

<template>
  <div class="w-full space-y-4 sm:space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Admin Dashboard</h1>
        <p class="text-muted-foreground text-sm sm:text-base md:text-lg mt-1">
          Welcome back, {{ authStore.user?.name || 'Admin' }}! 👋
        </p>
      </div>
      <div class="flex gap-2 flex-wrap">
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="outline" class="gap-2 text-sm" size="sm">
              <Calendar class="h-4 w-4" />
              <span class="hidden sm:inline">Last 7 Days</span>
              <span class="sm:hidden">7 Days</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Last 24 Hours</DropdownMenuItem>
            <DropdownMenuItem>Last 7 Days</DropdownMenuItem>
            <DropdownMenuItem>Last 30 Days</DropdownMenuItem>
            <DropdownMenuItem>Last 90 Days</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button class="gap-2 text-sm" size="sm">
          <Download class="h-4 w-4" />
          <span class="hidden sm:inline">Export Report</span>
          <span class="sm:hidden">Export</span>
        </Button>
      </div>
    </div>

    <!-- Notifications -->
    <div class="grid gap-4 md:grid-cols-3">
      <Alert v-for="notification in notifications" :key="notification.title" :class="getNotificationType(notification.type)">
        <component :is="notification.icon" class="h-4 w-4" />
        <AlertTitle>{{ notification.title }}</AlertTitle>
        <AlertDescription>{{ notification.message }}</AlertDescription>
      </Alert>
    </div>

    <!-- Stats Grid -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card v-for="stat in stats" :key="stat.title" class="transition-all hover:shadow-lg">
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <p class="text-sm font-medium text-muted-foreground">{{ stat.title }}</p>
              <div class="flex items-baseline gap-2 mt-2">
                <h3 class="text-3xl font-bold">{{ stat.value }}</h3>
                <Badge :class="stat.trend === 'up' ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400'" variant="secondary">
                  <component :is="stat.trend === 'up' ? ArrowUpRight : ArrowDownRight" class="h-3 w-3 mr-1" />
                  {{ stat.change }}
                </Badge>
              </div>
            </div>
            <div :class="[stat.bgColor, 'p-3 rounded-lg']">
              <component :is="stat.icon" :class="[stat.color, 'h-6 w-6']" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Main Content Grid -->
    <div class="grid gap-6 lg:grid-cols-7">
      <!-- Recent Orders -->
      <Card class="lg:col-span-4">
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>You have {{ recentOrders.length }} orders today</CardDescription>
            </div>
            <Button variant="ghost" size="sm" class="gap-2">
              <Eye class="h-4 w-4" />
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div class="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow class="bg-muted/50">
                  <TableHead class="font-semibold min-w-[100px]">Order ID</TableHead>
                  <TableHead class="font-semibold min-w-[150px]">Customer</TableHead>
                  <TableHead class="font-semibold min-w-[100px]">Status</TableHead>
                  <TableHead class="font-semibold min-w-[100px]">Amount</TableHead>
                  <TableHead class="font-semibold min-w-[100px]">Date</TableHead>
                  <TableHead class="text-right font-semibold min-w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="order in recentOrders" :key="order.id" class="hover:bg-muted/30">
                  <TableCell class="font-medium">{{ order.id }}</TableCell>
                  <TableCell>
                    <div>
                      <p class="font-medium">{{ order.customer }}</p>
                      <p class="text-xs text-muted-foreground">{{ order.email }}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge :class="getStatusColor(order.status)" variant="secondary">
                      {{ order.status }}
                    </Badge>
                  </TableCell>
                  <TableCell class="font-semibold">{{ order.amount }}</TableCell>
                  <TableCell class="text-muted-foreground">{{ order.date }}</TableCell>
                  <TableCell class="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger as-child>
                        <Button variant="ghost" size="sm">
                          <MoreVertical class="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Process Order</DropdownMenuItem>
                        <DropdownMenuItem class="text-red-600">Cancel Order</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <!-- Right Sidebar -->
      <div class="lg:col-span-3 space-y-6">
        <!-- Recent Activity -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Activity class="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest system events</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div v-for="(activity, index) in recentActivity" :key="index" class="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                <div :class="['p-2 rounded-lg', activity.color.replace('text-', 'bg-').replace('600', '100') + ' dark:' + activity.color.replace('text-', 'bg-').replace('600', '950')]">
                  <component :is="activity.icon" :class="['h-4 w-4', activity.color]" />
                </div>
                <div class="flex-1 space-y-1">
                  <p class="text-sm font-medium">{{ activity.action }}</p>
                  <p class="text-xs text-muted-foreground">{{ activity.user }} • {{ activity.time }}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- System Health -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Zap class="h-5 w-5" />
              System Health
            </CardTitle>
            <CardDescription>Real-time monitoring</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div v-for="metric in systemHealth" :key="metric.name" class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium">{{ metric.name }}</span>
                <Badge :variant="metric.status === 'healthy' ? 'default' : 'secondary'" :class="metric.status === 'healthy' ? 'bg-green-500' : 'bg-amber-500'">
                  {{ metric.value }}%
                </Badge>
              </div>
              <Progress :value="metric.value" :class="metric.color" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Bottom Section -->
    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Top Products -->
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle class="flex items-center gap-2">
                <Package class="h-5 w-5" />
                Top Products
              </CardTitle>
              <CardDescription>Best performers this month</CardDescription>
            </div>
            <Button variant="outline" size="sm">View All</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="(product, index) in topProducts" :key="product.name" class="flex items-center gap-4 pb-4 border-b last:border-0 last:pb-0">
              <div :class="['flex h-10 w-10 items-center justify-center rounded-lg font-bold text-white', product.color]">
                {{ index + 1 }}
              </div>
              <div class="flex-1">
                <p class="font-medium">{{ product.name }}</p>
                <p class="text-sm text-muted-foreground">{{ product.sales }} sales</p>
              </div>
              <div class="text-right">
                <p class="font-semibold">{{ product.revenue }}</p>
                <Badge :variant="product.trend.startsWith('+') ? 'default' : 'secondary'">
                  {{ product.trend }}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Quick Actions -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Zap class="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>Frequently used shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-2 gap-3">
            <Button v-for="action in quickActions" :key="action.label" variant="outline" class="h-24 flex flex-col gap-2">
              <component :is="action.icon" class="h-6 w-6" />
              <span class="text-sm font-medium">{{ action.label }}</span>
            </Button>
          </div>
          <div class="mt-4 pt-4 border-t">
            <p class="text-sm text-muted-foreground mb-3">Need help?</p>
            <div class="flex gap-2">
              <Button variant="outline" size="sm" class="flex-1">
                <FileText class="h-4 w-4 mr-2" />
                Documentation
              </Button>
              <Button variant="outline" size="sm" class="flex-1">
                <MessageSquare class="h-4 w-4 mr-2" />
                Support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
