<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useConfigStore } from '@/stores/config';
import { useToast } from '@/composables/useToast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Download, Calendar, FileText, User, Filter, X } from 'lucide-vue-next';
import { format } from 'date-fns';

const configStore = useConfigStore();
const toast = useToast();

const isLoading = ref(false);
const showDetails = ref(false);
const selectedLog = ref<any>(null);

// Filter states
const dateRange = ref<{ from: string; to: string }>({
  from: format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), // Last 7 days
  to: format(new Date(), 'yyyy-MM-dd')
});
const logTypeFilter = ref('all');
const userFilter = ref('all');
const searchFilter = ref('');

// Log types
const logTypes = [
  { id: 'all', label: 'All Types' },
  { id: 'auth', label: 'Authentication' },
  { id: 'config', label: 'Configuration' },
  { id: 'system', label: 'System' },
  { id: 'error', label: 'Error' }
];

// Users for filter
const users = [
  { id: 'all', name: 'All Users' },
  { id: 'admin', name: 'Admin' },
  { id: 'system', name: 'System' },
  { id: 'john.doe', name: 'John Doe' },
  { id: 'jane.smith', name: 'Jane Smith' }
];

// Mock logs data
const logs = ref([
  {
    id: 1,
    timestamp: '2023-06-05T16:30:00Z',
    user: 'admin',
    action: 'Config Changed',
    type: 'config',
    details: 'Changed theme settings: primaryColor from #4f46e5 to #3b82f6',
    ip: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  },
  {
    id: 2,
    timestamp: '2023-06-05T15:45:00Z',
    user: 'system',
    action: 'Backup Created',
    type: 'system',
    details: 'Daily automatic backup created successfully. Size: 24.5MB',
    ip: 'localhost',
    userAgent: 'System Scheduler'
  },
  {
    id: 3,
    timestamp: '2023-06-05T14:20:00Z',
    user: 'john.doe',
    action: 'Login Failed',
    type: 'auth',
    details: 'Failed login attempt for user john.doe. Reason: Invalid password',
    ip: '203.0.113.42',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
  },
  {
    id: 4,
    timestamp: '2023-06-05T14:15:00Z',
    user: 'jane.smith',
    action: 'Login Success',
    type: 'auth',
    details: 'User jane.smith logged in successfully',
    ip: '198.51.100.73',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
  },
  {
    id: 5,
    timestamp: '2023-06-05T12:30:00Z',
    user: 'admin',
    action: 'Role Created',
    type: 'config',
    details: 'Created new role: Editor with permissions: view_content, edit_content, publish_content',
    ip: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  },
  {
    id: 6,
    timestamp: '2023-06-05T10:15:00Z',
    user: 'system',
    action: 'Error Occurred',
    type: 'error',
    details: 'Database connection error: ETIMEDOUT connecting to database server at db.example.com:5432',
    ip: 'localhost',
    userAgent: 'System Service'
  },
  {
    id: 7,
    timestamp: '2023-06-04T09:20:00Z',
    user: 'admin',
    action: 'User Created',
    type: 'system',
    details: 'Created new user account for marketing@example.com with role: Marketing',
    ip: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  },
  {
    id: 8,
    timestamp: '2023-06-04T08:45:00Z',
    user: 'jane.smith',
    action: 'Content Updated',
    type: 'system',
    details: 'Updated homepage content and hero section images',
    ip: '198.51.100.73',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
  }
]);

// Filtered logs based on search, date range, type, and user
const filteredLogs = computed(() => {
  let filtered = logs.value;
  
  // Filter by date range
  if (dateRange.value.from && dateRange.value.to) {
    const fromDate = new Date(dateRange.value.from);
    const toDate = new Date(dateRange.value.to);
    toDate.setHours(23, 59, 59, 999); // End of day
    
    filtered = filtered.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate >= fromDate && logDate <= toDate;
    });
  }
  
  // Filter by log type
  if (logTypeFilter.value !== 'all') {
    filtered = filtered.filter(log => log.type === logTypeFilter.value);
  }
  
  // Filter by user
  if (userFilter.value !== 'all') {
    filtered = filtered.filter(log => log.user === userFilter.value);
  }
  
  // Filter by search term
  if (searchFilter.value) {
    const searchTerm = searchFilter.value.toLowerCase();
    filtered = filtered.filter(log => 
      log.action.toLowerCase().includes(searchTerm) ||
      log.details.toLowerCase().includes(searchTerm) ||
      log.user.toLowerCase().includes(searchTerm)
    );
  }
  
  return filtered;
});

// Format timestamp for display
function formatDate(timestamp: string) {
  return new Date(timestamp).toLocaleString();
}

// Show log details
function showLogDetails(log: any) {
  selectedLog.value = log;
  showDetails.value = true;
}

// Export logs to CSV
function exportLogs() {
  isLoading.value = true;
  
  try {
    // In a real implementation, this would generate and download a CSV file
    setTimeout(() => {
      toast.success('Logs exported successfully');
      isLoading.value = false;
    }, 1000);
  } catch (error) {
    console.error(error);
    toast.error('Failed to export logs');
    isLoading.value = false;
  }
}

// Clear all filters
function clearFilters() {
  dateRange.value = {
    from: format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    to: format(new Date(), 'yyyy-MM-dd')
  };
  logTypeFilter.value = 'all';
  userFilter.value = 'all';
  searchFilter.value = '';
}

// Load logs (in a real implementation, this would load from an API)
function loadLogs() {
  isLoading.value = true;
  
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
}

onMounted(() => {
  loadLogs();
});

// Define route meta for Vue Router
defineOptions({
  name: 'SuperadminLogs',
  meta: {
    layout: "dashboard",
    requiresAuth: true,
    roles: ["superadmin"]
  }
});
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-2">Logs & Activity</h1>
    <p class="text-muted-foreground mb-6">
      Monitor system events and user activity across the platform
    </p>
    
    <Card class="mb-6">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
        <CardDescription>Filter logs by date, type, and user</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="space-y-2">
            <Label for="date-from">Date Range</Label>
            <div class="flex gap-2 items-center">
              <Input 
                id="date-from" 
                v-model="dateRange.from" 
                type="date" 
                class="w-full"
              />
              <span>to</span>
              <Input 
                id="date-to" 
                v-model="dateRange.to" 
                type="date" 
                class="w-full"
              />
            </div>
          </div>
          
          <div class="space-y-2">
            <Label for="log-type">Log Type</Label>
            <Select id="log-type" v-model="logTypeFilter" class="w-full">
              <option v-for="type in logTypes" :key="type.id" :value="type.id">
                {{ type.label }}
              </option>
            </Select>
          </div>
          
          <div class="space-y-2">
            <Label for="user">User</Label>
            <Select id="user" v-model="userFilter" class="w-full">
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.name }}
              </option>
            </Select>
          </div>
          
          <div class="space-y-2">
            <Label for="search">Search</Label>
            <Input 
              id="search" 
              v-model="searchFilter" 
              placeholder="Search logs..." 
              class="w-full"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter class="flex justify-between">
        <Button variant="outline" @click="clearFilters" class="flex items-center gap-2">
          <X class="h-4 w-4" />
          <span>Clear Filters</span>
        </Button>
        <Button @click="exportLogs" class="flex items-center gap-2" :disabled="isLoading">
          <Download class="h-4 w-4" />
          <span>Export Logs</span>
        </Button>
      </CardFooter>
    </Card>
    
    <Card>
      <CardHeader>
        <CardTitle>Activity Logs</CardTitle>
        <CardDescription>
          Showing {{ filteredLogs.length }} logs
          <span v-if="logTypeFilter !== 'all'"> of type {{ logTypeFilter }}</span>
          <span v-if="userFilter !== 'all'"> for user {{ userFilter }}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="isLoading" class="flex justify-center py-8">
          <Loader2 class="h-8 w-8 animate-spin text-primary" />
        </div>
        <div v-else-if="filteredLogs.length === 0" class="text-center py-8 text-muted-foreground">
          No logs found matching the current filters.
        </div>
        <Table v-else>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Details</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="log in filteredLogs" :key="log.id">
              <TableCell>{{ formatDate(log.timestamp) }}</TableCell>
              <TableCell>{{ log.user }}</TableCell>
              <TableCell>{{ log.action }}</TableCell>
              <TableCell>
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="{
                    'bg-blue-100 text-blue-800': log.type === 'auth',
                    'bg-green-100 text-green-800': log.type === 'system',
                    'bg-purple-100 text-purple-800': log.type === 'config',
                    'bg-red-100 text-red-800': log.type === 'error'
                  }"
                >
                  {{ log.type }}
                </span>
              </TableCell>
              <TableCell class="truncate max-w-xs">{{ log.details }}</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" @click="showLogDetails(log)">
                  Details
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
    
    <!-- Log Details Dialog -->
    <Dialog v-model:open="showDetails">
      <DialogContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Log Details</DialogTitle>
          <DialogDescription>
            Detailed information about this log entry
          </DialogDescription>
        </DialogHeader>
        
        <div v-if="selectedLog" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <h3 class="text-sm font-medium text-muted-foreground">Timestamp</h3>
              <p class="flex items-center gap-2 mt-1">
                <Calendar class="h-4 w-4 text-muted-foreground" />
                {{ formatDate(selectedLog.timestamp) }}
              </p>
            </div>
            <div>
              <h3 class="text-sm font-medium text-muted-foreground">User</h3>
              <p class="flex items-center gap-2 mt-1">
                <User class="h-4 w-4 text-muted-foreground" />
                {{ selectedLog.user }}
              </p>
            </div>
          </div>
          
          <div>
            <h3 class="text-sm font-medium text-muted-foreground">Action</h3>
            <p class="mt-1 font-medium">{{ selectedLog.action }}</p>
          </div>
          
          <div>
            <h3 class="text-sm font-medium text-muted-foreground">Type</h3>
            <p class="mt-1">
              <span 
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="{
                  'bg-blue-100 text-blue-800': selectedLog.type === 'auth',
                  'bg-green-100 text-green-800': selectedLog.type === 'system',
                  'bg-purple-100 text-purple-800': selectedLog.type === 'config',
                  'bg-red-100 text-red-800': selectedLog.type === 'error'
                }"
              >
                {{ selectedLog.type }}
              </span>
            </p>
          </div>
          
          <div>
            <h3 class="text-sm font-medium text-muted-foreground">Details</h3>
            <p class="mt-1">{{ selectedLog.details }}</p>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <h3 class="text-sm font-medium text-muted-foreground">IP Address</h3>
              <p class="mt-1">{{ selectedLog.ip }}</p>
            </div>
            <div>
              <h3 class="text-sm font-medium text-muted-foreground">User Agent</h3>
              <p class="mt-1 text-sm">{{ selectedLog.userAgent }}</p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button @click="showDetails = false">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template> 