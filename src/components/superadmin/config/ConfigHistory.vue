<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ConfigHistoryEntry } from '@/types/config';

/**
 * Props for ConfigHistory
 */
interface Props {
  /** Array of config history entries */
  history: ConfigHistoryEntry[];
  /** Current config version number */
  currentVersion: number;
}

defineProps<Props>();

/**
 * Emits for ConfigHistory
 */
const emit = defineEmits<{
  (e: 'rollback', index: number): void;
}>();
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Configuration History</CardTitle>
    </CardHeader>
    <CardContent>
      <ul class="divide-y divide-border">
        <li v-for="(entry, idx) in history" :key="entry.timestamp" class="flex items-center justify-between py-2">
          <div>
            <div class="font-mono text-xs text-muted-foreground">{{ entry.timestamp }}</div>
            <div class="text-sm">By: {{ entry.user }}</div>
          </div>
          <Button
            size="sm"
            variant="outline"
            :disabled="currentVersion === idx"
            @click="emit('rollback', idx)"
          >
            {{ currentVersion === idx ? 'Current' : 'Rollback' }}
          </Button>
        </li>
      </ul>
    </CardContent>
  </Card>
</template> 