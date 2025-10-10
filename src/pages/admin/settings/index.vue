<template>
  <div class="space-y-6">
    <header class="mb-6">
      <h1 class="text-2xl font-bold tracking-tight">Admin Settings</h1>
      <p class="text-muted-foreground">Configure admin-level settings and user preferences</p>
    </header>
    
    <div v-if="isLoading" class="flex justify-center items-center min-h-[400px]">
      <div class="flex flex-col items-center gap-2">
        <Loader2 class="h-8 w-8 animate-spin text-primary" />
        <p class="text-muted-foreground">Loading settings...</p>
      </div>
    </div>
    
    <div v-else>
      <!-- Settings Tabs -->
      <Tabs defaultValue="admin" class="w-full">
        <TabsList class="grid grid-cols-2 w-[400px]">
          <TabsTrigger value="admin">Admin Settings</TabsTrigger>
          <TabsTrigger value="user">User Settings</TabsTrigger>
        </TabsList>

        <!-- Admin Settings Tab -->
        <TabsContent value="admin">
          <!-- User Management Settings -->
          <Card class="mb-6">
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Configure user management settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="grid gap-6">
                <div class="flex items-center justify-between">
                  <div class="space-y-0.5">
                    <Label htmlFor="allow-registration">Allow User Registration</Label>
                    <p class="text-sm text-muted-foreground">
                      Enable public user registration
                    </p>
                  </div>
                  <Switch id="allow-registration" v-model="config.users.allowRegistration" />
                </div>
                
                <div class="flex items-center justify-between">
                  <div class="space-y-0.5">
                    <Label htmlFor="email-verification">Email Verification</Label>
                    <p class="text-sm text-muted-foreground">
                      Require email verification for new accounts
                    </p>
                  </div>
                  <Switch id="email-verification" v-model="config.users.requireEmailVerification" />
                </div>
                
                <div class="flex items-center justify-between">
                  <div class="space-y-0.5">
                    <Label htmlFor="admin-approval">Admin Approval</Label>
                    <p class="text-sm text-muted-foreground">
                      Require admin approval for new accounts
                    </p>
                  </div>
                  <Switch id="admin-approval" v-model="config.users.requireAdminApproval" />
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Notification Settings -->
          <Card class="mb-6">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure admin notification preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="grid gap-6">
                <div class="flex items-center justify-between">
                  <div class="space-y-0.5">
                    <Label htmlFor="new-user-notifications">New User Notifications</Label>
                    <p class="text-sm text-muted-foreground">
                      Receive notifications when new users register
                    </p>
                  </div>
                  <Switch id="new-user-notifications" v-model="config.notifications.newUser" />
                </div>
                
                <div class="flex items-center justify-between">
                  <div class="space-y-0.5">
                    <Label htmlFor="system-alerts">System Alerts</Label>
                    <p class="text-sm text-muted-foreground">
                      Receive important system alerts
                    </p>
                  </div>
                  <Switch id="system-alerts" v-model="config.notifications.systemAlerts" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <!-- User Settings Tab -->
        <TabsContent value="user">
          <!-- User Default Settings -->
          <Card class="mb-6">
            <CardHeader>
              <CardTitle>Default User Settings</CardTitle>
              <CardDescription>Configure default settings for all users</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="grid gap-6 sm:grid-cols-2">
                <div class="space-y-2">
                  <Label for="default-language">Default Language</Label>
                  <Select id="default-language" v-model="config.locale.defaultLanguage">
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div class="space-y-2">
                  <Label for="default-theme">Default Theme</Label>
                  <Select id="default-theme" v-model="config.appearance.defaultTheme">
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- User Permissions -->
          <Card class="mb-6">
            <CardHeader>
              <CardTitle>User Permissions</CardTitle>
              <CardDescription>Configure what users can access</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="grid gap-6">
                <div class="flex items-center justify-between">
                  <div class="space-y-0.5">
                    <Label htmlFor="allow-profile-editing">Profile Editing</Label>
                    <p class="text-sm text-muted-foreground">
                      Allow users to edit their profiles
                    </p>
                  </div>
                  <Switch id="allow-profile-editing" v-model="config.users.allowProfileEditing" />
                </div>
                
                <div class="flex items-center justify-between">
                  <div class="space-y-0.5">
                    <Label htmlFor="allow-avatar-upload">Avatar Upload</Label>
                    <p class="text-sm text-muted-foreground">
                      Allow users to upload custom avatars
                    </p>
                  </div>
                  <Switch id="allow-avatar-upload" v-model="config.users.allowAvatarUpload" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <!-- Save/Reset Controls -->
      <div class="flex justify-end gap-4 mt-6">
        <Button variant="outline" @click="resetSettings">
          <RotateCcw class="mr-2 h-4 w-4" />
          Reset to Defaults
        </Button>
        <Button @click="saveSettings" :disabled="isSaving">
          <Save class="mr-2 h-4 w-4" />
          {{ isSaving ? 'Saving...' : 'Save Changes' }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { toast } from 'vue-sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, RotateCcw } from 'lucide-vue-next';

// Simulating loading state
const isLoading = ref(false);
const isSaving = ref(false);

// Mock config data
const config = ref({
  users: {
    allowRegistration: true,
    requireEmailVerification: true,
    requireAdminApproval: false,
    allowProfileEditing: true,
    allowAvatarUpload: true
  },
  notifications: {
    newUser: true,
    systemAlerts: true
  },
  locale: {
    defaultLanguage: 'en',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: 'HH:mm',
    timezone: 'UTC'
  },
  appearance: {
    defaultTheme: 'system'
  }
});

// Placeholder functions
function resetSettings() {
  isLoading.value = true;
  
  // Simulate API call
  setTimeout(() => {
    // Reset config to defaults
    config.value = {
      users: {
        allowRegistration: true,
        requireEmailVerification: true,
        requireAdminApproval: false,
        allowProfileEditing: true,
        allowAvatarUpload: true
      },
      notifications: {
        newUser: true,
        systemAlerts: true
      },
      locale: {
        defaultLanguage: 'en',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: 'HH:mm',
        timezone: 'UTC'
      },
      appearance: {
        defaultTheme: 'system'
      }
    };
    
    isLoading.value = false;
    toast.success('Settings Reset', {
      description: 'All settings have been reset to their default values.'
    });
  }, 1000);
}

function saveSettings() {
  isSaving.value = true;
  
  // Simulate API call
  setTimeout(() => {
    isSaving.value = false;
    toast.success('Settings Saved', {
      description: 'Your settings have been saved successfully.'
    });
  }, 1500);
}
</script> 