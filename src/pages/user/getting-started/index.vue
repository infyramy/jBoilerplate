<template>
  <div class="container mx-auto p-4 space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">Getting Started</h1>
        <p class="text-muted-foreground mt-1">Quick start guide for new users</p>
      </div>
    </div>

    <Card>
      <CardContent class="p-6 flex flex-col items-center justify-center min-h-[300px] text-center">
        <div class="bg-primary/10 p-4 rounded-full mb-4">
          <RocketIcon class="h-12 w-12 text-primary" />
        </div>
        <h2 class="text-2xl font-bold mb-2">Getting Started Placeholder</h2>
        <p class="text-muted-foreground max-w-md mb-6">
          This is a placeholder for the Getting Started guide. In a real application, 
          you would implement business-specific onboarding and guidance here.
        </p>
        <div class="bg-muted p-4 rounded-lg text-left w-full max-w-lg mb-4">
          <h3 class="font-medium mb-2">Implementation Ideas:</h3>
          <ul class="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
            <li>Interactive onboarding tour</li>
            <li>Quick setup steps and configuration</li>
            <li>Video tutorials and documentation links</li>
            <li>Progress tracking for setup completion</li>
            <li>Contextual help and guidance tips</li>
          </ul>
        </div>
        <p class="text-sm text-muted-foreground">
          This boilerplate provides the UI foundation - implement your specific business logic as needed.
        </p>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { RocketIcon } from "lucide-vue-next";
</script> 