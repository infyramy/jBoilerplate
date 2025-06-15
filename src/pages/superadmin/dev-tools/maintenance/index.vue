<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useConfigStore } from '@/stores/config';
import { useToast } from '@/composables/useToast';
import { Card } from '@/components/ui/card';
import { CardContent } from '@/components/ui/card';
import { CardDescription } from '@/components/ui/card';
import { CardFooter } from '@/components/ui/card';
import { CardHeader } from '@/components/ui/card';
import { CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { AlertDescription } from '@/components/ui/alert';
import { AlertTitle } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2, AlertTriangle, Clock, Calendar } from 'lucide-vue-next';

const configStore = useConfigStore();
const toast = useToast();

// State
const isLoading = ref(false);
const maintenanceMode = ref(false);
const maintenanceMessage = ref('');
const allowedIps = ref<string[]>([]);
const newIp = ref('');
const scheduleEnabled = ref(false);
const scheduleStart = ref('');
const scheduleEnd = ref('');

// Load maintenance settings from config store
const loadMaintenanceSettings = () => {
  isLoading.value = true;
  
  try {
    maintenanceMode.value = configStore.config.app.maintenanceMode;
    maintenanceMessage.value = configStore.config.app.maintenanceMessage;
    
    // In a real implementation, these would come from the config store as well
    allowedIps.value = ['127.0.0.1', '::1'];
    scheduleEnabled.value = false;
    scheduleStart.value = '';
    scheduleEnd.value = '';
  } catch (error) {
    console.error('Failed to load maintenance settings:', error);
    toast.error('Failed to load maintenance settings');
  } finally {
    isLoading.value = false;
  }
};

// Toggle maintenance mode
const toggleMaintenanceMode = async () => {
  isLoading.value = true;
  
  try {
    // Update config store
    await configStore.updateConfig('app', {
      maintenanceMode: !maintenanceMode.value
    });
    
    // Update local state
    maintenanceMode.value = !maintenanceMode.value;
    
    toast.success(`Maintenance mode ${maintenanceMode.value ? 'enabled' : 'disabled'}`);
  } catch (error) {
    console.error('Failed to toggle maintenance mode:', error);
    toast.error('Failed to toggle maintenance mode');
  } finally {
    isLoading.value = false;
  }
};

// Save maintenance message
const saveMaintenanceMessage = async () => {
  isLoading.value = true;
  
  try {
    // Update config store
    await configStore.updateConfig('app', {
      maintenanceMessage: maintenanceMessage.value
    });
    
    toast.success('Maintenance message saved');
  } catch (error) {
    console.error('Failed to save maintenance message:', error);
    toast.error('Failed to save maintenance message');
  } finally {
    isLoading.value = false;
  }
};

// Add IP to allowed list
const addIp = () => {
  if (!newIp.value) {
    toast.error('Please enter an IP address');
    return;
  }
  
  // Validate IP address format (basic validation)
  const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
  
  if (!ipv4Regex.test(newIp.value) && !ipv6Regex.test(newIp.value)) {
    toast.error('Invalid IP address format');
    return;
  }
  
  // Check if IP already exists
  if (allowedIps.value.includes(newIp.value)) {
    toast.error('IP address already in the list');
    return;
  }
  
  // Add IP to the list
  allowedIps.value.push(newIp.value);
  newIp.value = '';
  
  toast.success('IP address added to allowed list');
};

// Remove IP from allowed list
const removeIp = (ip: string) => {
  allowedIps.value = allowedIps.value.filter(i => i !== ip);
  toast.success('IP address removed from allowed list');
};

// Save scheduled maintenance
const saveSchedule = () => {
  if (scheduleEnabled.value && (!scheduleStart.value || !scheduleEnd.value)) {
    toast.error('Please set both start and end times');
    return;
  }
  
  // Validate dates
  if (scheduleEnabled.value) {
    const start = new Date(scheduleStart.value);
    const end = new Date(scheduleEnd.value);
    
    if (start >= end) {
      toast.error('End time must be after start time');
      return;
    }
    
    if (start < new Date()) {
      toast.error('Start time must be in the future');
      return;
    }
  }
  
  // In a real implementation, this would update the config store
  toast.success('Maintenance schedule saved');
};

onMounted(() => {
  loadMaintenanceSettings();
});
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Maintenance Mode</h1>
    
    <p class="text-muted-foreground mb-6">
      Enable maintenance mode to temporarily make the application unavailable to users
      while you perform updates or maintenance.
    </p>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Maintenance Mode Toggle -->
      <Card class="lg:col-span-3">
        <CardHeader>
          <CardTitle>Maintenance Mode</CardTitle>
          <CardDescription>
            When enabled, users will see a maintenance page instead of the application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="flex items-center justify-between">
            <div>
              <Label for="maintenance-mode">Maintenance Mode</Label>
              <p class="text-sm text-muted-foreground">
                {{ maintenanceMode ? 'The application is currently in maintenance mode' : 'The application is currently active' }}
              </p>
            </div>
            <Switch
              id="maintenance-mode"
              v-model="maintenanceMode"
              @click="toggleMaintenanceMode"
              :disabled="isLoading"
            />
          </div>
        </CardContent>
      </Card>
      
      <!-- Maintenance Message -->
      <Card class="lg:col-span-2">
        <CardHeader>
          <CardTitle>Maintenance Message</CardTitle>
          <CardDescription>
            Customize the message displayed to users during maintenance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label for="maintenance-message">Message</Label>
            <textarea
              id="maintenance-message"
              v-model="maintenanceMessage"
              class="min-h-[120px] w-full resize-y rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="We are currently performing scheduled maintenance. Please check back soon."
              :disabled="isLoading"
            ></textarea>
          </div>
        </CardContent>
        <CardFooter>
          <Button @click="saveMaintenanceMessage" :disabled="isLoading">
            <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            Save Message
          </Button>
        </CardFooter>
      </Card>
      
      <!-- IP Address Allowlist -->
      <Card class="lg:row-span-2">
        <CardHeader>
          <CardTitle>IP Address Allowlist</CardTitle>
          <CardDescription>
            Allow specific IP addresses to access the application during maintenance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div class="flex gap-2">
              <Input
                v-model="newIp"
                placeholder="Enter IP address"
                class="flex-1"
              />
              <Button variant="outline" @click="addIp">Add</Button>
            </div>
            
            <div class="space-y-2">
              <div v-if="allowedIps.length === 0" class="text-sm text-muted-foreground">
                No IP addresses in allowlist
              </div>
              
              <div
                v-for="ip in allowedIps"
                :key="ip"
                class="flex items-center justify-between rounded-md border px-3 py-2"
              >
                <span>{{ ip }}</span>
                <Button variant="ghost" size="sm" @click="removeIp(ip)">
                  <span class="sr-only">Remove</span>
                  <span>×</span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <!-- Scheduled Maintenance -->
      <Card class="lg:col-span-2">
        <CardHeader>
          <CardTitle>Schedule Maintenance</CardTitle>
          <CardDescription>
            Schedule maintenance mode to automatically enable and disable at specific times.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <Switch id="schedule-enabled" v-model="scheduleEnabled" />
              <Label for="schedule-enabled">Enable scheduled maintenance</Label>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4" :class="{ 'opacity-50': !scheduleEnabled }">
              <div>
                <Label for="schedule-start">Start Time</Label>
                <div class="relative">
                  <Calendar class="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="schedule-start"
                    type="datetime-local"
                    v-model="scheduleStart"
                    class="pl-10"
                    :disabled="!scheduleEnabled"
                  />
                </div>
              </div>
              
              <div>
                <Label for="schedule-end">End Time</Label>
                <div class="relative">
                  <Clock class="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="schedule-end"
                    type="datetime-local"
                    v-model="scheduleEnd"
                    class="pl-10"
                    :disabled="!scheduleEnabled"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button @click="saveSchedule" :disabled="!scheduleEnabled">
            Save Schedule
          </Button>
        </CardFooter>
      </Card>
      
      <!-- Warning -->
      <Card class="lg:col-span-3">
        <CardContent class="pt-6">
          <Alert variant="default" class="border-amber-500 bg-amber-50 text-amber-800 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-300">
            <AlertTriangle class="h-4 w-4" />
            <AlertTitle>Important Information</AlertTitle>
            <AlertDescription>
              <p>When maintenance mode is enabled:</p>
              <ul class="list-disc list-inside mt-2 ml-2 space-y-1">
                <li>All users except those with allowed IP addresses will see the maintenance page</li>
                <li>API endpoints will return 503 Service Unavailable responses</li>
                <li>Background jobs and scheduled tasks may still run depending on your configuration</li>
                <li>You will still be able to access the admin interface from allowed IP addresses</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  </div>
</template> 