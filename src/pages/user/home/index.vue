<template>
  <div class="container mx-auto p-4 space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">User Dashboard</h1>
        <p class="text-muted-foreground mt-1">Welcome to your dashboard</p>
      </div>
    </div>

    <Card>
      <CardContent class="p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
        <div class="bg-primary/10 p-6 rounded-full mb-6">
          <UserIcon class="h-16 w-16 text-primary" />
        </div>
        <h2 class="text-2xl font-bold mb-4">Default User Dashboard</h2>
        <p class="text-muted-foreground max-w-lg mb-6 text-lg">
          This is the default page for users with the "user" role.
          Your admin can customize this dashboard with relevant information and tools.
        </p>
        <Alert variant="default" class="max-w-lg">
          <AlertTitle class="flex items-center">
            <InfoIcon class="h-4 w-4 mr-2" />
            Information
          </AlertTitle>
          <AlertDescription>
            You can access your profile and account settings using the buttons in the sidebar.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle
} from "@/components/ui/alert";
import { UserIcon, InfoIcon } from "lucide-vue-next";
</script> 