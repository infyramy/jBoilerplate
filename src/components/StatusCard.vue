<template>
  <Card>
    <CardContent class="p-4">
      <div class="flex items-center justify-between space-x-4">
        <div class="space-y-1">
          <h3 class="font-semibold tracking-tight">{{ title }}</h3>
          <p class="text-xs text-muted-foreground">{{ description }}</p>
          <p class="text-xs text-muted-foreground" v-if="timestamp">
            Updated {{ getTimeAgo(timestamp) }}
          </p>
        </div>
        <div>
          <Badge :variant="statusVariant" class="px-3 py-1 h-auto">
            <component 
              :is="statusIcon" 
              v-if="statusIcon" 
              class="h-3 w-3 mr-1" 
              :class="{ 'animate-pulse': status === 'critical' }"
            />
            {{ statusLabel }}
          </Badge>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, AlertCircle } from 'lucide-vue-next';

interface Props {
  title: string;
  status: 'healthy' | 'degraded' | 'critical' | 'offline' | 'unknown';
  description?: string;
  timestamp?: Date | undefined;
}

const props = defineProps<Props>();

// Status styling
const statusVariant = computed(() => {
  switch (props.status) {
    case 'healthy':
      return 'default';
    case 'degraded':
      return 'secondary';
    case 'critical':
    case 'offline':
      return 'destructive';
    default:
      return 'outline';
  }
});

// Status icon
const statusIcon = computed(() => {
  switch (props.status) {
    case 'healthy':
      return CheckCircle;
    case 'degraded':
      return AlertTriangle;
    case 'critical':
    case 'offline':
      return AlertCircle;
    default:
      return null;
  }
});

// Status label
const statusLabel = computed(() => {
  switch (props.status) {
    case 'healthy':
      return 'Healthy';
    case 'degraded':
      return 'Degraded';
    case 'critical':
      return 'Critical';
    case 'offline':
      return 'Offline';
    default:
      return 'Unknown';
  }
});

// Format time ago
const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};
</script> 