<script setup lang="ts">
import { computed } from 'vue'

export interface PaginationContentProps {
  class?: string
}

const props = withDefaults(defineProps<PaginationContentProps>(), {
  class: '',
})

const classes = computed(() => [
  'flex flex-row items-center gap-1',
  props.class,
])
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template> 