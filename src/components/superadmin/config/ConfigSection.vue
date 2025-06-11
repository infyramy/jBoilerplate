<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import type { Component } from 'vue';

/**
 * Props for ConfigSection
 */
interface Props {
  /** Section title */
  title: string;
  /** Section description (optional) */
  description?: string;
  /** Optional icon component */
  icon?: Component;
}

defineProps<Props>();
</script>

<template>
  <Card class="mb-6">
    <CardHeader class="flex flex-row items-center gap-3">
      <div v-if="icon" class="shrink-0">
        <component :is="icon" class="h-6 w-6 text-primary" />
      </div>
      <div>
        <CardTitle>{{ title }}</CardTitle>
        <CardDescription v-if="description">{{ description }}</CardDescription>
      </div>
    </CardHeader>
    <CardContent>
      <slot />
    </CardContent>
  </Card>
</template> 