<template>
  <div class="space-y-6 max-w-5xl mx-auto">
    <header class="mb-6">
      <h1 class="text-3xl font-bold tracking-tight mb-2">System Health</h1>
      <p class="text-muted-foreground">Monitor the status and performance of your application</p>
    </header>

    <!-- System Status -->
    <Card class="mb-6">
      <CardHeader class="pb-3">
        <div class="flex items-center justify-between">
          <CardTitle>System Status</CardTitle>
          <Button size="sm" @click="refreshStatus">
            <RefreshCw class="h-4 w-4 mr-2" :class="{ 'animate-spin': isRefreshing }" />
            Refresh
          </Button>
        </div>
        <CardDescription>Current status of system components</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatusCard
            title="API Server"
            :status="healthStatus.api.status"
            :description="healthStatus.api.message"
            :timestamp="healthStatus.api.timestamp"
          />
          <StatusCard
            title="Database"
            :status="healthStatus.database.status"
            :description="healthStatus.database.message"
            :timestamp="healthStatus.database.timestamp"
          />
          <StatusCard
            title="Email Service"
            :status="healthStatus.email.status"
            :description="healthStatus.email.message"
            :timestamp="healthStatus.email.timestamp"
          />
          <StatusCard
            title="Authentication"
            :status="healthStatus.auth.status"
            :description="healthStatus.auth.message"
            :timestamp="healthStatus.auth.timestamp"
          />
          <StatusCard
            title="File Storage"
            :status="healthStatus.storage.status"
            :description="healthStatus.storage.message"
            :timestamp="healthStatus.storage.timestamp"
          />
          <StatusCard
            title="Job Queue"
            :status="healthStatus.queue.status"
            :description="healthStatus.queue.message"
            :timestamp="healthStatus.queue.timestamp"
          />
        </div>
      </CardContent>
    </Card>

    <!-- Performance Metrics -->
    <Card class="mb-6">
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
        <CardDescription>System performance over the last 24 hours</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="response-time">
          <TabsList class="mb-4">
            <TabsTrigger value="response-time">Response Time</TabsTrigger>
            <TabsTrigger value="cpu-usage">CPU Usage</TabsTrigger>
            <TabsTrigger value="memory-usage">Memory Usage</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="response-time">
            <div class="h-[300px] flex items-center justify-center bg-muted/50 rounded-lg">
              <div class="text-center text-muted-foreground">
                <p>Response Time Chart</p>
                <p class="text-xs">Chart visualization would appear here</p>
              </div>
            </div>
            <div class="mt-4 flex items-center justify-between">
              <div>
                <div class="text-2xl font-bold">124ms</div>
                <div class="text-sm text-muted-foreground">Average Response Time</div>
              </div>
              <div>
                <div class="text-2xl font-bold">98ms</div>
                <div class="text-sm text-muted-foreground">Median Response Time</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-destructive">789ms</div>
                <div class="text-sm text-muted-foreground">Max Response Time</div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="cpu-usage">
            <div class="h-[300px] flex items-center justify-center bg-muted/50 rounded-lg">
              <div class="text-center text-muted-foreground">
                <p>CPU Usage Chart</p>
                <p class="text-xs">Chart visualization would appear here</p>
              </div>
            </div>
            <div class="mt-4 flex items-center justify-between">
              <div>
                <div class="text-2xl font-bold">32%</div>
                <div class="text-sm text-muted-foreground">Average CPU Usage</div>
              </div>
              <div>
                <div class="text-2xl font-bold">28%</div>
                <div class="text-sm text-muted-foreground">Median CPU Usage</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-destructive">78%</div>
                <div class="text-sm text-muted-foreground">Max CPU Usage</div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="memory-usage">
            <div class="h-[300px] flex items-center justify-center bg-muted/50 rounded-lg">
              <div class="text-center text-muted-foreground">
                <p>Memory Usage Chart</p>
                <p class="text-xs">Chart visualization would appear here</p>
              </div>
            </div>
            <div class="mt-4 flex items-center justify-between">
              <div>
                <div class="text-2xl font-bold">512MB</div>
                <div class="text-sm text-muted-foreground">Average Memory Usage</div>
              </div>
              <div>
                <div class="text-2xl font-bold">480MB</div>
                <div class="text-sm text-muted-foreground">Median Memory Usage</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-destructive">1.2GB</div>
                <div class="text-sm text-muted-foreground">Max Memory Usage</div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="requests">
            <div class="h-[300px] flex items-center justify-center bg-muted/50 rounded-lg">
              <div class="text-center text-muted-foreground">
                <p>Requests Chart</p>
                <p class="text-xs">Chart visualization would appear here</p>
              </div>
            </div>
            <div class="mt-4 flex items-center justify-between">
              <div>
                <div class="text-2xl font-bold">13,428</div>
                <div class="text-sm text-muted-foreground">Total Requests</div>
              </div>
              <div>
                <div class="text-2xl font-bold">560</div>
                <div class="text-sm text-muted-foreground">Requests Per Hour</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-destructive">42</div>
                <div class="text-sm text-muted-foreground">Error Rate (0.31%)</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>

    <!-- Recent Errors -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <CardTitle>Recent Errors</CardTitle>
          <Button variant="outline" size="sm">
            <FileDown class="h-4 w-4 mr-2" />
            Export Logs
          </Button>
        </div>
        <CardDescription>System errors from the last 24 hours</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Message</TableHead>
                <TableHead class="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="(error, index) in recentErrors" :key="index">
                <TableCell>
                  <div class="font-medium">{{ formatDate(error.timestamp) }}</div>
                  <div class="text-xs text-muted-foreground">{{ formatTime(error.timestamp) }}</div>
                </TableCell>
                <TableCell>{{ error.service }}</TableCell>
                <TableCell>
                  <Badge :variant="getErrorVariant(error.type)">
                    {{ error.type }}
                  </Badge>
                </TableCell>
                <TableCell class="max-w-md truncate">{{ error.message }}</TableCell>
                <TableCell class="text-right">
                  <Button variant="ghost" size="icon">
                    <EyeIcon class="h-4 w-4" />
                    <span class="sr-only">View details</span>
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        
        <div class="mt-4 flex items-center justify-between">
          <div class="text-sm text-muted-foreground">
            Showing 10 of 42 errors
          </div>
          <div class="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft class="h-4 w-4" />
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
              <ChevronRight class="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  RefreshCw, 
  FileDown,
  Eye as EyeIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-vue-next';
import StatusCard from '@/components/StatusCard.vue';

// Status refresh state
const isRefreshing = ref(false);

// System health status
const healthStatus = ref({
  api: { 
    status: 'healthy', 
    message: 'API server is running normally',
    timestamp: new Date()
  },
  database: { 
    status: 'healthy', 
    message: 'Database connections are stable',
    timestamp: new Date()
  },
  email: { 
    status: 'degraded', 
    message: 'Delivery delays of ~5 minutes',
    timestamp: new Date()
  },
  auth: { 
    status: 'healthy', 
    message: 'Authentication services are operational',
    timestamp: new Date()
  },
  storage: { 
    status: 'healthy', 
    message: 'File storage is accessible',
    timestamp: new Date()
  },
  queue: { 
    status: 'critical', 
    message: 'Job queue is experiencing failures',
    timestamp: new Date()
  }
});

// Generate mock time series data for charts
const generateTimeSeriesData = (hours = 24, baseValue = 100, volatility = 0.3) => {
  const data = [];
  const now = new Date();
  
  for (let i = hours; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const timeStr = time.toISOString().slice(11, 16); // Format: HH:MM
    const randomFactor = 1 + (Math.random() * volatility * 2 - volatility);
    const value = Math.round(baseValue * randomFactor);
    
    data.push({
      time: timeStr,
      value
    });
  }
  
  return data;
};

// Performance metrics data
const performanceData = ref({
  responseTime: generateTimeSeriesData(24, 120, 0.5),
  cpuUsage: generateTimeSeriesData(24, 30, 0.4),
  memoryUsage: generateTimeSeriesData(24, 500, 0.3),
  requests: generateTimeSeriesData(24, 550, 0.2)
});

// Recent errors
const recentErrors = ref([
  {
    timestamp: new Date(new Date().getTime() - 35 * 60 * 1000),
    service: 'API Server',
    type: 'Error',
    message: 'Failed to process payment: Gateway timeout'
  },
  {
    timestamp: new Date(new Date().getTime() - 2 * 60 * 60 * 1000),
    service: 'Job Queue',
    type: 'Critical',
    message: 'Email notification queue processor crashed'
  },
  {
    timestamp: new Date(new Date().getTime() - 3 * 60 * 60 * 1000),
    service: 'Database',
    type: 'Warning',
    message: 'Slow query detected: SELECT * FROM users JOIN orders...'
  },
  {
    timestamp: new Date(new Date().getTime() - 5 * 60 * 60 * 1000),
    service: 'Auth Service',
    type: 'Error',
    message: 'Rate limit exceeded for IP 192.168.1.254'
  },
  {
    timestamp: new Date(new Date().getTime() - 7 * 60 * 60 * 1000),
    service: 'File Storage',
    type: 'Warning',
    message: 'Low disk space warning: 85% usage'
  },
  {
    timestamp: new Date(new Date().getTime() - 8 * 60 * 60 * 1000),
    service: 'API Server',
    type: 'Error',
    message: 'Unhandled exception in user registration endpoint'
  },
  {
    timestamp: new Date(new Date().getTime() - 10 * 60 * 60 * 1000),
    service: 'Job Queue',
    type: 'Error',
    message: 'Failed to process background task: report generation'
  },
  {
    timestamp: new Date(new Date().getTime() - 15 * 60 * 60 * 1000),
    service: 'Email Service',
    type: 'Warning',
    message: 'Throttled by email provider: sending too quickly'
  },
  {
    timestamp: new Date(new Date().getTime() - 18 * 60 * 60 * 1000),
    service: 'API Server',
    type: 'Info',
    message: 'Scheduled maintenance started'
  },
  {
    timestamp: new Date(new Date().getTime() - 22 * 60 * 60 * 1000),
    service: 'Database',
    type: 'Critical',
    message: 'Connection pool exhausted'
  }
]);

// Refresh system status
const refreshStatus = async () => {
  isRefreshing.value = true;
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update timestamps to be current
    (Object.keys(healthStatus.value) as Array<keyof typeof healthStatus.value>).forEach(key => {
      healthStatus.value[key].timestamp = new Date();
    });
  } finally {
    isRefreshing.value = false;
  }
};

// Format date for display
const formatDate = (date: Date): string => {
  return date.toLocaleDateString();
};

// Format time for display
const formatTime = (date: Date): string => {
  return date.toLocaleTimeString();
};

// Get badge variant based on error type
const getErrorVariant = (type: string): 'default' | 'destructive' | 'outline' | 'secondary' => {
  switch (type.toLowerCase()) {
    case 'critical':
      return 'destructive';
    case 'error':
      return 'destructive';
    case 'warning':
      return 'secondary';
    case 'info':
      return 'default';
    default:
      return 'outline';
  }
};

// Initialize component
onMounted(() => {
  // Initial data load would happen here in a real app
});
</script> 