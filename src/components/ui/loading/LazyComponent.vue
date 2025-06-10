<template>
  <div>
    <slot v-if="!loading" />
    <div v-else class="flex flex-col items-center justify-center p-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p class="mt-4 text-sm text-muted-foreground">{{ loadingText }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue';

const props = defineProps<{
  loadingText?: string;
}>();

const loading = ref(true);
const error = ref<Error | null>(null);

// Set default loading text
const loadingText = props.loadingText || 'Loading component...';

// Capture errors from lazy-loaded components
onErrorCaptured((err) => {
  error.value = err as Error;
  loading.value = false;
  console.error('Error loading component:', err);
  return false; // Don't propagate to parent
});

// This component is meant to be used with defineAsyncComponent
// which will handle the actual component loading
// The parent component using defineAsyncComponent should pass the loading state
defineExpose({
  setLoaded: () => {
    loading.value = false;
  },
  setLoading: () => {
    loading.value = true;
  },
  hasError: () => error.value !== null,
  getError: () => error.value
});
</script> 