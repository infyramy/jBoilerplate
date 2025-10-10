<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Alert,
  AlertDescription
} from '@/components/ui/alert';
import {
  Server,
  Database,
  Settings,
  Activity,
  Clock,
  FileText,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Copy,
  ChevronLeft,
  ChevronRight,
  Filter,
  AlertTriangle
} from 'lucide-vue-next';
import { toast } from 'vue-sonner';

// System status data
const systemStatus = ref<any>(null);
const isLoadingStatus = ref(false);
const lastUpdated = ref<string>('');

// Logs data
const logs = ref<any[]>([]);
const isLoadingLogs = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const totalLogs = ref(0);

// Filters
const filterType = ref('');
const filterLevel = ref('');
const filterStartDate = ref('');
const filterEndDate = ref('');

// Auto-refresh
const autoRefresh = ref(false);
let refreshInterval: any = null;

// Abort controller for cancelling pending requests
let abortController: AbortController | null = null;

// Format uptime
const formatUptime = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
  if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
};

// Format timestamp
const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

// Load system status
const loadSystemStatus = async () => {
  isLoadingStatus.value = true;
  try {
    // Create new abort controller for this request
    if (abortController) {
      abortController.abort();
    }
    abortController = new AbortController();

    const response = await fetch('/api/system/status', {
      signal: abortController.signal
    });
    const data = await response.json();
    systemStatus.value = data;
    lastUpdated.value = new Date().toLocaleString();
  } catch (error: any) {
    // Ignore abort errors
    if (error.name !== 'AbortError') {
      toast.error('Failed to load system status: ' + error.message);
    }
  } finally {
    isLoadingStatus.value = false;
  }
};

// Load logs
const loadLogs = async () => {
  isLoadingLogs.value = true;
  try {
    const params = new URLSearchParams({
      page: currentPage.value.toString(),
      limit: '20'
    });

    if (filterType.value) params.append('type', filterType.value);
    if (filterLevel.value) params.append('level', filterLevel.value);
    if (filterStartDate.value) params.append('startDate', filterStartDate.value);
    if (filterEndDate.value) params.append('endDate', filterEndDate.value);

    // Use abort controller signal for logs requests too
    const signal = abortController?.signal;
    const response = await fetch(`/api/system/logs?${params}`, { signal });
    const data = await response.json();

    logs.value = data.logs;
    totalPages.value = data.pagination.pages;
    totalLogs.value = data.pagination.total;
  } catch (error: any) {
    // Ignore abort errors
    if (error.name !== 'AbortError') {
      toast.error('Failed to load logs: ' + error.message);
    }
  } finally {
    isLoadingLogs.value = false;
  }
};

// Copy to clipboard
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  toast.success('Copied to clipboard');
};

// Get badge variant for environment
const getEnvVariant = (env: string): string => {
  if (env === 'production') return 'destructive';
  if (env === 'staging') return 'secondary';
  return 'default';
};

// Get badge variant for log level
const getLevelVariant = (level: string): string => {
  if (level === 'error') return 'destructive';
  if (level === 'warn') return 'secondary';
  return 'default';
};

// Toggle auto-refresh
const toggleAutoRefresh = () => {
  autoRefresh.value = !autoRefresh.value;
  if (autoRefresh.value) {
    refreshInterval = setInterval(() => {
      loadSystemStatus();
      loadLogs();
    }, 30000); // Refresh every 30 seconds
  } else {
    if (refreshInterval) {
      clearInterval(refreshInterval);
      refreshInterval = null;
    }
  }
};

// Apply filters
const applyFilters = () => {
  currentPage.value = 1;
  loadLogs();
};

// Clear filters
const clearFilters = () => {
  filterType.value = '';
  filterLevel.value = '';
  filterStartDate.value = '';
  filterEndDate.value = '';
  currentPage.value = 1;
  loadLogs();
};

// Pagination
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    loadLogs();
  }
};

onMounted(() => {
  // Load initial data without blocking component mount
  Promise.allSettled([
    loadSystemStatus(),
    loadLogs()
  ]).catch(error => {
    console.error('Failed to load system status page:', error);
  });
});

onUnmounted(() => {
  // Clean up auto-refresh interval on component unmount
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
  // Ensure auto-refresh is turned off
  autoRefresh.value = false;

  // Cancel any pending fetch requests
  if (abortController) {
    abortController.abort();
    abortController = null;
  }
});
</script>

<template>
  <div class="container mx-auto space-y-6 p-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">System Status</h1>
        <p class="text-muted-foreground">
          Monitor system health, runtime metrics, and logs
        </p>
      </div>
      <div class="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          @click="toggleAutoRefresh"
          :class="{ 'bg-primary text-primary-foreground': autoRefresh }"
        >
          <Activity class="h-4 w-4 mr-2" />
          Auto-refresh {{ autoRefresh ? 'ON' : 'OFF' }}
        </Button>
        <Button
          variant="outline"
          size="sm"
          @click="() => { loadSystemStatus(); loadLogs(); }"
          :disabled="isLoadingStatus || isLoadingLogs"
        >
          <RefreshCw class="h-4 w-4 mr-2" :class="{ 'animate-spin': isLoadingStatus || isLoadingLogs }" />
          Refresh
        </Button>
      </div>
    </div>

    <!-- System Status Cards -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <!-- Environment -->
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Environment</CardTitle>
          <Server class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="flex items-center gap-2">
            <Badge :variant="getEnvVariant(systemStatus?.env || 'development')">
              {{ systemStatus?.env || 'Loading...' }}
            </Badge>
          </div>
          <p class="text-xs text-muted-foreground mt-2">
            Last updated: {{ lastUpdated || 'Never' }}
          </p>
        </CardContent>
      </Card>

      <!-- Database Status -->
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Database</CardTitle>
          <Database class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="flex items-center gap-2">
            <CheckCircle2 v-if="systemStatus?.db?.connected" class="h-4 w-4 text-green-500" />
            <AlertCircle v-else class="h-4 w-4 text-red-500" />
            <Badge :variant="systemStatus?.db?.connected ? 'default' : 'destructive'">
              {{ systemStatus?.db?.connected ? 'Connected' : 'Disconnected' }}
            </Badge>
          </div>
          <p class="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            {{ systemStatus?.db?.client }} - {{ systemStatus?.db?.database }}
            <Button
              v-if="systemStatus?.db?.host"
              variant="ghost"
              size="icon"
              class="h-4 w-4"
              @click="copyToClipboard(systemStatus?.db?.host)"
            >
              <Copy class="h-3 w-3" />
            </Button>
          </p>
        </CardContent>
      </Card>

      <!-- Config Source -->
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Config Source</CardTitle>
          <Settings class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="flex items-center gap-2">
            <Badge variant="secondary">
              {{ systemStatus?.configSource || 'default' }}
            </Badge>
            <AlertTriangle
              v-if="systemStatus?.configSource === 'default'"
              class="h-4 w-4 text-yellow-500"
              title="Using fallback configuration"
            />
          </div>
          <p class="text-xs text-muted-foreground mt-2">
            Modules loaded: {{ systemStatus?.modulesLoaded || 0 }}
          </p>
        </CardContent>
      </Card>

      <!-- Uptime -->
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Uptime</CardTitle>
          <Clock class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            {{ systemStatus?.uptimeMs ? formatUptime(systemStatus.uptimeMs) : '--' }}
          </div>
          <p class="text-xs text-muted-foreground mt-2">
            Response time: {{ systemStatus?.responseTime || 0 }}ms
          </p>
        </CardContent>
      </Card>
    </div>

    <!-- Fallback Config Warning -->
    <Alert v-if="systemStatus?.configSource === 'default'" variant="destructive">
      <AlertTriangle class="h-4 w-4" />
      <AlertDescription>
        System is operating on fallback configuration. Database or file-based config could not be loaded.
      </AlertDescription>
    </Alert>

    <!-- System Logs -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle class="flex items-center gap-2">
              <FileText class="h-5 w-5" />
              System Logs
            </CardTitle>
            <CardDescription>
              {{ totalLogs }} total log entries
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent class="space-y-4">
        <!-- Filters -->
        <div class="grid gap-4 md:grid-cols-4">
          <div class="space-y-2">
            <Label>Type</Label>
            <Select v-model="filterType">
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All types</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="audit">Audit</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="boot">Boot</SelectItem>
                <SelectItem value="migration">Migration</SelectItem>
                <SelectItem value="setup">Setup</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-2">
            <Label>Level</Label>
            <Select v-model="filterLevel">
              <SelectTrigger>
                <SelectValue placeholder="All levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All levels</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warn">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-2">
            <Label>Start Date</Label>
            <Input
              type="date"
              v-model="filterStartDate"
            />
          </div>

          <div class="space-y-2">
            <Label>End Date</Label>
            <Input
              type="date"
              v-model="filterEndDate"
            />
          </div>
        </div>

        <div class="flex gap-2">
          <Button @click="applyFilters" size="sm">
            <Filter class="h-4 w-4 mr-2" />
            Apply Filters
          </Button>
          <Button @click="clearFilters" variant="outline" size="sm">
            Clear
          </Button>
        </div>

        <!-- Logs Table -->
        <div class="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead class="w-[140px]">Time</TableHead>
                <TableHead class="w-[100px]">Type</TableHead>
                <TableHead class="w-[80px]">Level</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-if="isLoadingLogs">
                <TableCell colspan="4" class="text-center py-8">
                  <RefreshCw class="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
              <TableRow v-else-if="logs.length === 0">
                <TableCell colspan="4" class="text-center py-8 text-muted-foreground">
                  No logs found for the selected filters
                </TableCell>
              </TableRow>
              <TableRow v-else v-for="log in logs" :key="log.id">
                <TableCell class="font-mono text-xs">
                  {{ formatTimestamp(log.created_at) }}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{{ log.type }}</Badge>
                </TableCell>
                <TableCell>
                  <Badge :variant="getLevelVariant(log.level)">{{ log.level }}</Badge>
                </TableCell>
                <TableCell class="max-w-md truncate">{{ log.message }}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex items-center justify-between">
          <p class="text-sm text-muted-foreground">
            Page {{ currentPage }} of {{ totalPages }}
          </p>
          <div class="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
            >
              <ChevronLeft class="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
            >
              <ChevronRight class="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
