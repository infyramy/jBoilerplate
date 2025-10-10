<script setup lang="ts">
import { ref, computed } from 'vue';
import { useColorMode } from '@vueuse/core';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { toast } from 'vue-sonner';
import { Sun, Moon, Bell, Globe, Palette, Lock } from 'lucide-vue-next';
import ThemeCustomizer from '@/components/ThemeCustomizer.vue';

const colorMode = useColorMode();
const showThemeCustomizer = ref(false);

const notifications = ref({
  email: true,
  push: false,
  sms: false,
});

const privacy = ref({
  profileVisible: true,
  activityVisible: false,
});

const currentTheme = computed(() => colorMode.value);

function changeTheme(theme: 'light' | 'dark' | 'auto') {
  colorMode.value = theme;
  document.documentElement.classList.toggle('dark', theme === 'dark');
  localStorage.setItem('theme', theme);
  toast.success(`Theme changed to ${theme}`);
}

function saveNotificationSettings() {
  toast.success('Notification settings saved');
}

function savePrivacySettings() {
  toast.success('Privacy settings saved');
}
</script>

<template>
  <div class="container mx-auto max-w-4xl space-y-6">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">Settings</h1>
      <p class="text-muted-foreground mt-2">
        Manage your account preferences and settings
      </p>
    </div>

    <Separator />

    <div class="grid gap-6">
      <!-- Appearance Settings -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Palette class="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>Customize how the application looks</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="space-y-3">
            <Label>Theme</Label>
            <Select :model-value="currentTheme" @update:model-value="changeTheme">
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div class="flex items-center gap-2">
                    <Sun class="h-4 w-4" />
                    Light
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div class="flex items-center gap-2">
                    <Moon class="h-4 w-4" />
                    Dark
                  </div>
                </SelectItem>
                <SelectItem value="auto">
                  <div class="flex items-center gap-2">
                    <Globe class="h-4 w-4" />
                    System
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div>
            <Button variant="outline" @click="showThemeCustomizer = true">
              Customize Theme Colors
            </Button>
          </div>
        </CardContent>
      </Card>

      <!-- Notification Settings -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Bell class="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>Manage how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <Label>Email Notifications</Label>
              <p class="text-sm text-muted-foreground">Receive notifications via email</p>
            </div>
            <Switch v-model:checked="notifications.email" />
          </div>

          <Separator />

          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <Label>Push Notifications</Label>
              <p class="text-sm text-muted-foreground">Receive push notifications in browser</p>
            </div>
            <Switch v-model:checked="notifications.push" />
          </div>

          <Separator />

          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <Label>SMS Notifications</Label>
              <p class="text-sm text-muted-foreground">Receive notifications via SMS</p>
            </div>
            <Switch v-model:checked="notifications.sms" />
          </div>

          <div class="flex justify-end pt-4">
            <Button @click="saveNotificationSettings">
              Save Notification Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      <!-- Privacy Settings -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Lock class="h-5 w-5" />
            Privacy
          </CardTitle>
          <CardDescription>Control your privacy preferences</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <Label>Profile Visibility</Label>
              <p class="text-sm text-muted-foreground">Make your profile visible to others</p>
            </div>
            <Switch v-model:checked="privacy.profileVisible" />
          </div>

          <Separator />

          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <Label>Activity Status</Label>
              <p class="text-sm text-muted-foreground">Show when you're active</p>
            </div>
            <Switch v-model:checked="privacy.activityVisible" />
          </div>

          <div class="flex justify-end pt-4">
            <Button @click="savePrivacySettings">
              Save Privacy Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Theme Customizer Dialog -->
    <ThemeCustomizer v-model:open="showThemeCustomizer" />
  </div>
</template>
