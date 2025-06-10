<template>
  <div
    class="relative h-2 w-full overflow-hidden rounded-full bg-secondary"
    role="progressbar"
    :aria-valuenow="value !== undefined ? value : 0"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div
      class="h-full w-full flex-1 bg-primary transition-all"
      :style="{ transform: `translateX(-${100 - (value || 0)}%)` }"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  value?: number
}>();
</script> 