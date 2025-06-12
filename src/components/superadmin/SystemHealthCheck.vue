<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useConfigStore } from '@/stores/config';
import { useToast } from '@/composables/useToast';
import { Card } from '@/components/ui/card';
import { CardContent } from '@/components/ui/card';
import { CardDescription } from '@/components/ui/card';
import { CardHeader } from '@/components/ui/card';
import { CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, CheckCircle, XCircle, AlertTriangle, RefreshCcw } from 'lucide-vue-next';

interface HealthStatus {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'error' | 'loading';
  message: string;
  details?: string;
  timestamp: Date;
}

interface SystemHealth {
  overall: 'healthy' | 'warning' | 'error' | 'loading';
  lastChecked: Date | null;
  checks: HealthStatus[];
}

const configStore = useConfigStore();
const toast = useToast();

// State
const systemHealth = ref<SystemHealth>({
  overall: 'loading',
  lastChecked: null,
  checks: []
});
const isLoading = ref(false);
const autoRefresh = ref(false);
const autoRefreshInterval = ref<number | null>(null);

// Run health check
const runHealthCheck = async () => {
  isLoading.value = true;
  systemHealth.value.overall = 'loading';
  
  // Update loading state for each check
  systemHealth.value.checks.forEach(check => {
    check.status = 'loading';
  });
  
  try {
    // In a real implementation, this would be an API call
    // For demonstration, we'll simulate API responses
    
    // Create initial checks if not existing
    if (systemHealth.value.checks.length === 0) {
      systemHealth.value.checks = [
        {
          id: 'database',
          name: 'Database Connection',
          status: 'loading',
          message: 'Checking database connection...',
          timestamp: new Date()
        },
        {
          id: 'api',
          name: 'API Services',
          status: 'loading',
          message: 'Checking API services...',
          timestamp: new Date()
        },
        {
          id: 'storage',
          name: 'Storage Service',
          status: 'loading',
          message: 'Checking storage service...',
          timestamp: new Date()
        },
        {
          id: 'email',
          name: 'Email Service',
          status: 'loading',
          message: 'Checking email service...',
          timestamp: new Date()
        },
        {
          id: 'cache',
          name: 'Cache System',
          status: 'loading',
          message: 'Checking cache system...',
          timestamp: new Date()
        },
        {
          id: 'jobs',
          name: 'Background Jobs',
          status: 'loading',
          message: 'Checking background jobs...',
          timestamp: new Date()
        }
      ];
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update each check with simulated results
    const updatedChecks = systemHealth.value.checks.map(check => {
      const now = new Date();
      
      // Generate random status for demonstration
      // In a real implementation, this would come from actual system checks
      const statuses: Array<'healthy' | 'warning' | 'error'> = ['healthy', 'warning', 'error'];
      const randomStatus = Math.random() < 0.7 ? 'healthy' : 
                          (Math.random() < 0.5 ? 'warning' : 'error');
      
      // Set status message based on the random status
      let message = '';
      let details = '';
      
      switch (check.id) {
        case 'database':
          if (randomStatus === 'healthy') {
            message = 'Database connection is stable';
            details = 'Connected to PostgreSQL 14.5, 25ms response time';
          } else if (randomStatus === 'warning') {
            message = 'Database connection is slow';
            details = 'Connected to PostgreSQL 14.5, 230ms response time (above threshold)';
          } else {
            message = 'Database connection failed';
            details = 'Error: Connection timeout after 5000ms';
          }
          break;
          
        case 'api':
          if (randomStatus === 'healthy') {
            message = 'All API services are operational';
            details = '15/15 endpoints responding normally';
          } else if (randomStatus === 'warning') {
            message = 'Some API services are degraded';
            details = '13/15 endpoints responding normally, 2 with high latency';
          } else {
            message = 'API services are down';
            details = 'Critical endpoints not responding';
          }
          break;
          
        case 'storage':
          if (randomStatus === 'healthy') {
            message = 'Storage service is operational';
            details = '82% capacity available, read/write operations normal';
          } else if (randomStatus === 'warning') {
            message = 'Storage service is running low on space';
            details = '15% capacity available, consider cleanup';
          } else {
            message = 'Storage service is full';
            details = 'Less than 5% capacity available, write operations may fail';
          }
          break;
          
        case 'email':
          if (randomStatus === 'healthy') {
            message = 'Email service is operational';
            details = 'Successfully sent test email in 430ms';
          } else if (randomStatus === 'warning') {
            message = 'Email service is experiencing delays';
            details = 'Test email sent after 3 retries';
          } else {
            message = 'Email service is down';
            details = 'Failed to send test email: SMTP connection error';
          }
          break;
          
        case 'cache':
          if (randomStatus === 'healthy') {
            message = 'Cache system is operational';
            details = 'Redis connected, 15ms response time';
          } else if (randomStatus === 'warning') {
            message = 'Cache system is degraded';
            details = 'Redis connected but slow, 180ms response time';
          } else {
            message = 'Cache system is down';
            details = 'Failed to connect to Redis';
          }
          break;
          
        case 'jobs':
          if (randomStatus === 'healthy') {
            message = 'Background jobs are processing normally';
            details = 'Queue length: 3, avg. processing time: 250ms';
          } else if (randomStatus === 'warning') {
            message = 'Background jobs are delayed';
            details = 'Queue length: 15, avg. processing time: 1200ms';
          } else {
            message = 'Background jobs are failing';
            details = 'Queue length: 42, multiple job failures detected';
          }
          break;
          
        default:
          message = randomStatus === 'healthy' ? 'System is healthy' : 
                    randomStatus === 'warning' ? 'System has warnings' : 'System has errors';
      }
      
      return {
        ...check,
        status: randomStatus,
        message,
        details,
        timestamp: now
      };
    });
    
    // Update checks
    systemHealth.value.checks = updatedChecks;
    
    // Determine overall status
    const hasError = updatedChecks.some(check => check.status === 'error');
    const hasWarning = updatedChecks.some(check => check.status === 'warning');
    
    if (hasError) {
      systemHealth.value.overall = 'error';
    } else if (hasWarning) {
      systemHealth.value.overall = 'warning';
    } else {
      systemHealth.value.overall = 'healthy';
    }
    
    // Update last checked timestamp
    systemHealth.value.lastChecked = new Date();
    
    toast.success('Health check completed');
  } catch (error) {
    console.error('Failed to run health check:', error);
    toast.error('Failed to run health check');
    
    // Set error status
    systemHealth.value.overall = 'error';
  } finally {
    isLoading.value = false;
  }
};

// Toggle auto refresh
const toggleAutoRefresh = () => {
  autoRefresh.value = !autoRefresh.value;
  
  if (autoRefresh.value) {
    // Start auto refresh
    autoRefreshInterval.value = window.setInterval(() => {
      runHealthCheck();
    }, 30000); // Refresh every 30 seconds
    
    toast.success('Auto-refresh enabled (every 30 seconds)');
  } else if (autoRefreshInterval.value !== null) {
    // Stop auto refresh
    clearInterval(autoRefreshInterval.value);
    autoRefreshInterval.value = null;
    
    toast.success('Auto-refresh disabled');
  }
};

// Format date
const formatDate = (date: Date) => {
  return date.toLocaleString();
};

// Get status color
const getStatusColor = (status: 'healthy' | 'warning' | 'error' | 'loading') => {
  switch (status) {
    case 'healthy':
      return 'bg-green-500';
    case 'warning':
      return 'bg-yellow-500';
    case 'error':
      return 'bg-red-500';
    case 'loading':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
};

// Get status badge variant
const getStatusBadgeVariant = (status: 'healthy' | 'warning' | 'error' | 'loading') => {
  switch (status) {
    case 'healthy':
      return 'default';
    case 'warning':
      return 'secondary';
    case 'error':
      return 'destructive';
    case 'loading':
      return 'outline';
    default:
      return 'outline';
  }
};

// Get status icon
const getStatusIcon = (status: 'healthy' | 'warning' | 'error' | 'loading') => {
  switch (status) {
    case 'healthy':
      return CheckCircle;
    case 'warning':
      return AlertTriangle;
    case 'error':
      return XCircle;
    case 'loading':
      return Loader2;
    default:
      return AlertTriangle;
  }
};

// Clean up on component unmount
onUnmounted(() => {
  if (autoRefreshInterval.value !== null) {
    clearInterval(autoRefreshInterval.value);
  }
});

// Initialize on component mount
onMounted(() => {
  runHealthCheck();
});
</script>

<template>
  <Card>
    <CardHeader>
      <div class="flex items-center justify-between">
        <div>
          <CardTitle>System Health Check</CardTitle>
          <CardDescription>
            Monitor the health and performance of system components
          </CardDescription>
        </div>
        <div class="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            @click="toggleAutoRefresh"
            :class="{ 'bg-primary/10': autoRefresh }"
          >
            <RefreshCcw class="mr-2 h-4 w-4" :class="{ 'animate-spin': autoRefresh }" />
            {{ autoRefresh ? 'Auto-refreshing' : 'Auto-refresh' }}
          </Button>
          <Button size="sm" @click="runHealthCheck" :disabled="isLoading">
            <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            <span v-else>Run Check</span>
          </Button>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div class="space-y-6">
        <!-- Overall Status -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-lg font-semibold">Overall Status:</span>
            <Badge :variant="getStatusBadgeVariant(systemHealth.overall)" class="capitalize">
              <component :is="getStatusIcon(systemHealth.overall)" 
                class="mr-1 h-3 w-3"
                :class="{ 'animate-spin': systemHealth.overall === 'loading' }" 
              />
              {{ systemHealth.overall }}
            </Badge>
          </div>
          <div v-if="systemHealth.lastChecked" class="text-sm text-muted-foreground">
            Last checked: {{ formatDate(systemHealth.lastChecked) }}
          </div>
        </div>
        
        <!-- Status Table -->
        <div class="rounded-md border">
          <div class="grid grid-cols-12 border-b px-4 py-3 font-medium">
            <div class="col-span-3">Service</div>
            <div class="col-span-2">Status</div>
            <div class="col-span-7">Details</div>
          </div>
          
          <div v-if="systemHealth.checks.length === 0 && !isLoading" class="px-4 py-8 text-center text-muted-foreground">
            No health check data available. Click "Run Check" to begin.
          </div>
          
          <div v-else-if="isLoading && systemHealth.checks.length === 0" class="px-4 py-8 text-center">
            <Loader2 class="mx-auto h-8 w-8 animate-spin text-primary" />
            <p class="mt-2 text-muted-foreground">Running initial health check...</p>
          </div>
          
          <div v-else>
            <div v-for="check in systemHealth.checks" :key="check.id" class="grid grid-cols-12 border-b px-4 py-3 last:border-0">
              <div class="col-span-3 font-medium">{{ check.name }}</div>
              <div class="col-span-2">
                <div class="flex items-center gap-2">
                  <span class="relative flex h-3 w-3">
                    <span class="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" :class="getStatusColor(check.status)"></span>
                    <span class="relative inline-flex h-3 w-3 rounded-full" :class="getStatusColor(check.status)"></span>
                  </span>
                  <span class="capitalize" :class="{
                    'text-green-600 dark:text-green-400': check.status === 'healthy',
                    'text-yellow-600 dark:text-yellow-400': check.status === 'warning',
                    'text-red-600 dark:text-red-400': check.status === 'error',
                    'text-blue-600 dark:text-blue-400': check.status === 'loading'
                  }">
                    {{ check.status }}
                  </span>
                </div>
              </div>
              <div class="col-span-7">
                <p>{{ check.message }}</p>
                <p v-if="check.details" class="text-sm text-muted-foreground">
                  {{ check.details }}
                </p>
                <Progress v-if="check.status === 'loading'" class="mt-2 h-1" value="indefinite" />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Actions -->
        <div class="flex justify-end">
          <Button variant="outline" size="sm" @click="runHealthCheck" :disabled="isLoading">
            <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            <span v-else>Refresh Status</span>
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template> 