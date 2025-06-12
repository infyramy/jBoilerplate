<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-foreground">
          Superadmin Dashboard
        </h1>
        <p class="text-muted-foreground mt-1">
          Platform overview and key metrics
        </p>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" size="sm" class="flex items-center gap-2">
          <Download class="h-4 w-4" />
          <span>Export</span>
        </Button>
        <Button size="sm" class="flex items-center gap-2">
          <RefreshCw class="h-4 w-4" />
          <span>Refresh</span>
        </Button>
      </div>
    </div>

    <!-- Overview Stats -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Total Users</CardTitle>
          <UserIcon class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">1,258</div>
          <p class="text-xs text-muted-foreground mt-1">
            +12% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Active Projects</CardTitle>
          <FolderIcon class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">87</div>
          <p class="text-xs text-muted-foreground mt-1">
            +5% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">System Load</CardTitle>
          <ActivityIcon class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">42%</div>
          <p class="text-xs text-muted-foreground mt-1">
            -8% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Storage Used</CardTitle>
          <DatabaseIcon class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">1.2 TB</div>
          <p class="text-xs text-muted-foreground mt-1">
            +15% from last month
          </p>
        </CardContent>
      </Card>
    </div>

    <!-- Charts and Data -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card class="lg:col-span-4">
        <CardHeader>
          <CardTitle>User Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="h-[300px] flex items-center justify-center border rounded-md bg-muted/20">
            <span class="text-muted-foreground">Chart: User activity over time</span>
          </div>
        </CardContent>
      </Card>
      <Card class="lg:col-span-3">
        <CardHeader>
          <CardTitle>Resource Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="h-[300px] flex items-center justify-center border rounded-md bg-muted/20">
            <span class="text-muted-foreground">Chart: Resource distribution</span>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Recent Activity & System Status -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card class="lg:col-span-4">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div class="flex items-start gap-4">
              <div class="rounded-full p-2 bg-primary/10">
                <UserPlusIcon class="h-4 w-4 text-primary" />
              </div>
              <div class="space-y-1 flex-1">
                <p class="text-sm font-medium">New user registered</p>
                <p class="text-xs text-muted-foreground">John Smith (john@example.com)</p>
                <p class="text-xs text-muted-foreground">2 minutes ago</p>
              </div>
            </div>
            <Separator />
            <div class="flex items-start gap-4">
              <div class="rounded-full p-2 bg-primary/10">
                <ServerIcon class="h-4 w-4 text-primary" />
              </div>
              <div class="space-y-1 flex-1">
                <p class="text-sm font-medium">Server update completed</p>
                <p class="text-xs text-muted-foreground">System updated to version 3.2.1</p>
                <p class="text-xs text-muted-foreground">15 minutes ago</p>
              </div>
            </div>
            <Separator />
            <div class="flex items-start gap-4">
              <div class="rounded-full p-2 bg-amber-500/10">
                <AlertTriangleIcon class="h-4 w-4 text-amber-500" />
              </div>
              <div class="space-y-1 flex-1">
                <p class="text-sm font-medium">Storage warning</p>
                <p class="text-xs text-muted-foreground">Primary database approaching 80% capacity</p>
                <p class="text-xs text-muted-foreground">45 minutes ago</p>
              </div>
            </div>
            <Separator />
            <div class="flex items-start gap-4">
              <div class="rounded-full p-2 bg-primary/10">
                <SettingsIcon class="h-4 w-4 text-primary" />
              </div>
              <div class="space-y-1 flex-1">
                <p class="text-sm font-medium">Configuration changed</p>
                <p class="text-xs text-muted-foreground">Email templates updated by Admin</p>
                <p class="text-xs text-muted-foreground">1 hour ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div class="lg:col-span-3">
        <SystemHealthCheck />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import SystemHealthCheck from "@/components/superadmin/SystemHealthCheck.vue";
import {
  Download,
  RefreshCw,
  User as UserIcon,
  Folder as FolderIcon,
  Activity as ActivityIcon,
  Database as DatabaseIcon,
  UserPlus as UserPlusIcon,
  Server as ServerIcon,
  AlertTriangle as AlertTriangleIcon,
  Settings as SettingsIcon,
} from "lucide-vue-next";

// Define route meta for Vue Router
defineOptions({
  name: 'SuperadminDashboard',
  meta: {
    layout: "dashboard",
    requiresAuth: true,
    roles: ["superadmin"]
  }
});
</script> 