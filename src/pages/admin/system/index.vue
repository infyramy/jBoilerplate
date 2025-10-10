<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">System Settings</h1>
        <p class="text-muted-foreground">Manage critical system configurations</p>
      </div>
      <div class="flex space-x-2">
        <Badge variant="destructive" class="px-3 py-1">SuperAdmin Only</Badge>
        <Button variant="outline" @click="router.push('/admin/system/health')">
          <Activity class="mr-2 h-4 w-4" />
          Health Monitoring
        </Button>
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <!-- System Info Card -->
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>Core system details and statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-2">
              <div class="text-sm">System Version:</div>
              <div class="text-sm font-medium text-right">v{{ systemInfo.version }}</div>
              
              <div class="text-sm">Last Updated:</div>
              <div class="text-sm font-medium text-right">{{ systemInfo.lastUpdated }}</div>
              
              <div class="text-sm">Environment:</div>
              <div class="text-sm font-medium text-right">{{ systemInfo.environment }}</div>
              
              <div class="text-sm">Database Size:</div>
              <div class="text-sm font-medium text-right">{{ systemInfo.databaseSize }}</div>
              
              <div class="text-sm">File Storage:</div>
              <div class="text-sm font-medium text-right">{{ systemInfo.fileStorage }}</div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" class="w-full" @click="checkForUpdates">
            <RefreshCwIcon class="mr-2 h-4 w-4" />
            Check for Updates
          </Button>
        </CardFooter>
      </Card>

      <!-- Environment Variables -->
      <Card>
        <CardHeader>
          <CardTitle>Environment Variables</CardTitle>
          <CardDescription>Critical system configurations</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-2">
            <div v-for="env in systemEnvironment" :key="env.key" class="flex items-center justify-between">
              <div class="flex items-center">
                <span class="text-sm font-medium">{{ env.key }}</span>
              </div>
              <Badge variant="outline" class="font-mono">{{ env.masked ? '********' : env.value }}</Badge>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" class="w-full" @click="isEnvDialogOpen = true">
            <Settings class="mr-2 h-4 w-4" />
            Manage Environment
          </Button>
        </CardFooter>
      </Card>

      <!-- Cache Management -->
      <Card>
        <CardHeader>
          <CardTitle>Cache Management</CardTitle>
          <CardDescription>System caching controls</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div class="flex flex-col space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-sm">Application Cache:</span>
                <Badge variant="outline" :class="{'bg-green-100': cacheInfo.application.status === 'Enabled', 'bg-gray-100': cacheInfo.application.status !== 'Enabled'}">
                  {{ cacheInfo.application.status }}
                </Badge>
              </div>
              <div class="text-xs text-muted-foreground">
                Last cleared: {{ cacheInfo.application.lastCleared }}
              </div>
            </div>
            
            <div class="flex flex-col space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-sm">Route Cache:</span>
                <Badge variant="outline" :class="{'bg-green-100': cacheInfo.route.status === 'Enabled', 'bg-gray-100': cacheInfo.route.status !== 'Enabled'}">
                  {{ cacheInfo.route.status }}
                </Badge>
              </div>
              <div class="text-xs text-muted-foreground">
                Last cleared: {{ cacheInfo.route.lastCleared }}
              </div>
            </div>
            
            <div class="flex flex-col space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-sm">Configuration Cache:</span>
                <Badge variant="outline" :class="{'bg-green-100': cacheInfo.config.status === 'Enabled', 'bg-gray-100': cacheInfo.config.status !== 'Enabled'}">
                  {{ cacheInfo.config.status }}
                </Badge>
              </div>
              <div class="text-xs text-muted-foreground">
                Last cleared: {{ cacheInfo.config.lastCleared }}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" class="w-full" @click="clearAllCaches">
            <Trash2Icon class="mr-2 h-4 w-4" />
            Clear All Caches
          </Button>
        </CardFooter>
      </Card>
    </div>

    <!-- System Logs -->
    <Card>
      <CardHeader>
        <CardTitle>System Logs</CardTitle>
        <CardDescription>View and manage system event logs</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <!-- Log filter options -->
          <div class="flex items-center space-x-2">
            <Select v-model="logLevel">
              <SelectTrigger class="w-[180px]">
                <SelectValue placeholder="Filter by level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            
            <DatePicker v-model="logDate" class="flex-1 md:max-w-[200px]" />
            
            <Input 
              type="search" 
              placeholder="Search logs..." 
              class="flex-1 md:max-w-[300px]" 
              v-model="logSearch"
            />
          </div>
          
          <!-- Logs table -->
          <div class="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Context</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="log in filteredLogs" :key="log.id">
                  <TableCell>{{ log.timestamp }}</TableCell>
                  <TableCell>
                    <Badge 
                      :variant="log.level === 'error' || log.level === 'critical' ? 'destructive' : 'secondary'"
                      :class="{
                        'bg-blue-100 text-blue-800': log.level === 'info',
                        'bg-yellow-100 text-yellow-800': log.level === 'warning',
                        'bg-red-100 text-red-800': log.level === 'error',
                        'bg-red-200 text-red-900': log.level === 'critical'
                      }"
                    >
                      {{ log.level }}
                    </Badge>
                  </TableCell>
                  <TableCell>{{ log.message }}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" @click="viewLogDetails(log)">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
      <CardFooter class="flex justify-between">
        <Button variant="outline" @click="downloadLogs">
          <Download class="mr-2 h-4 w-4" />
          Download Logs
        </Button>
        <Button variant="destructive" @click="clearLogs">
          <Trash2 class="mr-2 h-4 w-4" />
          Clear Logs
        </Button>
      </CardFooter>
    </Card>

    <!-- Maintenance Mode -->
    <Card>
      <CardHeader>
        <CardTitle>Maintenance Mode</CardTitle>
        <CardDescription>Control system availability</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-medium">System Status</h3>
            <p class="text-sm text-muted-foreground">
              {{ maintenanceMode ? 'System is currently in maintenance mode' : 'System is currently online and available' }}
            </p>
          </div>
          <Switch 
            :checked="maintenanceMode" 
            @update:checked="toggleMaintenanceMode" 
          />
        </div>
        
        <div v-if="maintenanceMode" class="mt-4 rounded-md border p-4 bg-yellow-50 dark:bg-yellow-900/20">
          <div class="flex items-start">
            <AlertTriangle class="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-3 mt-0.5" />
            <div>
              <h4 class="text-sm font-medium text-yellow-800 dark:text-yellow-300">Maintenance Mode Active</h4>
              <p class="mt-1 text-sm text-yellow-700 dark:text-yellow-400">
                The system is currently in maintenance mode. Only administrators can access the system.
                All other users will see a maintenance page.
              </p>
              <div class="mt-2">
                <Input 
                  v-model="maintenanceMessage" 
                  class="mb-2"
                  placeholder="Maintenance message to display to users"
                />
                <Button variant="outline" size="sm" @click="updateMaintenanceMessage">
                  Update Message
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Environment Variables Dialog -->
    <Dialog v-model:open="isEnvDialogOpen">
      <DialogContent class="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Environment Variables</DialogTitle>
          <DialogDescription>
            Manage critical system environment variables. Changes may require a system restart.
          </DialogDescription>
        </DialogHeader>
        
        <div class="space-y-4 my-4">
          <div v-for="(env, index) in editableEnvironment" :key="index" class="flex items-start space-x-2">
            <div class="flex-1">
              <Label :for="`env-key-${index}`">Key</Label>
              <Input :id="`env-key-${index}`" v-model="env.key" />
            </div>
            <div class="flex-1">
              <Label :for="`env-value-${index}`">Value</Label>
              <div class="flex space-x-1">
                <Input 
                  :id="`env-value-${index}`" 
                  v-model="env.value" 
                  :type="env.masked ? 'password' : 'text'"
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  @click="env.masked = !env.masked"
                  class="flex-shrink-0"
                >
                  <Eye v-if="env.masked" class="h-4 w-4" />
                  <EyeOff v-else class="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div class="pt-6">
              <Button 
                variant="ghost" 
                size="icon"
                @click="removeEnvVar(index)"
              >
                <Trash2 class="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            @click="addEnvVar"
          >
            <Plus class="h-4 w-4 mr-2" />
            Add Variable
          </Button>
        </div>
        
        <DialogFooter>
          <Button variant="outline" @click="isEnvDialogOpen = false">Cancel</Button>
          <Button @click="saveEnvVars">Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Log Details Dialog -->
    <Dialog v-model:open="isLogDetailsOpen">
      <DialogContent class="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Log Details</DialogTitle>
          <DialogDescription>
            Detailed information about this log entry
          </DialogDescription>
        </DialogHeader>
        
        <div v-if="selectedLog" class="space-y-4 my-4">
          <div class="rounded-md border p-3">
            <div class="grid grid-cols-4 gap-2">
              <div class="text-sm font-medium">Timestamp:</div>
              <div class="col-span-3 text-sm">{{ selectedLog.timestamp }}</div>
              
              <div class="text-sm font-medium">Level:</div>
              <div class="col-span-3 text-sm">
                <Badge 
                  :variant="selectedLog.level === 'error' || selectedLog.level === 'critical' ? 'destructive' : 'secondary'"
                >
                  {{ selectedLog.level }}
                </Badge>
              </div>
              
              <div class="text-sm font-medium">Message:</div>
              <div class="col-span-3 text-sm">{{ selectedLog.message }}</div>
              
              <div class="text-sm font-medium">File:</div>
              <div class="col-span-3 text-sm font-mono text-xs">{{ selectedLog.context.file }}</div>
              
              <div class="text-sm font-medium">Line:</div>
              <div class="col-span-3 text-sm">{{ selectedLog.context.line }}</div>
              
              <div class="text-sm font-medium">User:</div>
              <div class="col-span-3 text-sm">{{ selectedLog.context.user || 'None' }}</div>
            </div>
          </div>
          
          <div class="space-y-2">
            <h4 class="text-sm font-medium">Stack Trace</h4>
            <div class="rounded-md bg-muted p-3 max-h-[200px] overflow-auto">
              <pre class="text-xs font-mono">{{ selectedLog.context.trace }}</pre>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" @click="isLogDetailsOpen = false">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertTriangle,
  Download,
  Eye,
  EyeOff,
  Plus,
  RefreshCw,
  Settings,
  Trash2,
  Activity,
} from "lucide-vue-next";
import { useRouter } from 'vue-router';

const router = useRouter();

// System Information
const systemInfo = ref({
  version: '1.2.3',
  lastUpdated: '2023-12-15',
  environment: 'Production',
  databaseSize: '1.2 GB',
  fileStorage: '6.8 GB / 10 GB',
});

// Environment Variables
const systemEnvironment = ref([
  { key: 'APP_ENV', value: 'production', masked: false },
  { key: 'DB_CONNECTION', value: 'mysql', masked: false },
  { key: 'DB_HOST', value: 'localhost', masked: false },
  { key: 'DB_PORT', value: '3306', masked: false },
  { key: 'DB_DATABASE', value: 'app_db', masked: false },
  { key: 'DB_USERNAME', value: 'dbuser', masked: true },
  { key: 'DB_PASSWORD', value: 'secret', masked: true },
  { key: 'MAIL_HOST', value: 'smtp.example.com', masked: false },
  { key: 'MAIL_PORT', value: '587', masked: false },
]);

// Cache Information
const cacheInfo = ref({
  application: {
    status: 'Enabled',
    lastCleared: '2023-12-10 15:45:22',
  },
  route: {
    status: 'Enabled',
    lastCleared: '2023-12-10 15:45:22',
  },
  config: {
    status: 'Enabled',
    lastCleared: '2023-12-10 15:45:22',
  },
});

// System Logs
const logs = ref([
  { id: 1, timestamp: '2023-12-15 08:45:22', level: 'info', message: 'System startup completed', context: { file: 'app/Bootstrap.php', line: 45, user: 'system', trace: 'Stack trace information...' } },
  { id: 2, timestamp: '2023-12-15 09:12:33', level: 'info', message: 'User login successful', context: { file: 'app/Http/Controllers/AuthController.php', line: 87, user: 'john@example.com', trace: '' } },
  { id: 3, timestamp: '2023-12-15 10:23:45', level: 'warning', message: 'High CPU usage detected', context: { file: 'app/Services/MonitoringService.php', line: 122, user: 'system', trace: 'Detailed CPU usage information...' } },
  { id: 4, timestamp: '2023-12-15 11:05:18', level: 'error', message: 'Database connection failed', context: { file: 'app/Services/DatabaseService.php', line: 56, user: 'system', trace: 'Connection error: Cannot connect to MySQL server...' } },
  { id: 5, timestamp: '2023-12-15 12:34:56', level: 'info', message: 'Backup completed successfully', context: { file: 'app/Jobs/BackupJob.php', line: 201, user: 'system', trace: '' } },
  { id: 6, timestamp: '2023-12-15 14:22:10', level: 'warning', message: 'Failed login attempt', context: { file: 'app/Http/Controllers/AuthController.php', line: 62, user: 'unknown', trace: 'IP: 192.168.1.105' } },
  { id: 7, timestamp: '2023-12-15 16:45:33', level: 'critical', message: 'Security breach detected', context: { file: 'app/Security/Monitor.php', line: 88, user: 'system', trace: 'Multiple failed login attempts from IP 203.0.113.42...' } },
]);

// Maintenance Mode
const maintenanceMode = ref(false);
const maintenanceMessage = ref('The system is currently under maintenance. Please check back later.');

// Dialog states
const isEnvDialogOpen = ref(false);
const isLogDetailsOpen = ref(false);
const editableEnvironment = ref([...systemEnvironment.value]);
const selectedLog = ref<any>(null);

// Log filtering
const logLevel = ref('all');
const logDate = ref(new Date());
const logSearch = ref('');

// Computed Properties
const filteredLogs = computed(() => {
  return logs.value.filter(log => {
    // Filter by level
    if (logLevel.value !== 'all' && log.level !== logLevel.value) {
      return false;
    }
    
    // Filter by search term
    if (logSearch.value && !log.message.toLowerCase().includes(logSearch.value.toLowerCase())) {
      return false;
    }
    
    // Filter by date (this is simplified - would need proper date comparison in real app)
    // In a real app, you would convert both to dates and compare them properly
    return true;
  });
});

// Methods
function checkForUpdates() {
  // In a real app, this would check for system updates
  console.log('Checking for system updates...');
  // Mock update check
  setTimeout(() => {
    console.log('System is up to date');
  }, 2000);
}

function clearAllCaches() {
  // In a real app, this would clear all system caches
  console.log('Clearing all system caches...');
  
  // Update last cleared timestamps
  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
  cacheInfo.value.application.lastCleared = now;
  cacheInfo.value.route.lastCleared = now;
  cacheInfo.value.config.lastCleared = now;
}

function toggleMaintenanceMode(value: boolean) {
  maintenanceMode.value = value;
  console.log(`Maintenance mode ${value ? 'enabled' : 'disabled'}`);
}

function updateMaintenanceMessage() {
  console.log(`Maintenance message updated: ${maintenanceMessage.value}`);
}

function downloadLogs() {
  console.log('Downloading system logs...');
}

function clearLogs() {
  console.log('Clearing system logs...');
  logs.value = [];
}

function viewLogDetails(log: any) {
  selectedLog.value = log;
  isLogDetailsOpen.value = true;
}

function addEnvVar() {
  editableEnvironment.value.push({ key: '', value: '', masked: false });
}

function removeEnvVar(index: number) {
  editableEnvironment.value.splice(index, 1);
}

function saveEnvVars() {
  // In a real app, this would save the environment variables to the server
  systemEnvironment.value = [...editableEnvironment.value];
  isEnvDialogOpen.value = false;
  console.log('Environment variables saved');
}
</script> 